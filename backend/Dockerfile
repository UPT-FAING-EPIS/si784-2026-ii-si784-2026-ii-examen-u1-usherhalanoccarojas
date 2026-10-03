# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files for efficient layer caching
COPY DeviceInventory.sln ./
COPY src/DeviceInventory.Core/DeviceInventory.Core.csproj src/DeviceInventory.Core/
COPY src/DeviceInventory.Infrastructure/DeviceInventory.Infrastructure.csproj src/DeviceInventory.Infrastructure/
COPY src/DeviceInventory.Api/DeviceInventory.Api.csproj src/DeviceInventory.Api/
COPY tests/DeviceInventory.Tests/DeviceInventory.Tests.csproj tests/DeviceInventory.Tests/

# Restore dependencies
RUN dotnet restore DeviceInventory.sln

# Copy all source files
COPY src/ src/
COPY tests/ tests/

# Run tests in build stage to ensure quality
RUN dotnet test DeviceInventory.sln -c Release --no-restore

# Publish the API
WORKDIR /src/src/DeviceInventory.Api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=build /app/publish .

# Set permissions
RUN chown -R appuser:appgroup /app
USER appuser

ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "DeviceInventory.Api.dll"]
