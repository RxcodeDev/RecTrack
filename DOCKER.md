# Docker — RecTrack

Guía rápida para construir y ejecutar RecTrack con Docker.

El repo incluye `Dockerfile` (build multi-stage sobre el output `standalone` de
Next.js) y `docker-compose.yml` (servicio + volúmenes de persistencia).

---

## Requisito previo

El contenedor lee las variables de entorno desde `.env.local`. **Debe existir
antes de levantar nada.** Si no lo tienes, créalo desde la plantilla:

```bash
cp .env.example .env.local
```

Luego edítalo y rellena `ADMIN_PASSWORD` y `ADMIN_SECRET` (genera el secreto con
`openssl rand -hex 32`).

---

## Comandos básicos (docker compose)

```bash
# Construir la imagen y levantar el contenedor en segundo plano
docker compose up -d --build

# Ver los logs en vivo
docker compose logs -f

# Estado del contenedor (incluye el healthcheck)
docker compose ps

# Reiniciar el contenedor
docker compose restart

# Detener y eliminar el contenedor (los volúmenes/datos se conservan)
docker compose down
```

La app queda disponible en **http://localhost:3000**.

---

## Tras cambiar el código

El build se hace dentro de la imagen, así que cualquier cambio en el código
requiere reconstruir:

```bash
docker compose up -d --build
```

---

## Datos y persistencia

RecTrack es un CMS de archivos planos: escribe a disco en runtime. Dos
**volúmenes nombrados** conservan esos datos entre reinicios:

| Volumen             | Ruta en el contenedor | Contenido                          |
|---------------------|-----------------------|------------------------------------|
| `rectrack-data`     | `/app/data`           | `site-content/colors/logos.json` + leads |
| `rectrack-uploads`  | `/app/public/uploads` | Imágenes subidas desde el panel    |

En la primera creación, Docker siembra cada volumen con el contenido incluido en
la imagen. Después, las ediciones del panel persisten.

```bash
# Listar los volúmenes del proyecto
docker volume ls | grep rectrack

# ⚠️ Borrar el contenedor Y los volúmenes (se pierden TODOS los datos del CMS)
docker compose down -v
```

---

## Operaciones útiles

```bash
# Abrir una shell dentro del contenedor en marcha
docker compose exec rectrack sh

# Ver las variables de entorno cargadas
docker compose exec rectrack env

# Seguir solo las últimas 50 líneas de log
docker compose logs -f --tail 50
```

---

## Sin docker compose (Docker directo)

```bash
# Construir la imagen
docker build -t rectrack .

# Ejecutar el contenedor
docker run -d --name rectrack \
  -p 3000:3000 \
  --env-file .env.local \
  -v rectrack-data:/app/data \
  -v rectrack-uploads:/app/public/uploads \
  rectrack
```

---

## Resolución de problemas

| Síntoma                                  | Causa probable / solución                                      |
|------------------------------------------|----------------------------------------------------------------|
| `error: .env.local not found`            | Falta el archivo. `cp .env.example .env.local` y rellénalo.    |
| API admin responde `500` al iniciar      | Falta `ADMIN_PASSWORD` o `ADMIN_SECRET` en `.env.local`.       |
| Los cambios del panel desaparecen        | Levantaste sin los volúmenes (revisa `docker compose ps` / `docker volume ls`). |
| El puerto 3000 está ocupado              | Cambia el mapeo en `docker-compose.yml`: `"8080:3000"`.        |
| El código nuevo no se refleja            | Reconstruye: `docker compose up -d --build`.                   |
