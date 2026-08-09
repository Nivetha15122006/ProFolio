import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, FileText } from 'lucide-react';
import { api } from '../services/api';
import Toast from '../components/Toast';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const extension = selected.name.split('.').pop().toLowerCase();
    if (extension !== 'pdf' && extension !== 'txt') {
      setError("Only PDF and TXT files are supported.");
      setFile(null);
      return;
    }

    setError('');
    setFile(selected);
    setResults(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setError('');
    
    try {
      const data = await api.resume.analyze(file);
      setResults(data);
      setToastMsg("Resume analyzed successfully!");
    } catch (err) {
      setError(err.message || "Failed to analyze resume. Make sure the file is not corrupted.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="analyzer-page">
      <div className="analyzer-header-row">
        <div>
          <h1 className="page-title">Smart Resume Analyzer</h1>
          <p className="page-desc">Upload your current resume (.pdf or .txt) to perform a rule-based checklist evaluation and identify missing metrics.</p>
        </div>
      </div>

      <div className="analyzer-layout-grid">
        {/* Left Upload Panel */}
        <div className="analyzer-upload-card card">
          <h3 className="card-title">Upload Resume</h3>
          
          <form onSubmit={handleAnalyze} className="analyzer-form">
            <div className="drag-drop-zone">
              <input 
                type="file" 
                id="resume-file"
                className="file-hidden-input" 
                accept=".pdf,.txt" 
                onChange={handleFileChange}
                disabled={analyzing}
              />
              <label htmlFor="resume-file" className="drag-label-box">
                <Upload size={32} className="upload-icon" />
                <span className="upload-title">
                  {file ? file.name : "Select Resume File"}
                </span>
                <span className="upload-sub">Supports PDF and TXT format</span>
              </label>
            </div>

            {error && (
              <div className="analyzer-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary analyze-submit-btn" 
              disabled={!file || analyzing}
            >
              <Sparkles size={16} />
              <span>{analyzing ? 'Analyzing Content...' : 'Run Smart Analysis'}</span>
            </button>
          </form>

          <div className="privacy-badge">
            <FileText size={12} />
            <span>Files are processed in memory and never stored long-term.</span>
          </div>
        </div>

        {/* Right Audit Results Panel */}
        <div className="analyzer-results-col">
          {results ? (
            <div className="results-wrapper">
              {/* Score card */}
              <div className="card score-summary-card">
                <div className="score-ring-col">
                  <div className="score-ring">
                    <span className="score-num">{results.score}</span>
                    <span className="score-denom">/100</span>
                  </div>
                  <div className="score-text">
                    <h4>Resume Audit Score</h4>
                    <p className="score-grade">
                      {results.score >= 80 ? 'Excellent' : results.score >= 50 ? 'Needs Improvement' : 'Deficient'}
                    </p>
                    <p className="word-count-label">Word Count: {results.wordCount} words</p>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="card results-breakdown-card">
                <h3 className="breakdown-title text-success-title">
                  <CheckCircle2 size={16} />
                  <span>Strengths ({results.strengths.length})</span>
                </h3>
                
                {results.strengths.length > 0 ? (
                  <ul className="results-list green-bullets">
                    {results.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-bullets-text">No major strengths identified yet.</p>
                )}
              </div>

              {/* Suggestions */}
              <div className="card results-breakdown-card">
                <h3 className="breakdown-title text-warning-title">
                  <AlertTriangle size={16} />
                  <span>Suggestions ({results.suggestions.length})</span>
                </h3>
                
                {results.suggestions.length > 0 ? (
                  <ul className="results-list yellow-bullets">
                    {results.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="checklist-all-clear">
                    <CheckCircle2 size={24} className="all-clear-icon" />
                    <span>Fantastic! No issues found. Your resume follows standard conventions.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card results-empty-card">
              <Sparkles size={36} className="empty-sparkle" />
              <h4>Smart Audit Results</h4>
              <p>Upload a file and run the checker to display rule compliance, contact listings, and description strengths here.</p>
            </div>
          )}
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      <style>{`
        .analyzer-page {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .analyzer-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .analyzer-layout-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .analyzer-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .analyzer-upload-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .drag-drop-zone {
          position: relative;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-app);
          padding: 2.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .drag-drop-zone:hover {
          border-color: var(--accent-color);
        }

        .file-hidden-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .drag-label-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .upload-icon {
          color: var(--text-muted);
        }

        .upload-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-all;
        }

        .upload-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .analyzer-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--danger-light);
          color: var(--danger-color);
          font-size: 0.775rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          margin-top: 1rem;
        }

        .analyze-submit-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.625rem;
        }

        .privacy-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          font-size: 0.725rem;
          color: var(--text-muted);
          text-align: center;
        }

        /* Results Pane */
        .analyzer-results-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .results-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .score-summary-card {
          padding: 1.25rem;
        }

        .score-ring-col {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .score-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--bg-app);
          border: 4px solid var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .score-denom {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .score-text h4 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .score-grade {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-color);
        }

        .word-count-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .results-breakdown-card {
          padding: 1.25rem;
        }

        .breakdown-title {
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .text-success-title { color: var(--success-color); }
        .text-warning-title { color: var(--warning-color); }

        .results-list {
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .results-list li {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .green-bullets li::marker { color: var(--success-color); }
        .yellow-bullets li::marker { color: var(--warning-color); }

        .checklist-all-clear {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: var(--success-light);
          color: var(--success-color);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.825rem;
          font-weight: 500;
        }

        .all-clear-icon { flex-shrink: 0; }

        .no-bullets-text {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .results-empty-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          color: var(--text-muted);
          text-align: center;
          gap: 0.5rem;
          min-height: 300px;
        }

        .empty-sparkle {
          color: var(--border-color);
          margin-bottom: 0.5rem;
        }

        .results-empty-card h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0;
        }

        .results-empty-card p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          max-width: 300px;
        }
      `}</style>
    </div>
  );
}
