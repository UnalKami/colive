FROM node:23.11.1-alpine3.21 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY ./react-app .

RUN npm run build

FROM nginx:1.28.0-alpine-perl
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]