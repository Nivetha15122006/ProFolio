import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

export default function PortfolioPreview({ profile, config }) {
  if (!profile) return <div className="portfolio-preview-blank">No portfolio content loaded.</div>;

  const { personalInfo = {}, socialLinks = [], education = [], skills = [], projects = [], certifications = [], achievements = [] } = profile;
  const { template = 'Developer', theme = 'dark', heroStyle = 'minimalist', projectLayout = 'grid', visibleSections = {}, sectionOrder = [] } = config;

  // Social Links helper
  const getSocial = (platform) => {
    return socialLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase());
  };

  const github = getSocial('github');
  const linkedin = getSocial('linkedin');
  const twitter = getSocial('twitter');

  // Define theme styling presets
  const themePresetClass = `portfolio-theme-${theme} template-style-${template.toLowerCase()}`;

  // Section Renders
  const renderHero = () => {
    if (!visibleSections.hero) return null;
    return (
      <section id="hero" className="portfolio-sec hero-sec">
        <div className="hero-grid">
          <div className="hero-text-col">
            <span className="greet-tag" style={{ color: 'var(--p-accent)' }}>Hello, I'm</span>
            <h1 className="name-header">{personalInfo.fullName || 'Your Name'}</h1>
            <h2 className="title-subhead">{personalInfo.title || 'Professional Title'}</h2>
            <p className="summary-paragraph">{personalInfo.bio || 'Your bio summary appears here. Go to My Profile to update.'}</p>
            
            <div className="hero-cta-group">
              <a href="#contact" className="p-btn p-btn-primary">Get in Touch</a>
              <a href="#projects" className="p-btn p-btn-secondary">View Work</a>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderAbout = () => {
    if (!visibleSections.about || !personalInfo.bio) return null;
    return (
      <section id="about" className="portfolio-sec">
        <h3 className="section-title-p">About Me</h3>
        <div className="about-content">
          <div className="about-text">
            <p>{personalInfo.bio}</p>
            
            <div className="contact-details-grid">
              {personalInfo.email && (
                <div className="contact-meta-item">
                  <Mail size={16} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="contact-meta-item">
                  <Phone size={16} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="contact-meta-item">
                  <MapPin size={16} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="contact-meta-item">
                  <Globe size={16} />
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">{personalInfo.website}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!visibleSections.skills || skills.length === 0) return null;
    const categories = Array.from(new Set(skills.map(s => s.category)));
    
    return (
      <section id="skills" className="portfolio-sec">
        <h3 className="section-title-p">Skills & Technologies</h3>
        <div className="skills-categories-grid">
          {categories.map(cat => (
            <div key={cat} className="skills-cat-card">
              <h4 className="skills-cat-title">{cat}</h4>
              <div className="skills-pill-row">
                {skills.filter(s => s.category === cat).map(s => (
                  <div key={s.id} className="p-skill-pill">
                    <span className="name">{s.name}</span>
                    <span className="level">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!visibleSections.projects || projects.length === 0) return null;
    return (
      <section id="projects" className="portfolio-sec">
        <h3 className="section-title-p">Featured Projects</h3>
        <div className={projectLayout === 'list' ? 'projects-list-layout' : 'projects-grid-layout'}>
          {projects.map(proj => (
            <div key={proj.id} className="p-project-card">
              <div className="p-proj-head">
                <div className="p-proj-type">{proj.type}</div>
                <h4 className="p-proj-title">{proj.name}</h4>
              </div>
              <p className="p-proj-desc">{proj.shortDesc}</p>
              {proj.detailedDesc && <p className="p-proj-details">{proj.detailedDesc}</p>}
              
              <div className="p-proj-tech-list">
                {proj.technologies && proj.technologies.map(tech => (
                  <span key={tech} className="p-tech-badge">{tech}</span>
                ))}
              </div>

              <div className="p-proj-links">
                {proj.githubUrl && (
                  <a href={proj.githubUrl} className="p-proj-link" target="_blank" rel="noopener noreferrer">
                    <Github size={14} />
                    <span>Repository</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} className="p-proj-link" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (!visibleSections.education || education.length === 0) return null;
    return (
      <section id="education" className="portfolio-sec">
        <h3 className="section-title-p">Education</h3>
        <div className="p-timeline">
          {education.map(edu => (
            <div key={edu.id} className="p-timeline-item">
              <div className="p-timeline-dot" />
              <div className="p-timeline-content">
                <div className="p-timeline-header">
                  <h4 className="p-timeline-title">{edu.institution}</h4>
                  <span className="p-timeline-date">{edu.startYear} – {edu.endYear}</span>
                </div>
                <div className="p-timeline-sub">{edu.degree} in {edu.fieldOfStudy} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</div>
                {edu.description && <p className="p-timeline-desc">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!visibleSections.certifications || certifications.length === 0) return null;
    return (
      <section id="certifications" className="portfolio-sec">
        <h3 className="section-title-p">Certifications</h3>
        <div className="p-cert-grid">
          {certifications.map(cert => (
            <div key={cert.id} className="p-cert-card">
              <h4 className="p-cert-name">{cert.name}</h4>
              <p className="p-cert-issuer">Issued by {cert.issuer}</p>
              <div className="p-cert-meta">
                <span>Date: {cert.issueDate}</span>
                {cert.credentialId && <span>ID: {cert.credentialId}</span>}
              </div>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="p-cert-link">
                  Verify Credentials →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAchievements = () => {
    if (!visibleSections.achievements || achievements.length === 0) return null;
    return (
      <section id="achievements" className="portfolio-sec">
        <h3 className="section-title-p">Achievements & Honors</h3>
        <div className="p-timeline">
          {achievements.map(ach => (
            <div key={ach.id} className="p-timeline-item">
              <div className="p-timeline-dot badge-dot" />
              <div className="p-timeline-content">
                <div className="p-timeline-header">
                  <h4 className="p-timeline-title">{ach.title}</h4>
                  <span className="p-timeline-date">{ach.date}</span>
                </div>
                {ach.issuer && <div className="p-timeline-sub">Issued by {ach.issuer}</div>}
                {ach.description && <p className="p-timeline-desc">{ach.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderContact = () => {
    if (!visibleSections.contact) return null;
    return (
      <section id="contact" className="portfolio-sec contact-sec">
        <h3 className="section-title-p">Get In Touch</h3>
        <p className="contact-prompt">Feel free to reach out for collaborations, project opportunities, or internship roles.</p>
        
        <div className="contact-box-grid">
          <div className="contact-methods">
            {personalInfo.email && (
              <div className="c-item">
                <Mail size={16} />
                <div>
                  <span className="label">Email Me</span>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>
            )}
            {personalInfo.phone && (
              <div className="c-item">
                <Phone size={16} />
                <div>
                  <span className="label">Call Me</span>
                  <span>{personalInfo.phone}</span>
                </div>
              </div>
            )}
          </div>

          <div className="contact-socials-box">
            <h4 className="soc-title">Connect Online</h4>
            <div className="contact-social-row">
              {github && (
                <a href={github.url} target="_blank" rel="noopener noreferrer" className="soc-icon-btn" aria-label="GitHub">
                  <Github size={20} />
                </a>
              )}
              {linkedin && (
                <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className="soc-icon-btn" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSection = (secName) => {
    switch (secName) {
      case 'hero': return renderHero();
      case 'about': return renderAbout();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'education': return renderEducation();
      case 'certifications': return renderCertifications();
      case 'achievements': return renderAchievements();
      case 'contact': return renderContact();
      default: return null;
    }
  };

  return (
    <div className={`p-viewport-wrapper ${themePresetClass}`}>
      {/* Mini Nav Bar */}
      <nav className="p-navbar">
        <div className="p-brand">{personalInfo.fullName || 'Profolio'}</div>
        <div className="p-nav-links">
          {sectionOrder.map(sec => {
            if (!visibleSections[sec] || sec === 'hero') return null;
            return <a key={sec} href={`#${sec}`}>{sec.charAt(0).toUpperCase() + sec.slice(1)}</a>;
          })}
        </div>
      </nav>

      {/* Main Sections */}
      <div className="p-sections-container">
        {sectionOrder.map(sec => renderSection(sec))}
      </div>

      <style>{`
        /* Portfolio themes & styles */
        .p-viewport-wrapper {
          width: 100%;
          min-height: 100%;
          padding: 2rem;
          box-sizing: border-box;
          text-align: left;
          transition: all 0.3s ease;
          
          /* Colors setup (Light Theme) */
          --p-bg: #f8fafc;
          --p-surface: #ffffff;
          --p-border: #e2e8f0;
          --p-text: #0f172a;
          --p-muted: #475569;
          --p-accent: #4f46e5;
          --p-accent-hover: #4338ca;
        }

        /* Dark Theme overrides (Vibrant & High-Contrast) */
        .portfolio-theme-dark {
          --p-bg: #0a0e1a;
          --p-surface: #161e2f;
          --p-border: #2d3b55;
          --p-text: #ffffff;
          --p-muted: #cbd5e1;
          --p-accent: #818cf8;
          --p-accent-hover: #a5b4fc;
        }

        /* Applying theme styles */
        .p-viewport-wrapper {
          background-color: var(--p-bg);
          color: var(--p-text);
        }

        /* Enforce theme color hierarchy over global resets */
        .p-viewport-wrapper h1,
        .p-viewport-wrapper h2,
        .p-viewport-wrapper h3,
        .p-viewport-wrapper h4,
        .p-viewport-wrapper h5,
        .p-viewport-wrapper h6 {
          color: var(--p-text) !important;
        }

        .p-cert-name,
        .p-timeline-title,
        .soc-title {
          color: var(--p-text) !important;
        }

        .p-cert-issuer,
        .p-cert-meta,
        .p-cert-meta span,
        .p-timeline-sub,
        .p-timeline-desc,
        .contact-prompt {
          color: var(--p-muted) !important;
        }

        /* Brand Navbar */
        .p-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--p-border);
          margin-bottom: 2rem;
        }

        .p-brand {
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
        }

        .p-nav-links {
          display: flex;
          gap: 1rem;
        }

        .p-nav-links a {
          color: var(--p-muted);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .p-nav-links a:hover {
          color: var(--p-accent);
          text-decoration: none;
        }

        /* Sections spacing */
        .portfolio-sec {
          margin-bottom: 3.5rem;
        }

        .section-title-p {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          border-bottom: 2px solid var(--p-accent);
          padding-bottom: 0.25rem;
          margin-bottom: 1.5rem;
          width: fit-content;
        }

        /* Buttons inside portfolio */
        .p-btn {
          display: inline-flex;
          padding: 0.5rem 1rem;
          font-size: 0.825rem;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .p-btn-primary {
          background-color: var(--p-accent);
          color: white;
        }
        .p-btn-primary:hover {
          background-color: var(--p-accent-hover);
          text-decoration: none;
        }

        .p-btn-secondary {
          border: 1px solid var(--p-border);
          color: var(--p-text);
          margin-left: 0.5rem;
        }
        .p-btn-secondary:hover {
          background-color: var(--p-surface);
          text-decoration: none;
        }

        /* Hero Sec */
        .hero-sec {
          padding: 2rem 0;
        }

        .greet-tag {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .name-header {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0.25rem 0;
        }

        .title-subhead {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--p-muted);
          margin-bottom: 1.25rem;
        }

        .summary-paragraph {
          font-size: 0.95rem;
          color: var(--p-muted);
          max-width: 580px;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .hero-cta-group {
          display: flex;
        }

        /* About contact info grid */
        .contact-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
          border-top: 1px solid var(--p-border);
          padding-top: 1.5rem;
        }

        .contact-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--p-muted);
        }

        .contact-meta-item a {
          color: var(--p-text);
        }

        /* Skills Layout */
        .skills-categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .skills-categories-grid {
            grid-template-columns: 1fr;
          }
        }

        .skills-cat-card {
          background-color: var(--p-surface);
          border: 1px solid var(--p-border);
          padding: 1.25rem;
          border-radius: 6px;
        }

        .skills-cat-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--p-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .skills-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .p-skill-pill {
          background-color: var(--p-bg);
          border: 1px solid var(--p-border);
          padding: 0.25rem 0.625rem;
          border-radius: 4px;
          font-size: 0.775rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .p-skill-pill .level {
          font-size: 0.65rem;
          opacity: 0.75;
          font-weight: 600;
        }

        /* Projects grids */
        .projects-grid-layout {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .projects-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        .projects-list-layout {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .p-project-card {
          background-color: var(--p-surface);
          border: 1px solid var(--p-border);
          padding: 1.25rem;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
        }

        .p-proj-head {
          margin-bottom: 0.5rem;
        }

        .p-proj-type {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--p-accent);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .p-proj-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--p-text);
        }

        .p-proj-desc {
          font-size: 0.85rem;
          color: var(--p-text);
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 0.375rem;
        }

        .p-proj-details {
          font-size: 0.775rem;
          color: var(--p-muted);
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .p-proj-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .p-tech-badge {
          font-size: 0.65rem;
          background-color: var(--p-bg);
          padding: 1px 6px;
          border-radius: 3px;
          color: var(--p-muted);
          border: 1px solid var(--p-border);
        }

        .p-proj-links {
          display: flex;
          gap: 1rem;
          border-top: 1px solid var(--p-border);
          padding-top: 0.75rem;
          margin-top: auto;
        }

        .p-proj-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--p-muted);
        }

        .p-proj-link:hover {
          color: var(--p-accent);
          text-decoration: none;
        }

        /* Timeline education/achievements */
        .p-timeline {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 1.5rem;
        }

        .p-timeline::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--p-border);
        }

        .p-timeline-item {
          position: relative;
          padding-bottom: 1.5rem;
        }

        .p-timeline-item:last-child {
          padding-bottom: 0;
        }

        .p-timeline-dot {
          position: absolute;
          left: -19px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--p-accent);
          border: 2px solid var(--p-bg);
        }

        .p-timeline-content {
          background-color: var(--p-surface);
          border: 1px solid var(--p-border);
          border-radius: 6px;
          padding: 1rem;
        }

        .p-timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .p-timeline-title {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .p-timeline-date {
          font-size: 0.75rem;
          color: var(--p-muted);
          font-weight: 500;
        }

        .p-timeline-sub {
          font-size: 0.8rem;
          color: var(--p-muted);
          font-style: italic;
          margin-top: 0.125rem;
        }

        .p-timeline-desc {
          font-size: 0.775rem;
          line-height: 1.4;
          margin-top: 0.5rem;
          color: var(--p-muted);
        }

        /* Certifications grid */
        .p-cert-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .p-cert-grid {
            grid-template-columns: 1fr;
          }
        }

        .p-cert-card {
          background-color: var(--p-surface);
          border: 1px solid var(--p-border);
          padding: 1rem;
          border-radius: 6px;
        }

        .p-cert-name {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .p-cert-issuer {
          font-size: 0.775rem;
          color: var(--p-muted);
        }

        .p-cert-meta {
          font-size: 0.7rem;
          color: var(--p-muted);
          margin-top: 0.25rem;
          display: flex;
          justify-content: space-between;
        }

        .p-cert-link {
          font-size: 0.725rem;
          color: var(--p-accent);
          display: inline-block;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        /* Contact section */
        .contact-prompt {
          font-size: 0.875rem;
          color: var(--p-muted);
          margin-bottom: 1.5rem;
        }

        .contact-box-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .contact-box-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .c-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .c-item .label {
          display: block;
          font-size: 0.675rem;
          text-transform: uppercase;
          color: var(--p-muted);
          font-weight: 600;
        }

        .c-item a, .c-item span {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--p-text);
        }

        .contact-socials-box {
          background-color: var(--p-surface);
          border: 1px solid var(--p-border);
          border-radius: 6px;
          padding: 1.25rem;
        }

        .contact-socials-box .soc-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .contact-social-row {
          display: flex;
          gap: 0.5rem;
        }

        .soc-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 4px;
          border: 1px solid var(--p-border);
          background-color: var(--p-bg);
          color: var(--p-text);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .soc-icon-btn:hover {
          background-color: var(--p-accent);
          color: white;
          border-color: var(--p-accent);
        }

        /* ---------------------------------------------------- */
        /* Template Font Override Options                       */
        /* ---------------------------------------------------- */
        .template-style-minimal {
          font-family: system-ui, sans-serif;
        }

        .template-style-editorial {
          font-family: Georgia, serif;
        }
        .template-style-editorial .section-title-p {
          font-family: Georgia, serif;
          border-bottom-style: dotted;
        }

        .template-style-corporate {
          font-family: -apple-system, "Segoe UI", sans-serif;
        }

        .portfolio-preview-blank {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
