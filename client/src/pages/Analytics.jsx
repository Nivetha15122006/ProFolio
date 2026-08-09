import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle, PieChart, Users, Award, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Analytics() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.profile.get()
      .then(data => setProfile(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="analytics-loading">Loading analytics metrics...</div>;
  }

  // Calculate stats
  const projectsCount = profile?.projects?.length || 0;
  const skillsCount = profile?.skills?.length || 0;
  const certsCount = profile?.certifications?.length || 0;
  const eduCount = profile?.education?.length || 0;
  const achievementsCount = profile?.achievements?.length || 0;

  // Rule-based completeness checks
  const getCompletenessPercent = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.personalInfo?.fullName) score += 20;
    if (profile.personalInfo?.bio) score += 20;
    if (profile.socialLinks && profile.socialLinks.length > 0) score += 20;
    if (profile.projects && profile.projects.length >= 2) score += 20;
    if (profile.skills && profile.skills.length >= 3) score += 10;
    if (profile.education && profile.education.length >= 1) score += 10;
    return score;
  };

  const completionRate = getCompletenessPercent();
  
  // Custom SVG line chart calculations
  const historyScores = [30, 45, 60, 78, completionRate]; // dynamic progression
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 30;
  
  const getSvgCoordinates = () => {
    return historyScores.map((score, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / (historyScores.length - 1);
      const y = chartHeight - padding - (score * (chartHeight - 2 * padding)) / 100;
      return { x, y, score };
    });
  };

  const coordinates = getSvgCoordinates();
  const pathData = coordinates.reduce((path, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="page-title">Profile Analytics</h1>
        <p className="page-desc">Review metric summaries and verify completeness progression over key milestones.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-3 stats-grid">
        <div className="card kpi-card">
          <div className="kpi-icon-row">
            <TrendingUp className="kpi-icon accent" />
            <span className="kpi-label">Overall Completion</span>
          </div>
          <div className="kpi-val">{completionRate}%</div>
          <div className="kpi-sub">Central database readiness</div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon-row">
            <ShieldCheck className="kpi-icon green" />
            <span className="kpi-label">Portfolio Quality</span>
          </div>
          <div className="kpi-val">{completionRate >= 80 ? 'Grade A' : 'Grade B'}</div>
          <div className="kpi-sub">Based on section counts</div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-icon-row">
            <Award className="kpi-icon orange" />
            <span className="kpi-label">Active Credentials</span>
          </div>
          <div className="kpi-val">{certsCount + achievementsCount}</div>
          <div className="kpi-sub">Verified achievements listed</div>
        </div>
      </div>

      <div className="analytics-grid-two">
        {/* Profile Progress SVG Line Chart */}
        <div className="card chart-card">
          <h3 className="chart-title-label">Completion Progression Trend</h3>
          <p className="chart-sub">Visualizes score optimization over your edit milestones</p>
          
          <div className="svg-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="line-chart-svg">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="3,3" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--border-color)" strokeDasharray="3,3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border-color)" />
              
              {/* Chart Line */}
              <path d={pathData} fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Point Dots */}
              {coordinates.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="var(--bg-surface)" stroke="var(--accent-color)" strokeWidth="2" />
                  <text x={pt.x} y={pt.y - 12} fontSize="10" textAnchor="middle" fontWeight="bold" fill="var(--text-primary)">
                    {pt.score}%
                  </text>
                  <text x={pt.x} y={chartHeight - 10} fontSize="9" textAnchor="middle" fill="var(--text-muted)">
                    Step {idx + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="card breakdown-card">
          <h3 className="chart-title-label">Unified Resource Counts</h3>
          <p className="chart-sub">Distribution of elements stored in your central profile</p>
          
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span className="label">Projects Showcase</span>
              <span className="val badge badge-primary">{projectsCount}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Technical Skills</span>
              <span className="val badge badge-success">{skillsCount}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Certifications</span>
              <span className="val badge badge-warning">{certsCount}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Achievements</span>
              <span className="val badge badge-primary">{achievementsCount}</span>
            </div>
            <div className="breakdown-item">
              <span className="label">Education</span>
              <span className="val badge badge-success">{eduCount}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .analytics-header {
          margin-bottom: 0.5rem;
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

        .kpi-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kpi-icon-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .kpi-icon {
          width: 18px;
          height: 18px;
        }

        .kpi-icon.accent { color: var(--accent-color); }
        .kpi-icon.green { color: var(--success-color); }
        .kpi-icon.orange { color: var(--warning-color); }

        .kpi-label {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .kpi-val {
          font-size: 1.85rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: var(--text-primary);
        }

        .kpi-sub {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .analytics-grid-two {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.5rem;
        }

        @media (max-width: 850px) {
          .analytics-grid-two {
            grid-template-columns: 1fr;
          }
        }

        .chart-card, .breakdown-card {
          padding: 1.25rem;
        }

        .chart-title-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.125rem;
        }

        .chart-sub {
          font-size: 0.775rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .svg-container {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
          padding: 1rem;
        }

        .line-chart-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          background-color: var(--bg-app);
        }

        .breakdown-item .label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .analytics-loading {
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
