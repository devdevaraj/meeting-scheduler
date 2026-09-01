import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ScheduleFormProps } from '../types';
import { Calendar, Clock, Plus, X } from 'lucide-react';

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSchedule, isSubmitting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  
  const getInitialDateStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [dateStr, setDateStr] = useState(getInitialDateStr());
  const [startTimeStr, setStartTimeStr] = useState('10:00');
  const [endTimeStr, setEndTimeStr] = useState('11:00');

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setTitle('');
  };

  const handleDurationPreset = (minutes: number) => {
    if (!startTimeStr) return;
    const [h, m] = startTimeStr.split(':').map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);

    const end = new Date(start.getTime() + minutes * 60 * 1000);
    const endH = String(end.getHours()).padStart(2, '0');
    const endM = String(end.getMinutes()).padStart(2, '0');
    setEndTimeStr(`${endH}:${endM}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const startISO = new Date(`${dateStr}T${startTimeStr}:00`).toISOString();
    const endISO = new Date(`${dateStr}T${endTimeStr}:00`).toISOString();

    const success = await onSchedule({
      title: title.trim(),
      startTime: startISO,
      endTime: endISO,
    });

    if (success) {
      closeModal();
    }
  };

  return (
    <>
      <button className="btn-primary" onClick={openModal}>
        <Plus size={16} />
        <span>Schedule Meeting</span>
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--brand-blue)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Book a Meeting Room</h3>
                </div>
                <button className="btn-modal-close" onClick={closeModal} title="Close popup">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Meeting Title / Purpose</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Executive Sync, Sprint Planning"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Meeting Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={startTimeStr}
                      onChange={(e) => setStartTimeStr(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={endTimeStr}
                      onChange={(e) => setEndTimeStr(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quick Duration</label>
                  <div className="duration-presets">
                    <button type="button" className="btn-preset" onClick={() => handleDurationPreset(15)}>
                      15m
                    </button>
                    <button type="button" className="btn-preset" onClick={() => handleDurationPreset(30)}>
                      30m
                    </button>
                    <button type="button" className="btn-preset" onClick={() => handleDurationPreset(60)}>
                      1h
                    </button>
                    <button type="button" className="btn-preset" onClick={() => handleDurationPreset(120)}>
                      2h
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem' }}
                    disabled={isSubmitting}
                  >
                    <Clock size={16} />
                    <span>{isSubmitting ? 'Checking Rooms...' : 'Schedule & Auto-Assign Room'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
