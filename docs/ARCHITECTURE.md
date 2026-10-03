# Documento de Arquitectura y Diseño Técnico

Este documento consolida la arquitectura del sistema, el diccionario de datos y los diagramas estructurales y de despliegue generados en formato **Mermaid**.

---

## 1. Diagrama Entidad-Relación (ER)
Representa el modelo relacional implementado en la base de datos PostgreSQL / SQLite.

```mermaid
erDiagram
    DEVICES ||--o{ MOVEMENTS : "tiene historial"

    DEVICES {
        int Id PK "Auto-increment"
        string Brand "NOT NULL (100)"
        string Model "NOT NULL (100)"
        string Imei UK "UNIQUE (15)"
        string SerialNumber "NULL (100)"
        int Status "Enum: Disponible, EnUso, EnReparacion, DeBaja"
        string Location "NOT NULL (150)"
        datetime EntryDate "NOT NULL"
        string Notes "NULL (500)"
        decimal PurchasePrice "NULL (18,2)"
        datetime CreatedAt "NOT NULL"
        datetime UpdatedAt "NULL"
    }

    MOVEMENTS {
        int Id PK "Auto-increment"
        int DeviceId FK "References DEVICES(Id)"
        int MovementType "Enum: Ingreso, Salida, Traslado, Baja"
        string OriginLocation "NULL (150)"
        string DestinationLocation "NULL (150)"
        string Reason "NOT NULL (300)"
        string ResponsiblePerson "NOT NULL (150)"
        datetime MovementDate "NOT NULL"
        datetime CreatedAt "NOT NULL"
    }
```

---

## 2. Diagrama de Clases
Muestra el diseño orientado a objetos en .NET Core siguiendo principios SOLID y arquitectura en capas.

```mermaid
classDiagram
    class Device {
        +int Id
        +string Brand
        +string Model
        +string Imei
        +string SerialNumber
        +DeviceStatus Status
        +string Location
        +DateTime EntryDate
        +string Notes
        +decimal PurchasePrice
        +DateTime CreatedAt
        +DateTime UpdatedAt
        +ICollection~Movement~ Movements
    }

    class Movement {
        +int Id
        +int DeviceId
        +Device Device
        +MovementType MovementType
        +string OriginLocation
        +string DestinationLocation
        +string Reason
        +string ResponsiblePerson
        +DateTime MovementDate
        +DateTime CreatedAt
    }

    class DeviceStatus {
        <<enumeration>>
        Disponible = 1
        EnUso = 2
        EnReparacion = 3
        DeBaja = 4
    }

    class MovementType {
        <<enumeration>>
        Ingreso = 1
        Salida = 2
        Traslado = 3
        Baja = 4
    }

    class IDeviceRepository {
        <<interface>>
        +GetAllAsync()
        +GetByIdAsync()
        +GetByImeiAsync()
        +AddAsync()
        +UpdateAsync()
        +DeleteAsync()
        +ExistsImeiAsync()
        +CountAsync()
    }

    class IMovementRepository {
        <<interface>>
        +GetAllAsync()
        +GetByIdAsync()
        +AddAsync()
        +GetRecentAsync()
        +CountAsync()
    }

    class IInventoryService {
        <<interface>>
        +GetDevicesAsync()
        +GetDeviceByIdAsync()
        +CreateDeviceAsync()
        +UpdateDeviceAsync()
        +DeleteDeviceAsync()
        +GetMovementsAsync()
        +CreateMovementAsync()
        +GetStockReportAsync()
        +GetSummaryAsync()
    }

    class InventoryService {
        -IDeviceRepository _deviceRepository
        -IMovementRepository _movementRepository
        -ILogger _logger
    }

    class DevicesController {
        -IInventoryService _inventoryService
    }

    class MovementsController {
        -IInventoryService _inventoryService
    }

    class ReportsController {
        -IInventoryService _inventoryService
    }

    Device "1" *-- "many" Movement : contains
    Device --> DeviceStatus : has
    Movement --> MovementType : has
    InventoryService ..|> IInventoryService : implements
    InventoryService --> IDeviceRepository : uses
    InventoryService --> IMovementRepository : uses
    DevicesController --> IInventoryService : uses
    MovementsController --> IInventoryService : uses
    ReportsController --> IInventoryService : uses
```

