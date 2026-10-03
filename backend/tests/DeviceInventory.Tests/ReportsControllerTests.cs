using DeviceInventory.Api.Controllers;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DeviceInventory.Tests;

public class ReportsControllerTests
{
    private readonly Mock<IInventoryService> _inventoryServiceMock;
    private readonly ReportsController _controller;

    public ReportsControllerTests()
    {
        _inventoryServiceMock = new Mock<IInventoryService>();
        _controller = new ReportsController(_inventoryServiceMock.Object);
    }

    [Fact]
    public async Task GetStockReport_ShouldReturnOkWithStockReport()
    {
        // Arrange
        var report = new StockReportDto
        {
            TotalDevices = 10,
            AvailableCount = 6,
            InUseCount = 2,
            InRepairCount = 1,
            DisposedCount = 1,
            TotalInventoryValue = 5400m
        };

        _inventoryServiceMock.Setup(s => s.GetStockReportAsync())
            .ReturnsAsync(report);

        // Act
        var result = await _controller.GetStockReport();

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);

        var data = okResult.Value as StockReportDto;
        data.Should().NotBeNull();
        data!.TotalDevices.Should().Be(10);
        data.AvailableCount.Should().Be(6);
    }

    [Fact]
    public async Task GetSummary_ShouldReturnOkWithInventorySummary()
    {
        // Arrange
        var summary = new InventorySummaryDto
        {
            TotalDevices = 15,
            TotalMovements = 25,
            AvailableDevices = 10
        };

        _inventoryServiceMock.Setup(s => s.GetSummaryAsync())
            .ReturnsAsync(summary);

        // Act
        var result = await _controller.GetSummary();

        // Assert
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
        okResult!.StatusCode.Should().Be(200);

        var data = okResult.Value as InventorySummaryDto;
        data.Should().NotBeNull();
        data!.TotalDevices.Should().Be(15);
        data.TotalMovements.Should().Be(25);
    }
}
