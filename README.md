# Diretório de Prompts (Trae) – Deploy na Vercel

## Stack
- React 18 + Vite
- TailwindCSS
- Supabase (Auth/DB/Storage)

## Variáveis de Ambiente
Crie um arquivo `.env` na raiz com:
```
VITE_SUPABASE_URL=https://lhxnwwybhquttlyudgct.supabase.co
VITE_SUPABASE_ANON_KEY=SEU_ANON_KEY
```

## Desenvolvimento
```
pnpm install
pnpm dev
```

## Build de Produção
```
pnpm build
```
A saída fica em `dist/`.

## Deploy na Vercel (via Git)
1. Suba este projeto para um repositório (GitHub/GitLab/Bitbucket).
2. No painel da Vercel, clique em “Add New Project” e importe o repositório.
3. Configure:
   - Build Command: `pnpm build` (ou `npm run build`)
   - Output Directory: `dist`
4. Adicione as envs (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) em “Settings → Environment Variables”.
5. Publique. O `vercel.json` já garante SPA fallback para rotas do React Router.

## Conectar Domínio
- Apex (`iautonoma.com.br`): A → `76.76.21.21`
- Subdomínio (`www.iautonoma.com.br`): CNAME → `cname.vercel-dns.com`

## Deploy via CLI (opcional)
```
npm i -g vercel
vercel login
pnpm build
vercel --prebuilt --prod
```

## Observações
- Nunca use `service_role_key` no frontend.
- As migrações Supabase estão em `supabase/migrations`.
