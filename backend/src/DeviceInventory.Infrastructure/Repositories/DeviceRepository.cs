using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;
using DeviceInventory.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeviceInventory.Infrastructure.Repositories;

public class DeviceRepository : IDeviceRepository
{
    private readonly InventoryDbContext _context;

    public DeviceRepository(InventoryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Device>> GetAllAsync(string? search = null, DeviceStatus? status = null, string? location = null, string? brand = null)
    {
        var query = _context.Devices
            .Include(d => d.Movements)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(d =>
                d.Brand.ToLower().Contains(s) ||
                d.Model.ToLower().Contains(s) ||
                d.Imei.Contains(s) ||
                (d.SerialNumber != null && d.SerialNumber.ToLower().Contains(s)) ||
                d.Location.ToLower().Contains(s));
        }

        if (status.HasValue)
        {
            query = query.Where(d => d.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            var loc = location.Trim().ToLower();
            query = query.Where(d => d.Location.ToLower() == loc);
        }

        if (!string.IsNullOrWhiteSpace(brand))
        {
            var b = brand.Trim().ToLower();
            query = query.Where(d => d.Brand.ToLower() == b);
        }

        return await query.OrderByDescending(d => d.CreatedAt).ToListAsync();
    }

    public async Task<Device?> GetByIdAsync(int id)
    {
        return await _context.Devices
            .Include(d => d.Movements)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Device?> GetByImeiAsync(string imei)
    {
        return await _context.Devices
            .Include(d => d.Movements)
            .FirstOrDefaultAsync(d => d.Imei == imei);
    }

    public async Task<Device> AddAsync(Device device)
    {
        device.CreatedAt = DateTime.UtcNow;
        await _context.Devices.AddAsync(device);
        await _context.SaveChangesAsync();
        return device;
    }

    public async Task UpdateAsync(Device device)
    {
        device.UpdatedAt = DateTime.UtcNow;
        _context.Devices.Update(device);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Device device)
    {
        _context.Devices.Remove(device);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsImeiAsync(string imei, int? excludeId = null)
    {
        var query = _context.Devices.AsNoTracking().Where(d => d.Imei == imei);
        if (excludeId.HasValue)
        {
            query = query.Where(d => d.Id != excludeId.Value);
        }
        return await query.AnyAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _context.Devices.CountAsync();
    }
}
