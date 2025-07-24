FROM python:3.11-slim

# Crear y usar el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema (para PostgreSQL/MySQL)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    default-libmysqlclient-dev \
    pkg-config \
    python3-dev \
 && rm -rf /var/lib/apt/lists/*

# Copiar archivos del proyecto (código y entorno)
COPY . /app
COPY .env .env

# Instalar dependencias de Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Exponer el puerto por defecto de Django
EXPOSE 8000

# Comando de inicio: migrar y correr servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
