using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.Interfaces;

public interface IInventoryService
{
    // Devices
    Task<IEnumerable<DeviceDto>> GetDevicesAsync(string? search = null, DeviceStatus? status = null, string? location = null, string? brand = null);
    Task<DeviceDto?> GetDeviceByIdAsync(int id);
    Task<DeviceDto> CreateDeviceAsync(CreateDeviceDto dto);
    Task<DeviceDto?> UpdateDeviceAsync(int id, UpdateDeviceDto dto);
    Task<bool> DeleteDeviceAsync(int id);

    // Movements
    Task<IEnumerable<MovementDto>> GetMovementsAsync(int? deviceId = null);
    Task<MovementDto?> GetMovementByIdAsync(int id);
    Task<MovementDto> CreateMovementAsync(CreateMovementDto dto);

    // Reports
    Task<StockReportDto> GetStockReportAsync();
    Task<InventorySummaryDto> GetSummaryAsync();
}
