# Backend - Spring Boot
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Cache deps
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x ./mvnw || true
RUN ./mvnw -q -DskipTests dependency:go-offline || true

# Build
COPY src ./src
RUN ./mvnw -q -DskipTests package || mvn -q -DskipTests package



FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar
COPY --from=build /app/target/*.jar app.jar

# Ensure uploads folder exists
RUN mkdir -p /app/uploads

ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
