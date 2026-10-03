using DeviceInventory.Api.Validators;
using DeviceInventory.Core.DTOs;
using DeviceInventory.Core.Entities;
using DeviceInventory.Core.Enums;
using DeviceInventory.Core.Interfaces;

namespace DeviceInventory.Api.Services;

public class InventoryService : IInventoryService
{
    private readonly IDeviceRepository _deviceRepository;
    private readonly IMovementRepository _movementRepository;
    private readonly ILogger<InventoryService> _logger;

    public InventoryService(
        IDeviceRepository deviceRepository,
        IMovementRepository movementRepository,
        ILogger<InventoryService> logger)
    {
        _deviceRepository = deviceRepository;
        _movementRepository = movementRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<DeviceDto>> GetDevicesAsync(
        string? search = null,
        DeviceStatus? status = null,
        string? location = null,
        string? brand = null)
    {
        var devices = await _deviceRepository.GetAllAsync(search, status, location, brand);
        return devices.Select(MapToDeviceDto);
    }

    public async Task<DeviceDto?> GetDeviceByIdAsync(int id)
    {
        var device = await _deviceRepository.GetByIdAsync(id);
        return device == null ? null : MapToDeviceDto(device);
    }

    public async Task<DeviceDto> CreateDeviceAsync(CreateDeviceDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Brand))
            throw new ArgumentException("La marca del equipo es requerida.");

        if (string.IsNullOrWhiteSpace(dto.Model))
            throw new ArgumentException("El modelo del equipo es requerido.");

        if (string.IsNullOrWhiteSpace(dto.Imei))
            throw new ArgumentException("El código IMEI es requerido.");

        var imeiClean = dto.Imei.Trim();
        if (imeiClean.Length != 15 || !imeiClean.All(char.IsDigit))
            throw new ArgumentException("El IMEI debe contener exactamente 15 dígitos numéricos.");

        if (await _deviceRepository.ExistsImeiAsync(imeiClean))
            throw new InvalidOperationException($"El IMEI '{imeiClean}' ya se encuentra registrado en el sistema.");

        if (string.IsNullOrWhiteSpace(dto.Location))
            throw new ArgumentException("La ubicación inicial del equipo es requerida.");

        var device = new Device
        {
            Brand = dto.Brand.Trim(),
            Model = dto.Model.Trim(),
            Imei = imeiClean,
            SerialNumber = dto.SerialNumber?.Trim() ?? string.Empty,
            Status = dto.Status,
            Location = dto.Location.Trim(),
            EntryDate = dto.EntryDate ?? DateTime.UtcNow,
            Notes = dto.Notes?.Trim(),
            PurchasePrice = dto.PurchasePrice
        };

        var createdDevice = await _deviceRepository.AddAsync(device);

        // Register initial movement for the new device
        var initialMovement = new Movement
        {
            DeviceId = createdDevice.Id,
            MovementType = MovementType.Ingreso,
            OriginLocation = "Registro inicial",
            DestinationLocation = createdDevice.Location,
            Reason = "Ingreso inicial de equipo celular al inventario",
            ResponsiblePerson = "Sistema / Administrador",
            MovementDate = createdDevice.EntryDate
        };
        await _movementRepository.AddAsync(initialMovement);

