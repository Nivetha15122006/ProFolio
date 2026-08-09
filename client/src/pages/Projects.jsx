import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Calendar, Code } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Modals & Delete dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    shortDesc: '',
    detailedDesc: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: '',
    type: 'Personal Project',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err) {
      showToast("Failed to fetch projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const openAddModal = () => {
    setEditProject(null);
    setForm({
      name: '',
      shortDesc: '',
      detailedDesc: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      image: '',
      type: 'Personal Project',
      startDate: '',
      endDate: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditProject(proj);
    setForm({
      name: proj.name || '',
      shortDesc: proj.shortDesc || '',
      detailedDesc: proj.detailedDesc || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      image: proj.image || '',
      type: proj.type || 'Personal Project',
      startDate: proj.startDate || '',
      endDate: proj.endDate || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.shortDesc) {
      showToast("Project Name and Short Description are required.", "error");
      return;
    }

    const payload = {
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0)
    };

    try {
      if (editProject) {
        await api.projects.update(editProject.id, payload);
        showToast("Project updated successfully!");
      } else {
        await api.projects.create(payload);
        showToast("Project added successfully!");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      showToast(err.message || "Failed to save project.", "error");
    }
  };

  const promptDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.projects.delete(deleteTargetId);
      showToast("Project deleted successfully.");
      fetchProjects();
    } catch (err) {
      showToast("Failed to delete project.", "error");
    }
  };

  if (loading) {
    return <div className="projects-loading">Loading projects portfolio...</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header-row">
        <div>
          <h1 className="page-title">Projects Showcase</h1>
          <p className="page-desc">Manage the technical projects you want to feature. These are shared dynamically on your resume and portfolio site.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((proj) => (
            <div key={proj.id} className="card project-card">
              <div className="project-card-header">
                <div className="project-type-badge">{proj.type}</div>
                <div className="project-actions">
                  <button className="btn-icon" onClick={() => openEditModal(proj)} title="Edit Project">
                    <Edit2 size={14} />
                  </button>
                  <button className="btn-icon danger-icon" onClick={() => promptDelete(proj.id)} title="Delete Project">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="project-card-body">
                <h3 className="project-title">{proj.name}</h3>
                
                <div className="project-date-row">
                  <Calendar size={12} />
                  <span>{proj.startDate || 'N/A'} – {proj.endDate || 'Present'}</span>
                </div>

                <p className="project-short-desc">{proj.shortDesc}</p>
                
                {proj.detailedDesc && (
                  <p className="project-detail-snippet">{proj.detailedDesc}</p>
                )}

                <div className="project-tech-pills">
                  {proj.technologies && proj.technologies.map((tech) => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="project-card-footer">
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <Github size={14} />
                    <span>Source Code</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Code}
          title="No Projects Added"
          description="Build out your portfolio by adding technical, academic, or personal projects that highlight your expertise."
          actionText="Add your first project"
          onAction={openAddModal}
        />
      )}

      {/* Project Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editProject ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Project Name</label>
            <input 
              id="name"
              type="text" 
              className="form-input" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="e.g. Campus Event Tracker"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="type">Project Type</label>
              <select 
                id="type"
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Personal Project</option>
                <option>Academic Project</option>
                <option>Corporate Project</option>
                <option>Open Source Contribution</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="technologies">Technologies (comma-separated)</label>
              <input 
                id="technologies"
                type="text" 
                className="form-input" 
                value={form.technologies} 
                onChange={(e) => setForm({ ...form, technologies: e.target.value })} 
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">Start Date</label>
              <input 
                id="startDate"
                type="month" 
                className="form-input" 
                value={form.startDate} 
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="endDate">End Date (or blank for Present)</label>
              <input 
                id="endDate"
                type="month" 
                className="form-input" 
                value={form.endDate} 
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="shortDesc">Short Description</label>
            <input 
              id="shortDesc"
              type="text" 
              className="form-input" 
              value={form.shortDesc} 
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} 
              placeholder="A brief 1-sentence tagline describing the project focus."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="detailedDesc">Detailed Description</label>
            <textarea 
              id="detailedDesc"
              className="form-textarea" 
              value={form.detailedDesc} 
              onChange={(e) => setForm({ ...form, detailedDesc: e.target.value })} 
              placeholder="Explain the technical problem, your implementation stack, and the measurable outcome."
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="githubUrl">GitHub Repository Link</label>
              <input 
                id="githubUrl"
                type="url" 
                className="form-input" 
                value={form.githubUrl} 
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} 
                placeholder="https://github.com/..."
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="liveUrl">Live Demo Link</label>
              <input 
                id="liveUrl"
                type="url" 
                className="form-input" 
                value={form.liveUrl} 
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} 
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="modal-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem'}}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Project</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={executeDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will automatically remove it from your resume builder and live portfolio site."
      />

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}

      <style>{`
        .projects-page {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .projects-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }

        .project-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem;
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .project-type-badge {
          font-size: 0.7rem;
          background-color: var(--accent-light);
          color: var(--accent-color);
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 600;
        }

        .project-actions {
          display: flex;
          gap: 0.25rem;
        }

        .project-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .project-date-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .project-short-desc {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .project-detail-snippet {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .project-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-top: auto;
          margin-bottom: 1rem;
        }

        .tech-pill {
          font-size: 0.7rem;
          background-color: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .project-card-footer {
          display: flex;
          gap: 1rem;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
          margin-top: auto;
        }

        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .project-link:hover {
          color: var(--accent-color);
          text-decoration: none;
        }

        .projects-loading {
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
