using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Enums;

namespace DeviceInventory.Core.Interfaces;

public interface IDeviceRepository
{
    Task<IEnumerable<Device>> GetAllAsync(string? search = null, DeviceStatus? status = null, string? location = null, string? brand = null);
    Task<Device?> GetByIdAsync(int id);
    Task<Device?> GetByImeiAsync(string imei);
    Task<Device> AddAsync(Device device);
    Task UpdateAsync(Device device);
    Task DeleteAsync(Device device);
    Task<bool> ExistsImeiAsync(string imei, int? excludeId = null);
    Task<int> CountAsync();
}
