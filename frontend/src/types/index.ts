export type DeviceStatus = 'Disponible' | 'EnUso' | 'EnReparacion' | 'DeBaja';

export type MovementType = 'Ingreso' | 'Salida' | 'Traslado' | 'Baja';

export interface Device {
  id: number;
  brand: string;
  model: string;
  imei: string;
  serialNumber?: string;
  status: DeviceStatus;
  statusName?: string;
  location: string;
  entryDate: string;
  notes?: string;
  purchasePrice?: number;
  createdAt: string;
  updatedAt?: string;
  movementsCount?: number;
}

export interface Movement {
  id: number;
  deviceId: number;
  deviceBrand?: string;
  deviceModel?: string;
  deviceImei?: string;
  movementType: MovementType;
  movementTypeName?: string;
  originLocation?: string;
  destinationLocation?: string;
  reason: string;
  responsiblePerson: string;
  movementDate: string;
  createdAt?: string;
}

export interface StockReport {
  totalDevices: number;
  availableCount: number;
  inUseCount: number;
  inRepairCount: number;
  disposedCount: number;
  totalInventoryValue: number;
  byLocation: Record<string, number>;
  byBrand: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface InventorySummary {
  totalDevices: number;
  totalMovements: number;
  availableDevices: number;
  inRepairDevices: number;
  inUseDevices: number;
  disposedDevices: number;
  totalValue: number;
  recentMovements: Movement[];
  recentDevices: Device[];
}
