# Imagen base de nginx con soporte Perl (como el original)
FROM nginx:1.28.0-alpine-perl

# Copiar configuración principal de NGINX
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar certificados SSL
COPY nginx/ssl/ /etc/nginx/ssl/
