namespace DeviceInventory.Core.DTOs;

public class StockReportDto
{
    public int TotalDevices { get; set; }
    public int AvailableCount { get; set; }
    public int InUseCount { get; set; }
    public int InRepairCount { get; set; }
    public int DisposedCount { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public Dictionary<string, int> ByLocation { get; set; } = new();
    public Dictionary<string, int> ByBrand { get; set; } = new();
    public Dictionary<string, int> ByStatus { get; set; } = new();
}

public class InventorySummaryDto
{
    public int TotalDevices { get; set; }
    public int TotalMovements { get; set; }
    public int AvailableDevices { get; set; }
    public int InRepairDevices { get; set; }
    public int InUseDevices { get; set; }
    public int DisposedDevices { get; set; }
    public decimal TotalValue { get; set; }
    public List<MovementDto> RecentMovements { get; set; } = new();
    public List<DeviceDto> RecentDevices { get; set; } = new();
}
