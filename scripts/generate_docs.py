"""
Automation script to generate project documentation:
- Database Data Dictionary
- Entity-Relationship Diagram (Mermaid)
- Class Diagram (Mermaid)
- Components Diagram (Mermaid)
- Deployment Diagram (Mermaid)
- Architecture Summary (Markdown)
"""

import os

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
os.makedirs(DOCS_DIR, exist_ok=True)

# 1. Data Dictionary
DATA_DICTIONARY_CONTENT = """# Diccionario de Datos - Base de Datos de Inventario de Equipos Celulares

## Visión General
La base de datos relacional para el sistema de inventario de equipos celulares está diseñada bajo **Entity Framework Core 8.0**, compatible con **PostgreSQL** y **SQLite**. El modelo garantiza integridad referencial, unicidad de IMEI y trazabilidad de todos los movimientos de inventario.

---

## 1. Tabla: `Devices` (Equipos Celulares)
Almacena el catálogo y estado actual de cada equipo celular registrado en el inventario.

| Campo | Tipo de Dato | Nulo | Clave / Restricción | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `Id` | `INTEGER` / `SERIAL` | NO | **PK** (Auto-incremental) | Identificador único del equipo celular. |
| `Brand` | `VARCHAR(100)` | NO | NOT NULL | Fabricante / Marca (Apple, Samsung, Xiaomi, Motorola, etc.). |
| `Model` | `VARCHAR(100)` | NO | NOT NULL | Nombre comercial y especificación del modelo. |
| `Imei` | `VARCHAR(15)` | NO | **UNIQUE INDEX**, NOT NULL | Código IMEI de 15 dígitos con validación Luhn. |
| `SerialNumber` | `VARCHAR(100)` | SÍ | Opcional | Número de serie de fábrica provisto por el fabricante. |
| `Status` | `INTEGER` | NO | Enum: 1=Disponible, 2=EnUso, 3=EnReparacion, 4=DeBaja | Estado operativo del dispositivo. |
| `Location` | `VARCHAR(150)` | NO | NOT NULL | Ubicación física actual (Almacén Central, Tienda Tacna, etc.). |
| `EntryDate` | `TIMESTAMP` | NO | NOT NULL | Fecha y hora en la que ingresó el equipo al inventario. |
| `Notes` | `VARCHAR(500)` | SÍ | NULL | Observaciones, condiciones físicas o accesorios incluidos. |
| `PurchasePrice`| `DECIMAL(18,2)` | SÍ | NULL | Costo o valor de compra registrado en dólares americanos. |
| `CreatedAt` | `TIMESTAMP` | NO | DEFAULT UTC_NOW | Fecha de creación del registro en el sistema. |
| `UpdatedAt` | `TIMESTAMP` | SÍ | NULL | Fecha de la última modificación del registro. |

---

## 2. Tabla: `Movements` (Movimientos de Inventario)
Registra de forma inmutable cada evento o traslado sufrido por un equipo celular.

| Campo | Tipo de Dato | Nulo | Clave / Restricción | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `Id` | `INTEGER` / `SERIAL` | NO | **PK** (Auto-incremental) | Identificador único del movimiento. |
| `DeviceId` | `INTEGER` | NO | **FK** -> `Devices(Id)` ON DELETE CASCADE | Dispositivo celular asociado al movimiento. |
| `MovementType` | `INTEGER` | NO | Enum: 1=Ingreso, 2=Salida, 3=Traslado, 4=Baja | Tipo de transacción efectuada en el inventario. |
| `OriginLocation` | `VARCHAR(150)` | SÍ | NULL | Ubicación física desde donde sale el equipo. |
| `DestinationLocation` | `VARCHAR(150)` | SÍ | NULL | Ubicación física receptora (obligatorio en Traslados). |
| `Reason` | `VARCHAR(300)` | NO | NOT NULL | Justificación o motivo del movimiento. |
| `ResponsiblePerson` | `VARCHAR(150)` | NO | NOT NULL | Nombre o usuario del operador que efectúa el movimiento. |
| `MovementDate` | `TIMESTAMP` | NO | NOT NULL | Fecha y hora en la que se ejecutó físicamente el movimiento. |
| `CreatedAt` | `TIMESTAMP` | NO | DEFAULT UTC_NOW | Fecha de auditoría del registro en la base de datos. |

---

## 3. Relaciones e Integridad Referencial
- **`Devices` 1 : N `Movements`**: Un equipo celular puede tener cero o múltiples movimientos registrados a lo largo de su ciclo de vida.
- **Acción de borrado**: Cascada (`ON DELETE CASCADE`), garantizando que al eliminar un equipo se elimine su historial sin dejar registros huérfanos.
- **Índices**:
  - `IX_Devices_Imei` (UNIQUE): Asegura que ningún IMEI se registre más de una vez.
  - `IX_Movements_DeviceId`: Optimiza las consultas de historial por equipo (`GET /movements?deviceId={id}`).
"""

