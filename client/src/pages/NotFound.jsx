import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <Compass size={48} className="compass-icon animate-spin-slow" />
      <h1>404 – Page Not Found</h1>
      <p>The workspace page or route you are looking for does not exist in this lab installation.</p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </button>

      <style>{`
        .notfound-container {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          font-family: var(--font-sans);
        }

        .compass-icon {
          color: var(--text-muted);
        }

        .notfound-container h1 {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .notfound-container p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 320px;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
