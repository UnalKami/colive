# ResidenceCreator-ms/Dockerfile
FROM node:23.11.1-alpine3.21

WORKDIR /app

COPY package*.json ./

# Instala tanto dependencias como devDependencies
RUN npm install --include=dev

COPY . .

EXPOSE 3001

# Solo inicia la aplicación (el seed se puede ejecutar manualmente si es necesario)
CMD npm start