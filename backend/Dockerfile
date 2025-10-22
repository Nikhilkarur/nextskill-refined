# Single-stage Dockerfile for NextSkill Spring Boot backend
FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

# Copy project files
COPY . .

# Build the application (skip tests for faster deploys)
RUN mvn -B -DskipTests clean package

# Expose the port used by Spring Boot
EXPOSE 8080

# Start the application
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
