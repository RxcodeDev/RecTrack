# CONTEXT — RecTrack

> Documento de contexto para cualquier IA (o persona) que vaya a modificar este
> proyecto. Léelo completo antes de tocar código.
>
> Existe un companion `context.toon` con la parte **estructurada** (rutas API,
> modelo de datos, variables de entorno, mapa de archivos) en formato TOON,
> optimizado en tokens para ingestión por IA. Este `CONTEXT.MD` cubre lo
> narrativo (arquitectura, convenciones, advertencias).

---

## 1. Qué es este proyecto

**RecTrack** (marca visible: *ReckTrack Marketing Digital*) es el sitio web
landing de una agencia de marketing digital, con un **CMS de archivos planos**:
todo el contenido visible (textos, imágenes, colores, logos, SEO) se edita sin
tocar código a través de una API de administración protegida.

El proyecto tiene **dos caras**:

1. **Landing público** (`/`) — página única con secciones (hero, servicios,
   portafolio, testimonios, contacto, etc.). Renderizada en el servidor leyendo
   los JSON de `data/`.
2. **API de administración** (`/api/admin/*`) — capa de lectura/escritura sobre
   los JSON de contenido. La consume un **panel de administración externo**
   (otra app, no incluida en este repo). Por eso la API tiene CORS y acepta
   autenticación por token Bearer además de cookie.

No existe una UI de panel dentro de este repositorio: solo el landing y la API.

---

## 2. Stack tecnológico

| Capa            | Tecnología                                  |
|-----------------|---------------------------------------------|
| Framework       | **Next.js 16.2.6** (App Router)             |
| Runtime         | Node.js 20+                                 |
| Lenguaje        | TypeScript 5 (modo `strict`)                |
| UI              | React 19.2                                  |
| Estilos         | Tailwind CSS v4 (vía `@tailwindcss/postcss`)|
| Email           | `nodemailer` (declarado, **sin uso actual**)|
| Persistencia    | Archivos JSON en disco (`data/`, `public/`) |

No hay base de datos. No hay tests. No hay ORM.

---

## 3. ⚠️ Next.js 16 — esto NO es el Next.js que conoces

Esta versión tiene **breaking changes** respecto a versiones anteriores. Antes
de escribir código, consulta la guía relevante en
`node_modules/next/dist/docs/`. Cambios clave presentes en este repo:

- **`middleware.ts` → `proxy.ts`**. El middleware se llama ahora `proxy.ts` y
  exporta `export default async function proxy(req)`. Está en la raíz del repo.
  Docs: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- **Rutas dinámicas**: `params` es una **Promise**. Hay que hacer
  `const { section } = await params;` (ver `app/api/admin/content/[section]/route.ts`).
- App Router puro: cada carpeta en `app/api/.../` con un `route.ts` exporta
  handlers por método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `OPTIONS`).

Cuando dudes de una API de Next, **lee los docs locales** en
`node_modules/next/dist/docs/` en vez de asumir.

---

## 4. Estructura de carpetas

```
RecTrack/
├── app/
│   ├── layout.tsx            # Root layout: fuentes, <head>, metadata SEO dinámica,
│   │                         #   inyecta los colores de data/site-colors.json como CSS vars
│   ├── page.tsx              # Landing: lee data/ y monta los componentes de sección
│   ├── globals.css           # Tailwind v4 + design tokens (variables --color-*)
│   └── api/
│       ├── contact/route.ts          # POST público: guarda leads del formulario
│       └── admin/                    # API del panel (protegida por proxy.ts)
│           ├── auth/route.ts         # POST login/logout (password → token)
│           ├── content/route.ts      # GET/PUT/PATCH del contenido completo
│           ├── content/[section]/route.ts  # GET/PUT de una sección concreta
│           ├── colors/route.ts       # GET/PUT de la paleta de colores
│           ├── colors/defaults/route.ts    # GET paleta por defecto
│           ├── logos/route.ts        # GET/PUT de logo y favicon
│           ├── leads/route.ts        # GET de los leads del formulario
│           └── upload/route.ts       # POST de imágenes a public/<folder>
├── components/               # 9 componentes de sección del landing (client components)
│   ├── Navbar.tsx  Hero.tsx  Clients.tsx  Services.tsx  Stats.tsx
│   └── Portfolio.tsx  Testimonials.tsx  Contact.tsx  Footer.tsx
├── lib/
│   ├── auth.ts               # HMAC: tokens de sesión, verificación, cookies
│   ├── content.ts            # Tipos del contenido + read/write/patch de los JSON
│   └── cors.ts               # Cabeceras CORS para el panel externo
├── data/                     # "Base de datos" de archivos planos (ver §6)
│   ├── site-content.json     # Todo el contenido textual del landing
│   ├── site-colors.json      # Paleta de colores
│   ├── site-logos.json       # Rutas de logo y favicon
│   └── submissions.json      # Leads del formulario (generado, NO en git)
├── public/                   # Estáticos servidos en /
│   ├── clientes/  logos/     # Imágenes versionadas
│   └── uploads/              # Destino por defecto de /api/admin/upload
├── proxy.ts                  # Middleware (Next 16): protege /admin/* y /api/admin/*
├── next.config.ts            # output: "standalone", remotePatterns de imágenes
├── tailwind.config.ts        # Theme de Tailwind (colores brand, animaciones)
├── Dockerfile  docker-compose.yml  .dockerignore  DOCKER.md
└── AGENTS.md  CLAUDE.md  CONTEXT.MD  context.toon  README.md
```

