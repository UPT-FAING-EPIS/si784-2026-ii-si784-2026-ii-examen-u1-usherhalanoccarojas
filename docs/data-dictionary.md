# Diccionario de Datos - Base de Datos de Inventario de Equipos Celulares

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