        _logger.LogInformation("Device created successfully. Id={DeviceId}, IMEI={Imei}", createdDevice.Id, createdDevice.Imei);
        return MapToDeviceDto(createdDevice);
    }

    public async Task<DeviceDto?> UpdateDeviceAsync(int id, UpdateDeviceDto dto)
    {
        var device = await _deviceRepository.GetByIdAsync(id);
        if (device == null)
            return null;

        if (string.IsNullOrWhiteSpace(dto.Brand))
            throw new ArgumentException("La marca del equipo es requerida.");

        if (string.IsNullOrWhiteSpace(dto.Model))
            throw new ArgumentException("El modelo del equipo es requerido.");

        if (string.IsNullOrWhiteSpace(dto.Imei))
            throw new ArgumentException("El código IMEI es requerido.");

        var imeiClean = dto.Imei.Trim();
        if (imeiClean.Length != 15 || !imeiClean.All(char.IsDigit))
            throw new ArgumentException("El IMEI debe contener exactamente 15 dígitos numéricos.");

        if (await _deviceRepository.ExistsImeiAsync(imeiClean, id))
            throw new InvalidOperationException($"El IMEI '{imeiClean}' ya pertenece a otro equipo registrado.");

        if (string.IsNullOrWhiteSpace(dto.Location))
            throw new ArgumentException("La ubicación del equipo es requerida.");

        device.Brand = dto.Brand.Trim();
        device.Model = dto.Model.Trim();
        device.Imei = imeiClean;
        device.SerialNumber = dto.SerialNumber?.Trim() ?? string.Empty;
        device.Status = dto.Status;
        device.Location = dto.Location.Trim();
        if (dto.EntryDate.HasValue)
        {
            device.EntryDate = dto.EntryDate.Value;
        }
        device.Notes = dto.Notes?.Trim();
        device.PurchasePrice = dto.PurchasePrice;

        await _deviceRepository.UpdateAsync(device);
        _logger.LogInformation("Device updated successfully. Id={DeviceId}", device.Id);

        return MapToDeviceDto(device);
    }

    public async Task<bool> DeleteDeviceAsync(int id)
    {
        var device = await _deviceRepository.GetByIdAsync(id);
        if (device == null)
            return false;

        await _deviceRepository.DeleteAsync(device);
        _logger.LogInformation("Device deleted successfully. Id={DeviceId}", id);
        return true;
    }

    public async Task<IEnumerable<MovementDto>> GetMovementsAsync(int? deviceId = null)
    {
        var movements = await _movementRepository.GetAllAsync(deviceId);
        return movements.Select(MapToMovementDto);
    }

    public async Task<MovementDto?> GetMovementByIdAsync(int id)
    {
        var movement = await _movementRepository.GetByIdAsync(id);
        return movement == null ? null : MapToMovementDto(movement);
    }

    public async Task<MovementDto> CreateMovementAsync(CreateMovementDto dto)
    {
        var device = await _deviceRepository.GetByIdAsync(dto.DeviceId);
        if (device == null)
            throw new KeyNotFoundException($"No se encontró el equipo celular con ID {dto.DeviceId}.");

        if (string.IsNullOrWhiteSpace(dto.Reason))
            throw new ArgumentException("El motivo u observación del movimiento es requerido.");

        if (string.IsNullOrWhiteSpace(dto.ResponsiblePerson))
            throw new ArgumentException("El responsable del movimiento es requerido.");

        var movement = new Movement
        {
            DeviceId = dto.DeviceId,
            MovementType = dto.MovementType,
            OriginLocation = dto.OriginLocation?.Trim() ?? device.Location,
            DestinationLocation = dto.DestinationLocation?.Trim(),
            Reason = dto.Reason.Trim(),
            ResponsiblePerson = dto.ResponsiblePerson.Trim(),
            MovementDate = dto.MovementDate ?? DateTime.UtcNow
        };

        // Apply business transitions to device status and location
        switch (dto.MovementType)
        {
            case MovementType.Traslado:
                if (string.IsNullOrWhiteSpace(dto.DestinationLocation))
                    throw new ArgumentException("Para un traslado es obligatorio indicar la ubicación de destino.");
                device.Location = dto.DestinationLocation.Trim();
                break;

            case MovementType.Baja:
                device.Status = DeviceStatus.DeBaja;
                break;

            case MovementType.Salida:
                device.Status = DeviceStatus.EnUso;
                break;

            case MovementType.Ingreso:
                device.Status = DeviceStatus.Disponible;
                if (!string.IsNullOrWhiteSpace(dto.DestinationLocation))
                {
                    device.Location = dto.DestinationLocation.Trim();
                }
                break;
        }

        await _deviceRepository.UpdateAsync(device);
        var created = await _movementRepository.AddAsync(movement);
        created.Device = device;

        _logger.LogInformation("Movement created. Type={Type}, DeviceId={DeviceId}", dto.MovementType, device.Id);
        return MapToMovementDto(created);
    }

    public async Task<StockReportDto> GetStockReportAsync()
    {
        var devices = (await _deviceRepository.GetAllAsync()).ToList();

        var report = new StockReportDto
        {
            TotalDevices = devices.Count,
            AvailableCount = devices.Count(d => d.Status == DeviceStatus.Disponible),
            InUseCount = devices.Count(d => d.Status == DeviceStatus.EnUso),
            InRepairCount = devices.Count(d => d.Status == DeviceStatus.EnReparacion),
            DisposedCount = devices.Count(d => d.Status == DeviceStatus.DeBaja),
            TotalInventoryValue = devices.Sum(d => d.PurchasePrice ?? 0m)
        };

        // Group by location
        report.ByLocation = devices
            .GroupBy(d => string.IsNullOrWhiteSpace(d.Location) ? "Sin Ubicación" : d.Location)
            .ToDictionary(g => g.Key, g => g.Count());

        // Group by brand
        report.ByBrand = devices
            .GroupBy(d => string.IsNullOrWhiteSpace(d.Brand) ? "Sin Marca" : d.Brand)
            .ToDictionary(g => g.Key, g => g.Count());

        // Group by status
        report.ByStatus = devices
            .GroupBy(d => d.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return report;
    }

    public async Task<InventorySummaryDto> GetSummaryAsync()
    {
        var devices = (await _deviceRepository.GetAllAsync()).ToList();
        var movementsCount = await _movementRepository.CountAsync();
        var recentMovements = await _movementRepository.GetRecentAsync(5);

        return new InventorySummaryDto
        {
            TotalDevices = devices.Count,
            TotalMovements = movementsCount,
            AvailableDevices = devices.Count(d => d.Status == DeviceStatus.Disponible),
            InRepairDevices = devices.Count(d => d.Status == DeviceStatus.EnReparacion),
            InUseDevices = devices.Count(d => d.Status == DeviceStatus.EnUso),
            DisposedDevices = devices.Count(d => d.Status == DeviceStatus.DeBaja),
            TotalValue = devices.Sum(d => d.PurchasePrice ?? 0m),
            RecentMovements = recentMovements.Select(MapToMovementDto).ToList(),
            RecentDevices = devices.Take(5).Select(MapToDeviceDto).ToList()
        };
    }

    private static DeviceDto MapToDeviceDto(Device d) => new()
    {
        Id = d.Id,
        Brand = d.Brand,
        Model = d.Model,
        Imei = d.Imei,
        SerialNumber = d.SerialNumber,
        Status = d.Status,
        Location = d.Location,
        EntryDate = d.EntryDate,
        Notes = d.Notes,
        PurchasePrice = d.PurchasePrice,
        CreatedAt = d.CreatedAt,
        UpdatedAt = d.UpdatedAt,
        MovementsCount = d.Movements?.Count ?? 0
    };

    private static MovementDto MapToMovementDto(Movement m) => new()
    {
        Id = m.Id,
        DeviceId = m.DeviceId,
        DeviceBrand = m.Device?.Brand ?? string.Empty,
        DeviceModel = m.Device?.Model ?? string.Empty,
        DeviceImei = m.Device?.Imei ?? string.Empty,
        MovementType = m.MovementType,
        OriginLocation = m.OriginLocation,
        DestinationLocation = m.DestinationLocation,
        Reason = m.Reason,
        ResponsiblePerson = m.ResponsiblePerson,
        MovementDate = m.MovementDate,
        CreatedAt = m.CreatedAt
    };
}
