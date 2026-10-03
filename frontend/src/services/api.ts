import type { Device, Movement, StockReport, InventorySummary, DeviceStatus, MovementType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_DEVICES: Device[] = [
  {
    id: 1,
    brand: 'Apple',
    model: 'iPhone 15 Pro Max 256GB Titanium',
    imei: '359247118234503',
    serialNumber: 'DNPZQ128MD6R',
    status: 'Disponible',
    location: 'Almacén Central',
    entryDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    notes: 'Equipo nuevo sellado en caja con garantía de fábrica.',
    purchasePrice: 1199,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    movementsCount: 1
  },
  {
    id: 2,
    brand: 'Apple',
    model: 'iPhone 14 128GB Midnight',
    imei: '353120109845619',
    serialNumber: 'F2LXK990MD6T',
    status: 'EnUso',
    location: 'Tienda Tacna',
    entryDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    notes: 'Asignado para exhibición y demo comercial.',
    purchasePrice: 799,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    movementsCount: 2
  },
  {
    id: 3,
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra 512GB Titanium Gray',
    imei: '357891234567890',
    serialNumber: 'R58N10XYZ8K',
    status: 'Disponible',
    location: 'Almacén Central',
    entryDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    notes: 'Incluye S-Pen y funda protectora original.',
    purchasePrice: 1299.5,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    movementsCount: 1
  },
  {
    id: 4,
    brand: 'Samsung',
    model: 'Galaxy A55 5G 128GB Awesome Navy',
    imei: '358912345678902',
    serialNumber: 'R52M987654A',
    status: 'EnReparacion',
    location: 'Centro de Soporte Técnico',
    entryDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    notes: 'Ingresó por cambio de pantalla táctil y batería.',
    purchasePrice: 380,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    movementsCount: 2
  },
  {
    id: 5,
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro+ 5G 256GB Midnight Black',
    imei: '867123456789017',
    serialNumber: 'XM2024N13P01',
    status: 'Disponible',
    location: 'Tienda Lima Norte',
    entryDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    notes: 'Carga rápida 120W y cámara 200MP.',
    purchasePrice: 349.99,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    movementsCount: 1
  },
  {
    id: 6,
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra 512GB Black Leica',
    imei: '869456789012345',
    serialNumber: 'XM2024U1409',
    status: 'Disponible',
    location: 'Almacén Central',
    entryDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    notes: 'Edición Leica con kit fotográfico profesional.',
    purchasePrice: 1099,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    movementsCount: 1
  },
  {
    id: 7,
    brand: 'Motorola',
    model: 'Edge 50 Pro 512GB Luxe Lavender',
    imei: '356789012345672',
    serialNumber: 'MOTOE50P991',
    status: 'EnUso',
    location: 'Tienda Tacna',
    entryDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    notes: 'Equipo asignado al área de supervisión técnica.',
    purchasePrice: 599,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    movementsCount: 1
  },
  {
    id: 8,
    brand: 'Google',
    model: 'Pixel 8 Pro 128GB Bay Blue',
    imei: '354567890123458',
    serialNumber: 'GP8P2023X88',
    status: 'DeBaja',
    location: 'Almacén Central',
    entryDate: new Date(Date.now() - 120 * 86400000).toISOString(),
    notes: 'Baja definitiva por daño irrecuperable en placa madre.',
    purchasePrice: 899,
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    movementsCount: 1
  }
];

const INITIAL_MOVEMENTS: Movement[] = [
  {
    id: 1,
    deviceId: 1,
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro Max 256GB Titanium',
    deviceImei: '359247118234503',
    movementType: 'Ingreso',
    originLocation: 'Proveedor Importador',
    destinationLocation: 'Almacén Central',
    reason: 'Recepción de lote inicial de importación Q3',
    responsiblePerson: 'Carlos Mendoza (Jefe de Almacén)',
    movementDate: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2,
    deviceId: 2,
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 14 128GB Midnight',
    deviceImei: '353120109845619',
    movementType: 'Ingreso',
    originLocation: 'Proveedor Importador',
    destinationLocation: 'Almacén Central',
    reason: 'Ingreso al inventario general',
    responsiblePerson: 'Carlos Mendoza (Jefe de Almacén)',
    movementDate: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 3,
    deviceId: 2,
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 14 128GB Midnight',
    deviceImei: '353120109845619',
    movementType: 'Traslado',
    originLocation: 'Almacén Central',
    destinationLocation: 'Tienda Tacna',
    reason: 'Traslado para exhibición y venta en sucursal Tacna',
    responsiblePerson: 'Ana Flores (Logística)',
    movementDate: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 4,
    deviceId: 4,
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy A55 5G 128GB Awesome Navy',
    deviceImei: '358912345678902',
    movementType: 'Traslado',
    originLocation: 'Tienda Tacna',
    destinationLocation: 'Centro de Soporte Técnico',
    reason: 'Envío a servicio técnico por garantía de pantalla',
    responsiblePerson: 'Luis Quispe (Encargado Tienda)',
    movementDate: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 5,
    deviceId: 8,
    deviceBrand: 'Google',
    deviceModel: 'Pixel 8 Pro 128GB Bay Blue',
    deviceImei: '354567890123458',
    movementType: 'Baja',
    originLocation: 'Centro de Soporte Técnico',
    destinationLocation: 'Almacén Central',
    reason: 'Declaración de baja técnica por corto en placa base',
    responsiblePerson: 'Ing. Roberto Salazar (Servicio Técnico)',
    movementDate: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

// Helper to get local data from localStorage with initial fallback
function getLocalDevices(): Device[] {
  const data = localStorage.getItem('cell_inventory_devices');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('cell_inventory_devices', JSON.stringify(INITIAL_DEVICES));
  return INITIAL_DEVICES;
}

function saveLocalDevices(devices: Device[]) {
  localStorage.setItem('cell_inventory_devices', JSON.stringify(devices));
}

function getLocalMovements(): Movement[] {
  const data = localStorage.getItem('cell_inventory_movements');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('cell_inventory_movements', JSON.stringify(INITIAL_MOVEMENTS));
  return INITIAL_MOVEMENTS;
}

function saveLocalMovements(movements: Movement[]) {
  localStorage.setItem('cell_inventory_movements', JSON.stringify(movements));
}

class ApiService {
  private isOnline = false;
  private hasCheckedHealth = false;

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      this.isOnline = res.ok;
      this.hasCheckedHealth = true;
      return this.isOnline;
    } catch {
      this.isOnline = false;
      this.hasCheckedHealth = true;
      return false;
    }
  }

  getIsOnline(): boolean {
    return this.isOnline;
  }

  async getDevices(params?: { search?: string; status?: DeviceStatus; location?: string; brand?: string }): Promise<Device[]> {
    if (!this.hasCheckedHealth) await this.checkHealth();

    if (this.isOnline) {
      try {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.status) query.append('status', params.status);
        if (params?.location) query.append('location', params.location);
        if (params?.brand) query.append('brand', params.brand);

        const res = await fetch(`${API_BASE_URL}/devices?${query.toString()}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend API request failed, falling back to local storage:', err);
        this.isOnline = false;
      }
    }

    // Local Storage Fallback
    let list = getLocalDevices();
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(d =>
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.imei.includes(q) ||
        (d.serialNumber && d.serialNumber.toLowerCase().includes(q)) ||
        d.location.toLowerCase().includes(q)
      );
    }
    if (params?.status) {
      list = list.filter(d => d.status === params.status);
    }
    if (params?.location) {
      list = list.filter(d => d.location.toLowerCase() === params.location?.toLowerCase());
    }
    if (params?.brand) {
      list = list.filter(d => d.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    return list;
  }

  async getDeviceById(id: number): Promise<Device | null> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/${id}`);
        if (res.ok) return await res.json();
        if (res.status === 404) return null;
      } catch (err) {
        console.warn(err);
      }
    }
    const list = getLocalDevices();
    return list.find(d => d.id === id) || null;
  }

  async createDevice(device: Partial<Device>): Promise<Device> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(device)
        });
        if (res.ok) return await res.json();
        const errJson = await res.json().catch(() => ({ message: 'Error al registrar el equipo.' }));
        throw new Error(errJson.message || 'Error al registrar el equipo.');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
        this.isOnline = false;
      }
    }

    // Local creation
    const list = getLocalDevices();
    if (list.some(d => d.imei === device.imei)) {
      throw new Error(`El IMEI '${device.imei}' ya se encuentra registrado.`);
    }

    const newId = list.length > 0 ? Math.max(...list.map(d => d.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newDevice: Device = {
      id: newId,
      brand: device.brand || '',
      model: device.model || '',
      imei: device.imei || '',
      serialNumber: device.serialNumber || '',
      status: device.status || 'Disponible',
      location: device.location || 'Almacén Central',
      entryDate: device.entryDate || now,
      notes: device.notes || '',
      purchasePrice: device.purchasePrice || 0,
      createdAt: now,
      movementsCount: 1
    };

    list.unshift(newDevice);
    saveLocalDevices(list);

    // Initial movement
    const movements = getLocalMovements();
    movements.unshift({
      id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
      deviceId: newDevice.id,
      deviceBrand: newDevice.brand,
      deviceModel: newDevice.model,
      deviceImei: newDevice.imei,
      movementType: 'Ingreso',
      originLocation: 'Registro inicial',
      destinationLocation: newDevice.location,
      reason: 'Ingreso inicial de equipo celular',
      responsiblePerson: 'Administrador',
      movementDate: newDevice.entryDate,
      createdAt: now
    });
    saveLocalMovements(movements);

    return newDevice;
  }

  async updateDevice(id: number, device: Partial<Device>): Promise<Device> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(device)
        });
        if (res.ok) return await res.json();
        const errJson = await res.json().catch(() => ({ message: 'Error al actualizar.' }));
        throw new Error(errJson.message || 'Error al actualizar.');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
        this.isOnline = false;
      }
    }

    const list = getLocalDevices();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Equipo no encontrado.');

    if (device.imei && list.some(d => d.id !== id && d.imei === device.imei)) {
      throw new Error(`El IMEI '${device.imei}' ya pertenece a otro equipo.`);
    }

    list[index] = {
      ...list[index],
      ...device,
      updatedAt: new Date().toISOString()
    };
    saveLocalDevices(list);
    return list[index];
  }

  async deleteDevice(id: number): Promise<boolean> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/devices/${id}`, { method: 'DELETE' });
        if (res.ok) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    let list = getLocalDevices();
    list = list.filter(d => d.id !== id);
    saveLocalDevices(list);

    let movements = getLocalMovements();
    movements = movements.filter(m => m.deviceId !== id);
    saveLocalMovements(movements);

    return true;
  }

  async getMovements(deviceId?: number): Promise<Movement[]> {
    if (this.isOnline) {
      try {
        const url = deviceId ? `${API_BASE_URL}/movements?deviceId=${deviceId}` : `${API_BASE_URL}/movements`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }

    const movements = getLocalMovements();
    if (deviceId) {
      return movements.filter(m => m.deviceId === deviceId);
    }
    return movements;
  }

  async createMovement(movement: {
    deviceId: number;
    movementType: MovementType;
    originLocation?: string;
    destinationLocation?: string;
    reason: string;
    responsiblePerson: string;
    movementDate?: string;
  }): Promise<Movement> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/movements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movement)
        });
        if (res.ok) return await res.json();
        const errJson = await res.json().catch(() => ({ message: 'Error al registrar movimiento.' }));
        throw new Error(errJson.message || 'Error al registrar movimiento.');
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) throw err;
        this.isOnline = false;
      }
    }

    const devices = getLocalDevices();
    const device = devices.find(d => d.id === movement.deviceId);
    if (!device) throw new Error('Equipo no encontrado.');

    // Transition device
    if (movement.movementType === 'Traslado' && movement.destinationLocation) {
      device.location = movement.destinationLocation;
    } else if (movement.movementType === 'Baja') {
      device.status = 'DeBaja';
    } else if (movement.movementType === 'Salida') {
      device.status = 'EnUso';
    } else if (movement.movementType === 'Ingreso') {
      device.status = 'Disponible';
      if (movement.destinationLocation) device.location = movement.destinationLocation;
    }
    saveLocalDevices(devices);

    const movements = getLocalMovements();
    const newId = movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newMovement: Movement = {
      id: newId,
      deviceId: device.id,
      deviceBrand: device.brand,
      deviceModel: device.model,
      deviceImei: device.imei,
      movementType: movement.movementType,
      originLocation: movement.originLocation || device.location,
      destinationLocation: movement.destinationLocation,
      reason: movement.reason,
      responsiblePerson: movement.responsiblePerson,
      movementDate: movement.movementDate || now,
      createdAt: now
    };

    movements.unshift(newMovement);
    saveLocalMovements(movements);
    return newMovement;
  }

  async getStockReport(): Promise<StockReport> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/stock`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }

    const devices = getLocalDevices();
    const report: StockReport = {
      totalDevices: devices.length,
      availableCount: devices.filter(d => d.status === 'Disponible').length,
      inUseCount: devices.filter(d => d.status === 'EnUso').length,
      inRepairCount: devices.filter(d => d.status === 'EnReparacion').length,
      disposedCount: devices.filter(d => d.status === 'DeBaja').length,
      totalInventoryValue: devices.reduce((sum, d) => sum + (d.purchasePrice || 0), 0),
      byLocation: {},
      byBrand: {},
      byStatus: {}
    };

    for (const d of devices) {
      report.byLocation[d.location] = (report.byLocation[d.location] || 0) + 1;
      report.byBrand[d.brand] = (report.byBrand[d.brand] || 0) + 1;
      report.byStatus[d.status] = (report.byStatus[d.status] || 0) + 1;
    }

    return report;
  }

  async getSummary(): Promise<InventorySummary> {
    if (this.isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/reports/summary`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(err);
      }
    }

    const devices = getLocalDevices();
    const movements = getLocalMovements();

    return {
      totalDevices: devices.length,
      totalMovements: movements.length,
      availableDevices: devices.filter(d => d.status === 'Disponible').length,
      inRepairDevices: devices.filter(d => d.status === 'EnReparacion').length,
      inUseDevices: devices.filter(d => d.status === 'EnUso').length,
      disposedDevices: devices.filter(d => d.status === 'DeBaja').length,
      totalValue: devices.reduce((sum, d) => sum + (d.purchasePrice || 0), 0),
      recentMovements: movements.slice(0, 5),
      recentDevices: devices.slice(0, 5)
    };
  }

  resetDemoData() {
    localStorage.removeItem('cell_inventory_devices');
    localStorage.removeItem('cell_inventory_movements');
    getLocalDevices();
    getLocalMovements();
  }
}

export const api = new ApiService();
