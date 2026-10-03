using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DeviceInventory.Api.Controllers;

[ApiController]
[Route("movements")]
[Route("api/movements")]
public class MovementsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public MovementsController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    /// <summary>
    /// Ver historial de movimientos. Si se especifica deviceId, filtra los movimientos de dicho equipo celular.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MovementDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MovementDto>>> GetAll([FromQuery] int? deviceId)
    {
        var movements = await _inventoryService.GetMovementsAsync(deviceId);
        return Ok(movements);
    }

    /// <summary>
    /// Obtener detalle de un movimiento por su ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MovementDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MovementDto>> GetById(int id)
    {
        var movement = await _inventoryService.GetMovementByIdAsync(id);
        if (movement == null)
        {
            return NotFound(new { message = $"Movimiento con ID {id} no encontrado." });
        }
        return Ok(movement);
    }

    /// <summary>
    /// Registrar un nuevo movimiento de inventario (Ingreso, Salida, Traslado o Baja).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(MovementDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MovementDto>> Create([FromBody] CreateMovementDto dto)
    {
        try
        {
            var created = await _inventoryService.CreateMovementAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
