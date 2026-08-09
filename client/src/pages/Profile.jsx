import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Link as LinkIcon, 
  MapPin, Mail, Phone, BookOpen, GraduationCap, Award, Compass, BadgeCheck
} from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Modals & Delete dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edu', 'skill', 'cert', 'ach'
  const [editItem, setEditItem] = useState(null); // holds record to edit
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id }
  
  // Form States
  const [personalForm, setPersonalForm] = useState({
    fullName: '', title: '', email: '', phone: '', location: '', bio: '', website: '', avatar: ''
  });
  
  // social links
  const [socials, setSocials] = useState([]);
  const [newSocial, setNewSocial] = useState({ platform: 'GitHub', url: '' });

  // Modal forms
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', cgpa: '', description: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Programming Languages', level: 'Intermediate' });
  const [certForm, setCertForm] = useState({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
  const [achForm, setAchForm] = useState({ title: '', description: '', date: '', issuer: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      setProfile(data);
      if (data.personalInfo) {
        setPersonalForm({
          fullName: data.personalInfo.fullName || '',
          title: data.personalInfo.title || '',
          email: data.personalInfo.email || '',
          phone: data.personalInfo.phone || '',
          location: data.personalInfo.location || '',
          bio: data.personalInfo.bio || '',
          website: data.personalInfo.website || '',
          avatar: data.personalInfo.avatar || ''
        });
      }
      setSocials(data.socialLinks || []);
    } catch (err) {
      showToast("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  // Personal Info Form Submission
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (!personalForm.fullName || !personalForm.email) {
      showToast("Full Name and Email are required.", "error");
      return;
    }
    try {
      const updated = await api.profile.update({
        personalInfo: personalForm,
        socialLinks: socials
      });
      setProfile(updated);
      showToast("Personal info updated successfully!");
    } catch (err) {
      showToast("Failed to update personal info.", "error");
    }
  };

  // Social Links Handlers
  const addSocialLink = () => {
    if (!newSocial.url) return;
    
    // Check if platform already exists
    if (socials.some(s => s.platform.toLowerCase() === newSocial.platform.toLowerCase())) {
      showToast(`Social link for ${newSocial.platform} already exists.`, "error");
      return;
    }

    const updatedSocials = [...socials, { id: 'soc_' + Date.now(), ...newSocial }];
    setSocials(updatedSocials);
    setNewSocial({ platform: 'GitHub', url: '' });
    
    // Auto-save changes
    api.profile.update({ socialLinks: updatedSocials })
      .then(updated => setProfile(updated))
      .catch(() => showToast("Failed to save social handles.", "error"));
  };

  const removeSocialLink = (id) => {
    const updatedSocials = socials.filter(s => s.id !== id);
    setSocials(updatedSocials);
    
    // Auto-save changes
    api.profile.update({ socialLinks: updatedSocials })
      .then(updated => setProfile(updated))
      .catch(() => showToast("Failed to remove social handle.", "error"));
  };

  // Modal Open for Add/Edit
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    
    if (type === 'edu') {
      setEduForm(item ? { ...item } : { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', cgpa: '', description: '' });
    } else if (type === 'skill') {
      setSkillForm(item ? { ...item } : { name: '', category: 'Programming Languages', level: 'Intermediate' });
    } else if (type === 'cert') {
      setCertForm(item ? { ...item } : { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
    } else if (type === 'ach') {
      setAchForm(item ? { ...item } : { title: '', description: '', date: '', issuer: '' });
    }
    
    setIsModalOpen(true);
  };

  // Modal Submit Handlers
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'edu') {
        if (!eduForm.institution || !eduForm.degree) return showToast("Institution and Degree are required.", "error");
        
        const profileData = { ...profile };
        if (editItem) {
          profileData.education = profileData.education.map(e => e.id === editItem.id ? { ...eduForm, id: editItem.id } : e);
        } else {
          eduForm.id = 'edu_' + Date.now();
          profileData.education.push(eduForm);
        }
        await api.profile.update({ education: profileData.education });
        showToast(editItem ? "Education updated!" : "Education record added!");
        
      } else if (modalType === 'skill') {
        if (!skillForm.name) return showToast("Skill name is required.", "error");
        
        const profileData = { ...profile };
        if (editItem) {
          profileData.skills = profileData.skills.map(s => s.id === editItem.id ? { ...skillForm, id: editItem.id } : s);
        } else {
          skillForm.id = 'sk_' + Date.now();
          profileData.skills.push(skillForm);
        }
        await api.profile.update({ skills: profileData.skills });
        showToast(editItem ? "Skill level updated!" : "New skill added!");
        
      } else if (modalType === 'cert') {
        if (!certForm.name || !certForm.issuer) return showToast("Certification Name and Issuer are required.", "error");
        
        const profileData = { ...profile };
        if (editItem) {
          profileData.certifications = profileData.certifications.map(c => c.id === editItem.id ? { ...certForm, id: editItem.id } : c);
        } else {
          certForm.id = 'cert_' + Date.now();
          profileData.certifications.push(certForm);
        }
        await api.profile.update({ certifications: profileData.certifications });
        showToast(editItem ? "Certification updated!" : "Certification added!");
        
      } else if (modalType === 'ach') {
        if (!achForm.title) return showToast("Title is required.", "error");
        
        const profileData = { ...profile };
        if (editItem) {
          profileData.achievements = profileData.achievements.map(a => a.id === editItem.id ? { ...achForm, id: editItem.id } : a);
        } else {
          achForm.id = 'ach_' + Date.now();
          profileData.achievements.push(achForm);
        }
        await api.profile.update({ achievements: profileData.achievements });
        showToast(editItem ? "Achievement updated!" : "Achievement listed!");
      }
      
      setIsModalOpen(false);
      fetchProfile();
    } catch (err) {
      showToast("Failed to save changes.", "error");
    }
  };

  // Delete Prompt
  const promptDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setIsDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    
    try {
      const profileData = { ...profile };
      if (type === 'edu') {
        profileData.education = profileData.education.filter(e => e.id !== id);
        await api.profile.update({ education: profileData.education });
        showToast("Education record deleted.");
      } else if (type === 'skill') {
        profileData.skills = profileData.skills.filter(s => s.id !== id);
        await api.profile.update({ skills: profileData.skills });
        showToast("Skill deleted.");
      } else if (type === 'cert') {
        profileData.certifications = profileData.certifications.filter(c => c.id !== id);
        await api.profile.update({ certifications: profileData.certifications });
        showToast("Certification deleted.");
      } else if (type === 'ach') {
        profileData.achievements = profileData.achievements.filter(a => a.id !== id);
        await api.profile.update({ achievements: profileData.achievements });
        showToast("Achievement deleted.");
      }
      
      fetchProfile();
    } catch (err) {
      showToast("Deletion failed.", "error");
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading professional profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header-row">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-desc">Add details about your skills, education, and achievements here. They sync with the resume and portfolio templates instantly.</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="profile-tabs">
        <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
          Personal & Socials
        </button>
        <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
          Skills Matrix
        </button>
        <button className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>
          Education
        </button>
        <button className={`tab-btn ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
          Credentials & Honors
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-panel">
        
        {/* Personal & Socials */}
        {activeTab === 'personal' && (
          <div className="grid-2">
            {/* Personal Form */}
            <form onSubmit={handlePersonalSubmit} className="card">
              <h3 className="card-title">Personal Information</h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="form-input"
                  value={personalForm.fullName}
                  onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="title">Professional Title</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI & Full Stack Developer"
                  value={personalForm.title}
                  onChange={(e) => setPersonalForm({ ...personalForm, title: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="text"
                    className="form-input"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bangalore, India"
                    value={personalForm.location}
                    onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="website">Personal Website</label>
                  <input
                    id="website"
                    type="url"
                    className="form-input"
                    placeholder="https://"
                    value={personalForm.website}
                    onChange={(e) => setPersonalForm({ ...personalForm, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">Professional Summary / Bio</label>
                <textarea
                  id="bio"
                  className="form-textarea"
                  rows={4}
                  value={personalForm.bio}
                  onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary">Save Personal Info</button>
            </form>

            {/* Socials Handles */}
            <div className="card">
              <h3 className="card-title">Social Links</h3>
              <div className="socials-list">
                {socials.map((social) => (
                  <div key={social.id} className="social-item">
                    <div className="social-left">
                      <LinkIcon size={16} className="social-icon" />
                      <div>
                        <div className="social-platform">{social.platform}</div>
                        <a href={social.url} className="social-url" target="_blank" rel="noopener noreferrer">{social.url}</a>
                      </div>
                    </div>
                    <button className="btn-icon danger-icon" onClick={() => removeSocialLink(social.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-social-form">
                <h4 className="sub-title">Add Social Profile</h4>
                <div className="form-group grid-2">
                  <div>
                    <label className="form-label">Platform</label>
                    <select 
                      className="form-select"
                      value={newSocial.platform} 
                      onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    >
                      <option>GitHub</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                      <option>LeetCode</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">URL Link</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    />
                  </div>
                </div>
                <button type="button" className="btn btn-secondary" onClick={addSocialLink}>
                  <Plus size={14} />
                  <span>Add social link</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skills Panel */}
        {activeTab === 'skills' && (
          <div className="card">
            <div className="card-header-flex">
              <h3 className="card-title">Technical & Professional Skills</h3>
              <button className="btn btn-primary btn-sm" onClick={() => openModal('skill')}>
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            {profile?.skills?.length > 0 ? (
              <div className="skills-grid">
                {/* Grouping skills by category */}
                {Array.from(new Set(profile.skills.map(s => s.category))).map(category => (
                  <div key={category} className="skills-category-group">
                    <h4 className="category-title">{category}</h4>
                    <div className="skills-pill-container">
                      {profile.skills.filter(s => s.category === category).map(skill => (
                        <div key={skill.id} className="skill-pill">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-lvl">{skill.level}</span>
                          <button className="pill-action edit" onClick={() => openModal('skill', skill)}><Edit2 size={12} /></button>
                          <button className="pill-action del" onClick={() => promptDelete('skill', skill.id)}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tab-empty-state">
                <Compass size={40} className="empty-state-icon" />
                <h4>No Skills Added Yet</h4>
                <p>Define your core technical skills to reflect them on your resume templates.</p>
                <button className="btn btn-secondary" onClick={() => openModal('skill')}>Add your first skill</button>
              </div>
            )}
          </div>
        )}

        {/* Education Panel */}
        {activeTab === 'education' && (
          <div className="card">
            <div className="card-header-flex">
              <h3 className="card-title">Education History</h3>
              <button className="btn btn-primary btn-sm" onClick={() => openModal('edu')}>
                <Plus size={14} />
                <span>Add Education</span>
              </button>
            </div>

            {profile?.education?.length > 0 ? (
              <div className="list-items-container">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="history-item">
                    <div className="history-badge">
                      <GraduationCap size={20} />
                    </div>
                    <div className="history-info">
                      <div className="history-header">
                        <div>
                          <h4 className="institution-name">{edu.institution}</h4>
                          <div className="degree-details">{edu.degree} in {edu.fieldOfStudy}</div>
                        </div>
                        <div className="history-actions">
                          <button className="btn-icon" onClick={() => openModal('edu', edu)}><Edit2 size={14} /></button>
                          <button className="btn-icon danger-icon" onClick={() => promptDelete('edu', edu.id)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="meta-row">
                        <span className="year-span">{edu.startYear} – {edu.endYear}</span>
                        {edu.cgpa && <span className="cgpa-text">CGPA: {edu.cgpa}</span>}
                      </div>
                      {edu.description && <p className="item-description">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tab-empty-state">
                <BookOpen size={40} className="empty-state-icon" />
                <h4>No Education History Listed</h4>
                <p>Enter your academic records and degree paths to build standard resume headers.</p>
                <button className="btn btn-secondary" onClick={() => openModal('edu')}>Add education record</button>
              </div>
            )}
          </div>
        )}

        {/* Certifications & Achievements Panel */}
        {activeTab === 'credentials' && (
          <div className="credentials-layout">
            {/* Certifications list */}
            <div className="card">
              <div className="card-header-flex">
                <h3 className="card-title">Certifications</h3>
                <button className="btn btn-primary btn-sm" onClick={() => openModal('cert')}>
                  <Plus size={14} />
                  <span>Add Cert</span>
                </button>
              </div>

              {profile?.certifications?.length > 0 ? (
                <div className="list-items-container">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="history-item text-compact">
                      <div className="history-badge badge-green">
                        <BadgeCheck size={20} />
                      </div>
                      <div className="history-info">
                        <div className="history-header">
                          <div>
                            <h4 className="institution-name">{cert.name}</h4>
                            <div className="degree-details">Issued by {cert.issuer}</div>
                          </div>
                          <div className="history-actions">
                            <button className="btn-icon" onClick={() => openModal('cert', cert)}><Edit2 size={12} /></button>
                            <button className="btn-icon danger-icon" onClick={() => promptDelete('cert', cert.id)}><Trash2 size={12} /></button>
                          </div>
                        </div>
                        <div className="meta-row">
                          <span className="year-span">Issued: {cert.issueDate}</span>
                          {cert.credentialId && <span className="cgpa-text">ID: {cert.credentialId}</span>}
                        </div>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} className="credential-link" target="_blank" rel="noopener noreferrer">
                            View Credentials →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tab-empty-state">
                  <BadgeCheck size={36} className="empty-state-icon" />
                  <h4>No Certifications</h4>
                  <p>Add professional certifications (AWS, Azure, TensorFlow, etc.).</p>
                </div>
              )}
            </div>

            {/* Achievements list */}
            <div className="card">
              <div className="card-header-flex">
                <h3 className="card-title">Achievements</h3>
                <button className="btn btn-primary btn-sm" onClick={() => openModal('ach')}>
                  <Plus size={14} />
                  <span>Add Achievement</span>
                </button>
              </div>

              {profile?.achievements?.length > 0 ? (
                <div className="list-items-container">
                  {profile.achievements.map((ach) => (
                    <div key={ach.id} className="history-item text-compact">
                      <div className="history-badge badge-orange">
                        <Award size={20} />
                      </div>
                      <div className="history-info">
                        <div className="history-header">
                          <div>
                            <h4 className="institution-name">{ach.title}</h4>
                            {ach.issuer && <div className="degree-details">{ach.issuer}</div>}
                          </div>
                          <div className="history-actions">
                            <button className="btn-icon" onClick={() => openModal('ach', ach)}><Edit2 size={12} /></button>
                            <button className="btn-icon danger-icon" onClick={() => promptDelete('ach', ach.id)}><Trash2 size={12} /></button>
                          </div>
                        </div>
                        <div className="meta-row">
                          <span className="year-span">Date: {ach.date}</span>
                        </div>
                        {ach.description && <p className="item-description">{ach.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tab-empty-state">
                  <Award size={36} className="empty-state-icon" />
                  <h4>No Achievements</h4>
                  <p>Add competition successes, hackathons won, or scholarships earned.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CRUD Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editItem ? `Edit ${modalType === 'edu' ? 'Education' : modalType === 'skill' ? 'Skill' : modalType === 'cert' ? 'Certification' : 'Achievement'}` : `Add ${modalType === 'edu' ? 'Education' : modalType === 'skill' ? 'Skill' : modalType === 'cert' ? 'Certification' : 'Achievement'}`}
      >
        <form onSubmit={handleModalSubmit}>
          {/* Education Form */}
          {modalType === 'edu' && (
            <div className="modal-form-fields">
              <div className="form-group">
                <label className="form-label">Institution / University</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={eduForm.institution} 
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. IIIT Bangalore"
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={eduForm.degree} 
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="e.g. B.Tech, M.Tech"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Field of Study</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={eduForm.fieldOfStudy} 
                    onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Start Year</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={eduForm.startYear} 
                    onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                    placeholder="e.g. 2022"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Year (or Expected)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={eduForm.endYear} 
                    onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                    placeholder="e.g. 2026"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA / Percentage</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={eduForm.cgpa} 
                    onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                    placeholder="e.g. 9.2/10"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  value={eduForm.description} 
                  onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                  placeholder="List relevant coursework, club roles, or honors."
                />
              </div>
            </div>
          )}

          {/* Skill Form */}
          {modalType === 'skill' && (
            <div className="modal-form-fields">
              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={skillForm.name} 
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Python, React"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                >
                  <option>Programming Languages</option>
                  <option>Web Technologies</option>
                  <option>Frameworks</option>
                  <option>Databases</option>
                  <option>AI/ML</option>
                  <option>Tools</option>
                  <option>Soft Skills</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proficiency Level</label>
                <select 
                  className="form-select"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          )}

          {/* Certification Form */}
          {modalType === 'cert' && (
            <div className="modal-form-fields">
              <div className="form-group">
                <label className="form-label">Certification Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={certForm.name} 
                  onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                  placeholder="e.g. AWS Developer Associate"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organization</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={certForm.issuer} 
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={certForm.issueDate} 
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="YYYY-MM"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={certForm.expiryDate} 
                    onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                    placeholder="YYYY-MM"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Credential ID (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={certForm.credentialId} 
                  onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Credential URL (Optional)</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={certForm.credentialUrl} 
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  placeholder="https://"
                />
              </div>
            </div>
          )}

          {/* Achievement Form */}
          {modalType === 'ach' && (
            <div className="modal-form-fields">
              <div className="form-group">
                <label className="form-label">Achievement Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={achForm.title} 
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                  placeholder="e.g. 1st Place Smart Agriculture Hackathon"
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Issuing Organization / Host</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={achForm.issuer} 
                    onChange={(e) => setAchForm({ ...achForm, issuer: e.target.value })}
                    placeholder="e.g. Smart India Hackathon"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={achForm.date} 
                    onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                    placeholder="YYYY-MM"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  value={achForm.description} 
                  onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                  placeholder="Detail your contribution, team size, and outcome."
                />
              </div>
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Details</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone and will update your portfolio/resumes instantly."
      />

      {/* Toast Alert */}
      {toastMsg && (
        <Toast 
          message={toastMsg} 
          type={toastType} 
          onClose={() => setToastMsg('')} 
        />
      )}

      <style>{`
        .profile-page {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .profile-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          padding-bottom: 1px;
        }

        .tab-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 1.25rem;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
          font-weight: 600;
        }

        .tab-panel {
          margin-top: 0.5rem;
        }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
        }

        .card-header-flex .card-title {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        /* Social Handles list */
        .socials-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .social-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
        }

        .social-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-icon {
          color: var(--text-secondary);
        }

        .social-platform {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .social-url {
          font-size: 0.725rem;
          color: var(--text-secondary);
        }

        .add-social-form {
          border-top: 1px solid var(--border-color);
          padding-top: 1.25rem;
        }

        .sub-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        /* Skills Pill Layout */
        .skills-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .skills-category-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .skills-pill-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-pill {
          background-color: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.375rem 0.625rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .skill-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .skill-lvl {
          font-size: 0.675rem;
          background-color: var(--accent-light);
          color: var(--accent-color);
          padding: 1px 4px;
          border-radius: 2px;
          font-weight: 600;
        }

        .pill-action {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.125rem;
          border-radius: 2px;
        }

        .pill-action.edit { color: var(--text-secondary); }
        .pill-action.del { color: var(--text-muted); }
        .pill-action.edit:hover { color: var(--accent-color); background-color: var(--bg-surface); }
        .pill-action.del:hover { color: var(--danger-color); background-color: var(--bg-surface); }

        /* History items list */
        .list-items-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .history-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .history-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .history-badge {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background-color: var(--accent-light);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .badge-green {
          background-color: var(--success-light);
          color: var(--success-color);
        }

        .badge-orange {
          background-color: var(--warning-light);
          color: var(--warning-color);
        }

        .history-info {
          flex-grow: 1;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .institution-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.125rem;
        }

        .degree-details {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 0.375rem;
          border-radius: var(--radius-sm);
        }

        .btn-icon:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .btn-icon.danger-icon:hover {
          color: var(--danger-color);
        }

        .meta-row {
          display: flex;
          gap: 1rem;
          font-size: 0.775rem;
          color: var(--text-muted);
          margin: 0.25rem 0;
        }

        .cgpa-text {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .item-description {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-top: 0.5rem;
        }

        .credential-link {
          font-size: 0.775rem;
          color: var(--accent-color);
          font-weight: 500;
          display: inline-block;
          margin-top: 0.25rem;
        }

        /* Credentials Column grid */
        .credentials-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 850px) {
          .credentials-layout {
            grid-template-columns: 1fr;
          }
        }

        .text-compact .history-badge {
          width: 32px;
          height: 32px;
        }

        .text-compact .institution-name {
          font-size: 0.9rem;
        }

        /* Empty states inside tabs */
        .tab-empty-state {
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-state-icon {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .tab-empty-state h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0;
        }

        .tab-empty-state p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          max-width: 300px;
          margin-bottom: 1rem;
        }

        .profile-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .modal-form-fields {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
      `}</style>
    </div>
  );
}
