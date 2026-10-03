using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DeviceInventory.Api.Controllers;

[ApiController]
[Route("reports")]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public ReportsController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// Generar reporte de stock actual consolidado por estado, marca y ubicación.
    /// </summary>
    [HttpGet("stock")]
    [ProducesResponseType(typeof(StockReportDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<StockReportDto>> GetStockReport()
    {
        var report = await _inventoryService.GetStockReportAsync();
        return Ok(report);
    }

    /// <summary>
    /// Obtener resumen global de inventario, métricas clave y últimos movimientos.
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(InventorySummaryDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<InventorySummaryDto>> GetSummary()
    {
        var summary = await _inventoryService.GetSummaryAsync();
        return Ok(summary);
    }
}
