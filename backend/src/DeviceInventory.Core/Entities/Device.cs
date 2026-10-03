using System.Text.Json.Serialization;
using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.Entities;

public class Device
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Imei { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public DeviceStatus Status { get; set; } = DeviceStatus.Disponible;
    public string Location { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
    public decimal? PurchasePrice { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    [JsonIgnore]
    public ICollection<Movement> Movements { get; set; } = new List<Movement>();
}
