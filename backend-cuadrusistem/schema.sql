-- Archivo: schema.sql
-- Este archivo contiene el esquema de la base de datos para la aplicación CuadriSistem.
-- Ejecute estas sentencias en su base de datos PostgreSQL para crear las tablas necesarias.

-- Eliminar tablas existentes en orden inverso para evitar problemas de dependencias
DROP TABLE IF EXISTS "reporte_z_ventas";
DROP TABLE IF EXISTS "reportes_z";
DROP TABLE IF EXISTS "planilla_items";
DROP TABLE IF EXISTS "planillas";
DROP TABLE IF EXISTS "ingredientes";
DROP TABLE IF EXISTS "turnos";
DROP TABLE IF EXISTS "locales";

-- Tabla para almacenar los locales o sucursales del restaurante
CREATE TABLE "locales" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" VARCHAR(100) NOT NULL UNIQUE,
  "direccion" VARCHAR(255),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para almacenar los turnos de trabajo
CREATE TABLE "turnos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tipo" VARCHAR(50) NOT NULL, -- Por ejemplo: 'MAÑANA', 'TARDE', 'NOCHE'
  "fecha" DATE NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para almacenar los ingredientes y bebestibles
CREATE TABLE "ingredientes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombreVisible" VARCHAR(100) NOT NULL,
  "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('COCINA', 'CAJA')), -- 'COCINA' para ingredientes, 'CAJA' para bebestibles
  "unidad" VARCHAR(50), -- Por ejemplo: 'unidades', 'gramos', 'litros'
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla principal para las planillas
CREATE TABLE "planillas" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fecha" DATE NOT NULL,
  "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('COCINA', 'CAJA')),
  "turnoId" UUID NOT NULL REFERENCES "turnos"("id"),
  "localId" UUID NOT NULL REFERENCES "locales"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de detalles para cada planilla, almacenando los valores de los segmentos
CREATE TABLE "planilla_items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "planilla_id" UUID NOT NULL REFERENCES "planillas"("id") ON DELETE CASCADE,
  "ingrediente_id" UUID NOT NULL REFERENCES "ingredientes"("id"),
  "segmento" VARCHAR(50) NOT NULL, -- 'SALDO_INICIAL', 'ENTRADA', 'DEVOLUC', 'SALDO_FINAL'
  "cantidad" INTEGER NOT NULL,
  UNIQUE("planilla_id", "ingrediente_id", "segmento") -- Un ingrediente solo puede tener un valor por segmento en una planilla
);

-- Tabla para almacenar información sobre los archivos de Reporte Z subidos
CREATE TABLE "reportes_z" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_path" VARCHAR(255) NOT NULL,
  "raw_text" TEXT,
  "processed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla para almacenar los datos de ventas extraídos de un Reporte Z
CREATE TABLE "reporte_z_ventas" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "reporte_z_id" UUID NOT NULL REFERENCES "reportes_z"("id") ON DELETE CASCADE,
  "codigo_producto" VARCHAR(100) NOT NULL,
  "cantidad" INTEGER NOT NULL
);

-- --- INSERCIONES DE DATOS DE EJEMPLO ---
-- Puede descomentar estas líneas para poblar la base de datos con datos de prueba.

-- INSERT INTO "locales" ("nombre", "direccion") VALUES
-- ('Obelisco', 'Av. Principal, El Obelisco');

-- INSERT INTO "turnos" ("tipo", "fecha") VALUES
-- ('DIURNO', '2026-01-10'),
-- ('NOCTURNO', '2026-01-10');

-- INSERT INTO "ingredientes" ("nombreVisible", "tipo", "unidad") VALUES
-- ('Vienesas personal', 'COCINA', 'unidades'),
-- ('Pan de completo', 'COCINA', 'unidades'),
-- ('Carne de hamburguesa', 'COCINA', 'unidades'),
-- ('Coca-Cola 500ml', 'CAJA', 'unidades');

-- Mensaje de confirmación
-- \echo "Esquema de base de datos 'cuadrusistem' creado exitosamente."
