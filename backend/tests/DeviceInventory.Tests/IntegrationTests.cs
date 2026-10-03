using DeviceInventory.Api.Services;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Enums;
using DeviceInventory.Infrastructure.Data;
using DeviceInventory.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DeviceInventory.Tests;

public class IntegrationTests
{
    private static InventoryDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<InventoryDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new InventoryDbContext(options);
    }

    [Fact]
    public async Task FullDeviceAndMovementLifecycle_ShouldPersistAndCalculateStockCorrectly()
    {
        // 1. Arrange In-Memory DbContext and dependencies
        using var context = CreateInMemoryDbContext();
        var deviceRepo = new DeviceRepository(context);
        var movementRepo = new MovementRepository(context);
        var loggerMock = new Mock<ILogger<InventoryService>>();
        var service = new InventoryService(deviceRepo, movementRepo, loggerMock.Object);

        // 2. Create device
        var createDto = new CreateDeviceDto
        {
            Brand = "Apple",
            Model = "iPhone 15 Pro",
            Imei = "359247118234501",
            SerialNumber = "SN123456",
            Location = "Almacén Central",
            Status = DeviceStatus.Disponible,
            PurchasePrice = 1100m,
            Notes = "Nuevo en caja"
        };

        var device = await service.CreateDeviceAsync(createDto);
        device.Should().NotBeNull();
        device.Id.Should().BeGreaterThan(0);

        // Verify initial movement was recorded automatically
        var initialMovements = (await service.GetMovementsAsync(device.Id)).ToList();
        initialMovements.Should().HaveCount(1);
        initialMovements[0].MovementType.Should().Be(MovementType.Ingreso);

        // 3. Register a "Traslado" to "Tienda Tacna"
        var trasladoDto = new CreateMovementDto
        {
            DeviceId = device.Id,
            MovementType = MovementType.Traslado,
            OriginLocation = "Almacén Central",
            DestinationLocation = "Tienda Tacna",
            Reason = "Envío a sucursal Tacna",
            ResponsiblePerson = "Carlos Logística"
        };

        var trasladoMovement = await service.CreateMovementAsync(trasladoDto);
        trasladoMovement.DestinationLocation.Should().Be("Tienda Tacna");

        // Verify device's location is now Tienda Tacna
        var updatedDevice = await service.GetDeviceByIdAsync(device.Id);
        updatedDevice!.Location.Should().Be("Tienda Tacna");

        // 4. Register a "Salida" (En Uso)
        var salidaDto = new CreateMovementDto
        {
            DeviceId = device.Id,
            MovementType = MovementType.Salida,
            Reason = "Asignado a ventas",
            ResponsiblePerson = "Gerente Comercial"
        };
        await service.CreateMovementAsync(salidaDto);

        var deviceInUse = await service.GetDeviceByIdAsync(device.Id);
        deviceInUse!.Status.Should().Be(DeviceStatus.EnUso);

        // 5. Check stock report
        var report = await service.GetStockReportAsync();
        report.TotalDevices.Should().Be(1);
        report.InUseCount.Should().Be(1);
        report.AvailableCount.Should().Be(0);
        report.ByLocation["Tienda Tacna"].Should().Be(1);
        report.ByBrand["Apple"].Should().Be(1);
        report.TotalInventoryValue.Should().Be(1100m);

        // 6. Delete device and verify cascade
        var deleted = await service.DeleteDeviceAsync(device.Id);
        deleted.Should().BeTrue();

        var searchAfterDelete = await service.GetDeviceByIdAsync(device.Id);
        searchAfterDelete.Should().BeNull();

        var movementsAfterDelete = (await service.GetMovementsAsync(device.Id)).ToList();
        movementsAfterDelete.Should().BeEmpty();
    }
}
