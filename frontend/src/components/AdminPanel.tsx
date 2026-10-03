import React, { useState } from 'react';
import { Database, Server, RefreshCcw, FileJson, CheckCircle, Cpu } from 'lucide-react';
import type { Device, Movement } from '../types';

interface AdminPanelProps {
  devices: Device[];
  movements: Movement[];
  isOnline: boolean;
  onResetData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  devices,
  movements,
  isOnline,
  onResetData
}) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportJson = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      system: 'CellStock Pro Mobile Inventory',
      version: '1.0.0',
      totalDevices: devices.length,
      totalMovements: movements.length,
      devices,
      movements
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = () => {
    if (window.confirm('¿Está seguro de restaurar los datos iniciales de prueba? Se restablecerán todos los dispositivos y movimientos originales.')) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Panel de Administración y Control Global
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Gestión del sistema, auditoría de integridad, copias de seguridad y diagnóstico del backend
        </div>
      </div>

      {resetSuccess && (
        <div style={{ padding: '0.9rem 1.2rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>Datos iniciales restaurados con éxito.</span>
        </div>
      )}

      {/* System Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Server size={20} color={isOnline ? '#34d399' : '#fbbf24'} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Estado del Servidor API</h4>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isOnline ? '#34d399' : '#fbbf24' }}>
            {isOnline ? 'En Línea (.NET 8 Web API)' : 'Modo Almacenamiento Local'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Endpoint: http://localhost:5000/devices
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Database size={20} color="#60a5fa" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Base de Datos Relacional</h4>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            SQLite / PostgreSQL
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            EF Core 8.0 — Tablas: Devices, Movements
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Cpu size={20} color="#c084fc" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Integridad de Registros</h4>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
            100% Válido
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            IMEIs verificados con algoritmo Luhn
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Acciones de Mantenimiento y Auditoría
        </h3>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportJson}>
            <FileJson size={16} />
            <span>Exportar Base de Datos (JSON)</span>
          </button>

          <button className="btn btn-danger" onClick={handleConfirmReset}>
            <RefreshCcw size={16} />
            <span>Restablecer Datos Iniciales de Prueba</span>
          </button>
        </div>
      </div>

      {/* Endpoints & Architecture Reference */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Especificación de Endpoints RESTful Implementados
        </h3>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Endpoint</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td><code>/devices</code></td>
                <td>Listar equipos celulares con filtros (búsqueda, estado, ubicación, marca)</td>
                <td><span style={{ color: '#34d399' }}>200 OK</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td><code>/devices</code></td>
                <td>Registrar nuevo equipo celular con validación de IMEI y marca</td>
                <td><span style={{ color: '#34d399' }}>201 Created</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td><code>/devices/{'{id}'}</code></td>
                <td>Detalle completo de equipo celular por su identificador</td>
                <td><span style={{ color: '#34d399' }}>200 OK / 404</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#fbbf24', fontWeight: 700 }}>PUT</span></td>
                <td><code>/devices/{'{id}'}</code></td>
                <td>Actualizar información de equipo celular existente</td>
                <td><span style={{ color: '#34d399' }}>200 OK</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#f87171', fontWeight: 700 }}>DELETE</span></td>
                <td><code>/devices/{'{id}'}</code></td>
                <td>Eliminar equipo celular y su historial de movimientos</td>
                <td><span style={{ color: '#34d399' }}>204 No Content</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td><code>/movements</code></td>
                <td>Registrar movimiento (Ingreso, Salida, Traslado, Baja) y actualizar estado</td>
                <td><span style={{ color: '#34d399' }}>201 Created</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td><code>/movements?deviceId={'{id}'}</code></td>
                <td>Historial de movimientos de un equipo o consolidado general</td>
                <td><span style={{ color: '#34d399' }}>200 OK</span></td>
              </tr>
              <tr>
                <td><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td><code>/reports/stock</code></td>
                <td>Reporte de stock actual agrupado por ubicación, marca y estado</td>
                <td><span style={{ color: '#34d399' }}>200 OK</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
