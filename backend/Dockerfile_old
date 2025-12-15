# -------- Stage 1: Build using Maven + JDK 17 --------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy everything (pom.xml + src + Lombok + repos)
COPY pom.xml .
COPY src ./src

# Clean cache to avoid issues
RUN mvn -B -q dependency:go-offline

# Build with JDK17 inside Docker ONLY
RUN mvn -B clean package -DskipTests


# -------- Stage 2: Run with JRE 17 --------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