---

## 5. Arquitectura: CMS de archivos planos

El principio central: **el contenido vive en `data/*.json`, no en el código.**

- **Lectura (landing)**: `app/page.tsx` y `app/layout.tsx` leen los JSON con
  `fs.readFile` en cada render del servidor. `lib/content.ts` centraliza esa
  lectura y expone los **tipos TypeScript** de cada sección.
- **Escritura (panel externo)**: las rutas `/api/admin/*` reescriben los JSON
  con `fs.writeFile` y llaman a `revalidatePath("/")` para que el landing
  refleje el cambio.
- **Imágenes**: `/api/admin/upload` guarda archivos en `public/<folder>` y
  devuelve la ruta pública; esa ruta se guarda luego dentro de un JSON.

**Implicación para despliegue**: la app necesita un **disco de escritura
persistente** en `data/` y `public/uploads/`. En Docker esto se resuelve con
volúmenes (ver §13). Sin persistencia, los cambios del panel se pierden al
reiniciar el contenedor.

---

## 6. Modelo de datos (`data/`)

Los tipos canónicos están en [lib/content.ts](lib/content.ts). Resumen:

### `site-content.json` — interface `SiteContent`
Objeto con 10 secciones de nivel superior. Cada clave es una sección del landing:

| Clave         | Contenido                                                        |
|---------------|------------------------------------------------------------------|
| `meta`        | SEO: title, description, keywords, Open Graph, Twitter Card, robots, canonical |
| `navbar`      | Número y mensaje de WhatsApp                                      |
| `hero`        | Eyebrow, titular (array de líneas), subtítulo, CTAs, mini-stats   |
| `clients`     | Etiqueta + lista de logos de clientes (`name`, `src`)            |
| `services`    | Etiqueta, encabezado + lista de servicios (`title`, `description`, `detail`, `image`) |
| `stats`       | Etiqueta, encabezado + métricas animadas (`target`, `suffix`, `label`, `description`) |
| `portfolio`   | Encabezado + `photos[]` y `videos[]` del portafolio              |
| `testimonials`| Vídeos testimonio, resumen de Google Reviews y reseñas individuales |
| `contact`     | Encabezado, email, teléfono, ubicación                           |
| `footer`      | Tagline, datos de contacto, redes sociales, enlaces legales      |

### `site-colors.json` — `Record<string, string>`
Pares `nombre-de-token → valor CSS`. `layout.tsx` los inyecta como
`--color-<token>` en `:root`, sobreescribiendo los tokens de `globals.css`.
La paleta por defecto está duplicada en `app/api/admin/colors/defaults/route.ts`.

### `site-logos.json` — interface `SiteLogos`
`{ logo_url?, favicon_url? }`. Rutas públicas (p. ej. `/uploads/logo.png`).

### `submissions.json` — leads del formulario de contacto
Array de `{ id, createdAt, name, email, service, message }`. **Generado en
runtime, está en `.gitignore`.** No asumas que existe; el código lo crea al
recibir el primer lead.

> Al añadir/cambiar un campo de contenido: actualiza **(1)** el tipo en
> `lib/content.ts`, **(2)** el JSON en `data/`, y **(3)** el componente que lo
> consume. Los tres deben ir sincronizados.

