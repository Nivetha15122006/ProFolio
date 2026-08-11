import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

export default function ResumePreview({ profile, config, onProfileChange }) {
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

  // Inline edit state handlers
  const updatePersonalInfo = (field, value) => {
    if (!onProfileChange) return;
    onProfileChange({
      ...profile,
      personalInfo: {
        ...personalInfo,
        [field]: value
      }
    });
  };

  const updateEducation = (id, field, value) => {
    if (!onProfileChange) return;
    let list = [...education];
    if (id === 'edu_placeholder') {
      list = [{
        id: `edu_${Date.now()}`,
        institution: 'Click to add University Name',
        degree: 'Degree Program',
        fieldOfStudy: 'Field of Study',
        startYear: '2022',
        endYear: '2026',
        cgpa: '9.0',
        description: ''
      }];
      list[0][field] = value;
    } else {
      list = list.map(item => item.id === id ? { ...item, [field]: value } : item);
    }
    onProfileChange({ ...profile, education: list });
  };

  const updateProject = (id, field, value) => {
    if (!onProfileChange) return;
    let list = [...projects];
    if (id === 'proj_placeholder') {
      list = [{
        id: `proj_${Date.now()}`,
        name: 'Click to add Project Name',
        startDate: '2024',
        endDate: '2024',
        technologies: ['React', 'Node.js'],
        shortDesc: 'Click to add project description',
        detailedDesc: ''
      }];
      if (field === 'technologies') {
        list[0].technologies = value.split(',').map(t => t.trim());
      } else {
        list[0][field] = value;
      }
    } else {
      list = list.map(item => {
        if (item.id === id) {
          if (field === 'technologies') {
            return { ...item, technologies: value.split(',').map(t => t.trim()) };
          }
          return { ...item, [field]: value };
        }
        return item;
      });
    }
    onProfileChange({ ...profile, projects: list });
  };

  const updateSkillsText = (category, value) => {
    if (!onProfileChange) return;
    const otherSkills = skills.filter(s => s.category !== category);
    const parsedSkills = value.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map((name, i) => ({
        id: `skill_${Date.now()}_${i}`,
        name,
        category,
        level: 'Expert'
      }));
    onProfileChange({ ...profile, skills: [...otherSkills, ...parsedSkills] });
  };

  // Section Renders
  const renderSummary = () => {
    if (!visibleSections.summary) return null;
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Professional Summary</h4>
        <p 
          className="sec-body edit-highlight" 
          contentEditable={!!onProfileChange}
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('bio', e.target.innerText.trim())}
          style={{ lineHeight: densityStyles.lineSpacing }}
        >
          {personalInfo.bio || 'Click here to write your professional summary...'}
        </p>
      </section>
    );
  };

  const renderEducation = () => {
    if (!visibleSections.education) return null;

    const listToRender = education.length > 0 ? education : [{
      id: 'edu_placeholder',
      institution: 'University / High School Name (Click to edit)',
      degree: 'B.Tech / Class XII',
      fieldOfStudy: 'Computer Science / Science',
      startYear: '2022',
      endYear: '2026',
      cgpa: '9.0',
      description: 'Add details...'
    }];

    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Education</h4>
        <div className="sec-list" style={{ gap: densityStyles.gap }}>
          {listToRender.map(edu => (
            <div key={edu.id} className="sec-item">
              <div className="item-head">
                <span 
                  className="bold-text edit-highlight"
                  contentEditable={!!onProfileChange}
                  suppressContentEditableWarning
                  onBlur={(e) => updateEducation(edu.id, 'institution', e.target.innerText.trim())}
                >
                  {edu.institution}
                </span>
                <span className="meta-text">
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateEducation(edu.id, 'startYear', e.target.innerText.trim())}
                  >
                    {edu.startYear}
                  </span>
                  <span> – </span>
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateEducation(edu.id, 'endYear', e.target.innerText.trim())}
                  >
                    {edu.endYear}
                  </span>
                </span>
              </div>
              <div className="item-sub">
                <span>
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateEducation(edu.id, 'degree', e.target.innerText.trim())}
                  >
                    {edu.degree}
                  </span>
                  <span> in </span>
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.innerText.trim())}
                  >
                    {edu.fieldOfStudy}
                  </span>
                </span>
                {edu.cgpa && (
                  <span className="bold-text">
                    CGPA: <span 
                      contentEditable={!!onProfileChange} 
                      suppressContentEditableWarning 
                      onBlur={(e) => updateEducation(edu.id, 'cgpa', e.target.innerText.trim())}
                    >
                      {edu.cgpa}
                    </span>
                  </span>
                )}
              </div>
              <p 
                className="item-desc edit-highlight"
                contentEditable={!!onProfileChange}
                suppressContentEditableWarning
                onBlur={(e) => updateEducation(edu.id, 'description', e.target.innerText.trim())}
              >
                {edu.description || 'Description details...'}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!visibleSections.skills) return null;
    
    // Group skills by category
    const categories = skills.length > 0 ? Array.from(new Set(skills.map(s => s.category))) : ['Technical Skills'];
    
    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Skills</h4>
        <div className="skills-line-list" style={{ gap: '0.375rem' }}>
          {categories.map(cat => {
            const catSkills = skills.filter(s => s.category === cat);
            const skillsStr = catSkills.length > 0 ? catSkills.map(s => s.name).join(', ') : 'React, Node.js, Python, Click to edit skills...';
            return (
              <div key={cat} className="skill-cat-row" style={{ lineHeight: densityStyles.lineSpacing }}>
                <span className="bold-text" style={{ fontSize: '0.85rem' }}>{cat}: </span>
                <span 
                  className="skill-values edit-highlight"
                  contentEditable={!!onProfileChange}
                  suppressContentEditableWarning
                  onBlur={(e) => updateSkillsText(cat, e.target.innerText.trim())}
                >
                  {skillsStr}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!visibleSections.projects) return null;

    const listToRender = projects.length > 0 ? projects : [{
      id: 'proj_placeholder',
      name: 'Project Title (Click to edit)',
      startDate: '2024',
      endDate: '2024',
      technologies: ['React', 'Node.js'],
      shortDesc: 'A brief sentence summarizing the project.',
      detailedDesc: 'Click here to add project achievements and details.'
    }];

    return (
      <section className="resume-sec" style={{ marginBottom: densityStyles.margin }}>
        <h4 className="sec-heading" style={{ borderBottomColor: accentColor, color: template === 'Modern Developer' ? accentColor : '#111827' }}>Projects</h4>
        <div className="sec-list" style={{ gap: densityStyles.gap }}>
          {listToRender.map(proj => (
            <div key={proj.id} className="sec-item">
              <div className="item-head">
                <span 
                  className="bold-text edit-highlight"
                  contentEditable={!!onProfileChange}
                  suppressContentEditableWarning
                  onBlur={(e) => updateProject(proj.id, 'name', e.target.innerText.trim())}
                >
                  {proj.name}
                </span>
                <span className="meta-text">
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateProject(proj.id, 'startDate', e.target.innerText.trim())}
                  >
                    {proj.startDate}
                  </span>
                  <span> – </span>
                  <span 
                    contentEditable={!!onProfileChange} 
                    suppressContentEditableWarning 
                    onBlur={(e) => updateProject(proj.id, 'endDate', e.target.innerText.trim())}
                  >
                    {proj.endDate || 'Present'}
                  </span>
                </span>
              </div>
              
              <div 
                className="item-tech-tags edit-highlight" 
                style={{ color: accentColor }}
                contentEditable={!!onProfileChange}
                suppressContentEditableWarning
                onBlur={(e) => updateProject(proj.id, 'technologies', e.target.innerText.trim())}
              >
                {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}
              </div>
              
              <p className="item-desc" style={{ lineHeight: densityStyles.lineSpacing }}>
                <span 
                  className="bold-text edit-highlight"
                  contentEditable={!!onProfileChange}
                  suppressContentEditableWarning
                  onBlur={(e) => updateProject(proj.id, 'shortDesc', e.target.innerText.trim())}
                >
                  {proj.shortDesc}
                </span>
                <span> </span>
                <span 
                  className="edit-highlight"
                  contentEditable={!!onProfileChange}
                  suppressContentEditableWarning
                  onBlur={(e) => updateProject(proj.id, 'detailedDesc', e.target.innerText.trim())}
                >
                  {proj.detailedDesc || 'Detailed specifications...'}
                </span>
              </p>
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
        <h1 
          className="user-name edit-highlight" 
          contentEditable={!!onProfileChange}
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('fullName', e.target.innerText.trim())}
          style={{ color: template === 'Clean Academic' ? '#111827' : (template === 'Modern Developer' ? accentColor : '#1f2937') }}
        >
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <h2 
          className="user-title edit-highlight" 
          contentEditable={!!onProfileChange}
          suppressContentEditableWarning
          onBlur={(e) => updatePersonalInfo('title', e.target.innerText.trim())}
          style={{ color: accentColor }}
        >
          {personalInfo.title || 'Professional Title'}
        </h2>
        
        {/* Contact links */}
        <div className="contact-links-row" style={{ justifyContent: headerAlign === 'center' ? 'center' : 'flex-start' }}>
          <div className="link-item">
            <Mail size={12}/> 
            <span 
              contentEditable={!!onProfileChange} 
              suppressContentEditableWarning 
              onBlur={(e) => updatePersonalInfo('email', e.target.innerText.trim())}
            >
              {personalInfo.email || 'email@domain.com'}
            </span>
          </div>
          <div className="link-item">
            <Phone size={12}/> 
            <span 
              contentEditable={!!onProfileChange} 
              suppressContentEditableWarning 
              onBlur={(e) => updatePersonalInfo('phone', e.target.innerText.trim())}
            >
              {personalInfo.phone || '+1234567890'}
            </span>
          </div>
          <div className="link-item">
            <MapPin size={12}/> 
            <span 
              contentEditable={!!onProfileChange} 
              suppressContentEditableWarning 
              onBlur={(e) => updatePersonalInfo('location', e.target.innerText.trim())}
            >
              {personalInfo.location || 'City, Country'}
            </span>
          </div>
          <div className="link-item">
            <Globe size={12}/> 
            <span 
              contentEditable={!!onProfileChange} 
              suppressContentEditableWarning 
              onBlur={(e) => updatePersonalInfo('website', e.target.innerText.trim())}
            >
              {personalInfo.website || 'website.com'}
            </span>
          </div>
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
          min-height: 297mm;
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          box-sizing: border-box;
          position: relative;
          text-align: left;
        }

        /* Direct edit visual feedback hint */
        .edit-highlight:hover {
          background-color: rgba(99, 102, 241, 0.05);
          outline: 1px dashed rgba(99, 102, 241, 0.3);
          border-radius: 2px;
          cursor: text;
        }

        .edit-highlight:focus {
          background-color: rgba(99, 102, 241, 0.08);
          outline: 1.5px solid var(--accent-color);
          border-radius: 2px;
          box-shadow: 0 0 4px rgba(99, 102, 241, 0.2);
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
          margin-bottom: 0.5rem;
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
