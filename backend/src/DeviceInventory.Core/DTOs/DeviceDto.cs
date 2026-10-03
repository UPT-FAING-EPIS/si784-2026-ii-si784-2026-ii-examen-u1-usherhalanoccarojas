using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.DTOs;

public class DeviceDto
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Imei { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public DeviceStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public string Location { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public string? Notes { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int MovementsCount { get; set; }
}

public class CreateDeviceDto
{
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Imei { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public DeviceStatus Status { get; set; } = DeviceStatus.Disponible;
    public string Location { get; set; } = string.Empty;
    public DateTime? EntryDate { get; set; }
    public string? Notes { get; set; }
    public decimal? PurchasePrice { get; set; }
}

public class UpdateDeviceDto
{
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Imei { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public DeviceStatus Status { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime? EntryDate { get; set; }
    public string? Notes { get; set; }
    public decimal? PurchasePrice { get; set; }
}
