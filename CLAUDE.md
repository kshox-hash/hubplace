# runtimeGenerateUi — Contexto del proyecto

## Stack
- **Backend:** Node.js + TypeScript + Express 5 + PostgreSQL (Render)
- **Frontend:** Flutter (app móvil)
- **Auth:** JWT + Google OAuth (Passport)
- **Pagos:** MercadoPago
- **Otros:** Nodemailer, PDFKit, Zod, Helmet, express-rate-limit

## Estado del backend (junio 2025)

### Módulos existentes
- `src/modules/stadistics/` — estadísticas, reseñas (NUEVO, construido en sesión anterior)
- `src/modules/appointments/` — citas/calendario con MercadoPago (⚠️ tiene bugs, no tocar hasta arreglar webhook)
- `src/modules/quotes/` — cotizaciones con PDF y email
- `src/modules/notifications/` — notificaciones push
- `src/modules/profiles/` — perfil de empresa
- `src/modules/slug/` — slugs públicos
- `src/modules/menus/` — portal público
- `src/modules/payments/` — MercadoPago
- `src/login/` — login email/password + Google OAuth
- `src/runtime/` — runtime links, booking público

### Rutas del backend (base: `/api`)
```
POST   /api/stats/:userId/increment
GET    /api/stats/:userId/dashboard
GET    /api/stats/:userId/home
GET    /api/stats/:userId/link-opens
GET    /api/stats/:userId/module-ranking
GET    /api/stats/:userId/reviews/summary
POST   /api/stats/:userId/reviews
GET    /api/stats/:userId/reviews
DELETE /api/stats/:userId/reviews/:reviewId
GET    /api/notifications/:userId
PATCH  /api/notifications/:userId/read-all
PATCH  /api/notifications/:userId/:notificationId/read
GET    /health
POST   /auth/login          (rate limited: 20 req/15min)
GET    /auth/google
GET    /auth/google/callback
```

## Seguridad — ya resuelta
- Auth JWT en todos los módulos privados
- Ownership check (JWT userId vs params userId) en estadísticas y notificaciones
- CORS con allowlist via env var `CORS_ORIGIN`
- Helmet aplicado
- Rate limiting en /auth
- Credenciales DB solo desde env vars (no hardcodeadas)
- Graceful shutdown (SIGTERM/SIGINT)
- Health check en GET /health

## PENDIENTE CRÍTICO — webhook MercadoPago
**Archivo:** `src/runtime/runtime.controller.ts`
El endpoint `POST /api/payments/webhook` NO verifica la firma HMAC-SHA256 del header `x-signature`.
**El usuario quiere resolver esto antes de ir a producción.**
No tocar el módulo de calendario/pagos hasta que el usuario lo indique.

## Variables de entorno requeridas
```
JWT_SECRET=
CORS_ORIGIN=https://tudominio.com
PGHOST=
PGUSER=
PGPASSWORD=
PGDATABASE=
PGPORT=5432
PUBLIC_BASE_URL=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
APP_DEEPLINK_URL=automatiza://auth
```

## Nota técnica importante
`@types/express` v5.0.6 cambió `ParamsDictionary` a `{ [key: string]: string | string[] }`.
En controllers usar `String(req.params["paramName"])` — NO `req.params.paramName` directo.