# 2. ER Diagram
ER_DIAGRAM_CONTENT = """erDiagram
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
"""

# 3. Class Diagram
CLASS_DIAGRAM_CONTENT = """classDiagram
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
"""

# 4. Components Diagram
COMPONENTS_DIAGRAM_CONTENT = """graph TD
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
"""

# 5. Deployment Diagram
DEPLOYMENT_DIAGRAM_CONTENT = """graph TD
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
            BackendContainer["Contenedor Docker: ASP.NET Core 8 API\\n(Puerto 8080)"]
            ALB --> BackendContainer
        end

        subgraph PrivateSubnetDB ["Subred Privada - Base de Datos"]
            RDS["Amazon RDS PostgreSQL 16\\n(Puerto 5432)"]
            BackendContainer -- "Conexión TCP / EF Core" --> RDS
        end
    end

    subgraph DevOps ["Automatizaciones CI/CD (GitHub Actions)"]
        GH_Actions["GitHub Actions Workflows"]
        GH_Actions -- "Terraform" --> CloudVPC
        GH_Actions -- "Docker Push" --> BackendContainer
        GH_Actions -- "Static Deploy" --> CloudFront
    end
"""

def main():
    files = {
        "data-dictionary.md": DATA_DICTIONARY_CONTENT.strip(),
        "ER-diagram.mermaid": ER_DIAGRAM_CONTENT.strip(),
        "class-diagram.mermaid": CLASS_DIAGRAM_CONTENT.strip(),
        "components-diagram.mermaid": COMPONENTS_DIAGRAM_CONTENT.strip(),
        "deployment-diagram.mermaid": DEPLOYMENT_DIAGRAM_CONTENT.strip()
    }

    for filename, content in files.items():
        filepath = os.path.join(DOCS_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content + "\n")
        print(f"[OK] Generated: {filepath}")

    # Generate consolidated ARCHITECTURE.md
    arch_file = os.path.join(DOCS_DIR, "ARCHITECTURE.md")
    arch_content = f"""# Documento de Arquitectura y Diseño Técnico

Este documento consolida la arquitectura del sistema, el diccionario de datos y los diagramas estructurales y de despliegue generados en formato **Mermaid**.

---

## 1. Diagrama Entidad-Relación (ER)
Representa el modelo relacional implementado en la base de datos PostgreSQL / SQLite.

```mermaid
{ER_DIAGRAM_CONTENT.strip()}
```

---

## 2. Diagrama de Clases
Muestra el diseño orientado a objetos en .NET Core siguiendo principios SOLID y arquitectura en capas.

```mermaid
{CLASS_DIAGRAM_CONTENT.strip()}
```

---

## 3. Diagrama de Componentes
Ilustra la separación de responsabilidades entre el frontend, controladores API, servicios de dominio, acceso a datos y almacenamiento.

```mermaid
{COMPONENTS_DIAGRAM_CONTENT.strip()}
```

---

## 4. Diagrama de Despliegue
Detalla la infraestructura de ejecución contenerizada y aprovisionamiento en la nube mediante Terraform.

```mermaid
{DEPLOYMENT_DIAGRAM_CONTENT.strip()}
```
"""
    with open(arch_file, "w", encoding="utf-8") as f:
        f.write(arch_content.strip() + "\n")
    print(f"[OK] Generated: {arch_file}")

if __name__ == "__main__":
    main()
