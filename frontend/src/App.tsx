import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { DeviceList } from './components/DeviceList';
import { DeviceModal } from './components/DeviceModal';
import { MovementModal } from './components/MovementModal';
import { MovementHistoryModal } from './components/MovementHistoryModal';
import { StockReports } from './components/StockReports';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
import { api } from './services/api';
import type { Device, Movement, StockReport, InventorySummary, MovementType } from './types';
import {
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  DollarSign,
  Plus,
  ArrowLeftRight,
  TrendingUp,
  Check
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | null>(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [preselectedDevice, setPreselectedDevice] = useState<Device | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDeviceForHistory, setSelectedDeviceForHistory] = useState<Device | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const online = await api.checkHealth();
      setIsOnline(online);

      const [devs, movs, report, summ] = await Promise.all([
        api.getDevices(),
        api.getMovements(),
        api.getStockReport(),
        api.getSummary()
      ]);

      setDevices(devs);
      setMovements(movs);
      setStockReport(report);
      setSummary(summ);
    } catch (err) {
      console.error('Error loading inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save / Update Device
  const handleSaveDevice = async (deviceData: Partial<Device>) => {
    if (deviceToEdit) {
      await api.updateDevice(deviceToEdit.id, deviceData);
      showToast(`Equipo ${deviceData.brand} ${deviceData.model} actualizado.`);
    } else {
      await api.createDevice(deviceData);
      showToast(`Equipo ${deviceData.brand} ${deviceData.model} registrado exitosamente.`);
    }
    await loadData();
  };

  // Delete Device
  const handleDeleteDevice = async (id: number) => {
    await api.deleteDevice(id);
    showToast('Equipo celular eliminado del inventario.');
    await loadData();
  };

  // Create Movement
  const handleSaveMovement = async (mov: {
    deviceId: number;
    movementType: MovementType;
    originLocation?: string;
    destinationLocation?: string;
    reason: string;
    responsiblePerson: string;
    movementDate?: string;
  }) => {
    await api.createMovement(mov);
    showToast(`Movimiento de ${mov.movementType} registrado.`);
    await loadData();
  };

  // Reset Data
  const handleResetData = () => {
    api.resetDemoData();
    loadData();
    showToast('Datos de demostración reiniciados.');
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Check size={18} color="#34d399" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isOnline={isOnline}
          onRefresh={loadData}
          isLoading={isLoading}
        />

        <main className="content-wrapper">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Header Title with quick action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                    Panel de Control y Monitoreo
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Sistema integral de gestión de stock, movimientos e historial de equipos celulares
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setPreselectedDevice(null);
                      setIsMovementModalOpen(true);
                    }}
                  >
                    <ArrowLeftRight size={16} />
                    <span>Nuevo Movimiento</span>
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setDeviceToEdit(null);
                      setIsDeviceModalOpen(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>Registrar Celular</span>
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="stats-grid">
                <StatCard
                  label="Total Celulares"
                  value={summary?.totalDevices ?? devices.length}
                  icon={Smartphone}
                  color="blue"
                  subtext="En base de datos"
                />
                <StatCard
                  label="Disponibles"
                  value={summary?.availableDevices ?? 0}
                  icon={CheckCircle2}
                  color="green"
                  subtext="Listos para despacho"
                />
                <StatCard
                  label="En Uso / Demo"
                  value={summary?.inUseDevices ?? 0}
                  icon={Clock}
                  color="purple"
                  subtext="Asignados a personal/tienda"
                />
                <StatCard
                  label="En Reparación"
                  value={summary?.inRepairDevices ?? 0}
                  icon={AlertTriangle}
                  color="amber"
                  subtext="En servicio técnico"
                />
                <StatCard
                  label="De Baja"
                  value={summary?.disposedDevices ?? 0}
                  icon={XCircle}
                  color="rose"
                  subtext="Equipos dados de baja"
                />
                <StatCard
                  label="Valor en Activos"
                  value={`$${(summary?.totalValue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  icon={DollarSign}
                  color="blue"
                  subtext="Inventario totalizado"
                />
              </div>

              {/* Quick Actions & Recent Movements */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Movements */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={18} color="#60a5fa" />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Últimos Movimientos</h3>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('movements')}
                    >
                      Ver Todos ({movements.length})
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {movements.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 0.9rem',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span className={`type-badge ${m.movementType.toLowerCase()}`}>
                            {m.movementType}
                          </span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {m.deviceBrand} {m.deviceModel}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {m.originLocation} {m.destinationLocation ? `→ ${m.destinationLocation}` : ''}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <div>{new Date(m.movementDate).toLocaleDateString()}</div>
                          <div>{m.responsiblePerson.split(' ')[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Overview Widget */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Distribución por Marca</h3>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('reports')}
                    >
                      Ver Reporte
                    </button>
                  </div>

                  {stockReport && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {Object.entries(stockReport.byBrand).map(([brand, count]) => {
                        const pct = stockReport.totalDevices > 0 ? Math.round((count / stockReport.totalDevices) * 100) : 0;
                        return (
                          <div key={brand}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                              <span>{brand}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{count} unidades ({pct}%)</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: 3 }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEVICES */}
          {activeTab === 'devices' && (
            <DeviceList
              devices={devices}
              searchTerm={searchTerm}
              onAddDevice={() => {
                setDeviceToEdit(null);
                setIsDeviceModalOpen(true);
              }}
              onEditDevice={(device) => {
                setDeviceToEdit(device);
                setIsDeviceModalOpen(true);
              }}
              onDeleteDevice={handleDeleteDevice}
              onNewMovement={(device) => {
                setPreselectedDevice(device);
                setIsMovementModalOpen(true);
              }}
              onViewHistory={async (device) => {
                setSelectedDeviceForHistory(device);
                const history = await api.getMovements(device.id);
                setMovements(history);
                setIsHistoryModalOpen(true);
              }}
            />
          )}

          {/* TAB 3: MOVEMENTS TABLE */}
          {activeTab === 'movements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Historial Completo de Movimientos
                  </h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Auditoría de ingresos, salidas, traslados y bajas de equipos
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setPreselectedDevice(null);
                    setIsMovementModalOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Nuevo Movimiento</span>
                </button>
              </div>

              <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Equipo Celular</th>
                        <th>IMEI</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Responsable</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movements.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(m.movementDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <span className={`type-badge ${m.movementType.toLowerCase()}`}>
                              {m.movementType}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {m.deviceBrand} {m.deviceModel}
                          </td>
                          <td>
                            <code style={{ fontSize: '0.82rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: 4 }}>
                              {m.deviceImei || '—'}
                            </code>
                          </td>
                          <td>{m.originLocation || '—'}</td>
                          <td>
                            <span style={{ color: m.destinationLocation ? '#34d399' : 'inherit', fontWeight: m.destinationLocation ? 600 : 400 }}>
                              {m.destinationLocation || '—'}
                            </span>
                          </td>
                          <td>{m.responsiblePerson}</td>
                          <td style={{ color: 'var(--text-secondary)', maxWidth: 260 }}>
                            {m.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeTab === 'reports' && (
            <StockReports report={stockReport} devices={devices} />
          )}

          {/* TAB 5: USER PANEL */}
          {activeTab === 'user-panel' && (
            <UserPanel
              devices={devices}
              onNewMovement={(device) => {
                setPreselectedDevice(device);
                setIsMovementModalOpen(true);
              }}
              onViewHistory={async (device) => {
                setSelectedDeviceForHistory(device);
                const history = await api.getMovements(device.id);
                setMovements(history);
                setIsHistoryModalOpen(true);
              }}
            />
          )}

          {/* TAB 6: ADMIN PANEL */}
          {activeTab === 'admin-panel' && (
            <AdminPanel
              devices={devices}
              movements={movements}
              isOnline={isOnline}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        onClose={() => {
          setIsDeviceModalOpen(false);
          setDeviceToEdit(null);
        }}
        onSave={handleSaveDevice}
        deviceToEdit={deviceToEdit}
      />

      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => {
          setIsMovementModalOpen(false);
          setPreselectedDevice(null);
        }}
        devices={devices}
        preselectedDevice={preselectedDevice}
        onSave={handleSaveMovement}
      />

      <MovementHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedDeviceForHistory(null);
        }}
        device={selectedDeviceForHistory}
        movements={selectedDeviceForHistory ? movements.filter(m => m.deviceId === selectedDeviceForHistory.id) : movements}
      />
    </div>
  );
};

export default App;
