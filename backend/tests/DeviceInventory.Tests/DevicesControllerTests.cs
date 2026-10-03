using DeviceInventory.Api.Controllers;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DeviceInventory.Tests;

public class DevicesControllerTests
{
    private readonly Mock<IInventoryService> _inventoryServiceMock;
    private readonly DevicesController _controller;

    public DevicesControllerTests()
    {
        _inventoryServiceMock = new Mock<IInventoryService>();
        _controller = new DevicesController(_inventoryServiceMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOkWithDevicesList()
    {
        // Arrange
        var list = new List<DeviceDto>
        {
            new() { Id = 1, Brand = "Apple", Model = "iPhone 15", Imei = "359247118234501", Status = DeviceStatus.Disponible },
            new() { Id = 2, Brand = "Samsung", Model = "Galaxy S24", Imei = "357891234567890", Status = DeviceStatus.EnUso }
        };

        _inventoryServiceMock.Setup(s => s.GetDevicesAsync(null, null, null, null))
            .ReturnsAsync(list);

        // Act
        var result = await _controller.GetAll(null, null, null, null);

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);

        var data = okResult.Value as IEnumerable<DeviceDto>;
        data.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetById_WhenDeviceExists_ShouldReturnOkWithDevice()
    {
        // Arrange
        var device = new DeviceDto { Id = 1, Brand = "Apple", Model = "iPhone 15" };
        _inventoryServiceMock.Setup(s => s.GetDeviceByIdAsync(1))
            .ReturnsAsync(device);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);
        var data = okResult.Value as DeviceDto;
        data!.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetById_WhenDeviceNotFound_ShouldReturnNotFound()
    {
        // Arrange
        _inventoryServiceMock.Setup(s => s.GetDeviceByIdAsync(99))
            .ReturnsAsync((DeviceDto?)null);

        // Act
        var result = await _controller.GetById(99);

        // Assert
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Should().NotBeNull();
        notFoundResult!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task Create_WhenSuccessful_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var dto = new CreateDeviceDto { Brand = "Apple", Model = "iPhone 15", Imei = "359247118234501" };
        var created = new DeviceDto { Id = 4, Brand = "Apple", Model = "iPhone 15", Imei = "359247118234501" };

        _inventoryServiceMock.Setup(s => s.CreateDeviceAsync(dto))
            .ReturnsAsync(created);

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var createdResult = result.Result as CreatedAtActionResult;
        createdResult.Should().NotBeNull();
        createdResult!.StatusCode.Should().Be(201);
        createdResult.RouteValues!["id"].Should().Be(4);
    }

    [Fact]
    public async Task Create_WhenConflict_ShouldReturnConflictStatus()
    {
        // Arrange
        var dto = new CreateDeviceDto { Brand = "Apple", Model = "iPhone 15", Imei = "359247118234501" };
        _inventoryServiceMock.Setup(s => s.CreateDeviceAsync(dto))
            .ThrowsAsync(new InvalidOperationException("El IMEI ya se encuentra registrado."));

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var conflictResult = result.Result as ConflictObjectResult;
        conflictResult.Should().NotBeNull();
        conflictResult!.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task Delete_WhenDeviceFound_ShouldReturnNoContent()
    {
        // Arrange
        _inventoryServiceMock.Setup(s => s.DeleteDeviceAsync(1))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        var noContent = result as NoContentResult;
        noContent.Should().NotBeNull();
        noContent!.StatusCode.Should().Be(204);
    }

    [Fact]
    public async Task Delete_WhenNotFound_ShouldReturnNotFound()
    {
        // Arrange
        _inventoryServiceMock.Setup(s => s.DeleteDeviceAsync(99))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(99);

        // Assert
        var notFound = result as NotFoundObjectResult;
        notFound.Should().NotBeNull();
        notFound!.StatusCode.Should().Be(404);
    }
}
