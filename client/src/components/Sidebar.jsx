import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, FolderGit2, FileText, 
  Globe, Sparkles, BarChart3, Settings as SettingsIcon, 
  LogOut, Sun, Moon, Menu, X
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../services/api';

export default function Sidebar({ currentUser, onLogout }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Load profile email for display
    if (currentUser) {
      api.profile.get()
        .then(profile => {
          if (profile?.personalInfo?.email) {
            setUserEmail(profile.personalInfo.email);
          }
        })
        .catch(err => console.log(err));
    }
  }, [currentUser]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Resume Builder', path: '/resume-builder', icon: FileText },
    { name: 'Portfolio Builder', path: '/portfolio-builder', icon: Globe },
    { name: 'Resume Analyzer', path: '/resume-analyzer', icon: Sparkles },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      onLogout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <div className="logo-text">DevPortfolio</div>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-symbol">DP</div>
          <div className="logo-text">DevPortfolio</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* User profile row */}
          <div className="user-profile-info">
            <div className="avatar-placeholder">
              {currentUser ? currentUser[0].toUpperCase() : 'U'}
            </div>
            <div className="user-text">
              <div className="username">{currentUser || 'Guest User'}</div>
              <div className="email">{userEmail || 'developer@devportfolio.net'}</div>
            </div>
          </div>

          <div className="footer-actions">
            {/* Theme Toggle */}
            <button className="footer-btn" onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Logout */}
            <button className="footer-btn logout-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <style>{`
        .mobile-header {
          display: none;
          height: 60px;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.5rem;
        }

        .app-sidebar {
          width: 240px;
          height: 100vh;
          background-color: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 90;
        }

        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .logo-symbol {
          background-color: var(--accent-color);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-primary);
          letter-spacing: -0.025em;
        }

        .sidebar-nav {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.625rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          text-align: left;
          transition: all 0.15s ease;
        }

        .nav-item:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--accent-light);
          color: var(--accent-color);
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .user-profile-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.25rem;
        }

        .avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .user-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-text .username {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-text .email {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .footer-actions {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.825rem;
          font-weight: 500;
          text-align: left;
          width: 100%;
        }

        .footer-btn:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .logout-btn:hover {
          color: var(--danger-color);
        }

        .sidebar-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .app-sidebar {
            position: fixed;
            top: 60px;
            bottom: 0;
            left: -240px;
            height: calc(100vh - 60px);
            transition: left 0.2s ease-in-out;
            box-shadow: var(--shadow-lg);
          }

          .app-sidebar.open {
            left: 0;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 60px;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.4);
            z-index: 80;
          }
        }
      `}</style>
    </>
  );
}
