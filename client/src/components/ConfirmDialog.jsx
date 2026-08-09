import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDanger = true }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-dialog-content">
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .confirm-dialog-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .confirm-message {
          font-size: 0.925rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .confirm-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </Modal>
  );
}
