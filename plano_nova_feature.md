# Plano: CSV Report via CloudFront + HTTPS no site

## Contexto
Adicionar geração de relatório CSV com todos os campos dos links, upload para S3 privado servido por CloudFront (URL HTTPS permanente), e lifecycle rule de 24h para auto-deleção dos arquivos. Simultaneamente, adicionar CloudFront em frente ao S3 do frontend para habilitar HTTPS no site.

---

## Visão geral da arquitetura

```
[GET /links/report]
  → gera CSV em memória (cursor-based, batch de 100)
  → PutObject no S3 (reports bucket, privado)
  → retorna { url: "https://xxx.cloudfront.net/reports/uuid.csv" }

[HTTPS site]
  S3 web bucket (público) ← CloudFront (HTTPS) ← browser

[Download CSV]
  S3 reports bucket (privado, OAC) ← CloudFront (HTTPS) ← browser
```

---

## Parte 1 — Infra Pulumi (`server/infra/`)

### 1.1 Novo arquivo: `infra/reports.ts`
Criar S3 bucket privado para relatórios + CloudFront com OAC:

```typescript
// S3 bucket privado
const reportsBucket = new aws.s3.BucketV2('reports-bucket', {
  bucket: `link-shorter-reports-${stack}`,
  // block all public access
});

// Lifecycle: deletar objetos após 1 dia (24h)
new aws.s3.BucketLifecycleConfigurationV2('reports-lifecycle', {
  bucket: reportsBucket.id,
  rules: [{ status: 'Enabled', expiration: { days: 1 }, filter: { prefix: '' } }],
});

// Origin Access Control para CloudFront acessar o bucket privado
const oac = new aws.cloudfront.OriginAccessControl('reports-oac', { ... });

// CloudFront distribution
const reportsCf = new aws.cloudfront.Distribution('reports-cf', {
  origins: [{ domainName: reportsBucket.bucketRegionalDomainName, originAccessControlId: oac.id }],
  defaultCacheBehavior: { viewerProtocolPolicy: 'https-only', ... },
  restrictions: { geoRestriction: { restrictionType: 'none' } },
  viewerCertificate: { cloudfrontDefaultCertificate: true },
});

// Bucket policy: permitir CloudFront (OAC) ler os objetos
new aws.s3.BucketPolicy('reports-bucket-policy', {
  bucket: reportsBucket.id,
  policy: /* s3:GetObject para o CloudFront service principal */,
});

export { reportsBucket, reportsCf };
```

### 1.2 Atualizar `infra/website.ts`
Adicionar CloudFront em frente ao S3 website existente para HTTPS:

