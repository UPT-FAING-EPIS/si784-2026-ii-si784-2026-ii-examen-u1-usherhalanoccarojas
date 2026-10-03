import React from 'react';
import { X, History, ArrowRight, User, Calendar, MapPin } from 'lucide-react';
import type { Device, Movement } from '../types';

interface MovementHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  device?: Device | null;
  movements: Movement[];
}

export const MovementHistoryModal: React.FC<MovementHistoryModalProps> = ({
  isOpen,
  onClose,
  device,
  movements
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon purple" style={{ width: 34, height: 34 }}>
              <History size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                Historial de Movimientos
              </h3>
              {device && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {device.brand} {device.model} — IMEI: {device.imei}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {movements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <History size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <div>No hay movimientos registrados para este dispositivo.</div>
            </div>
          ) : (
            <div className="timeline">
              {movements.map((m) => (
                <div key={m.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className={`type-badge ${m.movementType.toLowerCase()}`}>
                        {m.movementType}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} />
                        {new Date(m.movementDate).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Locations */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      <MapPin size={14} color="#60a5fa" />
                      <span>{m.originLocation || 'Origen'}</span>
                      {m.destinationLocation && (
                        <>
                          <ArrowRight size={14} color="var(--text-muted)" />
                          <span style={{ fontWeight: 600, color: '#34d399' }}>{m.destinationLocation}</span>
                        </>
                      )}
                    </div>

                    {/* Reason */}
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      "{m.reason}"
                    </div>

                    {/* Responsible */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={13} />
                      <span>Responsable: <strong>{m.responsiblePerson}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
