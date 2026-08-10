import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import PortfolioPreview from '../components/PortfolioPreview';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      const res = await api.public.getProfile(username);
      if (res && res.profile) {
        setData(res);
      } else {
        setError("This portfolio does not exist or has been made private.");
      }
    } catch (err) {
      setError("This portfolio does not exist or has been made private.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="public-loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Profolio...</p>
        <style>{`
          .public-loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #090d16;
            color: #ffffff;
            font-family: sans-serif;
            gap: 1rem;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-error-screen">
        <Compass size={48} className="error-compass" />
        <h2>Portfolio Not Found</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">Go to Profolio Home</Link>
        <style>{`
          .public-error-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #090d16;
            color: #ffffff;
            font-family: sans-serif;
            gap: 1rem;
            text-align: center;
            padding: 2rem;
          }
          .error-compass {
            color: #6366f1;
            margin-bottom: 0.5rem;
            animation: pulse 2s infinite;
          }
          .public-error-screen h2 {
            font-size: 1.75rem;
            font-weight: 700;
          }
          .public-error-screen p {
            color: #94a3b8;
            max-width: 320px;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="public-portfolio-viewport">
      <PortfolioPreview profile={data.profile} config={data.portfolio} />
      
      {/* Small floating branding tag */}
      <div className="profolio-floating-brand">
        <Link to="/" target="_blank" rel="noopener noreferrer">
          <span>Made with</span>
          <span className="brand-logo-text">Profolio</span>
        </Link>
      </div>

      <style>{`
        .public-portfolio-viewport {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .profolio-floating-brand {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          background-color: rgba(9, 13, 22, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .profolio-floating-brand a {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
        }

        .profolio-floating-brand a:hover {
          color: #ffffff;
        }

        .profolio-floating-brand .brand-logo-text {
          font-weight: 700;
          color: #818cf8;
        }
      `}</style>
    </div>
  );
}
