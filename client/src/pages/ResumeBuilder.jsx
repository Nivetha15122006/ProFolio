import React, { useEffect, useState } from 'react';
import { 
  Printer, ArrowUp, ArrowDown, Eye, EyeOff, 
  Settings, Type, Layout, Palette, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import ResumePreview from '../components/ResumePreview';
import Toast from '../components/Toast';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  
  // Resume configuration settings
  const [config, setConfig] = useState({
    template: 'Modern Developer',
    font: 'sans-serif',
    density: 'normal',
    accentColor: '#4f46e5',
    visibleSections: {
      summary: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      achievements: true
    },
    sectionOrder: ['summary', 'skills', 'projects', 'education', 'certifications', 'achievements']
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      setProfile(data);
    } catch (err) {
      setToastMsg("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  // Section visibility toggle
  const toggleSection = (section) => {
    setConfig(prev => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section]
      }
    }));
  };

  // Section ordering helpers
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

  // Print helper
  const handlePrint = () => {
    // Add print class to body
    document.body.classList.add('print-mode-active');
    window.print();
    // Remove after printing dialog closes
    setTimeout(() => {
      document.body.classList.remove('print-mode-active');
    }, 1000);
  };

  if (loading) {
    return <div className="resume-builder-loading">Loading resume builder...</div>;
  }

  return (
    <div className="resume-builder-page">
      <div className="builder-header-row">
        <div>
          <h1 className="page-title">Resume Builder</h1>
          <p className="page-desc">Style and print an ATS-ready resume populated directly from your profile data.</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          <span>Print / Download PDF</span>
        </button>
      </div>

      <div className="builder-workspace-grid">
        {/* Left Side: Controls panel */}
        <div className="builder-controls-col">
          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Layout size={16} />
              <span>Layout & Template</span>
            </h3>
            
            <div className="form-group">
              <label className="form-label">Template Design</label>
              <select 
                className="form-select"
                value={config.template}
                onChange={(e) => setConfig({ ...config, template: e.target.value })}
              >
                <option>Minimal Professional</option>
                <option>Modern Developer</option>
                <option>Clean Academic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Theme Accent Color</label>
              <div className="accent-color-pickers">
                {['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`accent-dot ${config.accentColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setConfig({ ...config, accentColor: color })}
                    aria-label={`Select accent color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Sparkles size={16} />
              <span>Role-Based Skeletons</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Select a professional template to instantly populate your dashboard workspace with resume data.
            </p>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select 
                className="form-select"
                defaultValue=""
                onChange={async (e) => {
                  const templateId = e.target.value;
                  if (!templateId) return;
                  
                  if (window.confirm("Are you sure you want to load this template? It will replace your current projects, skills, and profile details.")) {
                    try {
                      setLoading(true);
                      const res = await api.profile.loadTemplate(templateId);
                      setProfile(res.profile);
                      setToastMsg("Template loaded successfully!");
                    } catch (err) {
                      setToastMsg("Failed to load template.");
                    } finally {
                      setLoading(false);
                    }
                  }
                  e.target.value = "";
                }}
              >
                <option value="" disabled>-- Select a Preset Role --</option>
                <optgroup label="Software Developer Templates">
                  <option value="software_frontend">Front-End Developer (React/TS)</option>
                  <option value="software_backend">Back-End Engineer (Node/Docker)</option>
                </optgroup>
                <optgroup label="Machine Learning / AI Templates">
                  <option value="ml_vision">Computer Vision Engineer (PhD)</option>
                  <option value="ml_nlp">NLP Systems Scientist (MS)</option>
                </optgroup>
                <optgroup label="Content Creator Templates">
                  <option value="creator_designer">UI/UX Product Designer</option>
                  <option value="creator_writer">Technical Writer & Advocate</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Type size={16} />
              <span>Typography & Density</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Font Family</label>
              <select 
                className="form-select"
                value={config.font}
                onChange={(e) => setConfig({ ...config, font: e.target.value })}
              >
                <option value="sans-serif">Modern Sans-Serif</option>
                <option value="serif">Classic Serif</option>
                <option value="monospace">Developer Monospace</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Page Density</label>
              <select 
                className="form-select"
                value={config.density}
                onChange={(e) => setConfig({ ...config, density: e.target.value })}
              >
                <option value="compact">Compact (More content)</option>
                <option value="normal">Normal Spacing</option>
                <option value="loose">Loose (More whitespace)</option>
              </select>
            </div>
          </div>

          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Settings size={16} />
              <span>Section Controls</span>
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

        {/* Right Side: Resume interactive preview pane */}
        <div className="builder-preview-col">
          <div className="preview-viewport-container">
            <ResumePreview profile={profile} config={config} />
          </div>
        </div>
      </div>

      {toastMsg && (
        <Toast 
          message={toastMsg} 
          type={toastMsg.toLowerCase().includes('fail') ? 'error' : 'success'} 
          onClose={() => setToastMsg('')} 
        />
      )}

      <style>{`
        .resume-builder-page {
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
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: flex-start;
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

        .accent-color-pickers {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .accent-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .accent-dot.active {
          border-color: var(--text-primary);
          transform: scale(1.15);
        }

        /* Section visibility & ordering lists */
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

        /* Preview container wrapper */
        .builder-preview-col {
          flex-grow: 1;
        }

        .preview-viewport-container {
          background-color: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 2rem;
          max-height: calc(100vh - 180px);
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 992px) {
          .preview-viewport-container {
            padding: 1rem;
            max-height: none;
          }
        }

        .resume-builder-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Global Print Rule Injection */
        @media print {
          body.print-mode-active .app-sidebar,
          body.print-mode-active .mobile-header,
          body.print-mode-active .main-content-wrapper .builder-header-row,
          body.print-mode-active .main-content-wrapper .builder-controls-col {
            display: none !important;
          }
          
          body.print-mode-active .main-content-wrapper {
            margin-top: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          body.print-mode-active .main-content-scroll {
            padding: 0 !important;
            overflow: visible !important;
          }
          
          body.print-mode-active .builder-workspace-grid {
            grid-template-columns: 1fr !important;
            display: block !important;
          }
          
          body.print-mode-active .preview-viewport-container {
            border: none !important;
            background: none !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}
