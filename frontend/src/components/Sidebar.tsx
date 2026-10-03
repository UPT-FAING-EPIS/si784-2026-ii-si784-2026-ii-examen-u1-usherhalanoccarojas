import React from 'react';
import { LayoutDashboard, Smartphone, ArrowLeftRight, BarChart3, UserCheck, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices', label: 'Equipos Celulares', icon: Smartphone },
    { id: 'movements', label: 'Movimientos', icon: ArrowLeftRight },
    { id: 'reports', label: 'Reportes de Stock', icon: BarChart3 },
    { id: 'user-panel', label: 'Panel de Usuario', icon: UserCheck },
    { id: 'admin-panel', label: 'Administración', icon: ShieldCheck }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Smartphone size={22} />
        </div>
        <div>
          <div className="brand-title">CellStock Pro</div>
          <div className="brand-subtitle">Inventario de Celulares</div>
        </div>
      </div>

      <nav>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>UPT - Examen U1</div>
        <div>API .NET Core + React</div>
      </div>
    </aside>
  );
};
