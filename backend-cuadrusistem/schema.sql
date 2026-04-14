-- Archivo: schema.sql
-- Este archivo contiene el esquema actualizado de la base de datos para CuadriSistem.

-- Eliminar tablas existentes en orden inverso
DROP TABLE IF EXISTS "reportes_z" CASCADE;
DROP TABLE IF EXISTS "reporte_z" CASCADE; -- Por si existe la versión singular
DROP TABLE IF EXISTS "planilla_items" CASCADE;
DROP TABLE IF EXISTS "planillas" CASCADE;
DROP TABLE IF EXISTS "ingredientes" CASCADE;
DROP TABLE IF EXISTS "turnos" CASCADE;
DROP TABLE IF EXISTS "locales" CASCADE;
DROP TABLE IF EXISTS "cuadres" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Tabla: users
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: locales
CREATE TABLE "locales" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" VARCHAR(100) NOT NULL UNIQUE,
  "direccion" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: turnos
CREATE TABLE "turnos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tipo" VARCHAR(50) NOT NULL,
  "fecha" DATE NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: ingredientes
CREATE TABLE "ingredientes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre_visible" VARCHAR(100) NOT NULL,
  "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('COCINA', 'CAJA')),
  "unidad" VARCHAR(50),
  "orden" INTEGER NOT NULL DEFAULT 0, -- Nueva columna para el orden exacto
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: planillas
CREATE TABLE "planillas" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fecha" DATE NOT NULL,
  "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('COCINA', 'CAJA')),
  "turno_id" UUID NOT NULL REFERENCES "turnos"("id"),
  "local_id" UUID NOT NULL REFERENCES "locales"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: planilla_items
CREATE TABLE "planilla_items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "planilla_id" UUID NOT NULL REFERENCES "planillas"("id") ON DELETE CASCADE,
  "ingrediente_id" UUID NOT NULL REFERENCES "ingredientes"("id"),
  "segmento" VARCHAR(50) NOT NULL, -- 'SALDO_INICIAL', 'ENTRADA', 'DEVOLUC', 'SALDO_FINAL'
  "cantidad" NUMERIC(10,2) NOT NULL,
  UNIQUE("planilla_id", "ingrediente_id", "segmento")
);

-- Tabla: reportes_z
CREATE TABLE "reportes_z" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "archivo_original" VARCHAR(255) NOT NULL,
  "checksum" VARCHAR(64) UNIQUE NOT NULL,
  "items" JSONB, -- Lista estructurada de ventas extraídas por OCR
  "fecha_operacion" DATE NOT NULL,
  "local_id" UUID REFERENCES "locales"("id"),
  "turno_id" UUID REFERENCES "turnos"("id"),
  "admin_id" UUID, -- Para trazabilidad futura
  "procesado" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --- DATOS INICIALES DE EJEMPLO ---

INSERT INTO "locales" ("nombre", "direccion") VALUES
('Obelisco', 'Av. Principal, El Obelisco');

-- Turnos de ejemplo (se crearán dinámicamente en producción, pero útil para tests)
INSERT INTO "turnos" ("tipo", "fecha") VALUES
('MAÑANA', '2026-03-17'),
('TARDE', '2026-03-17');

-- Ingredientes de ejemplo
INSERT INTO "ingredientes" ("nombre_visible", "tipo", "unidad") VALUES
('Vienesas personal', 'COCINA', 'unidades'),
('Pan mesa Personal', 'COCINA', 'unidades'),
('Carne para As Gig.', 'COCINA', 'unidades'),
('Coca Cola 591CC', 'CAJA', 'unidades'),
('CORONA BOTELLIN', 'CAJA', 'unidades');
