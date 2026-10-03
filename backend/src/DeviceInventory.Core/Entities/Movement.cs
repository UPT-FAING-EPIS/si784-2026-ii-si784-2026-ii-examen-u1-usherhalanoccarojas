using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.Entities;

public class Movement
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public Device? Device { get; set; }
    public MovementType MovementType { get; set; }
    public string? OriginLocation { get; set; }
    public string? DestinationLocation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string ResponsiblePerson { get; set; } = string.Empty;
    public DateTime MovementDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
