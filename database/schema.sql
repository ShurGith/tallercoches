CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    notas TEXT,
    archivado_en TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE clientes
    ADD COLUMN IF NOT EXISTS telefono TEXT,
    ADD COLUMN IF NOT EXISTS notas TEXT,
    ADD COLUMN IF NOT EXISTS archivado_en TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS clientes_activos_nombre_idx
    ON clientes (LOWER(nombre))
    WHERE archivado_en IS NULL;

CREATE INDEX IF NOT EXISTS clientes_activos_email_idx
    ON clientes (LOWER(email))
    WHERE archivado_en IS NULL AND email IS NOT NULL;

CREATE TABLE IF NOT EXISTS vehiculos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    matricula TEXT NOT NULL,
    marca TEXT NOT NULL,
    modelo TEXT,
    anio INTEGER,
    km INTEGER,
    archivado_en TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS vehiculos_matricula_activa_idx
    ON vehiculos (matricula)
    WHERE archivado_en IS NULL;

CREATE INDEX IF NOT EXISTS vehiculos_cliente_activo_idx
    ON vehiculos (cliente_id)
    WHERE archivado_en IS NULL;
