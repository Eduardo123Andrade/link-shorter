# Plano: Migração Next.js → Vite + React Router DOM

## Contexto

O critério obrigatório exige Vite sem framework completo. O projeto usa Next.js 16 com static export (`output: 'export'`). Como **não há SSR** (nenhum `getServerSideProps`, `getStaticProps`, API routes, Image optimization ou middleware), a migração é direta: trocar o framework de build + sistema de rotas. Toda a lógica de negócio (hooks, components, stores) é pura React e não precisa de alteração.

---

## Visão geral das mudanças

```
Next.js 16          →  Vite 6 + React Router DOM 6
_app.tsx            →  src/App.tsx (BrowserRouter + Routes)
_document.tsx       →  index.html (raiz do HTML)
pages/ (file-based) →  Routes declarativas em App.tsx
next/font/local     →  CSS @font-face em globals.css
next/link           →  <a> (externo) ou <Link> do React Router (interno)
next/router         →  useParams + useNavigate do React Router
process.env.NEXT_PUBLIC_*  →  import.meta.env.VITE_*
next.config.ts      →  vite.config.ts
```

---

## 4.1 ✅ `web/package.json` — trocar dependências

**Removido:**
- `next`, `eslint-config-next`, `serve`

**Adicionado:**
- `vite ^6.3.5`, `@vitejs/plugin-react ^4.3.4`, `react-router-dom ^6.30.0`
- `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint`, `@eslint/js`, `globals`

**Scripts atualizados:**
```json
{
  "scripts": {
    "dev": "vite --port 3001",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 3001",
    "lint": "eslint ."
  }
}
```

---

## 4.2 ✅ Criar `web/index.html` (substitui `_document.tsx`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>brev.ly</title>
  </head>
  <body class="bg-gray-200 text-gray-600">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 4.3 ✅ Criar `web/vite.config.ts` (substitui `next.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

---

## 4.4 ✅ Criar `web/src/main.tsx` (entry point explícito)

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 4.5 ✅ Criar `web/src/App.tsx` (substitui `_app.tsx`)

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from './components/ToastContainer';
import Home from './pages/index';
import NotFoundPage from './pages/404';
import ShortLinkPage from './pages/shortlink/index';

export default function App() {
  return (
    <BrowserRouter>
      <div className="antialiased font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/:slug" element={<ShortLinkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
```

> A rota `/:slug` serve como catch-all para todos os short links. A ordem garante que `/404` seja tratado antes do catch-all `/:slug`.

---

## 4.6 ✅ Atualizar `web/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "types": ["vite/client"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "index.html"]
}
```

---

## 4.7 ✅ Atualizar `web/src/lib/api.ts`

```typescript
function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3333`;
  }
  return 'http://localhost:3333';
}

export const API_URL = getBaseUrl();
export const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';
```

---

## 4.8 ✅ Atualizar `web/src/pages/shortlink/index.tsx`

Substituído `useRouter` + `useState(path)` + `window.location.pathname` por `useParams` + `useNavigate`:

```typescript
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ShortLinkPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { loading, isValid } = useValidateLink(slug || '');

  useEffect(() => {
    if (!slug || loading) return;
    if (isValid === false) {
      navigate('/404', { replace: true });
      return;
    }
    if (isValid) {
      const timer = setTimeout(() => {
        window.location.href = `${API_URL}/${slug}`;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [slug, loading, isValid, navigate]);
  // ...
}
```

---

## 4.9 ✅ Atualizar `web/src/pages/404.tsx`

```typescript
// Antes: import Link from 'next/link'; <Link href="/" ...>
import { Link } from 'react-router-dom';
// <Link to="/" ...>
```

---

## 4.10 ✅ Atualizar `web/src/components/ShortLink.tsx`

```typescript
export const ShortLink = ({ shortUrl }: ShortLinkProps) => (
  <a
    href={shortUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-base font-bold text-lg hover:underline truncate block w-full"
  >
    {shortUrl}
  </a>
);
```

