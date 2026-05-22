@AGENTS.md
@CONTEXT.MD

# Instrucciones para Claude — RecTrack

`CONTEXT.MD` (importado arriba) contiene el contexto completo del proyecto:
arquitectura, modelo de datos, rutas API y convenciones. Léelo antes de actuar.
Lo siguiente son las reglas operativas resumidas.

## Qué es

Landing de la agencia *ReckTrack Marketing Digital* (Next.js 16, App Router) con
un **CMS de archivos planos**: el contenido vive en `data/*.json`, no en el
código. Una API `/api/admin/*` la consume un **panel de administración externo**.

## Reglas críticas

- **Next.js 16 NO es el que conoces.** Consulta `node_modules/next/dist/docs/`
  antes de usar cualquier API del framework.
- El **middleware se llama `proxy.ts`** (raíz del repo). No crees `middleware.ts`.
- En rutas dinámicas, **`params` es una `Promise`**: usa `await params`.
- **No hardcodees contenido** en componentes. Para añadir un campo: tipo en
  `lib/content.ts` → dato en `data/*.json` → uso en el componente. Los tres
  sincronizados.
- Toda ruta `/api/admin/*` debe exportar `OPTIONS` y adjuntar `corsHeaders(req)`
  en cada respuesta. Copia el patrón de una ruta existente.
- La API admin es un **contrato con un panel externo**: cambiar la forma de sus
  requests/responses es un breaking change. No lo hagas sin pedir contexto.
- Datos persistentes nuevos van a `data/` o `public/`, y deben quedar cubiertos
  por un volumen en `docker-compose.yml`.

## Comandos

```bash
npm run dev      # desarrollo (http://localhost:3000)
npm run build    # build de producción (genera .next/standalone)
npm run lint     # ESLint
```

## Convenciones

- Idioma del proyecto: **español** (UI, errores de API, comentarios). Mantenlo.
- TypeScript en modo `strict`. Sin `any` salvo necesidad justificada.
- No hay tests ni CI: verifica los cambios manualmente con `npm run dev`.
- Nunca commitees `.env.local` ni credenciales.
