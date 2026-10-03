using DeviceInventory.Core.Entities;

namespace DeviceInventory.Core.Interfaces;

public interface IMovementRepository
{
    Task<IEnumerable<Movement>> GetAllAsync(int? deviceId = null);
    Task<Movement?> GetByIdAsync(int id);
    Task<Movement> AddAsync(Movement movement);
    Task<IEnumerable<Movement>> GetRecentAsync(int count = 10);
    Task<int> CountAsync();
}
