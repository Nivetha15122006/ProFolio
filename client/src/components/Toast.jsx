import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast-alert toast-${type}`} role="alert">
      {type === 'success' ? (
        <CheckCircle size={16} className="toast-icon" />
      ) : (
        <AlertCircle size={16} className="toast-icon" />
      )}
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close Alert">
        <X size={14} />
      </button>

      <style>{`
        .toast-alert {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-lg);
          z-index: 1100;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          animation: toastSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--border-color);
        }

        .toast-success {
          background-color: var(--bg-surface);
          border-left: 4px solid var(--success-color);
          color: var(--text-primary);
        }

        .toast-error {
          background-color: var(--bg-surface);
          border-left: 4px solid var(--danger-color);
          color: var(--text-primary);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          color: var(--success-color);
        }

        .toast-error .toast-icon {
          color: var(--danger-color);
        }

        .toast-text {
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.125rem;
          display: flex;
          align-items: center;
          margin-left: 0.5rem;
        }

        .toast-close:hover {
          color: var(--text-primary);
        }

        @keyframes toastSlide {
          from {
            transform: translateY(24px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
