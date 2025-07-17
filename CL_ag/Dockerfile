FROM python:3.11-slim

# Crear y usar el directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente
COPY ./app ./app

# Copiar la clave JWT pública (antes montada)
COPY JWT_public.key.pub /run/secrets/JWT_public.key.pub

# Exponer el puerto (opcional)
EXPOSE 8000

# Comando para iniciar el servidor Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
