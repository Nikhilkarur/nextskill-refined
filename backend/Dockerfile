# Multi-stage Dockerfile for NextSkill Spring Boot backend

# ===== Build stage =====
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only pom first to leverage Docker layer caching
COPY pom.xml ./
# Copy source
COPY src ./src

# Build the application (skip tests for faster deploys)
RUN mvn -B -DskipTests clean package

# ===== Runtime stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the fat jar from build stage
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port used by Spring Boot
EXPOSE 8080

# Allow passing JVM options via JAVA_OPTS
ENV JAVA_OPTS=""

# Start the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
