import React, { useState } from 'react';
import { QrCode, Search, Smartphone, ArrowLeftRight, AlertCircle, Clock } from 'lucide-react';
import type { Device } from '../types';

interface UserPanelProps {
  devices: Device[];
  onNewMovement: (device: Device) => void;
  onViewHistory: (device: Device) => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ devices, onNewMovement, onViewHistory }) => {
  const [scannedImei, setScannedImei] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const clean = scannedImei.trim();
    const found = devices.find(d => d.imei === clean || (d.serialNumber && d.serialNumber.toLowerCase() === clean.toLowerCase()));
    setSelectedDevice(found || null);
  };

  const handleQuickSelect = (device: Device) => {
    setScannedImei(device.imei);
    setSelectedDevice(device);
    setSearchAttempted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Panel de Operaciones de Inventario
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Consulta rápida por IMEI, verificación de estado en tienda y despacho de dispositivos
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Scanner Simulation Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="stat-icon blue" style={{ width: 38, height: 38 }}>
              <QrCode size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Lector / Búsqueda Express por IMEI</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ingrese o escanee los 15 dígitos del IMEI</div>
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Ej: 359247118234503"
              value={scannedImei}
              onChange={(e) => setScannedImei(e.target.value.replace(/\D/g, ''))}
              maxLength={15}
              style={{ fontSize: '1rem', letterSpacing: '0.05em' }}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Search size={16} />
              <span>Verificar</span>
            </button>
          </form>

          {/* Quick Click IMEI pills for fast testing */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              IMEIs para prueba rápida:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {devices.slice(0, 4).map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleQuickSelect(d)}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 4,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {d.brand} ({d.imei.slice(-4)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Found Device Detail Result */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
            Resultado de la Verificación
          </h3>

          {!searchAttempted && !selectedDevice ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Smartphone size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <div>Ingrese un número IMEI para consultar su estado en tiempo real.</div>
            </div>
          ) : selectedDevice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedDevice.brand} {selectedDevice.model}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    IMEI: <code style={{ color: '#60a5fa' }}>{selectedDevice.imei}</code>
                  </div>
                </div>
                <span className={`status-badge ${selectedDevice.status.toLowerCase()}`}>
                  {selectedDevice.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Ubicación Actual:</span>
                  <div style={{ fontWeight: 600 }}>{selectedDevice.location}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Fecha Ingreso:</span>
                  <div style={{ fontWeight: 600 }}>{new Date(selectedDevice.entryDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Valor Estimado:</span>
                  <div style={{ fontWeight: 600 }}>{selectedDevice.purchasePrice ? `$${selectedDevice.purchasePrice.toFixed(2)}` : 'N/A'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>N° Serie:</span>
                  <div style={{ fontWeight: 600 }}>{selectedDevice.serialNumber || '—'}</div>
                </div>
              </div>

              {selectedDevice.notes && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 4 }}>
                  <strong>Notas:</strong> {selectedDevice.notes}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onNewMovement(selectedDevice)}
                >
                  <ArrowLeftRight size={14} />
                  <span>Registrar Movimiento</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onViewHistory(selectedDevice)}
                >
                  <Clock size={14} />
                  <span>Historial</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#f87171' }}>
              <AlertCircle size={36} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600 }}>Equipo celular no encontrado</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                El IMEI {scannedImei} no está registrado en el inventario.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
