import React from 'react';
import { Plus } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrapper">
        {Icon && <Icon size={28} className="empty-icon" />}
      </div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-desc">{description}</p>
      {onAction && actionText && (
        <button className="btn btn-primary" onClick={onAction}>
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}

      <style>{`
        .empty-state-card {
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 2.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-surface);
        }

        .empty-icon-wrapper {
          background-color: var(--bg-app);
          color: var(--text-muted);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .empty-desc {
          font-size: 0.825rem;
          color: var(--text-secondary);
          max-width: 320px;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
