# ==============================================================================
# ETAPA 1: BUILD (Compilación de la aplicación con Maven)
# ==============================================================================
# Se utiliza una imagen ligera basada en Alpine con Java 21 y Maven 3.9 preinstalado.
FROM maven:3.9-eclipse-temurin-21-alpine AS build

# Establece el directorio de trabajo dentro del contenedor de compilación
WORKDIR /app

# Paso 1: Copia únicamente el archivo pom.xml para aprovechar la caché de capas de Docker.
# Si el pom.xml no cambia, Docker no volverá a descargar las dependencias de Maven.
COPY pom.xml .

# Paso 2: Descarga todas las dependencias declaradas en el pom.xml en la caché local.
# La bandera -B habilita el modo batch (no interactivo, más rápido en CI/CD).
RUN mvn dependency:go-offline -B

# Paso 3: Copia todo el código fuente de la aplicación (/src).
COPY src ./src

# Paso 4: Compila el código Java y genera el artefacto ejecutable (.jar) en /target.
# Se omiten los tests unitarios (-DskipTests) para acelerar la construcción de la imagen.
RUN mvn package -DskipTests

# ==============================================================================
# ETAPA 2: RUNTIME (Imagen final ultraligera de producción)
# ==============================================================================
# Se utiliza únicamente el Java Runtime Environment (JRE 21) sobre Alpine,
# excluyendo Maven y herramientas de compilación para reducir drásticamente el tamaño y los riesgos de seguridad.
FROM eclipse-temurin:21-jre-alpine

# Establece el directorio de trabajo final de ejecución
WORKDIR /app

# Paso 5: Copia únicamente el archivo .jar generado en la Etapa 1 (build) hacia la imagen final.
COPY --from=build /app/target/*.jar app.jar

# Paso 6: Expone el puerto por defecto en el que escucha el servidor Spring Boot (Tomcat integrado)
EXPOSE 8080

# Paso 7: Define el comando principal de entrada para iniciar la aplicación Java
ENTRYPOINT ["java", "-jar", "app.jar"]