```typescript
// CloudFront usando S3 website endpoint como origin (HTTP origin, HTTPS viewer)
const webCf = new aws.cloudfront.Distribution('web-cf', {
  origins: [{
    domainName: /* bucket.websiteEndpoint */,
    customOriginConfig: { httpPort: 80, originProtocolPolicy: 'http-only' },
  }],
  defaultCacheBehavior: { viewerProtocolPolicy: 'redirect-to-https' },
  // SPA routing: 403/404 → /index.html com status 200
  customErrorResponses: [
    { errorCode: 403, responseCode: 200, responsePagePath: '/index.html' },
    { errorCode: 404, responseCode: 200, responsePagePath: '/index.html' },
  ],
  viewerCertificate: { cloudfrontDefaultCertificate: true },
});

export const webCloudfrontUrl = webCf.domainName.apply(d => `https://${d}`);
```

### 1.3 Atualizar `infra/iam.ts`
Adicionar permissão S3 PutObject ao ECS Task Role:

```typescript
new aws.iam.RolePolicy('task-s3-reports-policy', {
  role: taskRole.id,
  policy: {
    Statement: [{
      Effect: 'Allow',
      Action: ['s3:PutObject'],
      Resource: pulumi.interpolate`${reportsBucket.arn}/reports/*`,
    }],
  },
});
```

### 1.4 Atualizar `infra/index.ts`
Exportar: `reportsBucketName`, `reportsCloudfrontUrl`, `webCloudfrontUrl`

### 1.5 Atualizar `infra/security-groups.ts`
Adicionar ingress na porta 443 no ALB SG (para HTTPS futuro com domínio próprio + ACM).

---

## Parte 2 — Backend (`server/src/`)

> **Estratégia de cursor**: em vez de `listAll()` (carrega tudo em memória de uma vez), a geração de CSV usa paginação por cursor sobre `id` (UUID v7 é time-sortable). Processa em batches de 100 registros — sem gargalo independente do tamanho da tabela.

### 2.1 `package.json` — nova dependência
```json
"@aws-sdk/client-s3": "^3.x"
```

### 2.2 `src/utils/env.ts` — novos env vars
```typescript
AWS_REGION: z.string().default('us-east-2'),
REPORTS_BUCKET_NAME: z.string(),
CLOUDFRONT_REPORTS_URL: z.string().url(),
```

### 2.3 `src/repository/link-shorter.repository.ts` — adicionar `listBatch`
```typescript
// Novo método: busca até `limit` links após o cursor (id UUID v7)
const listBatch = async (cursor: string | undefined, limit: number) => {
  const conditions = cursor ? gt(links.id, cursor) : undefined;
  return db
    .select()
    .from(links)
    .where(conditions)
    .orderBy(asc(links.id))
    .limit(limit);
};
```

### 2.4 `src/use-case/generate-link-report.use-case.ts` — NOVO
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { LinkShorterRepository } from '../repository/link-shorter.repository';
import { env } from '../utils/env';
import { uuidv7 } from 'uuidv7';

const s3 = new S3Client({ region: env.AWS_REGION });
const BATCH_SIZE = 100;
const CSV_HEADER = 'id,link,shortLink,accessCount,createdAt,updatedAt\n';

const rowToCsv = (l: Link) =>
  `"${l.id}","${l.link}","${l.shortLink}",${l.accessCount},"${l.createdAt.toISOString()}","${l.updatedAt.toISOString()}"`;

export const generateLinkReport = async (): Promise<{ url: string }> => {
  // Cursor-based batch: lê 100 registros por vez até esgotar a tabela
  let cursor: string | undefined;
  const rows: string[] = [CSV_HEADER];

  while (true) {
    const batch = await LinkShorterRepository.listBatch(cursor, BATCH_SIZE);
    if (batch.length === 0) break;
    rows.push(...batch.map(rowToCsv));
    cursor = batch[batch.length - 1].id;
    if (batch.length < BATCH_SIZE) break;
  }

  const key = `reports/${uuidv7()}.csv`;
  await s3.send(new PutObjectCommand({
    Bucket: env.REPORTS_BUCKET_NAME,
    Key: key,
    Body: rows.join('\n'),
    ContentType: 'text/csv',
    ContentDisposition: 'attachment; filename="links-report.csv"',
  }));

  return { url: `${env.CLOUDFRONT_REPORTS_URL}/${key}` };
};
```

### 2.5 `src/controller/generate-link-report.controller.ts` — NOVO
Segue o padrão existente: chama use case, retorna 200 com `{ url }`.

### 2.6 `src/schemas/link.schema.ts` — novo schema de response
```typescript
export const reportResponseSchema = z.object({ url: z.string().url() });
```

### 2.7 `src/router/link.router.ts` — nova rota
```
GET /links/report → generateLinkReportController (200 OK)
```
Com Swagger tag `Links` e schema de response `reportResponseSchema`.

### 2.8 `src/utils/constants/error-messages.ts` — nova mensagem
```typescript
REPORT_GENERATION_FAILED: 'Erro ao gerar o relatório CSV'
```

### 2.9 Dockerfile — atualizar (Prisma → Drizzle)
- Remover `yarn prisma:generate` do builder stage
- Remover cópia de arquivos do Prisma
- Substituir por `yarn db:migrate:deploy` antes de iniciar o servidor

---

## Parte 3 — Frontend (`web/src/`)

O frontend já tem `DownloadCsvButton`, `LinkList` e `utils/csv.ts`. A mudança é:
- remover a geração client-side (que usa apenas os dados já carregados no Zustand)
- substituir pela chamada ao backend, que gera o CSV completo via cursor e retorna uma URL CloudFront

