const API_BASE = window.location.port === '5173' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Helper to make authenticated requests
async function request(endpoint, options = {}) {
  const username = localStorage.getItem('devportfolio-user');
  
  const headers = {
    ...options.headers,
  };
  
  if (username) {
    headers['Authorization'] = `Bearer ${username}`;
  }
  
  // Default headers for JSON request unless it's FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('devportfolio-user');
      window.location.href = '/login';
    }
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
}

export const api = {
  // Auth API
  auth: {
    async register(username, password, email) {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, email })
      });
      localStorage.setItem('devportfolio-user', data.username);
      return data;
    },
    async login(username, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('devportfolio-user', data.username);
      return data;
    },
    async logout() {
      await request('/auth/logout', { method: 'POST' });
      localStorage.removeItem('devportfolio-user');
    },
    getCurrentUser() {
      return localStorage.getItem('devportfolio-user');
    }
  },
  
  // Profile API
  profile: {
    get() {
      return request('/profile');
    },
    update(profileData) {
      return request('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },
    loadTemplate(templateId) {
      return request('/profile/load-template', {
        method: 'POST',
        body: JSON.stringify({ templateId })
      });
    },
    restoreBackup() {
      return request('/profile/restore-backup', {
        method: 'POST'
      });
    }
  },
  
  // Projects CRUD
  projects: {
    getAll() {
      return request('/projects');
    },
    create(project) {
      return request('/projects', {
        method: 'POST',
        body: JSON.stringify(project)
      });
    },
    update(id, project) {
      return request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project)
      });
    },
    delete(id) {
      return request(`/projects/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Skills CRUD
  skills: {
    getAll() {
      return request('/skills');
    },
    create(skill) {
      return request('/skills', {
        method: 'POST',
        body: JSON.stringify(skill)
      });
    },
    delete(id) {
      return request(`/skills/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Education CRUD
  education: {
    getAll() {
      return request('/education');
    },
    create(edu) {
      return request('/education', {
        method: 'POST',
        body: JSON.stringify(edu)
      });
    },
    delete(id) {
      return request(`/education/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Certifications CRUD
  certifications: {
    getAll() {
      return request('/certifications');
    },
    create(cert) {
      return request('/certifications', {
        method: 'POST',
        body: JSON.stringify(cert)
      });
    },
    delete(id) {
      return request(`/certifications/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Achievements CRUD
  achievements: {
    getAll() {
      return request('/achievements');
    },
    create(ach) {
      return request('/achievements', {
        method: 'POST',
        body: JSON.stringify(ach)
      });
    },
    delete(id) {
      return request(`/achievements/${id}`, {
        method: 'DELETE'
      });
    }
  },
  
  // Portfolio Builder Config
  portfolio: {
    get() {
      return request('/portfolio');
    },
    update(config) {
      return request('/portfolio', {
        method: 'PUT',
        body: JSON.stringify(config)
      });
    }
  },
  
  // Smart Resume Analyzer
  resume: {
    analyze(file) {
      const formData = new FormData();
      formData.append('resume', file);
      
      return request('/resume/analyze', {
        method: 'POST',
        body: formData
      });
    },
    enhanceText(type, text) {
      return request('/resume/ai-enhance', {
        method: 'POST',
        body: JSON.stringify({ type, text })
      });
    }
  },
  
  // Public Portfolio View API
  public: {
    getProfile(username) {
      return request(`/public/profile?username=${username}`);
    }
  }
};
