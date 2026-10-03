using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Interfaces;
using DeviceInventory.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceInventory.Infrastructure.Repositories;

public class MovementRepository : IMovementRepository
{
    private readonly InventoryDbContext _context;

    public MovementRepository(InventoryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Movement>> GetAllAsync(int? deviceId = null)
    {
        var query = _context.Movements
            .Include(m => m.Device)
            .AsNoTracking()
            .AsQueryable();

        if (deviceId.HasValue)
        {
            query = query.Where(m => m.DeviceId == deviceId.Value);
        }

        return await query.OrderByDescending(m => m.MovementDate).ToListAsync();
    }

    public async Task<Movement?> GetByIdAsync(int id)
    {
        return await _context.Movements
            .Include(m => m.Device)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<Movement> AddAsync(Movement movement)
    {
        movement.CreatedAt = DateTime.UtcNow;
        await _context.Movements.AddAsync(movement);
        await _context.SaveChangesAsync();
        return movement;
    }

    public async Task<IEnumerable<Movement>> GetRecentAsync(int count = 10)
    {
        return await _context.Movements
            .Include(m => m.Device)
            .AsNoTracking()
            .OrderByDescending(m => m.MovementDate)
            .Take(count)
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _context.Movements.CountAsync();
    }
}
