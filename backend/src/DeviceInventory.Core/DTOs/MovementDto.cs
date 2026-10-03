using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.DTOs;

public class MovementDto
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceBrand { get; set; } = string.Empty;
    public string DeviceModel { get; set; } = string.Empty;
    public string DeviceImei { get; set; } = string.Empty;
    public MovementType MovementType { get; set; }
    public string MovementTypeName => MovementType.ToString();
    public string? OriginLocation { get; set; }
    public string? DestinationLocation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string ResponsiblePerson { get; set; } = string.Empty;
    public DateTime MovementDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateMovementDto
{
    public int DeviceId { get; set; }
    public MovementType MovementType { get; set; }
    public string? OriginLocation { get; set; }
    public string? DestinationLocation { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string ResponsiblePerson { get; set; } = string.Empty;
    public DateTime? MovementDate { get; set; }
}
