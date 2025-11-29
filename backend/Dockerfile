FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy Maven config & source
COPY pom.xml .
COPY src ./src

# Build the application
RUN ./mvnw clean package || mvn clean package

# Run the JAR
CMD ["java", "-jar", "target/*.jar"]
