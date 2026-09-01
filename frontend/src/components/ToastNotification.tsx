import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastProps } from '../types';

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div style={{ marginTop: '2px' }}>
              {isSuccess && <CheckCircle2 size={18} color="var(--status-available)" />}
              {isError && <AlertCircle size={18} color="var(--status-busy)" />}
              {!isSuccess && !isError && <Info size={18} color="var(--brand-blue)" />}
            </div>

            <div className="toast-content" style={{ flex: 1 }}>
              <h4>{toast.title}</h4>
              <p>{toast.description}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
