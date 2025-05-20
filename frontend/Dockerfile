FROM node:23.11.1-alpine3.21 AS build
WORKDIR /app
COPY react-app/package*.json ./
RUN npm install
COPY react-app/ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
