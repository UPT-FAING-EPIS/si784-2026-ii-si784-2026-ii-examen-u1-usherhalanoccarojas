import { Search, RefreshCw, Server, WifiOff } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isOnline: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  isOnline,
  onRefresh,
  isLoading
}) => {
  return (
    <header className="top-header">
      <div className="header-search">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar por IMEI, marca, modelo o ubicación..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Backend Connectivity Status Pill */}
        <div className={`badge-status-pill ${isOnline ? 'status-online' : 'status-offline'}`}>
          {isOnline ? <Server size={14} /> : <WifiOff size={14} />}
          <span className="indicator-dot"></span>
          <span>{isOnline ? 'API .NET Conectada' : 'Modo Local / Offline'}</span>
        </div>

        {/* Refresh button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isLoading}
          title="Actualizar datos"
        >
          <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
          <span>Actualizar</span>
        </button>
      </div>
    </header>
  );
};
