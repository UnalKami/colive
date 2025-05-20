# Imagen base con Maven y Java
FROM maven:3.9.9-eclipse-temurin-24-noble AS build

# Copiar todo el proyecto al contenedor
WORKDIR /app
COPY . .

# Compilar el proyecto y generar el .jar
RUN mvn clean package -DskipTests

# Imagen final con solo Java para ejecutar
FROM eclipse-temurin:24.0.1_9-jre-ubi9-minimal
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]