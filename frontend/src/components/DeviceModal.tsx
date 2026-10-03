import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import type { Device, DeviceStatus } from '../types';
import { validateImei } from '../utils/imei';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Partial<Device>) => Promise<void>;
  deviceToEdit?: Device | null;
}

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Google', 'Honor', 'Huawei', 'OnePlus', 'Oppo'];
const LOCATIONS = ['Almacén Central', 'Tienda Tacna', 'Tienda Lima Norte', 'Centro de Soporte Técnico', 'En Tránsito'];

export const DeviceModal: React.FC<DeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  deviceToEdit
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [imei, setImei] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState<DeviceStatus>('Disponible');
  const [location, setLocation] = useState('Almacén Central');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Luhn Validation
  const imeiValidation = validateImei(imei);

  useEffect(() => {
    if (deviceToEdit) {
      setBrand(deviceToEdit.brand);
      setModel(deviceToEdit.model);
      setImei(deviceToEdit.imei);
      setSerialNumber(deviceToEdit.serialNumber || '');
      setStatus(deviceToEdit.status);
      setLocation(deviceToEdit.location);
      setPurchasePrice(deviceToEdit.purchasePrice ? deviceToEdit.purchasePrice.toString() : '');
      setEntryDate(deviceToEdit.entryDate ? deviceToEdit.entryDate.split('T')[0] : new Date().toISOString().split('T')[0]);
      setNotes(deviceToEdit.notes || '');
    } else {
      setBrand('Apple');
      setModel('');
      setImei('');
      setSerialNumber('');
      setStatus('Disponible');
      setLocation('Almacén Central');
      setPurchasePrice('');
      setEntryDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setErrorMessage('');
  }, [deviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!brand.trim()) {
      setErrorMessage('Por favor ingrese la marca del equipo.');
      return;
    }
    if (!model.trim()) {
      setErrorMessage('Por favor ingrese el modelo del equipo.');
      return;
    }
    if (!imeiValidation.isValid) {
      setErrorMessage(imeiValidation.message);
      return;
    }
    if (!location.trim()) {
      setErrorMessage('Por favor seleccione o ingrese una ubicación.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        brand: brand.trim(),
        model: model.trim(),
        imei: imei.trim(),
        serialNumber: serialNumber.trim(),
        status,
        location: location.trim(),
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        entryDate: new Date(entryDate).toISOString(),
        notes: notes.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar el equipo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon blue" style={{ width: 34, height: 34 }}>
              <Smartphone size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {deviceToEdit ? 'Editar Equipo Celular' : 'Registrar Nuevo Equipo Celular'}
            </h3>
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

            <div className="form-grid-2">
              <div className="form-group">
                <label>Marca *</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Modelo *</label>
                <input
                  type="text"
                  placeholder="Ej: iPhone 15 Pro, Galaxy S24"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* IMEI input with live validation */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>IMEI (15 dígitos) *</label>
                {imei.length > 0 && (
                  <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: imeiValidation.isValid ? '#34d399' : '#f87171' }}>
                    {imeiValidation.isValid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {imeiValidation.message}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="Ej: 359247118234503"
                maxLength={15}
                value={imei}
                onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
                required
                style={{
                  borderColor: imei.length > 0 ? (imeiValidation.isValid ? '#10b981' : '#ef4444') : undefined
                }}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Número de Serie (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: DNPZQ128MD6R"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Precio / Costo ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 999.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Estado del Equipo *</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as DeviceStatus)}>
                  <option value="Disponible">Disponible</option>
                  <option value="EnUso">En Uso</option>
                  <option value="EnReparacion">En Reparación</option>
                  <option value="DeBaja">De Baja</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ubicación *</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Fecha de Ingreso</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Observaciones / Notas</label>
              <textarea
                rows={3}
                placeholder="Accesorios incluidos, condiciones físicas o detalles adicionales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (deviceToEdit ? 'Actualizar Equipo' : 'Registrar Equipo')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
