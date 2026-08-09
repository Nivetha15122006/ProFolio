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
          <div className="logo-symbol">DP</div>
          <span>DevPortfolio</span>
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
            Build your professional identity once. <span className="highlight">Showcase it everywhere.</span>
          </h1>
          <p className="hero-subtext">
            Create a polished developer portfolio website and a job-ready resume from a single source of truth.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              <span>Create Your Portfolio</span>
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
              <div className="mockup-address">app.devportfolio.net/dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mock-sidebar">
                <div className="mock-logo">DP</div>
                <div className="mock-nav-item active"/>
                <div className="mock-nav-item"/>
                <div className="mock-nav-item"/>
                <div className="mock-nav-item"/>
              </div>
              <div className="mock-content">
                <div className="mock-header-row">
                  <div className="mock-title">Dashboard</div>
                  <div className="mock-avatar"/>
                </div>
                <div className="mock-grid">
                  <div className="mock-card">
                    <div className="mock-card-label">Profile Completion</div>
                    <div className="mock-score">85%</div>
                    <div className="mock-progress"><div style={{width: '85%'}}/></div>
                  </div>
                  <div className="mock-card">
                    <div className="mock-card-label">Resume Score</div>
                    <div className="mock-score">82/100</div>
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
            <h3>Resume Builder</h3>
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
            <h3>Resume Review</h3>
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
            <p>Sign up and setup your DevPortfolio central dashboard account in seconds.</p>
          </div>
          <div className="step-col">
            <div className="step-num">02</div>
            <h4>Add your credentials</h4>
            <p>Input your projects, skill levels, certifications, and educational credentials.</p>
          </div>
          <div className="step-col">
            <div className="step-num">03</div>
            <h4>Choose templates</h4>
            <p>Select professional designs, fonts, and themes that fit corporate or startup positions.</p>
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
        <p>© 2026 DevPortfolio. Built once. Showcased everywhere.</p>
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
          padding: 1.25rem 2rem;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--text-primary);
        }

        .logo-symbol {
          background-color: var(--accent-color);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
        }

        .nav-links a {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
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
          padding: 5rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 992px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 3rem 1.5rem;
            gap: 2.5rem;
            text-align: center;
          }
        }

        .hero-headline {
          font-size: 3rem;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }

        .hero-headline .highlight {
          color: var(--accent-color);
        }

        .hero-subtext {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 480px;
        }

        @media (max-width: 992px) {
          .hero-subtext {
            margin: 0 auto 2rem auto;
          }
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
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
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .mockup-header {
          background-color: var(--bg-surface-hover);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          gap: 1rem;
        }

        .mockup-dots {
          display: flex;
          gap: 4px;
        }

        .mockup-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--border-color);
          display: inline-block;
        }

        .mockup-address {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-surface);
          padding: 0.125rem 2rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 280px;
          text-align: center;
        }

        .mockup-body {
          display: flex;
          height: 280px;
        }

        .mock-sidebar {
          width: 50px;
          background-color: var(--bg-surface-hover);
          border-right: 1px solid var(--border-color);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .mock-logo {
          background-color: var(--accent-color);
          color: white;
          width: 24px;
          height: 24px;
          font-weight: 700;
          font-size: 0.65rem;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mock-nav-item {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          background-color: var(--border-color);
        }

        .mock-nav-item.active {
          background-color: var(--accent-light);
        }

        .mock-content {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mock-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mock-title {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .mock-avatar {
          width: 20px;
          height: 20px;
          background-color: var(--border-color);
          border-radius: 50%;
        }

        .mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .mock-card {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.5rem;
        }

        .mock-card-label {
          font-size: 0.6rem;
          color: var(--text-muted);
        }

        .mock-score {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .mock-progress {
          background-color: var(--border-color);
          height: 4px;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .mock-progress div {
          background-color: var(--accent-color);
          height: 100%;
        }

        .mock-indicator {
          font-size: 0.6rem;
          font-weight: 600;
          display: inline-block;
          padding: 1px 4px;
          border-radius: 2px;
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
          height: 32px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--bg-surface-hover);
        }

        /* Features Section */
        .features-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 5rem 2rem;
          text-align: center;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: var(--text-secondary);
          margin-bottom: 3.5rem;
        }

        .features-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
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
          padding: 2rem 1.5rem;
          text-align: left;
        }

        .feature-icon {
          background-color: var(--accent-light);
          color: var(--accent-color);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* How it works */
        .how-section {
          padding: 5rem 2rem;
          text-align: center;
          max-width: 1100px;
          margin: 0 auto;
        }

        .steps-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-top: 3.5rem;
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
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--accent-color);
          opacity: 0.3;
          margin-bottom: 0.5rem;
          font-family: monospace;
        }

        .step-col h4 {
          font-size: 1.05rem;
          margin-bottom: 0.375rem;
        }

        .step-col p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Templates Showcase */
        .templates-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 5rem 2rem;
          text-align: center;
        }

        .template-showcase {
          max-width: 1100px;
          margin: 3rem auto 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
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
          padding: 1rem;
        }

        .template-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          text-align: left;
        }

        .template-doc-mock {
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          border-radius: var(--radius-sm);
          padding: 1.5rem 1rem;
          height: 220px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .template-doc-mock .doc-head {
          font-weight: 700;
          font-size: 0.85rem;
        }

        .template-doc-mock .doc-sub {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .template-doc-mock hr {
          border: 0;
          border-top: 1px solid var(--border-color);
        }

        .template-doc-mock .doc-sec {
          height: 10px;
          background-color: var(--bg-surface-hover);
          width: 80%;
          border-radius: 1px;
        }

        .colored-accent {
          border-top: 3px solid var(--accent-color);
        }

        .serif-font {
          font-family: Georgia, serif;
        }

        /* Final CTA */
        .cta-footer-section {
          padding: 6rem 2rem;
          text-align: center;
        }

        .cta-footer-section h2 {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
        }

        .cta-footer-section p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .footer-copyright {
          padding: 2rem;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
