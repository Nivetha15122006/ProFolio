import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

export default function ResumePreview({ profile, config }) {
  if (!profile) return <div className="resume-preview-blank">No profile loaded.</div>;

  const { personalInfo = {}, socialLinks = [], education = [], skills = [], projects = [], certifications = [], achievements = [] } = profile;
  const { template = 'Minimal Professional', font = 'sans-serif', density = 'normal', accentColor = '#4f46e5', visibleSections = {}, sectionOrder = [] } = config;

  // Retrieve platform links
  const getSocialUrl = (platform) => {
    const link = socialLinks.find(l => l.platform.toLowerCase() === platform.toLowerCase());
    return link ? link.url : '';
  };

  const githubUrl = getSocialUrl('github');
  const linkedinUrl = getSocialUrl('linkedin');

  // Styles dynamically adjusted by config
  const densityStyles = {
    compact: { gap: '0.5rem', padding: '1.25rem', lineSpacing: '1.2', margin: '0.25rem' },
    normal: { gap: '1rem', padding: '2rem', lineSpacing: '1.4', margin: '0.5rem' },
    loose: { gap: '1.5rem', padding: '2.5rem', lineSpacing: '1.6', margin: '0.75rem' }
  }[density];

  const fontStyles = {
    'sans-serif': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
    'monospace': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  }[font];

  const headerAlign = template === 'Clean Academic' ? 'center' : 'left';

  // Section Renders
  const renderSummary = () => {
    if (!visibleSections.summary || !personalInfo.bio) return null;
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Professional Summary</h4>
        <p className="sec-body" style={{ lineHeight: densityStyles.lineSpacing }}>{personalInfo.bio}</p>
      </section>
    );
  };

  const renderEducation = () => {
    if (!visibleSections.education || education.length === 0) return null;
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Education</h4>
        <div className="sec-list" style={{ gap: densityStyles.gap }}>
          {education.map(edu => (
            <div key={edu.id} className="sec-item">
              <div className="item-head">
                <span className="bold-text">{edu.institution}</span>
                <span className="meta-text">{edu.startYear} – {edu.endYear}</span>
              </div>
              <div className="item-sub">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                {edu.cgpa && <span className="bold-text">CGPA: {edu.cgpa}</span>}
              </div>
              {edu.description && <p className="item-desc">{edu.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!visibleSections.skills || skills.length === 0) return null;
    
    // Group skills by category
    const categories = Array.from(new Set(skills.map(s => s.category)));
    
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Skills</h4>
        <div className="skills-line-list" style={{ gap: '0.375rem' }}>
          {categories.map(cat => (
            <div key={cat} className="skill-cat-row" style={{ lineHeight: densityStyles.lineSpacing }}>
              <span className="bold-text" style={{ fontSize: '0.85rem' }}>{cat}: </span>
              <span className="skill-values">
                {skills.filter(s => s.category === cat).map(s => `${s.name} (${s.level})`).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!visibleSections.projects || projects.length === 0) return null;
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Projects</h4>
        <div className="sec-list" style={{ gap: densityStyles.gap }}>
          {projects.map(proj => (
            <div key={proj.id} className="sec-item">
              <div className="item-head">
                <span className="bold-text">{proj.name}</span>
                <span className="meta-text">{proj.startDate} – {proj.endDate || 'Present'}</span>
              </div>
              {proj.technologies && (
                <div className="item-tech-tags" style={{ color: accentColor }}>
                  {proj.technologies.join(' | ')}
                </div>
              )}
              <p className="item-desc" style={{ lineHeight: densityStyles.lineSpacing }}>
                <span className="bold-text">{proj.shortDesc} </span>
                {proj.detailedDesc}
              </p>
              <div className="item-links">
                {proj.githubUrl && <span className="item-link">GitHub: {proj.githubUrl}</span>}
                {proj.liveUrl && <span className="item-link">Demo: {proj.liveUrl}</span>}
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
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Certifications</h4>
        <div className="sec-list-grid">
          {certifications.map(cert => (
            <div key={cert.id} className="grid-item-row" style={{ lineHeight: densityStyles.lineSpacing }}>
              <div>
                <span className="bold-text">{cert.name}</span> – Issued by {cert.issuer}
              </div>
              <div className="meta-text">{cert.issueDate}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAchievements = () => {
    if (!visibleSections.achievements || achievements.length === 0) return null;
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Achievements & Awards</h4>
        <div className="sec-list" style={{ gap: '0.25rem' }}>
          {achievements.map(ach => (
            <div key={ach.id} className="sec-item" style={{ lineHeight: densityStyles.lineSpacing }}>
              <div className="item-head">
                <span>
                  <span className="bold-text">{ach.title}</span> 
                  {ach.issuer && ` – ${ach.issuer}`}
                </span>
                <span className="meta-text">{ach.date}</span>
              </div>
              {ach.description && <p className="item-desc">{ach.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Section router mapping
  const renderSection = (secName) => {
    switch (secName) {
      case 'summary': return renderSummary();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      case 'achievements': return renderAchievements();
      default: return null;
    }
  };

  return (
    <div 
      className={`resume-paper-page template-${template.replace(/\s+/g, '-').toLowerCase()}`}
      style={{
        fontFamily: fontStyles,
        padding: densityStyles.padding,
        color: '#1e293b'
      }}
    >
      {/* Accent strip for Modern Developer */}
      {template === 'Modern Developer' && (
        <div className="modern-strip" style={{ backgroundColor: accentColor }} />
      )}

      {/* Header Info */}
      <header className="resume-header" style={{ textAlign: headerAlign }}>
        <h1 className="user-name" style={{ color: template === 'Clean Academic' ? '#111827' : (template === 'Modern Developer' ? accentColor : '#1f2937') }}>
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <h2 className="user-title" style={{ color: accentColor }}>
          {personalInfo.title || 'Professional Title'}
        </h2>
        
        {/* Contact links */}
        <div className="contact-links-row" style={{ justifyContent: headerAlign === 'center' ? 'center' : 'flex-start' }}>
          {personalInfo.email && (
            <div className="link-item"><Mail size={12}/> <span>{personalInfo.email}</span></div>
          )}
          {personalInfo.phone && (
            <div className="link-item"><Phone size={12}/> <span>{personalInfo.phone}</span></div>
          )}
          {personalInfo.location && (
            <div className="link-item"><MapPin size={12}/> <span>{personalInfo.location}</span></div>
          )}
          {personalInfo.website && (
            <div className="link-item"><Globe size={12}/> <span>{personalInfo.website}</span></div>
          )}
        </div>

        {/* Social Link Row */}
        <div className="social-links-row" style={{ justifyContent: headerAlign === 'center' ? 'center' : 'flex-start' }}>
          {githubUrl && (
            <div className="link-item"><Github size={12}/> <span>{githubUrl}</span></div>
          )}
          {linkedinUrl && (
            <div className="link-item"><Linkedin size={12}/> <span>{linkedinUrl}</span></div>
          )}
        </div>
      </header>

      {/* Dynamic Ordered Sections */}
      <main className="resume-body-content">
        {sectionOrder.map(sec => renderSection(sec))}
      </main>

      <style>{`
        .resume-paper-page {
          background-color: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          min-height: 297mm; /* Standard A4 height proportional ratio */
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          box-sizing: border-box;
          position: relative;
          text-align: left;
        }

        .modern-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
        }

        .resume-header {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .user-name {
          font-size: 1.85rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .user-title {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .contact-links-row, .social-links-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #475569;
        }

        .link-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .resume-sec {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .sec-heading {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1.5px solid #cbd5e1;
          padding-bottom: 0.125rem;
          margin-bottom: 0.25rem;
        }

        .sec-body {
          font-size: 0.8rem;
          color: #334155;
          text-align: justify;
        }

        .sec-list {
          display: flex;
          flex-direction: column;
        }

        .sec-item {
          display: flex;
          flex-direction: column;
        }

        .item-head {
          display: flex;
          justify-content: space-between;
          font-size: 0.825rem;
        }

        .bold-text {
          font-weight: 700;
          color: #0f172a;
        }

        .meta-text {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .item-sub {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #475569;
          font-style: italic;
        }

        .item-desc {
          font-size: 0.775rem;
          color: #334155;
          margin-top: 0.125rem;
          text-align: justify;
        }

        .item-tech-tags {
          font-size: 0.725rem;
          font-weight: 600;
        }

        .item-links {
          display: flex;
          gap: 1rem;
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.125rem;
        }

        .skills-line-list {
          display: flex;
          flex-direction: column;
        }

        .skill-cat-row {
          font-size: 0.8rem;
          color: #334155;
        }

        .skill-values {
          color: #475569;
        }

        .sec-list-grid {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .grid-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #334155;
        }

        /* Template Specific Adjustments */
        .template-clean-academic {
          font-family: Georgia, serif;
        }
        
        .template-clean-academic .sec-heading {
          border-bottom: 1px dashed #64748b;
          text-align: center;
        }

        .resume-preview-blank {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        /* Print styles */
        @media print {
          body {
            background-color: white;
          }
          .resume-paper-page {
            box-shadow: none;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
