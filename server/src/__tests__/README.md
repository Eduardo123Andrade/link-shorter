# Testes de Integração

Este diretório contém os testes de integração do servidor Link Shorter.

## 📋 Pré-requisitos

Antes de rodar os testes, você precisa:

1. **PostgreSQL rodando localmente** (ou acessível)
2. **Criar o banco de dados de teste**

## 🚀 Configuração

### 1. Criar o banco de dados de teste

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco de dados de teste
CREATE DATABASE link_shorter_test;

# Habilite a extensão uuid-ossp (necessária para uuid v7)
\c link_shorter_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Executar as migrações no banco de teste

```bash
# Defina a DATABASE_URL para o banco de teste
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/link_shorter_test"

# Execute as migrações
npm run prisma:migrate

# Ou use o comando direto
npx prisma migrate deploy
```

### 3. Gerar o Prisma Client

```bash
npm run prisma:generate
```

## 🧪 Executando os Testes

### Rodar todos os testes

```bash
npm test
```

### Rodar testes em modo watch

```bash
npm run test:watch
```

### Rodar testes com coverage

```bash
npm test -- --coverage
```

### Rodar apenas os testes do repository

```bash
npm test -- link-shorter.repository
```

## 📁 Estrutura de Testes

```
src/__tests__/
├── setup/
│   ├── jest.setup.ts         # Configuração inicial do Jest
│   ├── globalTeardown.ts     # Limpeza global após os testes
│   └── test-helpers.ts       # Funções auxiliares para testes
└── repository/
    └── link-shorter.repository.test.ts  # Testes do repository
```

## ⚠️ Importante

- Os testes **limpam o banco de dados** antes e depois de cada teste
- Use sempre um banco de dados **separado para testes** (link_shorter_test)
- Nunca rode os testes apontando para o banco de produção ou desenvolvimento
- O arquivo `.env.test` já está configurado com as variáveis corretas

## 🔧 Troubleshooting

### Erro de conexão com o banco

Verifique se:
- O PostgreSQL está rodando
- As credenciais em `.env.test` estão corretas
- O banco de dados `link_shorter_test` existe

### Erro "relation does not exist"

Execute as migrações no banco de teste:
```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/link_shorter_test"
npx prisma migrate deploy
```

### Testes lentos

Os testes de integração são mais lentos que testes unitários por natureza, pois acessam o banco de dados real. O timeout está configurado para 10 segundos.
