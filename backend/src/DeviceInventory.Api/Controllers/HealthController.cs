using Microsoft.AspNetCore.Mvc;

namespace DeviceInventory.Api.Controllers;

[ApiController]
[Route("health")]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Check()
    {
        return Ok(new
        {
            status = "Healthy",
            service = "Device Inventory API",
            timestamp = DateTime.UtcNow,
            version = "1.0.0"
        });
    }
}
