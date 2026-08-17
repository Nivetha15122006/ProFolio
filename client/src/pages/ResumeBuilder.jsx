import React, { useEffect, useState } from 'react';
import { 
  Printer, ArrowUp, ArrowDown, Eye, EyeOff, 
  Settings, Type, Layout, Palette, Sparkles,
  Code, Database, Brain, Cpu, PenTool, Edit3, Plus, X, FileText
} from 'lucide-react';
import { api } from '../services/api';
import ResumePreview from '../components/ResumePreview';
import Toast from '../components/Toast';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [showingSampleFor, setShowingSampleFor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('personal');
  const [isDirty, setIsDirty] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingField, setAiLoadingField] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [editorMode, setEditorMode] = useState('visual');
  const [rawText, setRawText] = useState('');

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

  const [skillsText, setSkillsText] = useState('');
  const [projectsForm, setProjectsForm] = useState([]);
  const [educationForm, setEducationForm] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditForm({
        fullName: profile.personalInfo?.fullName || '',
        title: profile.personalInfo?.title || '',
        email: profile.personalInfo?.email || '',
        phone: profile.personalInfo?.phone || '',
        location: profile.personalInfo?.location || '',
        bio: profile.personalInfo?.bio || ''
      });
      if (profile.skills) {
        setSkillsText(profile.skills.map(s => s.name).join(', '));
      } else {
        setSkillsText('');
      }
      setProjectsForm(profile.projects || []);
      setEducationForm(profile.education || []);
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
      // Map skills text back to array
      const parsedSkills = skillsText.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map((name, i) => {
          const existing = profile.skills?.find(s => s.name.toLowerCase() === name.toLowerCase());
          return {
            id: existing ? existing.id : `skill_${Date.now()}_${i}`,
            name,
            category: existing?.category || 'Core Competency',
            level: existing?.level || 'Expert'
          };
        });

      const updatedProfile = {
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          ...editForm
        },
        skills: parsedSkills,
        projects: projectsForm,
        education: educationForm
      };
      
      const res = await api.profile.update(updatedProfile);
      setProfile(res);
      setIsDirty(false);
      setToastMsg("Resume details updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      setToastMsg("Failed to update resume details.");
    }
  };

  const handleSaveDirectEdits = async () => {
    try {
      setLoading(true);
      const res = await api.profile.update(profile);
      setProfile(res);
      setIsDirty(false);
      setToastMsg("Direct resume changes saved to database!");
    } catch (err) {
      setToastMsg("Failed to save direct resume changes.");
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
    try {
      setLoading(true);
      // Fetch the actual user's custom details from the database (not blanked out, keeping their real details!)
      const originalData = await api.profile.get();
      setProfile(originalData);
      setIsDirty(false);
      setConfig(prev => ({ ...prev, template: 'Minimal Professional' }));
      setToastMsg("Loaded your own profile details! You can now edit and print.");
    } catch (err) {
      setToastMsg("Failed to load your profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplateLayoutOnly = async (layout) => {
    try {
      setLoading(true);
      const originalData = await api.profile.get();
      setProfile(originalData);
      setIsDirty(false);
      setConfig(prev => ({ ...prev, template: layout }));
      setToastMsg(`Activated layout: ${layout} using your profile details!`);
    } catch (err) {
      setToastMsg("Failed to reload your profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleContent = async (roleId, roleName, layout) => {
    try {
      setLoading(true);
      const res = await api.profile.loadTemplate(roleId);
      setProfile(res.profile);
      setIsDirty(false);
      setShowingSampleFor(roleName);
      setConfig(prev => ({ ...prev, template: layout }));
      setToastMsg(`Loaded ${roleName} sample content!`);
    } catch (err) {
      setToastMsg("Failed to load sample content.");
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceWithMyDetails = async () => {
    try {
      setLoading(true);
      const res = await api.profile.restoreBackup();
      setProfile(res.profile);
      setShowingSampleFor(null);
      setIsDirty(false);
      setToastMsg("Replaced template content with your own profile details!");
    } catch (err) {
      setToastMsg("Failed to replace template content.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiEnhanceBio = async () => {
    if (!editForm.bio) {
      setToastMsg("Please enter some summary text first!");
      return;
    }
    setAiLoading(true);
    setAiLoadingField('bio');
    setAiSuggestion(null);
    try {
      const res = await api.resume.enhanceText('bio', editForm.bio);
      setAiSuggestion({
        type: 'bio',
        original: editForm.bio,
        suggestion: res.enhancedText
      });
      setToastMsg("AI suggestion generated!");
    } catch (err) {
      setToastMsg("AI enhancement failed.");
    } finally {
      setAiLoading(false);
      setAiLoadingField(null);
    }
  };

  const handleAiEnhanceProject = async (index) => {
    const projectText = projectsForm[index].shortDesc;
    if (!projectText) {
      setToastMsg("Please enter some project description first!");
      return;
    }
    setAiLoading(true);
    setAiLoadingField(`project-${index}`);
    setAiSuggestion(null);
    try {
      const res = await api.resume.enhanceText('project', projectText);
      setAiSuggestion({
        type: 'project',
        index: index,
        original: projectText,
        suggestion: res.enhancedText
      });
      setToastMsg("AI suggestion generated!");
    } catch (err) {
      setToastMsg("AI enhancement failed.");
    } finally {
      setAiLoading(false);
      setAiLoadingField(null);
    }
  };

  const getProfileAsText = (prof) => {
    if (!prof) return '';
    const personal = prof.personalInfo || {};
    const skills = prof.skills || [];
    const projects = prof.projects || [];
    const education = prof.education || [];
    
    let text = `${personal.fullName || ''}\n`;
    if (personal.title) text += `${personal.title}\n`;
    if (personal.email || personal.phone || personal.location) {
      text += `${[personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')}\n`;
    }
    if (personal.bio) text += `\nProfessional Summary:\n${personal.bio}\n`;
    
    if (skills.length > 0) {
      text += `\nSkills: ${skills.map(s => s.name).join(', ')}\n`;
    }
    
    if (projects.length > 0) {
      text += `\nProjects:\n`;
      projects.forEach(p => {
        text += `- ${p.name}: ${p.shortDesc || ''}\n`;
      });
    }
    
    if (education.length > 0) {
      text += `\nEducation:\n`;
      education.forEach(e => {
        text += `- ${e.institution}: ${e.degree || ''} in ${e.fieldOfStudy || ''} (${e.startYear || ''} - ${e.endYear || ''})\n`;
      });
    }
    return text.trim();
  };

  const handleAiStructurize = async () => {
    if (!rawText.trim()) {
      setToastMsg("Please write some resume text first!");
      return;
    }
    setAiLoading(true);
    setAiLoadingField('structurize');
    try {
      const res = await api.resume.structurizeText(rawText);
      setProfile(res.profile);
      setIsDirty(false);
      setToastMsg("AI compiled your text and updated the resume preview!");
      setEditorMode('visual');
    } catch (err) {
      setToastMsg("AI Structurization failed. Please check formatting.");
    } finally {
      setAiLoading(false);
      setAiLoadingField(null);
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
          {/* Editor Mode Tab Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`p-btn ${editorMode === 'visual' ? 'p-btn-primary' : 'p-btn-secondary'}`}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', borderRadius: '4px' }}
              onClick={() => setEditorMode('visual')}
            >
              <Layout size={14} />
              Visual Designer
            </button>
            <button
              type="button"
              className={`p-btn ${editorMode === 'raw' ? 'p-btn-primary' : 'p-btn-secondary'}`}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', borderRadius: '4px' }}
              onClick={() => {
                setRawText(getProfileAsText(profile));
                setEditorMode('raw');
              }}
            >
              <FileText size={14} />
              Raw Text Editor
            </button>
          </div>

          {editorMode === 'visual' && (
            <>
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
                  <span className="role-desc">Use your own profile details</span>
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
                    onClick={() => handleLoadSampleContent(role.id, role.name, role.layout)}
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
            </>
          )}

          {editorMode === 'raw' && (
            <div className="card control-group-card">
              <h3 className="control-card-heading">
                <Sparkles size={16} />
                <span>AI Resume Copilot</span>
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                Type or paste your information in the blank document sheet on the right. Once ready, click compile below to instantly format and structure your resume!
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="p-btn p-btn-primary"
                  onClick={handleAiStructurize}
                  disabled={aiLoading}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem', fontWeight: 600, borderRadius: '4px' }}
                >
                  <Sparkles size={14} />
                  {aiLoading && aiLoadingField === 'structurize' ? 'AI Formatting...' : '✨ AI Compile & Format'}
                </button>
                <button
                  type="button"
                  className="p-btn p-btn-secondary"
                  onClick={() => setRawText('')}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px' }}
                >
                  Clear Document
                </button>
              </div>

              {aiLoading && aiLoadingField === 'structurize' && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--text-primary)', border: '1px solid var(--accent-color)', borderRadius: '6px', marginTop: '1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="ai-spinner-animate" style={{ width: '12px', height: '12px', border: '2px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                  <span>Gemini is reading your Word document and generating template records...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Resume interactive preview pane */}
        <div className="builder-preview-col">
          {showingSampleFor && (
            <div className="floating-save-bar sample-info-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0f2fe', border: '1px solid #3b82f6', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#0369a1', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600 }}>✨ Showing {showingSampleFor} template. Click here to replace with your details:</span>
              <button type="button" className="btn btn-primary" onClick={handleReplaceWithMyDetails} style={{ padding: '4px 12px', fontSize: '0.75rem', backgroundColor: '#0284c7', borderColor: '#0284c7' }}>
                Replace with My Details
              </button>
            </div>
          )}
          
          {isDirty && !showingSampleFor && (
            <div className="floating-save-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 600 }}>⚠️ You have unsaved direct resume edits! Click save to sync with database:</span>
              <button type="button" className="btn btn-primary" onClick={handleSaveDirectEdits} style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                Save Edits
              </button>
            </div>
          )}
          <div className="preview-viewport-container" style={editorMode === 'raw' ? { backgroundColor: 'var(--bg-app)', padding: '2rem 1rem' } : {}}>
            {editorMode === 'visual' ? (
              <ResumePreview 
                profile={profile} 
                config={config} 
                onProfileChange={(updated) => {
                  setProfile(updated);
                  setIsDirty(true);
                  setShowingSampleFor(null);
                }}
              />
            ) : (
              <div className="word-doc-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', alignItems: 'center' }}>
                <div className="word-doc-header" style={{ width: '100%', maxWidth: '820px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)', padding: '0.6rem 1.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} className="accent-text" />
                    <span style={{ fontWeight: 600 }}>raw_resume_scratchpad.txt</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>📝 Plain Text Mode</span>
                </div>
                
                <div className="word-doc-sheet" style={{ width: '100%', maxWidth: '820px', backgroundColor: '#ffffff', minHeight: '842px', padding: '3.5rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 8px rgba(0, 0, 0, 0.03)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}>
                  <textarea
                    className="word-doc-textarea"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    style={{ width: '100%', minHeight: '800px', border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: 'Segoe UI, Helvetica, Arial, sans-serif', fontSize: '1rem', lineHeight: '1.6', color: '#1e293b', padding: 0 }}
                    placeholder={`[Full Name]\n[Professional Title]\n[Email] | [Phone] | [Location]\n\nProfessional Summary:\nWrite your career bio here...\n\nSkills:\nReact, Node.js, Python, CSS...\n\nProjects:\n- Project Name: Describe what you built, tech stack, and impact metrics...\n\nEducation:\n- School Name: Degree Details (Start Year - End Year)`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* 2. TABBED QUICK EDIT DETAILS MODAL */}
      {isEditModalOpen && (
        <div className="builder-modal-overlay">
          <div className="builder-modal-card edit-details-modal">
            <div className="modal-header">
              <h3>Edit Resume Details</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-tab-bar">
              <button 
                type="button" 
                className={`modal-tab-btn ${activeEditTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveEditTab('personal')}
              >
                Personal Info
              </button>
              <button 
                type="button" 
                className={`modal-tab-btn ${activeEditTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveEditTab('skills')}
              >
                Skills
              </button>
              <button 
                type="button" 
                className={`modal-tab-btn ${activeEditTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveEditTab('projects')}
              >
                Projects ({projectsForm.length})
              </button>
              <button 
                type="button" 
                className={`modal-tab-btn ${activeEditTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveEditTab('education')}
              >
                Education ({educationForm.length})
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="modal-body" style={{ paddingTop: 0 }}>
              
              {/* Tab 1: Personal Info */}
              {activeEditTab === 'personal' && (
                <div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Professional Summary</label>
                      <button 
                        type="button" 
                        onClick={handleAiEnhanceBio} 
                        disabled={aiLoading}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
                      >
                        ✨ AI Optimize
                      </button>
                    </div>
                    <textarea 
                      className="form-textarea" 
                      value={editForm.bio} 
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      style={{ minHeight: '80px' }}
                    />
                  </div>

                  {aiLoading && aiLoadingField === 'bio' && (
                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--text-primary)', border: '1px solid var(--accent-color)', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="ai-spinner-animate" style={{ width: '12px', height: '12px', border: '2px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                      <span>Analyzing summary and rewriting...</span>
                    </div>
                  )}

                  {aiSuggestion && aiSuggestion.type === 'bio' && (
                    <div className="ai-suggestion-box" style={{ marginTop: '0.5rem', border: '1px solid var(--accent-color)', borderRadius: '6px', backgroundColor: 'var(--bg-surface-hover)', padding: '0.75rem', color: 'var(--text-primary)' }}>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', color: 'var(--accent-color)' }}>
                        <span>✨ Gemini AI Recommendation</span>
                      </h4>
                      <div style={{ fontSize: '0.7rem', lineHeight: '1.4', fontStyle: 'italic', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-color)', padding: '0.5rem', borderRadius: '4px', whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>
                        {aiSuggestion.suggestion}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setAiSuggestion(null)}
                          style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                        >
                          Dismiss
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={() => {
                            setEditForm({ ...editForm, bio: aiSuggestion.suggestion });
                            setAiSuggestion(null);
                            setToastMsg("AI summary suggestion applied!");
                          }}
                          style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Skills */}
              {activeEditTab === 'skills' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Core Skills (Comma-separated)</label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      List your key technical skills separated by commas (e.g. React, Node.js, Python, CSS)
                    </p>
                    <textarea 
                      className="form-textarea" 
                      value={skillsText} 
                      onChange={(e) => setSkillsText(e.target.value)}
                      style={{ minHeight: '150px' }}
                      placeholder="React, Node.js, Mongoose, Express, Docker..."
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Projects */}
              {activeEditTab === 'projects' && (
                <div className="modal-scroll-section" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {projectsForm.map((proj, idx) => (
                    <div key={idx} className="edit-modal-sub-card" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--bg-surface-hover)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-color)' }}>Project #{idx + 1}</span>
                        <button 
                          type="button" 
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => setProjectsForm(projectsForm.filter((_, i) => i !== idx))}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Project Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={proj.name} 
                          onChange={(e) => {
                            const updated = [...projectsForm];
                            updated[idx].name = e.target.value;
                            setProjectsForm(updated);
                          }}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Description</label>
                          <button 
                            type="button" 
                            onClick={() => handleAiEnhanceProject(idx)} 
                            disabled={aiLoading}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
                          >
                            ✨ AI Optimize
                          </button>
                        </div>
                        <textarea 
                          className="form-textarea" 
                          value={proj.shortDesc} 
                          onChange={(e) => {
                            const updated = [...projectsForm];
                            updated[idx].shortDesc = e.target.value;
                            setProjectsForm(updated);
                          }}
                          style={{ minHeight: '60px' }}
                        />
                      </div>

                      {aiLoading && aiLoadingField === `project-${idx}` && (
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--text-primary)', border: '1px solid var(--accent-color)', borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="ai-spinner-animate" style={{ width: '12px', height: '12px', border: '2px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                          <span>AI is formatting and adding metrics using STAR...</span>
                        </div>
                      )}

                      {aiSuggestion && aiSuggestion.type === 'project' && aiSuggestion.index === idx && (
                        <div className="ai-suggestion-box" style={{ marginTop: '0.5rem', border: '1px solid var(--accent-color)', borderRadius: '6px', backgroundColor: 'var(--bg-surface-hover)', padding: '0.75rem', color: 'var(--text-primary)' }}>
                          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem', color: 'var(--accent-color)' }}>
                            <span>✨ Gemini AI Recommendation</span>
                          </h4>
                          <div style={{ fontSize: '0.7rem', lineHeight: '1.4', fontStyle: 'italic', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border-color)', padding: '0.5rem', borderRadius: '4px', whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>
                            {aiSuggestion.suggestion}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={() => setAiSuggestion(null)}
                              style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                            >
                              Dismiss
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-primary" 
                              onClick={() => {
                                const updated = [...projectsForm];
                                updated[idx].shortDesc = aiSuggestion.suggestion;
                                setProjectsForm(updated);
                                setAiSuggestion(null);
                                setToastMsg("AI project suggestion applied!");
                              }}
                              style={{ fontSize: '0.65rem', padding: '2px 8px' }}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Technologies (Comma-separated)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')} 
                          onChange={(e) => {
                            const updated = [...projectsForm];
                            updated[idx].technologies = e.target.value.split(',').map(t => t.trim());
                            setProjectsForm(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setProjectsForm([...projectsForm, { id: `proj_${Date.now()}`, name: 'New Project', shortDesc: '', technologies: [] }])}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                  >
                    + Add New Project
                  </button>
                </div>
              )}

              {/* Tab 4: Education */}
              {activeEditTab === 'education' && (
                <div className="modal-scroll-section" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {educationForm.map((edu, idx) => (
                    <div key={idx} className="edit-modal-sub-card" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem', backgroundColor: 'var(--bg-surface-hover)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--accent-color)' }}>Education #{idx + 1}</span>
                        <button 
                          type="button" 
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                          onClick={() => setEducationForm(educationForm.filter((_, i) => i !== idx))}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Institution / School</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={edu.institution} 
                          onChange={(e) => {
                            const updated = [...educationForm];
                            updated[idx].institution = e.target.value;
                            setEducationForm(updated);
                          }}
                          required
                        />
                      </div>
                      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Degree / Class</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={edu.degree || ''} 
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].degree = e.target.value;
                              setEducationForm(updated);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>CGPA / Grade</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={edu.cgpa || ''} 
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].cgpa = e.target.value;
                              setEducationForm(updated);
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Start Year</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={edu.startYear || ''} 
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].startYear = e.target.value;
                              setEducationForm(updated);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>End Year</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={edu.endYear || ''} 
                            onChange={(e) => {
                              const updated = [...educationForm];
                              updated[idx].endYear = e.target.value;
                              setEducationForm(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setEducationForm([...educationForm, { id: `edu_${Date.now()}`, institution: 'New University', degree: '', cgpa: '', startYear: '', endYear: '' }])}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                  >
                    + Add New Education
                  </button>
                </div>
              )}

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
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

        .ai-spinner-animate {
          animation: ai-spin 0.8s linear infinite;
        }

        @keyframes ai-spin {
          to { transform: rotate(360deg); }
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

        /* Modal Quick Edit Tab Bar */
        .modal-tab-bar {
          display: flex;
          gap: 0.25rem;
          border-bottom: 1px solid var(--border-color);
          padding: 0.75rem 1.5rem 0.25rem 1.5rem;
          background-color: var(--bg-surface-hover);
        }

        .modal-tab-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }

        .modal-tab-btn:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .modal-tab-btn.active {
          background-color: var(--accent-color);
          color: #ffffff;
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