---

## 7. Rutas API

### Pública
- `POST /api/contact` — recibe `{ name, email, service?, message }`, valida en
  servidor (campos requeridos + formato de email) y añade el lead a
  `data/submissions.json`. **No envía email** (nodemailer no está cableado).

### Administración (`/api/admin/*` — protegidas por `proxy.ts`)
| Ruta                          | Métodos              | Función                              |
|-------------------------------|----------------------|--------------------------------------|
| `/api/admin/auth`             | `POST`, `OPTIONS`    | Login (password → token) y logout. **No requiere sesión previa.** |
| `/api/admin/content`          | `GET/PUT/PATCH/OPTIONS` | Leer / reemplazar / parchear contenido completo |
| `/api/admin/content/[section]`| `GET/PUT/OPTIONS`    | Leer / parchear una sección concreta |
| `/api/admin/colors`           | `GET/PUT/OPTIONS`    | Leer / guardar la paleta             |
| `/api/admin/colors/defaults`  | `GET/OPTIONS`        | Paleta por defecto (solo lectura)    |
| `/api/admin/logos`            | `GET/PUT/OPTIONS`    | Leer / guardar logo y favicon        |
| `/api/admin/leads`            | `GET/OPTIONS`        | Listar leads (más recientes primero) |
| `/api/admin/upload`           | `POST/OPTIONS`       | Subir imagen (≤5 MB; jpeg/png/webp/gif/svg) |

Todas las rutas admin: responden `OPTIONS` (preflight CORS) y adjuntan
cabeceras CORS en cada respuesta vía `lib/cors.ts`.

---

## 8. Autenticación del panel ([lib/auth.ts](lib/auth.ts))

- **Login**: `POST /api/admin/auth` con `{ password }`. Se compara contra
  `ADMIN_PASSWORD` en **tiempo constante** (`checkPassword`).
- **Token**: al validar, se emite un token = `base64url("admin:<timestamp>.<HMAC-SHA256>")`,
  firmado con `ADMIN_SECRET`. Se devuelve en el body **y** se setea como cookie
  `admin_session` (`HttpOnly; SameSite=None; Secure; Max-Age=8h`).
- **Protección** (`proxy.ts`): toda petición a `/api/admin/*` (excepto
  `/api/admin/auth`) y a `/admin/*` se valida con `isAuthenticatedRequest`, que
  acepta **token Bearer** (`Authorization: Bearer <token>`) o **cookie**.
  - API admin no autenticada → `401 { error: "No autorizado." }`.
  - Página `/admin/*` no autenticada → redirect a `/admin`.
- Las peticiones `OPTIONS` pasan sin autenticar (preflight CORS).

> Limitaciones conocidas (no son bugs a “arreglar” sin pedir contexto):
> el token **no caduca** por sí mismo (el `Max-Age` es solo de la cookie); la
> auth es de un solo usuario con password compartida; no hay rate limiting más
> allá del `setTimeout(400ms)` en login fallido.

---

## 9. CORS / panel externo ([lib/cors.ts](lib/cors.ts))

El panel de administración es una app **separada**, en otro origen. Por eso:

- `ADMIN_PANEL_ORIGIN` (env) define los orígenes permitidos (lista separada por
  comas). Si no se define, cae a `*` (wildcard) — **restríngelo en producción**.
- Con `*` no se envía `Access-Control-Allow-Credentials`; las cookies
  cross-site no funcionarán, por lo que el panel debe usar el **token Bearer**.
- Con un origen explícito sí se permiten credenciales (cookies).

---

## 10. Componentes del landing (`components/`)

`app/page.tsx` lee el contenido y pasa a cada componente su sección como prop
`data`. Todos los componentes son **client components** (`'use client'`) porque
usan animaciones, scroll reveal (`IntersectionObserver`), contadores, etc.

Cada componente recibe `data?` tipado desde `lib/content.ts` y tiene **valores
por defecto** para renderizar aunque falte contenido. Orden de secciones:
`Navbar → Hero → Clients → Services → Stats → Portfolio → Testimonials →
Contact → Footer`.

`Contact.tsx` contiene el formulario que hace `POST /api/contact`.

---

## 11. Estilos y theming

