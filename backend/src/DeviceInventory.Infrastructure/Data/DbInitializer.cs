using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DeviceInventory.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(InventoryDbContext context, ILogger logger)
    {
        try
        {
            await context.Database.EnsureCreatedAsync();

            if (await context.Devices.AnyAsync())
            {
                logger.LogInformation("Database already contains data. Skipping initial seeding.");
                return;
            }

            logger.LogInformation("Seeding initial inventory data...");

            var devices = new List<Device>
            {
                new()
                {
                    Brand = "Apple",
                    Model = "iPhone 15 Pro Max 256GB Titanium",
                    Imei = "359247118234503",
                    SerialNumber = "DNPZQ128MD6R",
                    Status = DeviceStatus.Disponible,
                    Location = "Almacén Central",
                    EntryDate = DateTime.UtcNow.AddDays(-30),
                    PurchasePrice = 1199.00m,
                    Notes = "Equipo nuevo sellado en caja con garantía de fábrica."
                },
                new()
                {
                    Brand = "Apple",
                    Model = "iPhone 14 128GB Midnight",
                    Imei = "353120109845619",
                    SerialNumber = "F2LXK990MD6T",
                    Status = DeviceStatus.EnUso,
                    Location = "Tienda Tacna",
                    EntryDate = DateTime.UtcNow.AddDays(-45),
                    PurchasePrice = 799.00m,
                    Notes = "Asignado para exhibición y demo comercial."
                },
                new()
                {
                    Brand = "Samsung",
                    Model = "Galaxy S24 Ultra 512GB Titanium Gray",
                    Imei = "357891234567890",
                    SerialNumber = "R58N10XYZ8K",
                    Status = DeviceStatus.Disponible,
                    Location = "Almacén Central",
                    EntryDate = DateTime.UtcNow.AddDays(-20),
                    PurchasePrice = 1299.50m,
                    Notes = "Incluye S-Pen y funda protectora original."
                },
                new()
                {
                    Brand = "Samsung",
                    Model = "Galaxy A55 5G 128GB Awesome Navy",
                    Imei = "358912345678902",
                    SerialNumber = "R52M987654A",
                    Status = DeviceStatus.EnReparacion,
                    Location = "Centro de Soporte Técnico",
                    EntryDate = DateTime.UtcNow.AddDays(-60),
                    PurchasePrice = 380.00m,
                    Notes = "Ingresó por cambio de pantalla táctil y batería."
                },
                new()
                {
                    Brand = "Xiaomi",
                    Model = "Redmi Note 13 Pro+ 5G 256GB Midnight Black",
                    Imei = "867123456789017",
                    SerialNumber = "XM2024N13P01",
                    Status = DeviceStatus.Disponible,
                    Location = "Tienda Lima Norte",
                    EntryDate = DateTime.UtcNow.AddDays(-15),
                    PurchasePrice = 349.99m,
                    Notes = "Carga rápida 120W y cámara 200MP."
                },
                new()
                {
                    Brand = "Xiaomi",
                    Model = "Xiaomi 14 Ultra 512GB Black Leica",
                    Imei = "869456789012345",
                    SerialNumber = "XM2024U1409",
                    Status = DeviceStatus.Disponible,
                    Location = "Almacén Central",
                    EntryDate = DateTime.UtcNow.AddDays(-10),
                    PurchasePrice = 1099.00m,
                    Notes = "Edición Leica con kit fotográfico profesional."
                },
                new()
                {
                    Brand = "Motorola",
                    Model = "Edge 50 Pro 512GB Luxe Lavender",
                    Imei = "356789012345672",
                    SerialNumber = "MOTOE50P991",
                    Status = DeviceStatus.EnUso,
                    Location = "Tienda Tacna",
                    EntryDate = DateTime.UtcNow.AddDays(-25),
                    PurchasePrice = 599.00m,
                    Notes = "Equipo asignado al área de supervisión técnica."
                },
                new()
                {
                    Brand = "Google",
                    Model = "Pixel 8 Pro 128GB Bay Blue",
                    Imei = "354567890123458",
                    SerialNumber = "GP8P2023X88",
                    Status = DeviceStatus.DeBaja,
                    Location = "Almacén Central",
                    EntryDate = DateTime.UtcNow.AddDays(-120),
                    PurchasePrice = 899.00m,
                    Notes = "Baja definitiva por daño irrecuperable en placa madre."
                }
            };

            await context.Devices.AddRangeAsync(devices);
            await context.SaveChangesAsync();

            // Seed initial movements
            var movements = new List<Movement>
            {
                new()
                {
                    DeviceId = devices[0].Id,
                    MovementType = MovementType.Ingreso,
                    OriginLocation = "Proveedor Importador",
                    DestinationLocation = "Almacén Central",
                    Reason = "Recepción de lote inicial de importación Q3",
                    ResponsiblePerson = "Carlos Mendoza (Jefe de Almacén)",
                    MovementDate = DateTime.UtcNow.AddDays(-30)
                },
                new()
                {
                    DeviceId = devices[1].Id,
                    MovementType = MovementType.Ingreso,
                    OriginLocation = "Proveedor Importador",
                    DestinationLocation = "Almacén Central",
                    Reason = "Ingreso al inventario general",
                    ResponsiblePerson = "Carlos Mendoza (Jefe de Almacén)",
                    MovementDate = DateTime.UtcNow.AddDays(-45)
                },
                new()
                {
                    DeviceId = devices[1].Id,
                    MovementType = MovementType.Traslado,
                    OriginLocation = "Almacén Central",
                    DestinationLocation = "Tienda Tacna",
                    Reason = "Traslado para exhibición y venta en sucursal Tacna",
                    ResponsiblePerson = "Ana Flores (Logística)",
                    MovementDate = DateTime.UtcNow.AddDays(-40)
                },
                new()
                {
                    DeviceId = devices[2].Id,
                    MovementType = MovementType.Ingreso,
                    OriginLocation = "Samsung Electronics Perú",
                    DestinationLocation = "Almacén Central",
                    Reason = "Compra directa fabricante",
                    ResponsiblePerson = "Carlos Mendoza (Jefe de Almacén)",
                    MovementDate = DateTime.UtcNow.AddDays(-20)
                },
                new()
                {
                    DeviceId = devices[3].Id,
                    MovementType = MovementType.Ingreso,
                    OriginLocation = "Proveedor Local",
                    DestinationLocation = "Tienda Tacna",
                    Reason = "Ingreso a tienda para venta directa",
                    ResponsiblePerson = "Luis Quispe (Encargado Tienda)",
                    MovementDate = DateTime.UtcNow.AddDays(-60)
                },
                new()
                {
                    DeviceId = devices[3].Id,
                    MovementType = MovementType.Traslado,
                    OriginLocation = "Tienda Tacna",
                    DestinationLocation = "Centro de Soporte Técnico",
                    Reason = "Envío a servicio técnico por garantía de pantalla",
                    ResponsiblePerson = "Luis Quispe (Encargado Tienda)",
                    MovementDate = DateTime.UtcNow.AddDays(-10)
                },
                new()
                {
                    DeviceId = devices[4].Id,
                    MovementType = MovementType.Ingreso,
                    OriginLocation = "Xiaomi Perú",
                    DestinationLocation = "Tienda Lima Norte",
                    Reason = "Reabastecimiento de stock retail",
                    ResponsiblePerson = "Mariana Ramos (Almacén Lima)",
                    MovementDate = DateTime.UtcNow.AddDays(-15)
                },
                new()
                {
                    DeviceId = devices[7].Id,
                    MovementType = MovementType.Baja,
                    OriginLocation = "Centro de Soporte Técnico",
                    DestinationLocation = "Almacén Central",
                    Reason = "Declaración de baja técnica por corto en placa base",
                    ResponsiblePerson = "Ing. Roberto Salazar (Servicio Técnico)",
                    MovementDate = DateTime.UtcNow.AddDays(-5)
                }
            };

            await context.Movements.AddRangeAsync(movements);
            await context.SaveChangesAsync();

            logger.LogInformation("Database seeded successfully with {DeviceCount} devices and {MovementCount} movements.",
                devices.Count, movements.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }
}
