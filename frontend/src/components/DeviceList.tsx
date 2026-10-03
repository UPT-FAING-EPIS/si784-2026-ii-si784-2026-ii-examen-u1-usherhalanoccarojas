import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ArrowLeftRight, History, Filter, Smartphone, MapPin } from 'lucide-react';
import type { Device, DeviceStatus } from '../types';

interface DeviceListProps {
  devices: Device[];
  onAddDevice: () => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (id: number) => void;
  onNewMovement: (device: Device) => void;
  onViewHistory: (device: Device) => void;
  searchTerm: string;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onNewMovement,
  onViewHistory,
  searchTerm
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Extract unique brands and locations
  const brands = Array.from(new Set(devices.map(d => d.brand))).sort();
  const locations = Array.from(new Set(devices.map(d => d.location))).sort();

  // Apply filters
  const filteredDevices = devices.filter(d => {
    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.imei.includes(q) ||
        (d.serialNumber && d.serialNumber.toLowerCase().includes(q)) ||
        d.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;

    // Brand
    if (brandFilter !== 'ALL' && d.brand !== brandFilter) return false;

    // Location
    if (locationFilter !== 'ALL' && d.location !== locationFilter) return false;

    return true;
  });

  const getStatusBadge = (status: DeviceStatus) => {
    const labels: Record<DeviceStatus, string> = {
      Disponible: 'Disponible',
      EnUso: 'En Uso',
      EnReparacion: 'En Reparación',
      DeBaja: 'De Baja'
    };
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>
        <span className="indicator-dot"></span>
        <span>{labels[status] || status}</span>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Title and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Inventario de Equipos Celulares
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Mostrando {filteredDevices.length} de {devices.length} dispositivos registrados
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddDevice}>
          <Plus size={18} />
          <span>Registrar Nuevo Equipo</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Filter size={16} />
            <span>Filtros:</span>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: 160 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="EnUso">En Uso</option>
              <option value="EnReparacion">En Reparación</option>
              <option value="DeBaja">De Baja</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div style={{ minWidth: 160 }}>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">Todas las Marcas</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div style={{ minWidth: 180 }}>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="ALL">Todas las Ubicaciones</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {(statusFilter !== 'ALL' || brandFilter !== 'ALL' || locationFilter !== 'ALL') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('ALL');
                setBrandFilter('ALL');
                setLocationFilter('ALL');
              }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Devices Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Equipo / Modelo</th>
                <th>IMEI</th>
                <th>Serie</th>
                <th>Estado</th>
                <th>Ubicación Actual</th>
                <th>Precio</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                    <Smartphone size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>No se encontraron equipos celulares</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Intente ajustar los filtros o registre un nuevo equipo celular.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {d.brand} {d.model}
                      </div>
                      {d.notes && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 260, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {d.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.45rem', borderRadius: 4, letterSpacing: '0.05em' }}>
                        {d.imei}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {d.serialNumber || '—'}
                      </span>
                    </td>
                    <td>
                      {getStatusBadge(d.status)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <MapPin size={13} color="var(--accent-blue)" />
                        <span>{d.location}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {d.purchasePrice ? `$${d.purchasePrice.toFixed(2)}` : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Ver Historial de Movimientos"
                          onClick={() => onViewHistory(d)}
                        >
                          <History size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Registrar Movimiento"
                          onClick={() => onNewMovement(d)}
                        >
                          <ArrowLeftRight size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Editar Equipo"
                          onClick={() => onEditDevice(d)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          title="Eliminar Equipo"
                          onClick={() => {
                            if (window.confirm(`¿Está seguro de eliminar el equipo ${d.brand} ${d.model} (IMEI: ${d.imei})?`)) {
                              onDeleteDevice(d.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
