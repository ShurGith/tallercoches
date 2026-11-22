# TallerCoches

Aplicación para la gestión de un taller mecánico. El primer módulo cubre autenticación y gestión de clientes; presupuestos, citas, inventario y personal se incorporarán en fases posteriores.

## Desarrollo local

Requisitos: Node.js, pnpm 12.21.0 y PostgreSQL.

1. Configura `DATABASE_URL`, `JWT_SECRET` y `PORT` en `.env`.
2. Ejecuta el esquema de base de datos con `psql "$DATABASE_URL" -f database/schema.sql`.
3. Para cargar clientes ficticios de prueba, ejecuta `psql "$DATABASE_URL" -f database/seed.sql`.
4. Instala las dependencias desde la raíz con `pnpm install`.
5. Inicia la API desde la raíz con `pnpm start` (por defecto, puerto 4000).
6. Inicia el frontend en otra terminal con `pnpm --filter app-clientes start` (por defecto, puerto 3000).

El frontend usa `http://localhost:4000` como API por defecto. Se puede cambiar con `REACT_APP_API_URL` en `app-clientes/.env`.
El workspace fija pnpm 12.21.0 en `package.json` para que todos usen el mismo gestor.

## API inicial

- `POST /register` y `POST /login` gestionan las cuentas y emiten un JWT.
- Las rutas `/clientes` requieren `Authorization: Bearer <token>`.
- `GET /clientes?q=...` lista y busca clientes activos.
- `POST /clientes`, `GET /clientes/:id` y `PUT /clientes/:id` crean, consultan y actualizan clientes.
- `DELETE /clientes/:id` archiva al cliente para conservar su registro e historial futuro.
