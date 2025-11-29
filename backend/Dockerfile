# -------- Stage 1: build with Maven --------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom and sources
COPY pom.xml .
COPY src ./src

# Build the app (skip tests if you want faster builds)
RUN mvn -B clean package -DskipTests


# -------- Stage 2: run with JRE only --------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Run the app
CMD ["java", "-jar", "app.jar"]
