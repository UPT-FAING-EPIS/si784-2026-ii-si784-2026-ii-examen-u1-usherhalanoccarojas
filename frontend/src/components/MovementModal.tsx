import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, AlertCircle, Info } from 'lucide-react';
import type { Device, MovementType } from '../types';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  preselectedDevice?: Device | null;
  onSave: (movement: {
    deviceId: number;
    movementType: MovementType;
    originLocation?: string;
    destinationLocation?: string;
    reason: string;
    responsiblePerson: string;
    movementDate?: string;
  }) => Promise<void>;
}

const LOCATIONS = ['Almacén Central', 'Tienda Tacna', 'Tienda Lima Norte', 'Centro de Soporte Técnico', 'En Tránsito'];

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  devices,
  preselectedDevice,
  onSave
}) => {
  const [deviceId, setDeviceId] = useState<number>(0);
  const [movementType, setMovementType] = useState<MovementType>('Traslado');
  const [originLocation, setOriginLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('Tienda Tacna');
  const [reason, setReason] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [movementDate, setMovementDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedDevice = devices.find(d => d.id === deviceId);

  useEffect(() => {
    if (preselectedDevice) {
      setDeviceId(preselectedDevice.id);
      setOriginLocation(preselectedDevice.location);
    } else if (devices.length > 0 && deviceId === 0) {
      setDeviceId(devices[0].id);
      setOriginLocation(devices[0].location);
    }
  }, [preselectedDevice, devices, isOpen]);

  useEffect(() => {
    if (selectedDevice) {
      setOriginLocation(selectedDevice.location);
    }
  }, [deviceId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!deviceId) {
      setErrorMessage('Por favor seleccione un equipo celular.');
      return;
    }
    if (movementType === 'Traslado' && (!destinationLocation || destinationLocation === originLocation)) {
      setErrorMessage('Para un traslado, seleccione una ubicación de destino diferente al origen.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Por favor especifique el motivo del movimiento.');
      return;
    }
    if (!responsiblePerson.trim()) {
      setErrorMessage('Por favor ingrese el nombre del responsable.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        deviceId,
        movementType,
        originLocation,
        destinationLocation: movementType === 'Traslado' || movementType === 'Ingreso' ? destinationLocation : undefined,
        reason: reason.trim(),
        responsiblePerson: responsiblePerson.trim(),
        movementDate: new Date(movementDate).toISOString()
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon amber" style={{ width: 34, height: 34 }}>
              <ArrowLeftRight size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Registrar Movimiento de Inventario</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMessage && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-group">
              <label>Equipo Celular *</label>
              <select
                value={deviceId}
                onChange={(e) => setDeviceId(Number(e.target.value))}
                required
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.brand} {d.model} — IMEI: {d.imei} ({d.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as MovementType)}
                  required
                >
                  <option value="Traslado">Traslado (Cambia ubicación)</option>
                  <option value="Salida">Salida (Pasa a En Uso)</option>
                  <option value="Ingreso">Ingreso (Pasa a Disponible)</option>
                  <option value="Baja">Baja (Pasa a De Baja)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de Movimiento</label>
                <input
                  type="date"
                  value={movementDate}
                  onChange={(e) => setMovementDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Ubicación Origen</label>
                <input
                  type="text"
                  value={originLocation}
                  onChange={(e) => setOriginLocation(e.target.value)}
                  placeholder="Ubicación de partida"
                />
              </div>

              {(movementType === 'Traslado' || movementType === 'Ingreso') && (
                <div className="form-group">
                  <label>Ubicación Destino *</label>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    required
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Responsable del Movimiento *</label>
              <input
                type="text"
                placeholder="Nombre del operador o supervisor"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Motivo / Observación *</label>
              <textarea
                rows={3}
                placeholder="Indique motivo del movimiento, número de guía de remisión o justificación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#93c5fd', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <span>
                {movementType === 'Traslado' && 'El equipo se moverá automáticamente a la ubicación de destino.'}
                {movementType === 'Baja' && 'El estado del equipo cambiará a "De Baja" y no estará disponible para venta/uso.'}
                {movementType === 'Salida' && 'El estado del equipo cambiará a "En Uso".'}
                {movementType === 'Ingreso' && 'El estado del equipo cambiará a "Disponible".'}
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Confirmar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
