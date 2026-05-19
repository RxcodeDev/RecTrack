This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Integración con Rxpanel (contrato estándar)

RecTrack expone el contrato que el proxy de Rxpanel consume. Todos los
endpoints aceptan **`Authorization: Bearer <token>`** (token generado por
`POST /api/admin/auth`, sin expiración) o la cookie de sesión same-origin.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/content/:section` | Lee una sección de `data/site-content.json` |
| `PUT` | `/content/:section` | Reemplaza la sección (body = nuevo valor) |
| `DELETE` | `/content/:section` | Elimina la sección |
| `GET/PUT` | `/colors` | `{ primary, secondary, accent, bg, text }` → `data/site-theme.json` |
| `GET/PUT` | `/logos` | `{ logo_url, favicon_url }` → `data/site-theme.json` |

`section` ∈ `meta · navbar · hero · clients · services · stats · portfolio ·
testimonials · contact · footer`.

**Configurar en Rxpanel:** crea el sitio con `url` = raíz pública de RecTrack
(ej. `https://recktrack.com`) y `api_token` = token de `/api/admin/auth`.
CORS se controla con `ADMIN_PANEL_ORIGIN` en `.env.local`.

Todas las rutas `/api/admin/*` (excepto `POST /api/admin/auth`, que emite el
token) exigen Bearer o cookie de sesión vía `requireAuth`. La ruta pública
`POST /api/contact` permanece abierta a propósito (formulario del sitio).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
