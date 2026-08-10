import React, { useEffect, useState } from 'react';
import { 
  Globe, Eye, EyeOff, Layout, Palette, 
  ArrowUp, ArrowDown, ExternalLink, Save, CheckCircle
} from 'lucide-react';
import { api } from '../services/api';
import PortfolioPreview from '../components/PortfolioPreview';
import Toast from '../components/Toast';

export default function PortfolioBuilder() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [saving, setSaving] = useState(false);

  // Portfolio config states
  const [config, setConfig] = useState({
    template: 'Developer',
    theme: 'dark',
    heroStyle: 'minimalist',
    projectLayout: 'grid',
    visibleSections: {
      hero: true,
      about: true,
      skills: true,
      projects: true,
      education: true,
      certifications: true,
      achievements: true,
      contact: true
    },
    sectionOrder: ['hero', 'about', 'skills', 'projects', 'education', 'certifications', 'achievements', 'contact']
  });

  useEffect(() => {
    fetchProfileAndConfig();
  }, []);

  const fetchProfileAndConfig = async () => {
    try {
      setLoading(true);
      const profileData = await api.profile.get();
      setProfile(profileData);
      
      const portfolioConfig = await api.portfolio.get();
      if (portfolioConfig && portfolioConfig.template) {
        setConfig(portfolioConfig);
      }
    } catch (err) {
      showToast("Failed to load portfolio workspace.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.portfolio.update(config);
      showToast("Portfolio settings saved successfully!");
    } catch (err) {
      showToast("Failed to save portfolio settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section) => {
    setConfig(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section]
      }
    }));
  };

  const moveSection = (index, direction) => {
    const newOrder = [...config.sectionOrder];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    // Swap
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    setConfig(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  if (loading) {
    return <div className="portfolio-builder-loading">Loading portfolio builder...</div>;
  }

  return (
    <div className="portfolio-builder-page">
      <div className="builder-header-row">
        <div>
          <h1 className="page-title">Portfolio Builder</h1>
          <p className="page-desc">Customize your personal website templates and toggle visible items in real time.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a 
            href={`/p/${api.auth.getCurrentUser() || 'arjun'}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            <span>Open Public Site</span>
          </a>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="builder-workspace-grid">
        {/* Left Control Column */}
        <div className="builder-controls-col">
          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Layout size={16} />
              <span>Theme & Layout</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Portfolio Theme</label>
              <select 
                className="form-select"
                value={config.template}
                onChange={(e) => setConfig({ ...config, template: e.target.value })}
              >
                <option>Minimal</option>
                <option>Developer</option>
                <option>Editorial</option>
                <option>Corporate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Theme Mode</label>
              <select 
                className="form-select"
                value={config.theme}
                onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Project Layout Style</label>
              <select 
                className="form-select"
                value={config.projectLayout}
                onChange={(e) => setConfig({ ...config, projectLayout: e.target.value })}
              >
                <option value="grid">Grid (Side-by-Side)</option>
                <option value="list">List (Vertical Stack)</option>
              </select>
            </div>
          </div>

          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Palette size={16} />
              <span>Sections Manager</span>
            </h3>

            <div className="section-visibility-list">
              {config.sectionOrder.map((section, index) => {
                const isVisible = config.visibleSections[section];
                return (
                  <div key={section} className="section-control-item">
                    <div className="section-item-left">
                      <button 
                        type="button" 
                        className="visibility-toggle-btn"
                        onClick={() => toggleSection(section)}
                        title={isVisible ? "Hide Section" : "Show Section"}
                      >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} className="muted-text" />}
                      </button>
                      <span className={`section-name-label ${!isVisible ? 'text-muted-line' : ''}`}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    </div>

                    <div className="section-item-actions">
                      <button 
                        type="button" 
                        className="order-btn" 
                        disabled={index === 0} 
                        onClick={() => moveSection(index, -1)}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="order-btn" 
                        disabled={index === config.sectionOrder.length - 1} 
                        onClick={() => moveSection(index, 1)}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Preview Viewport */}
        <div className="builder-preview-col">
          <div className="portfolio-viewport-outer">
            <div className="viewport-header-row">
              <div className="mock-address-bar">
                <Globe size={12} />
                <span>arjunkumar.profolio.com</span>
              </div>
            </div>
            <div className="viewport-preview-area">
              <PortfolioPreview profile={profile} config={config} />
            </div>
          </div>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      <style>{`
        .portfolio-builder-page {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .builder-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .builder-workspace-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
        }

        @media (max-width: 992px) {
          .builder-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        .control-group-card {
          margin-bottom: 1rem;
          padding: 1.25rem;
        }

        .control-card-heading {
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
        }

        .section-visibility-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-control-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
        }

        .section-item-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .visibility-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--accent-color);
          display: flex;
          align-items: center;
        }

        .visibility-toggle-btn .muted-text {
          color: var(--text-muted);
        }

        .section-name-label {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .text-muted-line {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .section-item-actions {
          display: flex;
          gap: 0.25rem;
        }

        .order-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
        }

        .order-btn:hover:not(:disabled) {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .order-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Portfolio viewport wrapper */
        .builder-preview-col {
          flex-grow: 1;
        }

        .portfolio-viewport-outer {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-surface);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
        }

        @media (max-width: 992px) {
          .portfolio-viewport-outer {
            height: 600px;
          }
        }

        .viewport-header-row {
          background-color: var(--bg-surface-hover);
          border-bottom: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
        }

        .mock-address-bar {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 0.25rem 1.5rem;
          border-radius: 4px;
          font-size: 0.725rem;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          max-width: 320px;
        }

        .viewport-preview-area {
          flex-grow: 1;
          overflow-y: auto;
        }

        .portfolio-builder-loading {
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
