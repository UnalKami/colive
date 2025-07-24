# Etapa 1: Compilar con Maven
FROM maven:3.9.9-eclipse-temurin-24-noble AS build

WORKDIR /app
COPY . .

RUN mvn clean package -DskipTests

# Etapa 2: Imagen final con JRE y llaves incluidas
FROM eclipse-temurin:24.0.1_9-jre-ubi9-minimal

WORKDIR /app

# Copiar el JAR compilado desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Copiar las llaves JWT al contenedor (deben estar en el mismo contexto que el Dockerfile)
COPY JWT_private.key /run/secrets/JWT_private.key
COPY JWT_public.key.pub /run/secrets/JWT_public.key.pub

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]