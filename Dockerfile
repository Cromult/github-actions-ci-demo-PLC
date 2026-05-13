# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo dev para build)
RUN npm install
COPY . .

# STAGE 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Solo instalamos dependencias de producción para reducir peso
RUN npm install --only=production
# Copiamos solo el código necesario del stage anterior
COPY --from=builder /usr/src/app . 

EXPOSE 3000
CMD ["node", "app.js"]