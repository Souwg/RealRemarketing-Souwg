# Usa Python 3.10 en una imagen ligera
FROM python:3.10-slim AS backend

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración (Pipfile y Pipfile.lock) primero para optimizar cache de Docker
COPY Pipfile Pipfile.lock /app/

# Instala dependencias del sistema necesarias
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client curl \
    && rm -rf /var/lib/apt/lists/*

# Instala Pipenv
RUN pip install --no-cache-dir pipenv && pipenv install --deploy --ignore-pipfile

# Copia el código del backend dentro del contenedor
COPY src /app/



# Exponer puerto del backend
EXPOSE 3001

# Comando de inicio del backend
CMD ["pipenv", "run", "start"]
