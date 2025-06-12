# Imagen base
FROM python:3.11-slim

# Crear y usar directorio en el contenedor
WORKDIR /app

# Copiar dependencias y código
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exponer el puerto para Flask/Gunicorn
EXPOSE 5000

# Comando para correr la app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]