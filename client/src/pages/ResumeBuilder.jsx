import React, { useEffect, useState } from 'react';
import { 
  Printer, ArrowUp, ArrowDown, Eye, EyeOff, 
  Settings, Type, Layout, Palette, Sparkles,
  Code, Database, Brain, Cpu, PenTool, Edit3, Plus, X
} from 'lucide-react';
import { api } from '../services/api';
import ResumePreview from '../components/ResumePreview';
import Toast from '../components/Toast';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const [editForm, setEditForm] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.personalInfo) {
      setEditForm({
        fullName: profile.personalInfo.fullName || '',
        title: profile.personalInfo.title || '',
        email: profile.personalInfo.email || '',
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || '',
        bio: profile.personalInfo.bio || ''
      });
    }
  }, [profile]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          ...editForm
        }
      };
      const res = await api.profile.update(updatedProfile);
      setProfile(res);
      setToastMsg("Resume details updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      setToastMsg("Failed to update resume details.");
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
    
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    setConfig(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  // Print helper
  const handlePrint = () => {
    document.body.classList.add('print-mode-active');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-mode-active');
    }, 1000);
  };

  // Preset Role Cards configurations
  const rolePresetsCatalog = [
    { id: 'software_frontend', name: 'Front-End Dev', desc: 'React, TS, Tailwind CSS', icon: Code, layout: 'Modern Developer' },
    { id: 'software_backend', name: 'Back-End Eng', desc: 'Node.js, Docker, REST APIs', icon: Database, layout: 'Modern Developer' },
    { id: 'ml_vision', name: 'Computer Vision', desc: 'PyTorch, CUDA, GPUs', icon: Brain, layout: 'Clean Academic' },
    { id: 'ml_nlp', name: 'NLP Scientist', desc: 'Transformers, LLMs', icon: Cpu, layout: 'Clean Academic' },
    { id: 'creator_designer', name: 'UI/UX Designer', desc: 'Figma mockups, design layouts', icon: Palette, layout: 'Minimal Professional' },
    { id: 'creator_writer', name: 'Tech Writer', desc: 'Markdown scripts, API documentation', icon: PenTool, layout: 'Minimal Professional' }
  ];

  const handleStartFromScratch = async () => {
    if (window.confirm("Do you want to clear the sample data and start from scratch with your own custom profile details?")) {
      try {
        setLoading(true);
        // Put a default blank profile structure
        const defaultBlank = {
          personalInfo: { fullName: "My Name", title: "My Professional Title", email: "my.email@domain.com", phone: "", location: "", bio: "", website: "", avatar: "" },
          socialLinks: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          achievements: []
        };
        await api.profile.update(defaultBlank);
        setProfile(defaultBlank);
        setConfig(prev => ({ ...prev, template: 'Minimal Professional' }));
        setToastMsg("Cleared workspace! Start customizing your resume.");
      } catch (err) {
        setToastMsg("Failed to initialize blank profile.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUseTemplateLayoutOnly = (layout) => {
    setConfig(prev => ({ ...prev, template: layout }));
    setToastMsg(`Activated layout: ${layout} using your profile details!`);
    setSelectedRole(null);
  };

  const handleLoadSampleContent = async (roleId, roleName) => {
    try {
      setLoading(true);
      const res = await api.profile.loadTemplate(roleId);
      setProfile(res.profile);
      setToastMsg(`Loaded ${roleName} sample content and layout!`);
      setSelectedRole(null);
    } catch (err) {
      setToastMsg("Failed to load sample content.");
    } finally {
      setLoading(false);
    }
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(true)}>
            <Edit3 size={16} />
            <span>Edit Resume Details</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      <div className="builder-workspace-grid">
        {/* Left Side: Controls panel */}
        <div className="builder-controls-col">
          
          {/* Skeletons Picker */}
          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Sparkles size={16} />
              <span>Choose a Template</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Select a visual mockup to configure your layout, or load sample content.
            </p>
            
            <div className="role-templates-grid">
              {/* Creator from Scratch Card */}
              <button
                type="button"
                className="role-preset-card scratch-card"
                onClick={handleStartFromScratch}
              >
                <div className="role-card-icon-wrapper scratch-icon">
                  <Plus size={16} />
                </div>
                <div className="role-card-info">
                  <span className="role-name">Create Your Own</span>
                  <span className="role-desc">Start clean template</span>
                </div>
              </button>

              {/* Preset Skeletons */}
              {rolePresetsCatalog.map(role => {
                const RoleIcon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    className="role-preset-card"
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="role-card-icon-wrapper">
                      <RoleIcon size={16} />
                    </div>
                    <div className="role-card-info">
                      <span className="role-name">{role.name}</span>
                      <span className="role-desc">{role.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Design Customizations */}
          <div className="card control-group-card">
            <h3 className="control-card-heading">
              <Layout size={16} />
              <span>Layout Styles</span>
            </h3>
            
            <div className="form-group">
              <label className="form-label" style={{ marginBottom: '0.75rem' }}>Select Design Preset</label>
              
              <div className="visual-template-grid">
                {[
                  { name: 'Minimal Professional', desc: 'Classic single-column corporate layout', color: '#64748b' },
                  { name: 'Modern Developer', desc: 'Tech-focused two-column design', color: '#6366f1' },
                  { name: 'Clean Academic', desc: 'Elegant serif layout for placements', color: '#10b981' }
                ].map(tpl => (
                  <button
                    key={tpl.name}
                    type="button"
                    className={`visual-template-card ${config.template === tpl.name ? 'active' : ''}`}
                    onClick={() => setConfig({ ...config, template: tpl.name })}
                  >
                    <div className="template-card-preview-icon" style={{ borderTopColor: tpl.color }}>
                      <div className="mock-lines">
                        <div className="mock-line-title" style={{ backgroundColor: tpl.color }} />
                        <div className="mock-line-sub" />
                        <div className="mock-line-body" />
                        <div className="mock-line-body" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div className="template-card-meta">
                      <span className="name">{tpl.name}</span>
                      <span className="desc">{tpl.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
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

      {/* 1. TEMPLATE OPTION CHOOSE MODAL (Canva Style) */}
      {selectedRole && (
        <div className="builder-modal-overlay">
          <div className="builder-modal-card">
            <div className="modal-header">
              <h3>{selectedRole.name} Preset Option</h3>
              <button className="modal-close-btn" onClick={() => setSelectedRole(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-intro">
                You selected the **{selectedRole.name}** layout template. How would you like to load it?
              </p>
              
              <div className="modal-options-row">
                {/* Option A: Inject personal details */}
                <div className="modal-option-box">
                  <h4>Use Template Only</h4>
                  <p>Apply this resume layout style but keep your <strong>own custom profile details</strong> (projects, name, credentials).</p>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleUseTemplateLayoutOnly(selectedRole.layout)}
                  >
                    Replace with My Details
                  </button>
                </div>

                {/* Option B: Load Full Sample */}
                <div className="modal-option-box highlight-box">
                  <h4>Load Full Sample Content</h4>
                  <p>Overwrite the workspace with the pre-seeded mock profile data (projects, skills, achievements) to edit and start.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleLoadSampleContent(selectedRole.id, selectedRole.name)}
                  >
                    Load Sample Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. QUICK EDIT PROFILE DETAILS MODAL */}
      {isEditModalOpen && (
        <div className="builder-modal-overlay">
          <div className="builder-modal-card edit-details-modal">
            <div className="modal-header">
              <h3>Quick Edit Resume Details</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editForm.fullName} 
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editForm.title} 
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                  required 
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editForm.email} 
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.phone} 
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editForm.location} 
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea 
                  className="form-textarea" 
                  value={editForm.bio} 
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-surface-hover);
        }

        .section-item-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .section-name-label.text-muted-line {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .section-item-actions {
          display: flex;
          gap: 0.25rem;
        }

        .order-btn {
          background-color: var(--bg-surface);
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

        /* Visual Templates & Role Skeletons Canva-style Layouts */
        .visual-template-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .visual-template-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-surface);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .visual-template-card:hover {
          border-color: var(--border-hover);
          background-color: var(--bg-surface-hover);
          transform: translateY(-1px);
        }

        .visual-template-card.active {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
        }

        .template-card-preview-icon {
          width: 44px;
          height: 52px;
          border-top: 3px solid;
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 4px;
          background-color: var(--bg-surface);
          flex-shrink: 0;
        }

        .mock-lines {
          display: flex;
          flex-direction: column;
          gap: 3px;
          height: 100%;
          justify-content: center;
        }

        .mock-line-title {
          height: 4px;
          width: 60%;
          border-radius: 1px;
        }

        .mock-line-sub {
          height: 2px;
          width: 40%;
          background-color: var(--border-color);
          border-radius: 0.5px;
        }

        .mock-line-body {
          height: 2px;
          width: 100%;
          background-color: var(--border-color);
          border-radius: 0.5px;
        }

        .template-card-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .template-card-meta .name {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .template-card-meta .desc {
          font-size: 0.7rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .role-templates-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .role-preset-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-surface);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }

        .role-preset-card:hover {
          border-color: var(--border-hover);
          background-color: var(--bg-surface-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .scratch-card {
          border-style: dashed;
          border-color: var(--text-muted);
        }

        .scratch-card:hover {
          border-color: var(--accent-color);
        }

        .role-card-icon-wrapper {
          color: var(--accent-color);
          background-color: var(--accent-light);
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .scratch-icon {
          color: var(--text-secondary);
          background-color: var(--border-color);
        }

        .role-preset-card:hover .scratch-icon {
          color: var(--accent-color);
          background-color: var(--accent-light);
        }

        .role-card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .role-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .role-desc {
          font-size: 0.65rem;
          color: var(--text-secondary);
          line-height: 1.2;
        }

        .resume-builder-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Modal Overlays (Canva Style) */
        .builder-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .builder-modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 540px;
          overflow: hidden;
          animation: modalFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .edit-details-modal {
          max-width: 600px;
        }

        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-surface-hover);
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
        }

        .modal-close-btn:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-intro {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .modal-options-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 500px) {
          .modal-options-row {
            grid-template-columns: 1fr;
          }
        }

        .modal-option-box {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: var(--bg-surface);
        }

        .modal-option-box h4 {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .modal-option-box p {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.4;
          flex-grow: 1;
        }

        .highlight-box {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
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
