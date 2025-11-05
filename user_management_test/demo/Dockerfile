# Use OpenJDK 25 as base image
FROM eclipse-temurin:21-jdk

# Set working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/application-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "/app/app.jar"]