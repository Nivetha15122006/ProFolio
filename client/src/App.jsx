import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ResumeBuilder from './pages/ResumeBuilder';
import PortfolioBuilder from './pages/PortfolioBuilder';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('devportfolio-user') || '';
  });

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser('');
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
            } 
          />
          <Route 
            path="/register" 
            element={
              currentUser ? <Navigate to="/dashboard" replace /> : <Register onLoginSuccess={handleLoginSuccess} />
            } 
          />

          {/* Secure App Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <Dashboard currentUser={currentUser} />
              </DashboardLayout>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <Profile />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/projects" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <Projects />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/resume-builder" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <ResumeBuilder />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/portfolio-builder" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <PortfolioBuilder />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/resume-analyzer" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <ResumeAnalyzer />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/analytics" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <Analytics />
              </DashboardLayout>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                <Settings currentUser={currentUser} />
              </DashboardLayout>
            } 
          />

          {/* Fallback 404 Route */}
          <Route 
            path="*" 
            element={
              currentUser ? (
                <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
                  <NotFound />
                </DashboardLayout>
              ) : (
                <NotFound />
              )
            } 
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