### 3.1 Novo hook: `web/src/hooks/useDownloadReport.ts`
```typescript
import { useState } from 'react';
import { API_URL } from '../lib/api';

export function useDownloadReport() {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/links/report`);
      if (!res.ok) throw new Error('Erro ao gerar relatório');
      const { url } = await res.json();
      // Abre a URL do CloudFront — o navegador faz o download automaticamente
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  };

  return { downloadReport, loading };
}
```

### 3.2 Atualizar `web/src/components/DownloadCsvButton.tsx`
Adicionar prop `loading` para feedback visual enquanto o backend processa:
```typescript
interface DownloadCsvButtonProps {
  onDownloadCsv: () => void;
  disabled?: boolean;
  loading?: boolean;   // novo — exibe spinner no botão
}
```

### 3.3 Atualizar `web/src/components/LinkList.tsx`
- Remover imports de `generateCsv` e `downloadCsv` de `utils/csv`
- Usar o hook `useDownloadReport`
- Passar `loading` ao `DownloadCsvButton`

```typescript
// Antes:
import { generateCsv, downloadCsv } from "../utils/csv";
const onDownloadCsv = () => { /* gera CSV dos dados locais */ };

// Depois:
import { useDownloadReport } from "../hooks/useDownloadReport";
const { downloadReport, loading: reportLoading } = useDownloadReport();
// <DownloadCsvButton onDownloadCsv={downloadReport} loading={reportLoading} ... />
```

### 3.4 Deletar `web/src/utils/csv.ts`
Geração client-side substituída pelo backend — arquivo não tem mais uso.

---

## Parte 4 — Env vars a adicionar

**`server/.env`** (dev local):
```env
AWS_REGION=us-east-2
REPORTS_BUCKET_NAME=link-shorter-reports-dev
CLOUDFRONT_REPORTS_URL=https://xxx.cloudfront.net
```

**`server/.env.example`**: mesmas chaves com valores de placeholder.

**CI/CD**: testes unit/integration mockam o `S3Client` — não precisam dessas vars.

---

## Arquivos a criar
| Arquivo | Descrição |
|---------|-----------|
| `server/infra/reports.ts` | S3 bucket + lifecycle + CloudFront para relatórios |
| `server/src/use-case/generate-link-report.use-case.ts` | Lógica de cursor + upload S3 |
| `server/src/controller/generate-link-report.controller.ts` | Handler HTTP |
| `web/src/hooks/useDownloadReport.ts` | Hook que chama o backend e abre a URL |

## Arquivos a modificar
| Arquivo | Mudança |
|---------|---------|
| `server/infra/website.ts` | Adicionar CloudFront para HTTPS no site |
| `server/infra/iam.ts` | Permissão `s3:PutObject` no task role |
| `server/infra/index.ts` | Exportar novos recursos |
| `server/infra/security-groups.ts` | Porta 443 no ALB SG |
| `server/src/repository/link-shorter.repository.ts` | Método `listBatch` com cursor |
| `server/src/schemas/link.schema.ts` | `reportResponseSchema` |
| `server/src/router/link.router.ts` | Rota `GET /links/report` |
| `server/src/utils/env.ts` | `AWS_REGION`, `REPORTS_BUCKET_NAME`, `CLOUDFRONT_REPORTS_URL` |
| `server/src/utils/constants/error-messages.ts` | `REPORT_GENERATION_FAILED` |
| `server/package.json` | `@aws-sdk/client-s3` |
| `server/Dockerfile` | Remover Prisma, corrigir build para Drizzle |
| `web/src/components/LinkList.tsx` | Usar hook, remover CSV local |
| `web/src/components/DownloadCsvButton.tsx` | Prop `loading` + spinner |

## Arquivos a deletar
| Arquivo | Motivo |
|---------|--------|
| `web/src/utils/csv.ts` | Substituído pela geração no backend |

---

## Verificação

1. `npm run build` no server — TypeScript compila sem erros
2. `npm run test:unit` — testes passam (S3Client mockado)
3. `pulumi preview` — ver diff da infra antes de aplicar
4. `pulumi up` — provisionar bucket, CloudFront e permissões
5. `curl http://localhost:3333/links/report` — retorna `{ "url": "https://xxx.cloudfront.net/reports/uuid.csv" }`
6. Acessar a URL retornada — browser faz download do CSV
7. Verificar conteúdo do CSV — todas as colunas presentes, dados corretos
8. Após 24h — objeto expirado pelo lifecycle do S3
9. Site acessível via `https://xxx.cloudfront.net` com redirect HTTP→HTTPS
