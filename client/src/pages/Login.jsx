import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const data = await api.auth.login(username, password);
      if (rememberMe) {
        localStorage.setItem('devportfolio-remember', username);
      } else {
        localStorage.removeItem('devportfolio-remember');
      }
      onLoginSuccess(data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-symbol">DP</div>
          <h2>Welcome back</h2>
          <p>Login to manage your professional profile</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <KeyRound size={16} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" style={{fontSize: '0.8rem'}}>Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-app);
          padding: 2rem 1rem;
        }

        .auth-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 400px;
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow-md);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 0.75rem;
        }

        .auth-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .auth-error-banner {
          background-color: var(--danger-light);
          color: var(--danger-color);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          font-size: 0.825rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-input {
          padding-left: 2.25rem;
        }

        .auth-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .remember-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .auth-submit {
          width: 100%;
          padding: 0.625rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.825rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
