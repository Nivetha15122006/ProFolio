import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ currentUser, onLogout, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('devportfolio-user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="app-container">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <main className="main-content-wrapper">
        <div className="main-content-scroll">
          {children}
        </div>
      </main>

      <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-app);
        }

        .main-content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .main-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          padding-top: 2rem;
        }

        @media (max-width: 768px) {
          .main-content-wrapper {
            margin-top: 60px;
            height: calc(100vh - 60px);
          }
          
          .main-content-scroll {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
