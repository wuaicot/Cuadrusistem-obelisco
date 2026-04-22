# Estapa de construcción
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias necesarias para construir módulos nativos (como sharp)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-slim

WORKDIR /app

# Instalar librerías necesarias para Sharp y procesamiento de imágenes
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Solo instalar dependencias de producción
RUN npm install --omit=dev

# Copiar archivos de entrenamiento de Tesseract si los tienes localmente
COPY --from=builder /app/spa.traineddata ./
# Copiar el esquema de la base de datos
COPY --from=builder /app/schema.sql ./

EXPOSE 3000

CMD ["npm", "start"]
