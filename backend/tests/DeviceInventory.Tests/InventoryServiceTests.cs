using DeviceInventory.Api.Services;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DeviceInventory.Tests;

public class InventoryServiceTests
{
    private readonly Mock<IDeviceRepository> _deviceRepoMock;
    private readonly Mock<IMovementRepository> _movementRepoMock;
    private readonly Mock<ILogger<InventoryService>> _loggerMock;
    private readonly InventoryService _service;

    public InventoryServiceTests()
    {
        _deviceRepoMock = new Mock<IDeviceRepository>();
        _movementRepoMock = new Mock<IMovementRepository>();
        _loggerMock = new Mock<ILogger<InventoryService>>();
        _service = new InventoryService(_deviceRepoMock.Object, _movementRepoMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task CreateDeviceAsync_WithValidData_ShouldCreateDeviceAndInitialMovement()
    {
        // Arrange
        var dto = new CreateDeviceDto
        {
            Brand = "Apple",
            Model = "iPhone 15",
            Imei = "359247118234501",
            Location = "Almacén Central",
            Status = DeviceStatus.Disponible,
            PurchasePrice = 999.00m
        };

        _deviceRepoMock.Setup(r => r.ExistsImeiAsync(dto.Imei, null))
            .ReturnsAsync(false);

        _deviceRepoMock.Setup(r => r.AddAsync(It.IsAny<Device>()))
            .ReturnsAsync((Device d) =>
            {
                d.Id = 10;
                return d;
            });

        _movementRepoMock.Setup(m => m.AddAsync(It.IsAny<Movement>()))
            .ReturnsAsync((Movement m) => m);

        // Act
        var result = await _service.CreateDeviceAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(10);
        result.Brand.Should().Be("Apple");
        result.Imei.Should().Be("359247118234501");

        _deviceRepoMock.Verify(r => r.AddAsync(It.IsAny<Device>()), Times.Once);
        _movementRepoMock.Verify(m => m.AddAsync(It.Is<Movement>(mov =>
            mov.DeviceId == 10 &&
            mov.MovementType == MovementType.Ingreso &&
            mov.DestinationLocation == "Almacén Central"
        )), Times.Once);
    }

    [Fact]
    public async Task CreateDeviceAsync_WithDuplicateImei_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var dto = new CreateDeviceDto
        {
            Brand = "Samsung",
            Model = "Galaxy S24",
            Imei = "357891234567890",
            Location = "Tienda Tacna"
        };

        _deviceRepoMock.Setup(r => r.ExistsImeiAsync(dto.Imei, null))
            .ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateDeviceAsync(dto));
        _deviceRepoMock.Verify(r => r.AddAsync(It.IsAny<Device>()), Times.Never);
    }

    [Fact]
    public async Task CreateDeviceAsync_WithInvalidImeiFormat_ShouldThrowArgumentException()
    {
        // Arrange
        var dto = new CreateDeviceDto
        {
            Brand = "Samsung",
            Model = "Galaxy S24",
            Imei = "12345", // Only 5 digits
            Location = "Tienda Tacna"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.CreateDeviceAsync(dto));
    }

    [Fact]
    public async Task CreateMovementAsync_Traslado_ShouldUpdateDeviceLocation()
    {
        // Arrange
        var device = new Device
        {
            Id = 5,
            Brand = "Xiaomi",
            Model = "14 Ultra",
            Imei = "869456789012345",
            Location = "Almacén Central",
            Status = DeviceStatus.Disponible
        };

        _deviceRepoMock.Setup(r => r.GetByIdAsync(5))
            .ReturnsAsync(device);

        _deviceRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Device>()))
            .Returns(Task.CompletedTask);

        _movementRepoMock.Setup(m => m.AddAsync(It.IsAny<Movement>()))
            .ReturnsAsync((Movement m) =>
            {
                m.Id = 100;
                return m;
            });

        var movementDto = new CreateMovementDto
        {
            DeviceId = 5,
            MovementType = MovementType.Traslado,
            OriginLocation = "Almacén Central",
            DestinationLocation = "Tienda Lima Norte",
            Reason = "Reabastecimiento de tienda",
            ResponsiblePerson = "Juan Perez"
        };

        // Act
        var result = await _service.CreateMovementAsync(movementDto);

        // Assert
        result.Should().NotBeNull();
        result.DeviceId.Should().Be(5);
        result.MovementType.Should().Be(MovementType.Traslado);
        device.Location.Should().Be("Tienda Lima Norte");

        _deviceRepoMock.Verify(r => r.UpdateAsync(It.Is<Device>(d => d.Location == "Tienda Lima Norte")), Times.Once);
        _movementRepoMock.Verify(m => m.AddAsync(It.IsAny<Movement>()), Times.Once);
    }

    [Fact]
    public async Task CreateMovementAsync_Baja_ShouldUpdateDeviceStatusToDeBaja()
    {
        // Arrange
        var device = new Device
        {
            Id = 8,
            Brand = "Google",
            Model = "Pixel 8",
            Imei = "354567890123456",
            Status = DeviceStatus.Disponible
        };

        _deviceRepoMock.Setup(r => r.GetByIdAsync(8))
            .ReturnsAsync(device);

        _movementRepoMock.Setup(m => m.AddAsync(It.IsAny<Movement>()))
            .ReturnsAsync((Movement m) => m);

        var movementDto = new CreateMovementDto
        {
            DeviceId = 8,
            MovementType = MovementType.Baja,
            Reason = "Pantalla rota sin repuesto",
            ResponsiblePerson = "Técnico Soporte"
        };

        // Act
        var result = await _service.CreateMovementAsync(movementDto);

        // Assert
        result.Should().NotBeNull();
        device.Status.Should().Be(DeviceStatus.DeBaja);
        _deviceRepoMock.Verify(r => r.UpdateAsync(It.Is<Device>(d => d.Status == DeviceStatus.DeBaja)), Times.Once);
    }

    [Fact]
    public async Task GetStockReportAsync_ShouldCalculateMetricsCorrectly()
    {
        // Arrange
        var devices = new List<Device>
        {
            new() { Id = 1, Brand = "Apple", Status = DeviceStatus.Disponible, Location = "Almacén", PurchasePrice = 1000m },
            new() { Id = 2, Brand = "Apple", Status = DeviceStatus.EnUso, Location = "Tienda", PurchasePrice = 800m },
            new() { Id = 3, Brand = "Samsung", Status = DeviceStatus.EnReparacion, Location = "Soporte", PurchasePrice = 500m },
            new() { Id = 4, Brand = "Samsung", Status = DeviceStatus.DeBaja, Location = "Almacén", PurchasePrice = 300m }
        };

        _deviceRepoMock.Setup(r => r.GetAllAsync(null, null, null, null))
            .ReturnsAsync(devices);

        // Act
        var report = await _service.GetStockReportAsync();

        // Assert
        report.TotalDevices.Should().Be(4);
        report.AvailableCount.Should().Be(1);
        report.InUseCount.Should().Be(1);
        report.InRepairCount.Should().Be(1);
        report.DisposedCount.Should().Be(1);
        report.TotalInventoryValue.Should().Be(2600m);
        report.ByBrand["Apple"].Should().Be(2);
        report.ByBrand["Samsung"].Should().Be(2);
    }
}
