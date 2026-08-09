import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, Award, CheckCircle2, AlertTriangle, 
  ArrowRight, ShieldCheck, Plus, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard({ currentUser }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Generate greeting based on local hour
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good morning');
    else if (hrs < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard workspace...</div>;
  }

  // Calculate scores dynamically based on the profile contents
  const calculateCompleteness = () => {
    if (!profile) return { score: 0, items: [] };
    
    let score = 0;
    const items = [];
    
    // Personal info
    const info = profile.personalInfo || {};
    if (info.fullName) { score += 15; items.push({ name: 'Full Name', ok: true }); }
    else { items.push({ name: 'Full Name', ok: false, tip: 'Add your full name under Personal Info.' }); }
    
    if (info.title) { score += 15; items.push({ name: 'Professional Title', ok: true }); }
    else { items.push({ name: 'Professional Title', ok: false, tip: 'Define your professional role (e.g. Full Stack Developer).' }); }
    
    if (info.email && info.phone) { score += 10; items.push({ name: 'Contact Information', ok: true }); }
    else { items.push({ name: 'Contact Information', ok: false, tip: 'Add your email and phone number to let recruiters reach out.' }); }
    
    if (info.bio && info.bio.length > 50) { score += 15; items.push({ name: 'About Me Bio', ok: true }); }
    else { items.push({ name: 'About Me Bio', ok: false, tip: 'Write a detailed bio (at least 50 chars) describing your developer focus.' }); }

    // Social Links
    const github = (profile.socialLinks || []).find(l => l.platform.toLowerCase() === 'github');
    const linkedin = (profile.socialLinks || []).find(l => l.platform.toLowerCase() === 'linkedin');
    
    if (github) { score += 10; items.push({ name: 'GitHub Handle', ok: true }); }
    else { items.push({ name: 'GitHub Handle', ok: false, tip: 'Connect your GitHub profile link to showcase repositories.' }); }

    if (linkedin) { score += 10; items.push({ name: 'LinkedIn Profile', ok: true }); }
    else { items.push({ name: 'LinkedIn Profile', ok: false, tip: 'Connect your LinkedIn link for professional credibility.' }); }

    // Arrays check
    if (profile.projects && profile.projects.length >= 2) { score += 10; items.push({ name: 'Projects (2+)', ok: true }); }
    else { items.push({ name: 'Projects (2+)', ok: false, tip: 'Add at least 2 technical projects with source links.' }); }

    if (profile.skills && profile.skills.length >= 4) { score += 5; items.push({ name: 'Skills (4+)', ok: true }); }
    else { items.push({ name: 'Skills (4+)', ok: false, tip: 'Add at least 4 tech skills (Programming, Databases, etc.).' }); }

    if (profile.education && profile.education.length >= 1) { score += 5; items.push({ name: 'Education Record', ok: true }); }
    else { items.push({ name: 'Education Record', ok: false, tip: 'Include your university or college educational credentials.' }); }

    if (profile.certifications && profile.certifications.length >= 1) { score += 5; items.push({ name: 'Certifications', ok: true }); }
    else { items.push({ name: 'Certifications', ok: false, tip: 'Add at least one professional certification.' }); }

    return { score, items };
  };

  const { score: completenessScore, items: checklist } = calculateCompleteness();
  const hasProjects = profile?.projects && profile.projects.length > 0;
  const suggestions = checklist.filter(item => !item.ok);

  return (
    <div className="dashboard-page">
      {/* Top Header Panel */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="welcome-text">{greeting}, {profile?.personalInfo?.fullName || currentUser}</h1>
          <p className="subtext-muted">Here is an overview of your portfolio status and improvement checklist.</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/profile')}>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats grid */}
      <div className="grid-3 stats-grid">
        <div className="card stats-card">
          <div className="stats-label">Profile Completion</div>
          <div className="stats-main-row">
            <span className="stats-number">{completenessScore}%</span>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${completenessScore}%` }} />
          </div>
        </div>

        <div className="card stats-card">
          <div className="stats-label">Resume Status</div>
          <div className="stats-main-row">
            <span className="stats-number">Ready</span>
            <span className="badge badge-primary">ATS Friendly</span>
          </div>
          <button className="btn-link-action" onClick={() => navigate('/resume-builder')}>
            <span>Resume Builder</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="card stats-card">
          <div className="stats-label">Portfolio completeness</div>
          <div className="stats-main-row">
            <span className="stats-number">{completenessScore >= 75 ? '92' : '78'}/100</span>
            <span className="badge badge-success">Online</span>
          </div>
          <button className="btn-link-action" onClick={() => navigate('/portfolio-builder')}>
            <span>Portfolio Preview</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Counts Row */}
      <div className="counts-row">
        <div className="count-item">
          <span className="count-val">{profile?.projects?.length || 0}</span>
          <span className="count-label">Projects</span>
        </div>
        <div className="count-item">
          <span className="count-val">{profile?.skills?.length || 0}</span>
          <span className="count-label">Skills</span>
        </div>
        <div className="count-item">
          <span className="count-val">{profile?.education?.length || 0}</span>
          <span className="count-label">Education</span>
        </div>
        <div className="count-item">
          <span className="count-val">{profile?.certifications?.length || 0}</span>
          <span className="count-label">Certificates</span>
        </div>
      </div>

      <div className="dashboard-layout-grid">
        {/* Left Side: Recent Projects & Quick Tools */}
        <div className="grid-main-col">
          <div className="card list-card">
            <div className="list-card-header">
              <h3 className="card-heading">Recent Projects</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>
            
            {hasProjects ? (
              <div className="project-simple-list">
                {profile.projects.slice(0, 3).map((proj) => (
                  <div key={proj.id} className="project-simple-item">
                    <div className="proj-info">
                      <h4 className="proj-name">{proj.name}</h4>
                      <p className="proj-desc">{proj.shortDesc}</p>
                      <div className="proj-tags">
                        {proj.technologies && proj.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="proj-tag-badge">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty">
                <FolderGit2 size={32} />
                <p>No projects added yet.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>
                  Create first project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Smart completeness recommendations */}
        <div className="grid-side-col">
          <div className="card checklist-card">
            <h3 className="card-heading flex-heading">
              <Sparkles size={16} className="spark-icon" />
              <span>Smart Suggestions</span>
            </h3>
            
            {suggestions.length > 0 ? (
              <div className="checklist-list">
                {suggestions.map((item, idx) => (
                  <div key={idx} className="checklist-item warning">
                    <AlertTriangle size={16} className="chk-icon warning-color-text" />
                    <div className="chk-text">
                      <div className="chk-label">{item.name} Incomplete</div>
                      <p className="chk-desc">{item.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="checklist-complete">
                <CheckCircle2 size={32} className="complete-icon" />
                <p className="complete-title">Profile 100% Complete!</p>
                <p className="complete-desc">Excellent work. Your resume and portfolio are fully optimized for application sharing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-text {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.125rem;
          letter-spacing: -0.02em;
        }

        .subtext-muted {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .stats-grid {
          margin-top: 0.5rem;
        }

        .stats-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem;
          min-height: 120px;
        }

        .stats-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .stats-main-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .stats-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
          margin-top: auto;
        }

        .progress-bar {
          height: 100%;
          background-color: var(--accent-color);
          border-radius: 3px;
        }

        .btn-link-action {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: none;
          color: var(--accent-color);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-top: auto;
          text-align: left;
          width: fit-content;
        }

        .btn-link-action:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }

        .counts-row {
          display: flex;
          justify-content: space-around;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .count-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .count-val {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .count-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .dashboard-layout-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .dashboard-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .list-card, .checklist-card {
          padding: 1.25rem;
          height: 100%;
        }

        .list-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .card-heading {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0;
        }

        .flex-heading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .spark-icon {
          color: var(--accent-color);
        }

        .project-simple-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .project-simple-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
        }

        .proj-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow: hidden;
          margin-right: 1rem;
        }

        .proj-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .proj-desc {
          font-size: 0.775rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .proj-tags {
          display: flex;
          gap: 0.375rem;
          margin-top: 0.25rem;
        }

        .proj-tag-badge {
          font-size: 0.65rem;
          background-color: var(--border-color);
          padding: 1px 6px;
          border-radius: 3px;
          color: var(--text-secondary);
        }

        .dashboard-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2.5rem 1rem;
          color: var(--text-muted);
          gap: 0.5rem;
        }

        .dashboard-empty p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .checklist-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checklist-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
        }

        .chk-icon {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .warning-color-text {
          color: var(--warning-color);
        }

        .chk-text {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .chk-label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .chk-desc {
          font-size: 0.775rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .checklist-complete {
          text-align: center;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .complete-icon {
          color: var(--success-color);
          margin-bottom: 0.75rem;
        }

        .complete-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .complete-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          max-width: 220px;
        }

        .dashboard-loading {
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
