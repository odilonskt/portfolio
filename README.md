# Portfólio

Portfólio pessoal em Next.js (App Router) com painel administrativo, blog, currículo em PDF e três idiomas (pt, en, es).

## O que tem

- **Home**: hero com globo 3D e dados do GitHub, sobre, trajetória, tecnologias (faixa animada e **cubo 3D arrastável**), projetos e formulário de contato.
- **Blog**: posts em Markdown com leitura em voz alta (TTS local no navegador).
- **Currículo**: página pública e PDF gerado no servidor. E-mail e telefone saem só no PDF, nunca no HTML.
- **Painel (`/dashboard`)**: login com Firebase Auth, edição de trajetória, projetos, blog e currículo, caixa de contatos.
- **Imagens**: upload para o Vercel Blob, servidas por `/api/blob`.
- **i18n**: todo texto (site e painel) existe em pt/en/es em `src/lib/i18n/messages`; o idioma vem do visitante.
- **Acessibilidade**: contraste AA nos temas claro e escuro, foco visível, `prefers-reduced-motion` respeitado.

## Interação 3D

O cubo de tecnologias (`src/components/tecnologia/tech-cube.tsx`) é CSS 3D puro, sem dependência. Gira ao arrastar com mouse ou toque e com as setas do teclado. Não tem movimento automático, então não precisa de pausa.

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4 + daisyUI + shadcn/ui, motion, Firebase (Auth e Firestore), Vercel Blob, zod, `@react-pdf/renderer`.

## Rodando localmente

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

Variáveis de ambiente (todas só no servidor, validadas em `src/lib/env.ts`): `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `ADMIN_EMAILS`, `BLOB_READ_WRITE_TOKEN`, `GITHUB_USERNAME`, `GITHUB_TOKEN` (opcional).

## Teste de escalabilidade

`scripts/load-test.mjs` faz carga sem dependências contra uma URL:

```bash
pnpm build && pnpm exec next start -p 3100
node scripts/load-test.mjs http://localhost:3100/pt 50 15   # URL, conexões, segundos
```

Resultado da home `/pt` em build de produção, processo único, gerador de carga na mesma máquina, 15 s por rodada:

| Conexões | Req/s | p50 | p95 | p99 | Erros |
|---|---|---|---|---|---|
| 10 | 266 | 36 ms | 48 ms | 57 ms | 0 |
| 50 | 330 | 151 ms | 174 ms | 231 ms | 0 |
| 100 | 353 | 283 ms | 308 ms | 417 ms | 0 |
| 200 | 363 | 546 ms | 649 ms | 729 ms | 0 |

A vazão satura perto de 360 req/s em um núcleo e a latência cresce de forma linear com as conexões, sem erros nem timeouts. Em produção a Vercel escala horizontalmente e a home é cacheada (`revalidate = 3600`), então o gargalo local não representa o limite real.

## Estrutura

```
src/app          rotas ([lang], api)
src/components   componentes por seção
src/lib          env, auth, conteúdo, i18n, Firebase
scripts          utilitários (TTS, teste de carga)
```
