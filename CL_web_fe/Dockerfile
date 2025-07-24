# Imagen base
FROM python:3.11-slim

# Crear y usar directorio en el contenedor
WORKDIR /app

# Copiar dependencias e instalarlas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente de la app
COPY . .

# Copiar la clave JWT pública (antes montada como volumen)
COPY JWT_public.key.pub /run/secrets/JWT_public.key.pub

# Exponer el puerto para Flask/Gunicorn
EXPOSE 5000

# Comando para correr la app con Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