---

## 3. Diagrama de Componentes
Ilustra la separación de responsabilidades entre el frontend, controladores API, servicios de dominio, acceso a datos y almacenamiento.

```mermaid
graph TD
    subgraph Client ["Frontend (Cliente Web SPA)"]
        UI["Interfaz de Usuario (React + Vite + TypeScript)"]
        Components["Componentes (Dashboard, Devices, Movements, Reports, Panels)"]
        APIClient["API Service / Offline Fallback"]
        UI --> Components
        Components --> APIClient
    end

    subgraph BackendGateway ["Capa de Exposición (ASP.NET Core Web API)"]
        Controllers["Controladores RESTful"]
        Swagger["OpenAPI / Swagger UI"]
        Middleware["Exception Handling & CORS Middleware"]
        Controllers --> Middleware
    end

    subgraph CoreDomain ["Capa de Lógica de Negocio"]
        InventoryService["Servicio de Inventario (IInventoryService)"]
        ImeiValidator["Validador Luhn IMEI"]
        DTOs["Modelos DTO y Mapeos"]
        InventoryService --> ImeiValidator
        InventoryService --> DTOs
    end

    subgraph InfrastructureLayer ["Capa de Acceso a Datos (Infraestructura)"]
        DeviceRepo["DeviceRepository (IDeviceRepository)"]
        MovementRepo["MovementRepository (IMovementRepository)"]
        DbContext["InventoryDbContext (Entity Framework Core)"]
        DeviceRepo --> DbContext
        MovementRepo --> DbContext
    end

    subgraph DataStorage ["Persistencia Relacional"]
        DB[("PostgreSQL / SQLite")]
        DbContext --> DB
    end

    APIClient -- "HTTP/JSON REST (/devices, /movements, /reports)" --> Controllers
    Controllers --> InventoryService
    InventoryService --> DeviceRepo
    InventoryService --> MovementRepo
```

---

## 4. Diagrama de Despliegue
Detalla la infraestructura de ejecución contenerizada y aprovisionamiento en la nube mediante Terraform.

```mermaid
graph TD
    subgraph Users ["Usuarios y Operadores"]
        Browser["Navegador Web / Dispositivo Móvil"]
    end

    subgraph CDN_Edge ["Capa de Distribución y Frontend"]
        CloudFront["CDN / S3 Static Web Hosting (Nginx)"]
        Browser -- "HTTPS (Puerto 443 / 80)" --> CloudFront
    end

    subgraph CloudVPC ["VPC en la Nube (AWS / Azure)"]
        subgraph PublicSubnet ["Subred Pública"]
            ALB["Application Load Balancer / App Runner Gateway"]
            CloudFront -- "API Requests (/devices, /movements)" --> ALB
        end

        subgraph PrivateSubnetApp ["Subred Privada - Aplicación"]
            BackendContainer["Contenedor Docker: ASP.NET Core 8 API\n(Puerto 8080)"]
            ALB --> BackendContainer
        end

        subgraph PrivateSubnetDB ["Subred Privada - Base de Datos"]
            RDS["Amazon RDS PostgreSQL 16\n(Puerto 5432)"]
            BackendContainer -- "Conexión TCP / EF Core" --> RDS
        end
    end

    subgraph DevOps ["Automatizaciones CI/CD (GitHub Actions)"]
        GH_Actions["GitHub Actions Workflows"]
        GH_Actions -- "Terraform" --> CloudVPC
        GH_Actions -- "Docker Push" --> BackendContainer
        GH_Actions -- "Static Deploy" --> CloudFront
    end
```
