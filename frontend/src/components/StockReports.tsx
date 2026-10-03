import { Download, Printer, BarChart2, DollarSign, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { Device, StockReport } from '../types';

interface StockReportsProps {
  report: StockReport | null;
  devices: Device[];
}

export const StockReports: React.FC<StockReportsProps> = ({ report, devices }) => {
  if (!report) {
    return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>Cargando reportes...</div>;
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Marca', 'Modelo', 'IMEI', 'Serie', 'Estado', 'Ubicación', 'Precio_USD', 'Fecha_Ingreso'];
    const rows = devices.map(d => [
      d.id,
      `"${d.brand}"`,
      `"${d.model}"`,
      `"${d.imei}"`,
      `"${d.serialNumber || ''}"`,
      d.status,
      `"${d.location}"`,
      d.purchasePrice || 0,
      d.entryDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_stock_celulares_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Reporte de Stock y Monitoreo de Dispositivos
          </h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Consolidado general de inventario por estado, ubicación y fabricante
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Imprimir Reporte</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Stock Total</div>
            <div className="stat-value">{report.totalDevices}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Equipos registrados</div>
          </div>
          <div className="stat-icon blue">
            <BarChart2 size={22} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Disponibles</div>
            <div className="stat-value" style={{ color: '#34d399' }}>{report.availableCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Listos para entrega/venta</div>
          </div>
          <div className="stat-icon green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">En Uso / Demo</div>
            <div className="stat-value" style={{ color: '#c084fc' }}>{report.inUseCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Asignados en tienda</div>
          </div>
          <div className="stat-icon purple">
            <Clock size={22} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">En Reparación</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>{report.inRepairCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>En soporte técnico</div>
          </div>
          <div className="stat-icon amber">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">De Baja</div>
            <div className="stat-value" style={{ color: '#f87171' }}>{report.disposedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Dañados / Desincorporados</div>
          </div>
          <div className="stat-icon rose">
            <XCircle size={22} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Valoración Total</div>
            <div className="stat-value">${report.totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Valor de activos</div>
          </div>
          <div className="stat-icon blue">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* Distribution Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* By Location */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Stock por Ubicación</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Almacenes y Tiendas</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(report.byLocation).map(([loc, count]) => {
              const pct = report.totalDevices > 0 ? Math.round((count / report.totalDevices) * 100) : 0;
              return (
                <div key={loc}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500 }}>{loc}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: 4 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Brand */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Stock por Marca / Fabricante</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dispositivos</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(report.byBrand).map(([brand, count]) => {
              const pct = report.totalDevices > 0 ? Math.round((count / report.totalDevices) * 100) : 0;
              return (
                <div key={brand}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500 }}>{brand}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: 4 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
