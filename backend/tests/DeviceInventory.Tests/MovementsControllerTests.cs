using DeviceInventory.Api.Controllers;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DeviceInventory.Tests;

public class MovementsControllerTests
{
    private readonly Mock<IInventoryService> _inventoryServiceMock;
    private readonly MovementsController _controller;

    public MovementsControllerTests()
    {
        _inventoryServiceMock = new Mock<IInventoryService>();
        _controller = new MovementsController(_inventoryServiceMock.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnMovementsList()
    {
        // Arrange
        var movements = new List<MovementDto>
        {
            new() { Id = 1, DeviceId = 1, MovementType = MovementType.Ingreso, Reason = "Compra" },
            new() { Id = 2, DeviceId = 1, MovementType = MovementType.Traslado, Reason = "Distribución" }
        };

        _inventoryServiceMock.Setup(s => s.GetMovementsAsync(1))
            .ReturnsAsync(movements);

        // Act
        var result = await _controller.GetAll(1);

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        var data = okResult!.Value as IEnumerable<MovementDto>;
        data.Should().HaveCount(2);
    }

    [Fact]
    public async Task Create_WhenDeviceNotFound_ShouldReturnNotFound()
    {
        // Arrange
        var dto = new CreateMovementDto
        {
            DeviceId = 99,
            MovementType = MovementType.Traslado,
            Reason = "Test",
            ResponsiblePerson = "Admin"
        };

        _inventoryServiceMock.Setup(s => s.CreateMovementAsync(dto))
            .ThrowsAsync(new KeyNotFoundException("No se encontró el equipo."));

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var notFound = result.Result as NotFoundObjectResult;
        notFound.Should().NotBeNull();
        notFound!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task Create_WhenSuccessful_ShouldReturnCreatedAtAction()
    {
        // Arrange
        var dto = new CreateMovementDto
        {
            DeviceId = 1,
            MovementType = MovementType.Traslado,
            DestinationLocation = "Tienda Tacna",
            Reason = "Traslado",
            ResponsiblePerson = "Operador"
        };

        var created = new MovementDto
        {
            Id = 10,
            DeviceId = 1,
            MovementType = MovementType.Traslado,
            DestinationLocation = "Tienda Tacna"
        };

        _inventoryServiceMock.Setup(s => s.CreateMovementAsync(dto))
            .ReturnsAsync(created);

        // Act
        var result = await _controller.Create(dto);

        // Assert
        var createdResult = result.Result as CreatedAtActionResult;
        createdResult.Should().NotBeNull();
        createdResult!.StatusCode.Should().Be(201);
        createdResult.RouteValues!["id"].Should().Be(10);
    }
}
