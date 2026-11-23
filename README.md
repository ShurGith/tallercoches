<div align="center">

# 🚗 TallerCoches

**Gestión integral para talleres mecánicos** — clientes, vehículos, presupuestos, citas, inventario y personal en un panel moderno.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white&labelColor=0f172a)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-12-F69220?logo=pnpm&logoColor=white&labelColor=24292e)
![JWT](https://img.shields.io/badge/Auth-JWT-d63aff?logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ Módulos

| Módulo | Descripción | Estado |
| --- | --- | :---: |
| 🔐 **Autenticación** | Registro e inicio de sesión con JWT | ✅ Conectado a BD |
| 👥 **Clientes** | Alta, edición, búsqueda y archivado | ✅ Conectado a BD |
| 🚙 **Vehículos** | Varios vehículos por cliente, con matrícula, año y km | ✅ Conectado a BD |
| 📄 **Presupuestos** | Estados y valores de ejemplo | 🧪 Datos demo |
| 📅 **Citas** | Agenda con vistas de día, semana y mes | 🧪 Datos demo |
| 📦 **Repuestos** | Existencias frente a mínimos | 🧪 Datos demo |
| 🧑‍🔧 **Personal** | Equipo y turnos | 🧪 Datos demo |
| 🗓️ **Horarios** | Planificación semanal | 🧪 Datos demo |
| 🎨 **Configuración** | 6 paletas de color (regla 60-30-10) | ✅ Persistente |

## 🎨 Paletas de color

La interfaz se tematiza con variables CSS y `[data-palette]`; Tailwind consume esos tokens semánticos.

| | Paleta | Base · Secundario · Acento |
| :---: | --- | --- |
| 🔵 | Azul + gris + naranja | `#1E3A8A` · `#F3F4F6` · `#F97316` |
| 🟢 | Verde + blanco + amarillo | `#215E33` · `#E5E7EB` · `#FBBF24` |
| ⚫ | Grafito + celeste + rojo | `#2E2E2E` · `#EEF6FF` · `#EF4444` |
| 🪸 | Azul petróleo + crema + coral | `#264653` · `#F4F1DE` · `#E76F51` |
| 🟣 | Morado + gris perla + verde lima | `#5D3A77` · `#E1E1E1` · `#9BE564` |
| 🟡 | Negro + gris claro + mostaza | `#1C1C1C` · `#CFCFCF` · `#D4A017` |

## 🚀 Desarrollo local

**Requisitos:** Node.js, pnpm `12.21.0` (fijado en `package.json`) y PostgreSQL.

```bash
# 1. Variables de entorno (.env en la raíz)
#    DATABASE_URL, JWT_SECRET y PORT

# 2. Esquema y datos de prueba
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql   # opcional: clientes ficticios

# 3. Dependencias
pnpm install

# 4. API (puerto 4000)
pnpm start

# 5. Frontend en otra terminal (puerto 3000)
pnpm --filter app-clientes start
```

> 💡 El frontend apunta a `http://localhost:4000` por defecto. Cámbialo con `REACT_APP_API_URL` en `app-clientes/.env`.

### ✅ Tests y build

```bash
CI=true pnpm --filter app-clientes test   # tests del frontend
pnpm --filter app-clientes build          # build de producción
```

## 🔌 API

Las rutas protegidas requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción | Auth |
| :---: | --- | --- | :---: |
| `POST` | `/register` | Crea una cuenta y emite un JWT | — |
| `POST` | `/login` | Inicia sesión y emite un JWT | — |
| `GET` | `/clientes?q=...` | Lista y busca clientes activos | 🔒 |
| `POST` | `/clientes` | Crea un cliente | 🔒 |
| `GET` | `/clientes/:id` | Consulta un cliente | 🔒 |
| `PUT` | `/clientes/:id` | Actualiza un cliente | 🔒 |
| `DELETE` | `/clientes/:id` | Archiva al cliente (conserva su historial) | 🔒 |
| `GET` | `/clientes/:id/vehiculos` | Lista los vehículos de un cliente | 🔒 |
| `POST` | `/clientes/:id/vehiculos` | Añade un vehículo al cliente | 🔒 |
| `PUT` | `/vehiculos/:id` | Actualiza un vehículo | 🔒 |
| `DELETE` | `/vehiculos/:id` | Archiva un vehículo | 🔒 |

## 🗂️ Estructura

```text
tallercoches/
├── index.js              # API Express (puerto 4000)
├── database/             # schema.sql y seed.sql
├── app-clientes/         # Frontend React + Tailwind (puerto 3000)
│   └── src/
│       ├── App.js        # Paneles y componentes
│       ├── api.js        # Cliente axios con JWT
│       └── index.css     # Tokens, paletas y estilos base
└── docs/                 # Notas de desarrollo
```