- **Tailwind CSS v4**, configurado vía `app/globals.css` (`@import "tailwindcss"`
  + `@config "../tailwind.config.ts"`).
- **Design tokens**: variables CSS `--color-<token>` definidas en `globals.css`
  (bloque `@theme inline` + `:root`). Tailwind las expone como clases
  (`bg-brand-primary`, `text-brand-text`, etc.).
- **Theming dinámico**: `layout.tsx` lee `data/site-colors.json` y emite un
  `<style>:root{--color-...}</style>` que **sobreescribe** los tokens. Así el
  panel cambia la paleta sin recompilar.
- Fuentes Google vía `next/font`: Plus Jakarta Sans (`--font-display`), Outfit
  (`--font-body`), Space Mono (`--font-mono`).

> Hay duplicación intencionada de la paleta en 3 sitios: `globals.css`,
> `tailwind.config.ts` y `colors/defaults/route.ts`. Si cambias un color base,
> revisa los tres.

---

## 12. Variables de entorno

Definidas en `.env.local` (NO versionado — ver `.gitignore`). El repo incluye
`.env.example` como plantilla: `cp .env.example .env.local` y rellena los valores.

| Variable             | Obligatoria | Descripción                                            |
|----------------------|-------------|--------------------------------------------------------|
| `ADMIN_PASSWORD`     | Sí          | Contraseña del panel admin.                            |
| `ADMIN_SECRET`       | Sí          | Clave HMAC para firmar tokens. Genera 64 hex con `openssl rand -hex 32`. |
| `ADMIN_PANEL_ORIGIN` | No          | Orígenes CORS permitidos (coma-separados). Sin definir → `*`. |

`auth.ts` lanza error en runtime si falta `ADMIN_PASSWORD` o `ADMIN_SECRET`
(solo al ejecutarse una ruta admin, no en el build).

---

## 13. Comandos y despliegue

### Desarrollo local
```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run build    # build de producción (genera .next/standalone)
npm run start    # servir el build
npm run lint     # ESLint
```

### Docker
El repo incluye `Dockerfile` (multi-stage, basado en el output `standalone`) y
`docker-compose.yml`. Guía de comandos completa en [DOCKER.md](DOCKER.md).

```bash
docker compose up -d --build      # construir y levantar
docker compose logs -f            # ver logs
docker compose down               # detener
```

Detalles importantes:
- El contenedor lee `ADMIN_PASSWORD` / `ADMIN_SECRET` desde `.env.local` vía
  `env_file`. Ese archivo **debe existir** antes de `docker compose up`.
- Persistencia: dos **volúmenes nombrados** mantienen los datos editables:
  - `rectrack-data` → `/app/data` (contenido del CMS + leads)
  - `rectrack-uploads` → `/app/public/uploads` (imágenes subidas)
  En la primera creación, Docker siembra cada volumen con los archivos JSON /
  imágenes incluidos en la imagen. Después, las ediciones del panel persisten.
- La app escucha en el puerto **3000** dentro del contenedor.

---

## 14. Convenciones y advertencias al modificar

1. **Lee los docs de Next 16** en `node_modules/next/dist/docs/` antes de usar
   una API de framework. Esta versión difiere de lo que “sabes”.
2. **Middleware = `proxy.ts`** en la raíz. No crees `middleware.ts`.
3. **`params` es Promise** en rutas dinámicas: siempre `await params`.
4. **Contenido = JSON**, no hardcodear textos en componentes. Para añadir un
   campo: tipo en `lib/content.ts` → dato en `data/*.json` → uso en el componente.
5. **Toda ruta admin** debe: exportar `OPTIONS` (preflight) y adjuntar
   `corsHeaders(req)` en cada respuesta. Copia el patrón de una ruta existente.
6. **No rompas el contrato de la API admin**: la consume un panel externo.
   Cambios en forma de request/response son breaking changes para ese panel.
7. **Escrituras a disco**: cualquier dato nuevo persistente va a `data/` o
   `public/`, y debe quedar cubierto por un volumen en `docker-compose.yml`.
8. **Sin tests ni CI**: verifica los cambios manualmente con `npm run dev` y,
   para cambios de API, con peticiones reales (incluido el flujo de auth).
9. **Idioma**: la UI, los mensajes de error de la API y los comentarios están
   en **español**. Mantén ese idioma.
10. **Secretos**: nunca commitees `.env.local` ni dejes credenciales en código.
