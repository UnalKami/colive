# ResidenceCreator-ms/Dockerfile
FROM node:23.11.1-alpine3.21

WORKDIR /app

COPY package*.json ./

# Instala tanto dependencias como devDependencies
RUN npm install --include=dev

COPY . .

EXPOSE 3001

# Ejecuta el script de seed (para generar conjuntos y residencias de prueba) y luego inicia la aplicación
CMD npm run seed && npm start