---

## 4.11 ✅ Atualizar `web/src/styles/globals.css` — adicionar `@font-face`

Substituir `next/font/local` com CSS nativo. Adicionar antes do `@import "tailwindcss"`:

```css
@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/OpenSans-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/OpenSans-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/OpenSans-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Open Sans';
  src: url('/fonts/OpenSans-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Atualizar a variável CSS `--font-sans` no `@theme`:
```css
--font-sans: 'Open Sans', ui-sans-serif, system-ui, sans-serif;
```

> Impacto: app já roda sem isso, apenas com fonte fallback do sistema.

---

## 4.12 ✅ Atualizar `web/eslint.config.mjs`

```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  }
);
```

---

## 4.13 ✅ Atualizar `web/.env.local`

```env
VITE_API_URL=http://localhost:3333
```

(`NEXT_PUBLIC_API_URL` renomeado para `VITE_API_URL`)

---

## 4.14 ✅ Atualizar `web/.gitignore`

```diff
-# next.js
-/.next/
-/out/
-# vercel
-.vercel
-# typescript
-*.tsbuildinfo
-next-env.d.ts
+# vite
+/dist
+# typescript
+*.tsbuildinfo
```

---

## 4.15 ✅ Atualizar CI/CD workflows

### `web-build.yaml`

```diff
-        NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
+        VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

```diff
-          path: web/out
+          path: web/dist
```

### `web-deploy.yaml`

```diff
-          aws s3 sync out/ s3://link-shorter-web-...
+          aws s3 sync dist/ s3://link-shorter-web-...
```

### GitHub Secret

Renomear no repositório → Settings → Secrets → Actions:
- `NEXT_PUBLIC_API_URL` → `VITE_API_URL`

> `web-setup.yaml`, `web-lint.yaml` e `web-ci.yaml` não precisam de alteração.

---

## Resumo dos arquivos

### Criados ✅
| Arquivo | Descrição |
|---------|-----------|
| `web/index.html` | Entry point HTML |
| `web/vite.config.ts` | Config do Vite |
| `web/src/main.tsx` | Entry point React |
| `web/src/App.tsx` | BrowserRouter + Routes |

### Modificados
| Arquivo | Status |
|---------|--------|
| `web/package.json` | ✅ |
| `web/tsconfig.json` | ✅ |
| `web/src/lib/api.ts` | ✅ |
| `web/src/pages/shortlink/index.tsx` | ✅ |
| `web/src/pages/404.tsx` | ✅ |
| `web/src/components/ShortLink.tsx` | ✅ |
| `web/.env.local` | ✅ |
| `web/src/styles/globals.css` | ✅ |
| `web/eslint.config.mjs` | ✅ |
| `web/.gitignore` | ✅ |
| `.github/workflows/web-build.yaml` | ✅ |
| `.github/workflows/web-deploy.yaml` | ✅ |

### Deletados
| Arquivo | Status |
|---------|--------|
| `web/next.config.ts` | ✅ |
| `web/src/pages/_app.tsx` | ✅ |
| `web/src/pages/_document.tsx` | ✅ |
| `web/next-env.d.ts` | ✅ |
| `web/public/serve.json` | ✅ |
| `web/public/next.svg` | ✅ |
| `web/public/vercel.svg` | ✅ |
| `web/.next/` (diretório) | ✅ |
| `web/out/` (diretório) | ✅ |

---

## Status geral

- **`yarn dev`** — ✅ funcionando em `http://localhost:3001`
- **`yarn build`** — ✅ gera `dist/` sem erros TypeScript
- **Fonte Open Sans** — ✅ `globals.css` com `@font-face`
- **ESLint** — ✅ `eslint.config.mjs` sem `eslint-config-next`
- **CI/CD** — ✅ workflows + GitHub Secret (renomear manualmente no GitHub)
- **Limpeza** — ✅ arquivos obsoletos removidos
