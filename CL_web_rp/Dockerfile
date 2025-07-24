# Imagen base de nginx
FROM nginx:1.28.0-alpine-perl

# Copiar configuración de nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar certificados SSL
COPY nginx/ssl/ /etc/nginx/ssl/
