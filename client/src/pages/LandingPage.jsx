import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Globe, Sparkles, BarChart3, 
  ArrowRight, ShieldCheck, CheckCircle2, UserCheck
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="landing-nav">
        <div className="logo">
          <div className="logo-symbol">PF</div>
          <span>Profolio</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#templates">Templates</a>
        </nav>
        <div className="nav-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">
            Build Your Presence. <br/>
            <span className="highlight-gradient">Shape Your Future.</span>
          </h1>
          <p className="hero-subtext">
            Create a polished developer portfolio website and a job-ready resume from a single source of truth. Enter your details once, showcase everywhere.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              <span>Create Your Profile</span>
              <ArrowRight size={16} />
            </button>
            <a href="#features" className="btn btn-secondary btn-lg">Explore Features</a>
          </div>
        </div>
        
        {/* Mockup Preview */}
        <div className="hero-preview">
          <div className="mockup-frame">
            <div className="mockup-header">
              <div className="mockup-dots"><span/><span/><span/></div>
              <div className="mockup-address">app.profolio.net/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mock-sidebar">
                <div className="mock-logo">PF</div>
                <div className="mock-nav-item active"/>
                <div className="mock-nav-item"/>
                <div className="mock-nav-item"/>
                <div className="mock-nav-item"/>
              </div>
              <div className="mock-content">
                <div className="mock-header-row">
                  <div className="mock-title">Dashboard Overview</div>
                  <div className="mock-avatar"/>
                </div>
                <div className="mock-grid">
                  <div className="mock-card">
                    <div className="mock-card-label">Profile Completion</div>
                    <div className="mock-score">90%</div>
                    <div className="mock-progress"><div style={{width: '90%'}}/></div>
                  </div>
                  <div className="mock-card">
                    <div className="mock-card-label">Resume Status</div>
                    <div className="mock-score">92/100</div>
                    <div className="mock-indicator success">Ready</div>
                  </div>
                  <div className="mock-card">
                    <div className="mock-card-label">Portfolio Site</div>
                    <div className="mock-score">Published</div>
                    <div className="mock-indicator active">Live</div>
                  </div>
                </div>
                <div className="mock-list">
                  <div className="mock-list-item"/>
                  <div className="mock-list-item"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <h2 className="section-title">Everything you need to stand out</h2>
        <p className="section-subtitle">A set of developer-focused tools built to elevate your internship and job applications.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FileText size={22} /></div>
            <h3>Dynamic Resume Builder</h3>
            <p>Generate clean, professional, ATS-friendly resumes dynamically from your profile data in one click.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><Globe size={22} /></div>
            <h3>Portfolio Website</h3>
            <p>Publish an interactive portfolio website with modern responsive layouts and custom theme options.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><UserCheck size={22} /></div>
            <h3>Centralized Profile</h3>
            <p>Enter your projects, skills, education, and credentials once. It automatically updates everywhere.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Sparkles size={22} /></div>
            <h3>Smart Resume Review</h3>
            <p>Upload your resume file and get a rule-based checklist audit mapping out profile deficiencies.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={22} /></div>
            <h3>Completeness Analyzer</h3>
            <p>A smart dashboard tracker ensuring your bio, social handles, and academic listings are fully complete.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={22} /></div>
            <h3>Export & Print</h3>
            <p>Print or download PDF copies of your resume directly from your browser with professional formatting.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <h2 className="section-title">How it works</h2>
        <div className="steps-row">
          <div className="step-col">
            <div className="step-num">01</div>
            <h4>Create your profile</h4>
            <p>Sign up and setup your Profolio central dashboard account in seconds.</p>
          </div>
          <div className="step-col">
            <div className="step-num">02</div>
            <h4>Add your credentials</h4>
            <p>Input your projects, skill levels, certifications, and educational credentials.</p>
          </div>
          <div className="step-col">
            <div className="step-num">03</div>
            <h4>Choose templates</h4>
            <p>Select professional designs, fonts, and themes that fit corporate or tech positions.</p>
          </div>
          <div className="step-col">
            <div className="step-num">04</div>
            <h4>Publish and apply</h4>
            <p>Download your PDF resume, host your portfolio link, and share them on applications.</p>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="templates-section">
        <h2 className="section-title">Tailored for tech roles</h2>
        <p className="section-subtitle">Minimal, clean, and ATS-friendly templates optimized for software and AI roles.</p>
        
        <div className="template-showcase">
          <div className="template-card-preview">
            <div className="template-tag">Minimal Professional</div>
            <div className="template-doc-mock">
              <div className="doc-head">Arjun Kumar</div>
              <div className="doc-sub">AI & Full Stack Developer</div>
              <hr/>
              <div className="doc-sec"/>
              <div className="doc-sec"/>
            </div>
          </div>

          <div className="template-card-preview">
            <div className="template-tag">Modern Developer</div>
            <div className="template-doc-mock colored-accent">
              <div className="doc-head">Arjun Kumar</div>
              <div className="doc-sub">AI & Full Stack Developer</div>
              <hr/>
              <div className="doc-sec"/>
              <div className="doc-sec"/>
            </div>
          </div>

          <div className="template-card-preview">
            <div className="template-tag">Clean Academic</div>
            <div className="template-doc-mock serif-font">
              <div className="doc-head">Arjun Kumar</div>
              <div className="doc-sub">AI & Full Stack Developer</div>
              <hr/>
              <div className="doc-sec"/>
              <div className="doc-sec"/>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="cta-footer-section">
        <h2>Your skills deserve a professional presence.</h2>
        <p>Start organizing your achievements and projects in a unified professional identity.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
          <span>Get Started Free</span>
          <ArrowRight size={16} />
        </button>
      </section>

      <footer className="footer-copyright">
        <p>© 2026 Profolio. Built once. Showcased everywhere.</p>
      </footer>

      <style>{`
        .landing-container {
          background-color: var(--bg-app);
          min-height: 100vh;
        }

        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 3rem;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: var(--shadow-sm);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .logo-symbol {
          background: var(--accent-gradient);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .nav-links a:hover {
          color: var(--accent-color);
          text-decoration: none;
        }

        .nav-actions {
          display: flex;
          gap: 0.75rem;
        }

        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 7rem 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 992px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 4rem 1.5rem;
            gap: 3rem;
            text-align: center;
          }
        }

        .hero-headline {
          font-size: 3.25rem;
          line-height: 1.15;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
          font-weight: 800;
        }

        .hero-headline .highlight-gradient {
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 2.25rem;
          max-width: 500px;
          line-height: 1.6;
        }

        @media (max-width: 992px) {
          .hero-subtext {
            margin: 0 auto 2.25rem auto;
          }
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 992px) {
          .hero-ctas {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .hero-ctas {
            flex-direction: column;
          }
        }

        .btn-lg {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
        }

        /* Mockup Preview styles */
        .hero-preview {
          width: 100%;
        }

        .mockup-frame {
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 40px -4px rgba(99, 102, 241, 0.12), var(--shadow-lg);
          overflow: hidden;
        }

        .mockup-header {
          background-color: var(--bg-surface-hover);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          gap: 1rem;
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--border-color);
          display: inline-block;
        }

        .mockup-address {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background-color: var(--bg-surface);
          padding: 0.25rem 2rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 300px;
          text-align: center;
        }

        .mockup-body {
          display: flex;
          height: 300px;
        }

        .mock-sidebar {
          width: 60px;
          background-color: var(--bg-surface-hover);
          border-right: 1px solid var(--border-color);
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .mock-logo {
          background: var(--accent-gradient);
          color: white;
          width: 28px;
          height: 28px;
          font-weight: 800;
          font-size: 0.75rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mock-nav-item {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-sm);
          background-color: var(--border-color);
        }

        .mock-nav-item.active {
          background-color: var(--accent-light);
        }

        .mock-content {
          flex: 1;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mock-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mock-title {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .mock-avatar {
          width: 24px;
          height: 24px;
          background-color: var(--border-color);
          border-radius: 50%;
        }

        .mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .mock-card {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.75rem;
          background-color: var(--bg-surface);
        }

        .mock-card-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .mock-score {
          font-size: 1.1rem;
          font-weight: 800;
        }

        .mock-progress {
          background-color: var(--border-color);
          height: 5px;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }

        .mock-progress div {
          background: var(--accent-gradient);
          height: 100%;
        }

        .mock-indicator {
          font-size: 0.65rem;
          font-weight: 700;
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .mock-indicator.success {
          background-color: var(--success-light);
          color: var(--success-color);
        }

        .mock-indicator.active {
          background-color: var(--accent-light);
          color: var(--accent-color);
        }

        .mock-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mock-list-item {
          height: 36px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background-color: var(--bg-surface-hover);
        }

        /* Features Section */
        .features-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 6rem 3rem;
          text-align: center;
        }

        .section-title {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
          font-weight: 800;
        }

        .section-subtitle {
          color: var(--text-secondary);
          margin-bottom: 4rem;
          font-size: 1.05rem;
        }

        .features-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-app);
          padding: 2.25rem 1.75rem;
          text-align: left;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }

        .feature-icon {
          background: var(--accent-light);
          color: var(--accent-color);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .feature-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* How it works */
        .how-section {
          padding: 6rem 3rem;
          text-align: center;
          max-width: 1100px;
          margin: 0 auto;
        }

        .steps-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
          margin-top: 4rem;
        }

        @media (max-width: 800px) {
          .steps-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 500px) {
          .steps-row {
            grid-template-columns: 1fr;
          }
        }

        .step-col {
          text-align: left;
        }

        .step-num {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.4;
          margin-bottom: 0.5rem;
          font-family: monospace;
        }

        .step-col h4 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .step-col p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Templates Showcase */
        .templates-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 6rem 3rem;
          text-align: center;
        }

        .template-showcase {
          max-width: 1100px;
          margin: 4rem auto 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        @media (max-width: 900px) {
          .template-showcase {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
        }

        .template-card-preview {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-app);
          overflow: hidden;
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .template-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          text-align: left;
        }

        .template-doc-mock {
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          border-radius: var(--radius-sm);
          padding: 1.75rem 1.25rem;
          height: 240px;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          text-align: left;
          box-shadow: var(--shadow-sm);
        }

        .template-doc-mock .doc-head {
          font-weight: 800;
          font-size: 0.95rem;
        }

        .template-doc-mock .doc-sub {
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .template-doc-mock hr {
          border: 0;
          border-top: 1px solid var(--border-color);
        }

        .template-doc-mock .doc-sec {
          height: 10px;
          background-color: var(--bg-surface-hover);
          width: 80%;
          border-radius: 2px;
        }

        .colored-accent {
          border-top: 4px solid var(--accent-color);
        }

        .serif-font {
          font-family: Georgia, serif;
        }

        /* Final CTA */
        .cta-footer-section {
          padding: 7rem 3rem;
          text-align: center;
        }

        .cta-footer-section h2 {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          font-weight: 800;
        }

        .cta-footer-section p {
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          font-size: 1.05rem;
        }

        .footer-copyright {
          padding: 2.5rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
