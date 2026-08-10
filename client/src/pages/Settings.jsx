import React, { useContext, useEffect, useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Laptop, Shield, User, Save } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../services/api';
import Toast from '../components/Toast';

export default function Settings({ currentUser }) {
  const { theme, setExplicitTheme } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedThemeOption, setSelectedThemeOption] = useState(() => {
    // Read from localStorage to match stored preference
    const stored = localStorage.getItem('devportfolio-theme');
    return stored || 'system';
  });

  const [accountForm, setAccountForm] = useState({
    username: currentUser || '',
    email: '',
    privacyMode: 'public'
  });

  useEffect(() => {
    api.profile.get()
      .then(data => {
        setProfile(data);
        if (data.personalInfo) {
          setAccountForm(prev => ({
            ...prev,
            email: data.personalInfo.email || ''
          }));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleThemeChange = (option) => {
    setSelectedThemeOption(option);
    if (option === 'system') {
      setExplicitTheme('system');
      localStorage.setItem('devportfolio-theme', 'system');
    } else {
      setExplicitTheme(option);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      // Sync email back to personalInfo
      if (profile && profile.personalInfo) {
        const updatedInfo = {
          ...profile.personalInfo,
          email: accountForm.email
        };
        await api.profile.update({ personalInfo: updatedInfo });
      }
      setToastMsg("Account settings updated successfully!");
    } catch (err) {
      setToastMsg("Failed to save settings.");
    }
  };

  if (loading) {
    return <div className="settings-loading">Loading settings workspace...</div>;
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-title">Workspace Settings</h1>
        <p className="page-desc">Manage your account credentials, interface theme options, and profile privacy levels.</p>
      </div>

      <div className="settings-layout-grid">
        {/* Left Side: General Forms */}
        <div className="settings-main-col">
          <form onSubmit={handleSaveSettings} className="card settings-card">
            <h3 className="settings-card-title-flex">
              <User size={16} />
              <span>Account Information</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={accountForm.username} 
                disabled 
              />
              <span className="input-helper-text">Username cannot be changed after registration.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email-settings">Primary Email Address</label>
              <input 
                id="email-settings"
                type="email" 
                className="form-input" 
                value={accountForm.email} 
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={14} />
              <span>Save Account Settings</span>
            </button>
          </form>

          {/* Privacy Group */}
          <div className="card settings-card">
            <h3 className="settings-card-title-flex">
              <Shield size={16} />
              <span>Privacy & Shareability</span>
            </h3>
            
            <div className="form-group">
              <label className="form-label">Profile Sharing Mode</label>
              <select 
                className="form-select"
                value={accountForm.privacyMode}
                onChange={(e) => setAccountForm({ ...accountForm, privacyMode: e.target.value })}
              >
                <option value="public">Public (Anyone with link can view portfolio)</option>
                <option value="private">Private (Only viewable when logged in)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Interface Theme Control */}
        <div className="settings-side-col">
          <div className="card settings-card">
            <h3 className="settings-card-title-flex">
              <SettingsIcon size={16} />
              <span>App Appearance</span>
            </h3>
            <p className="settings-card-desc">Select how Profolio interface appears on your local computer.</p>
            
            <div className="appearance-options-list">
              <button 
                type="button" 
                className={`appearance-option-item ${selectedThemeOption === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun size={18} className="theme-icon light" />
                <div className="theme-option-text">
                  <div className="option-name">Light Theme</div>
                  <div className="option-desc">Off-white background, clean grid dividers</div>
                </div>
              </button>

              <button 
                type="button" 
                className={`appearance-option-item ${selectedThemeOption === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon size={18} className="theme-icon dark" />
                <div className="theme-option-text">
                  <div className="option-name">Dark Theme</div>
                  <div className="option-desc">Deep charcoal slate, high text contrast</div>
                </div>
              </button>

              <button 
                type="button" 
                className={`appearance-option-item ${selectedThemeOption === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <Laptop size={18} className="theme-icon system" />
                <div className="theme-option-text">
                  <div className="option-name">System Default</div>
                  <div className="option-desc">Auto-syncs color modes with your browser settings</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <style>{`
        .settings-page {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-header {
          margin-bottom: 0.5rem;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .page-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .settings-layout-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 850px) {
          .settings-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .settings-card {
          margin-bottom: 1.25rem;
          padding: 1.25rem;
        }

        .settings-card-title-flex {
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .settings-card-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .input-helper-text {
          font-size: 0.725rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          display: block;
        }

        .appearance-options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .appearance-option-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          font-family: var(--font-sans);
          transition: all 0.15s ease;
        }

        .appearance-option-item:hover {
          background-color: var(--bg-surface-hover);
        }

        .appearance-option-item.active {
          border-color: var(--accent-color);
          background-color: var(--bg-surface);
          box-shadow: 0 0 0 1px var(--accent-color);
        }

        .theme-icon {
          flex-shrink: 0;
        }
        .theme-icon.light { color: #f59e0b; }
        .theme-icon.dark { color: #6366f1; }
        .theme-icon.system { color: var(--text-secondary); }

        .theme-option-text {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .option-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .option-desc {
          font-size: 0.725rem;
          color: var(--text-secondary);
        }

        .settings-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
