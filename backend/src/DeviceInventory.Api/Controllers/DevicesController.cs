using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DeviceInventory.Api.Controllers;

[ApiController]
[Route("devices")]
[Route("api/devices")]
public class DevicesController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public DevicesController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// Listar equipos celulares con filtros opcionales de búsqueda, estado, ubicación y marca.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DeviceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<DeviceDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] DeviceStatus? status,
        [FromQuery] string? location,
        [FromQuery] string? brand)
    {
        var devices = await _inventoryService.GetDevicesAsync(search, status, location, brand);
        return Ok(devices);
    }

    /// <summary>
    /// Obtener detalle de un equipo celular por ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(DeviceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DeviceDto>> GetById(int id)
    {
        var device = await _inventoryService.GetDeviceByIdAsync(id);
        if (device == null)
        {
            return NotFound(new { message = $"Equipo celular con ID {id} no encontrado." });
        }
        return Ok(device);
    }

    /// <summary>
    /// Registrar nuevo equipo celular en el inventario.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(DeviceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DeviceDto>> Create([FromBody] CreateDeviceDto dto)
    {
        try
        {
            var created = await _inventoryService.CreateDeviceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Actualizar información de un equipo celular existente.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(DeviceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DeviceDto>> Update(int id, [FromBody] UpdateDeviceDto dto)
    {
        try
        {
            var updated = await _inventoryService.UpdateDeviceAsync(id, dto);
            if (updated == null)
            {
                return NotFound(new { message = $"Equipo celular con ID {id} no encontrado." });
            }
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Eliminar un equipo celular y su historial de movimientos.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _inventoryService.DeleteDeviceAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Equipo celular con ID {id} no encontrado." });
        }
        return NoContent();
    }
}
