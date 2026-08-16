const storage = require('../services/storageService');
const eventEmitter = require('../events/eventLogger');
const { parseMultipart } = require('../utils/multipartParser');
const { extractText } = require('../utils/pdfParser');
const roleTemplates = require('../data/roleTemplates');

// Utility helper to send JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper to get authenticated username from headers
function getAuthenticatedUser(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// Router handler called by server.js
async function handleApiRequest(req, res, bodyBuffer) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method;
  
  console.log(`[API Router] Incoming request: ${method} ${pathname}`);
  
  // Handle CORS Preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  const username = getAuthenticatedUser(req);
  
  // Enforce authentication on all routes except auth endpoints and public showcase
  const isAuthRoute = pathname.startsWith('/api/auth/');
  const isPublicRoute = pathname === '/api/public/profile';
  if (!username && !isAuthRoute && !isPublicRoute) {
    return sendJSON(res, 401, { error: "Unauthorized. Please log in." });
  }
  
  try {
    // ----------------------------------------------------
    // PUBLIC PROFILE ROUTE (No Auth Required)
    // ----------------------------------------------------
    if (pathname === '/api/public/profile' && method === 'GET') {
      const queryUser = url.searchParams.get('username');
      if (!queryUser) {
        return sendJSON(res, 400, { error: "Username parameter is required." });
      }
      const userProfile = await storage.getProfile(queryUser);
      const userPortfolio = await storage.getPortfolio(queryUser);
      return sendJSON(res, 200, { profile: userProfile, portfolio: userPortfolio });
    }
    // ----------------------------------------------------
    // LOAD PREDEFINED ROLE TEMPLATE
    // ----------------------------------------------------
    if (pathname === '/api/profile/load-template' && method === 'POST') {
      const { templateId } = JSON.parse(bodyBuffer.toString());
      const templateData = roleTemplates[templateId];
      if (!templateData) {
        return sendJSON(res, 400, { error: "Template not found." });
      }
      
      // Backup original user profile before overwriting it (only if it's not already a template!)
      const currentProfile = await storage.getProfile(username);
      const templateNames = ["Jane Doe", "Sarah Chen", "Sophia Patel", "Marcus Aurelius", "Emily Johnson", "Arjun Patel", "Arjun"];
      const isSample = templateNames.includes(currentProfile.personalInfo?.fullName);
      if (!isSample && currentProfile.personalInfo?.fullName) {
        await storage.saveProfile(`backup_${username}`, currentProfile);
      }

      // Save template as the user's active profile details
      await storage.saveProfile(username, templateData);
      
      // Configure default layout parameters to match template type
      const defaultPortfolio = {
        template: templateId.includes('creator') ? 'Editorial' : 'Developer',
        theme: 'dark',
        heroStyle: 'minimalist',
        projectLayout: 'grid',
        visibleSections: {
          hero: true,
          about: true,
          skills: true,
          projects: true,
          education: true,
          certifications: true,
          achievements: true,
          contact: true
        },
        sectionOrder: ["hero", "about", "skills", "projects", "education", "certifications", "achievements", "contact"]
      };
      await storage.savePortfolio(username, defaultPortfolio);
      
      eventEmitter.emit('portfolioUpdated', { username, update: 'templateLoaded' });
      return sendJSON(res, 200, { message: "Template loaded successfully.", profile: templateData });
    }
    
    if (pathname === '/api/profile/restore-backup' && method === 'POST') {
      const backupProfile = await storage.getProfile(`backup_${username}`);
      
      const templateNames = ["Jane Doe", "Sarah Chen", "Sophia Patel", "Marcus Aurelius", "Emily Johnson", "Arjun Patel", "Arjun"];
      const hasBackup = backupProfile && 
                        backupProfile.personalInfo && 
                        backupProfile.personalInfo.fullName && 
                        !templateNames.includes(backupProfile.personalInfo.fullName) &&
                        backupProfile.personalInfo.fullName !== `backup_${username}`;
                        
      if (hasBackup) {
        await storage.saveProfile(username, backupProfile);
        return sendJSON(res, 200, { message: "Backup restored successfully.", profile: backupProfile });
      } else {
        // No backup exists, let's create a clean profile with their registered username!
        const cleanProfile = {
          personalInfo: { 
            fullName: username.charAt(0).toUpperCase() + username.slice(1), 
            title: "Software Engineer", 
            email: `${username.toLowerCase()}@example.com`, 
            phone: "", 
            location: "", 
            bio: "I am a professional developer.", 
            website: "", 
            avatar: "" 
          },
          socialLinks: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          achievements: []
        };
        await storage.saveProfile(username, cleanProfile);
        return sendJSON(res, 200, { message: "Clean profile initialized.", profile: cleanProfile });
      }
    }
    // ----------------------------------------------------
    // AUTHENTICATION ROUTES
    // ----------------------------------------------------
    if (pathname === '/api/auth/register' && method === 'POST') {
      const { username: regUser, password, email } = JSON.parse(bodyBuffer.toString());
      if (!regUser || !password || !email) {
        return sendJSON(res, 400, { error: "Username, password, and email are required." });
      }
      
      const users = await storage.getUsers();
      const exists = users.find(u => u.username.toLowerCase() === regUser.toLowerCase());
      if (exists) {
        return sendJSON(res, 409, { error: "Username is already registered." });
      }
      
      await storage.saveUser({ username: regUser, password, email });
      
      // Initialize an empty profile and portfolio for this new user
      const defaultProfile = {
        personalInfo: { fullName: regUser, title: "", email: email, phone: "", location: "", bio: "", website: "", avatar: "" },
        socialLinks: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: []
      };
      await storage.saveProfile(regUser, defaultProfile);
      
      return sendJSON(res, 201, { message: "User registered successfully.", username: regUser });
    }
    
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username: loginUser, password } = JSON.parse(bodyBuffer.toString());
      const users = await storage.getUsers();
      const user = users.find(u => u.username.toLowerCase() === loginUser.toLowerCase() && u.password === password);
      
      if (!user) {
        return sendJSON(res, 401, { error: "Invalid username or password." });
      }
      
      return sendJSON(res, 200, { message: "Login successful.", username: user.username });
    }
    
    if (pathname === '/api/auth/logout' && method === 'POST') {
      return sendJSON(res, 200, { message: "Logout successful." });
    }
    
    // ----------------------------------------------------
    // PROFILE ENDPOINTS (GET, PUT)
    // ----------------------------------------------------
    if (pathname === '/api/profile' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile);
    }
    
    if (pathname === '/api/profile' && method === 'PUT') {
      const incomingData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      if (incomingData.personalInfo) {
        profile.personalInfo = { ...profile.personalInfo, ...incomingData.personalInfo };
      }
      if (incomingData.socialLinks) {
        profile.socialLinks = incomingData.socialLinks;
      }
      if (incomingData.education) {
        profile.education = incomingData.education;
      }
      if (incomingData.skills) {
        profile.skills = incomingData.skills;
      }
      if (incomingData.projects) {
        profile.projects = incomingData.projects;
      }
      if (incomingData.certifications) {
        profile.certifications = incomingData.certifications;
      }
      if (incomingData.achievements) {
        profile.achievements = incomingData.achievements;
      }
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'all' });
      return sendJSON(res, 200, profile);
    }
    
    // ----------------------------------------------------
    // PROJECTS MODULE (CRUD)
    // ----------------------------------------------------
    if (pathname === '/api/projects' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile.projects || []);
    }
    
    if (pathname === '/api/projects' && method === 'POST') {
      const newProj = JSON.parse(bodyBuffer.toString());
      if (!newProj.name) {
        return sendJSON(res, 400, { error: "Project Name is required." });
      }
      
      const profile = await storage.getProfile(username);
      newProj.id = 'proj_' + Date.now();
      profile.projects = profile.projects || [];
      profile.projects.push(newProj);
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('projectCreated', { username, projectId: newProj.id, name: newProj.name });
      eventEmitter.emit('portfolioUpdated', { username, update: 'projects' });
      return sendJSON(res, 201, newProj);
    }
    
    if (pathname.startsWith('/api/projects/') && method === 'PUT') {
      const id = pathname.substring('/api/projects/'.length);
      const updateData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      const idx = profile.projects.findIndex(p => p.id === id);
      if (idx === -1) {
        return sendJSON(res, 404, { error: "Project not found." });
      }
      
      profile.projects[idx] = { ...profile.projects[idx], ...updateData, id };
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'projects' });
      return sendJSON(res, 200, profile.projects[idx]);
    }
    
    if (pathname.startsWith('/api/projects/') && method === 'DELETE') {
      const id = pathname.substring('/api/projects/'.length);
      const profile = await storage.getProfile(username);
      
      const initialLength = profile.projects.length;
      profile.projects = profile.projects.filter(p => p.id !== id);
      
      if (profile.projects.length === initialLength) {
        return sendJSON(res, 404, { error: "Project not found." });
      }
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'projects' });
      return sendJSON(res, 200, { message: "Project deleted successfully." });
    }
    
    // ----------------------------------------------------
    // SKILLS MODULE (CRUD)
    // ----------------------------------------------------
    if (pathname === '/api/skills' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile.skills || []);
    }
    
    if (pathname === '/api/skills' && method === 'POST') {
      const skill = JSON.parse(bodyBuffer.toString());
      if (!skill.name || !skill.category) {
        return sendJSON(res, 400, { error: "Skill name and category are required." });
      }
      
      const profile = await storage.getProfile(username);
      skill.id = 'sk_' + Date.now();
      profile.skills = profile.skills || [];
      profile.skills.push(skill);
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'skills' });
      return sendJSON(res, 201, skill);
    }
    
    if (pathname.startsWith('/api/skills/') && method === 'PUT') {
      const id = pathname.substring('/api/skills/'.length);
      const updateData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      const idx = profile.skills.findIndex(s => s.id === id);
      if (idx === -1) {
        return sendJSON(res, 404, { error: "Skill not found." });
      }
      
      profile.skills[idx] = { ...profile.skills[idx], ...updateData, id };
      await storage.saveProfile(username, profile);
      return sendJSON(res, 200, profile.skills[idx]);
    }
    
    if (pathname.startsWith('/api/skills/') && method === 'DELETE') {
      const id = pathname.substring('/api/skills/'.length);
      const profile = await storage.getProfile(username);
      
      profile.skills = profile.skills.filter(s => s.id !== id);
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'skills' });
      return sendJSON(res, 200, { message: "Skill removed successfully." });
    }
    
    // ----------------------------------------------------
    // EDUCATION MODULE (CRUD)
    // ----------------------------------------------------
    if (pathname === '/api/education' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile.education || []);
    }
    
    if (pathname === '/api/education' && method === 'POST') {
      const edu = JSON.parse(bodyBuffer.toString());
      if (!edu.institution || !edu.degree) {
        return sendJSON(res, 400, { error: "Institution and degree are required." });
      }
      
      const profile = await storage.getProfile(username);
      edu.id = 'edu_' + Date.now();
      profile.education = profile.education || [];
      profile.education.push(edu);
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'education' });
      return sendJSON(res, 201, edu);
    }
    
    if (pathname.startsWith('/api/education/') && method === 'PUT') {
      const id = pathname.substring('/api/education/'.length);
      const updateData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      const idx = profile.education.findIndex(e => e.id === id);
      if (idx === -1) {
        return sendJSON(res, 404, { error: "Education record not found." });
      }
      
      profile.education[idx] = { ...profile.education[idx], ...updateData, id };
      await storage.saveProfile(username, profile);
      return sendJSON(res, 200, profile.education[idx]);
    }
    
    if (pathname.startsWith('/api/education/') && method === 'DELETE') {
      const id = pathname.substring('/api/education/'.length);
      const profile = await storage.getProfile(username);
      
      profile.education = profile.education.filter(e => e.id !== id);
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'education' });
      return sendJSON(res, 200, { message: "Education record deleted." });
    }
    
    // ----------------------------------------------------
    // CERTIFICATIONS MODULE (CRUD)
    // ----------------------------------------------------
    if (pathname === '/api/certifications' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile.certifications || []);
    }
    
    if (pathname === '/api/certifications' && method === 'POST') {
      const cert = JSON.parse(bodyBuffer.toString());
      if (!cert.name || !cert.issuer) {
        return sendJSON(res, 400, { error: "Certification Name and Issuer are required." });
      }
      
      const profile = await storage.getProfile(username);
      cert.id = 'cert_' + Date.now();
      profile.certifications = profile.certifications || [];
      profile.certifications.push(cert);
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'certifications' });
      return sendJSON(res, 201, cert);
    }
    
    if (pathname.startsWith('/api/certifications/') && method === 'PUT') {
      const id = pathname.substring('/api/certifications/'.length);
      const updateData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      const idx = profile.certifications.findIndex(c => c.id === id);
      if (idx === -1) {
        return sendJSON(res, 404, { error: "Certification not found." });
      }
      
      profile.certifications[idx] = { ...profile.certifications[idx], ...updateData, id };
      await storage.saveProfile(username, profile);
      return sendJSON(res, 200, profile.certifications[idx]);
    }
    
    if (pathname.startsWith('/api/certifications/') && method === 'DELETE') {
      const id = pathname.substring('/api/certifications/'.length);
      const profile = await storage.getProfile(username);
      
      profile.certifications = profile.certifications.filter(c => c.id !== id);
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'certifications' });
      return sendJSON(res, 200, { message: "Certification deleted." });
    }
    
    // ----------------------------------------------------
    // ACHIEVEMENTS MODULE (CRUD)
    // ----------------------------------------------------
    if (pathname === '/api/achievements' && method === 'GET') {
      const profile = await storage.getProfile(username);
      return sendJSON(res, 200, profile.achievements || []);
    }
    
    if (pathname === '/api/achievements' && method === 'POST') {
      const ach = JSON.parse(bodyBuffer.toString());
      if (!ach.title) {
        return sendJSON(res, 400, { error: "Achievement title is required." });
      }
      
      const profile = await storage.getProfile(username);
      ach.id = 'ach_' + Date.now();
      profile.achievements = profile.achievements || [];
      profile.achievements.push(ach);
      
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'achievements' });
      return sendJSON(res, 201, ach);
    }
    
    if (pathname.startsWith('/api/achievements/') && method === 'PUT') {
      const id = pathname.substring('/api/achievements/'.length);
      const updateData = JSON.parse(bodyBuffer.toString());
      const profile = await storage.getProfile(username);
      
      const idx = profile.achievements.findIndex(a => a.id === id);
      if (idx === -1) {
        return sendJSON(res, 404, { error: "Achievement not found." });
      }
      
      profile.achievements[idx] = { ...profile.achievements[idx], ...updateData, id };
      await storage.saveProfile(username, profile);
      return sendJSON(res, 200, profile.achievements[idx]);
    }
    
    if (pathname.startsWith('/api/achievements/') && method === 'DELETE') {
      const id = pathname.substring('/api/achievements/'.length);
      const profile = await storage.getProfile(username);
      
      profile.achievements = profile.achievements.filter(a => a.id !== id);
      await storage.saveProfile(username, profile);
      eventEmitter.emit('portfolioUpdated', { username, update: 'achievements' });
      return sendJSON(res, 200, { message: "Achievement deleted." });
    }
    
    // ----------------------------------------------------
    // PORTFOLIO CONFIG ENDPOINTS (GET, PUT)
    // ----------------------------------------------------
    if (pathname === '/api/portfolio' && method === 'GET') {
      const portfolio = await storage.getPortfolio(username);
      return sendJSON(res, 200, portfolio);
    }
    
    if (pathname === '/api/portfolio' && method === 'PUT') {
      const portfolioData = JSON.parse(bodyBuffer.toString());
      await storage.savePortfolio(username, portfolioData);
      eventEmitter.emit('portfolioUpdated', { username, update: 'builder' });
      return sendJSON(res, 200, portfolioData);
    }
    
    // ----------------------------------------------------
    // SMART RESUME ANALYZER (FILE UPLOAD)
    // ----------------------------------------------------
    if (pathname === '/api/resume/analyze' && method === 'POST') {
      const contentType = req.headers['content-type'] || '';
      if (!contentType.includes('multipart/form-data')) {
        return sendJSON(res, 400, { error: "Request content type must be multipart/form-data" });
      }
      
      const parts = parseMultipart(bodyBuffer, contentType);
      const filePart = parts.find(p => p.name === 'resume');
      
      if (!filePart) {
        return sendJSON(res, 400, { error: "No file field named 'resume' was uploaded." });
      }
      
      const text = await extractText(filePart.data, filePart.mimeType, filePart.filename);
      
      // Perform rule-based analysis on the extracted text
      const lowerText = text.toLowerCase();
      
      let score = 0;
      const strengths = [];
      const suggestions = [];
      
      // Rule 1: Email check
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      if (emailRegex.test(lowerText)) {
        score += 10;
        strengths.push("Email contact information found.");
      } else {
        suggestions.push("Missing a valid email address in the contact section.");
      }
      
      // Rule 2: Phone number check
      const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/;
      if (phoneRegex.test(lowerText) || /\b\d{5}\s*\d{5}\b/.test(lowerText)) {
        score += 10;
        strengths.push("Phone number contact information found.");
      } else {
        suggestions.push("Missing a contact phone number.");
      }
      
      // Rule 3: GitHub link
      if (lowerText.includes('github.com')) {
        score += 10;
        strengths.push("GitHub profile URL included.");
      } else {
        suggestions.push("Add a GitHub profile link to showcase your source code.");
      }
      
      // Rule 4: LinkedIn link
      if (lowerText.includes('linkedin.com')) {
        score += 10;
        strengths.push("LinkedIn profile URL included.");
      } else {
        suggestions.push("Add a LinkedIn URL to enhance professional networking.");
      }
      
      // Rule 5: Skills section
      if (lowerText.includes('skill') || lowerText.includes('technologies') || lowerText.includes('languages')) {
        score += 15;
        strengths.push("Distinct skills section detected.");
      } else {
        suggestions.push("Add a dedicated Skills/Technologies section to help resume search filters.");
      }
      
      // Rule 6: Projects section
      if (lowerText.includes('project') || lowerText.includes('application') || lowerText.includes('development')) {
        score += 15;
        strengths.push("Projects section detected.");
      } else {
        suggestions.push("Include a Projects section outlining key technical implementations.");
      }
      
      // Rule 7: Education section
      if (lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('university') || lowerText.includes('college')) {
        score += 10;
        strengths.push("Education credentials present.");
      } else {
        suggestions.push("Specify your educational history and degrees.");
      }
      
      // Rule 8: Certifications
      if (lowerText.includes('certificat') || lowerText.includes('certified') || lowerText.includes('credential')) {
        score += 10;
        strengths.push("Certifications or credentials listed.");
      } else {
        suggestions.push("Add certifications to showcase continuous learning.");
      }
      
      // Rule 9: Word Count / Density
      const words = lowerText.split(/\s+/).filter(w => w.length > 0);
      if (words.length > 300) {
        score += 10;
        strengths.push("Good descriptive detail (sufficient text length).");
      } else if (words.length > 150) {
        score += 5;
        strengths.push("Moderate text length.");
        suggestions.push("Consider expanding your descriptions to explain measurable contributions.");
      } else {
        suggestions.push("The resume is extremely short. Add details about your projects and roles.");
      }
      
      eventEmitter.emit('resumeAnalyzed', { username, score, filename: filePart.filename });
      
      return sendJSON(res, 200, {
        score,
        strengths,
        suggestions,
        wordCount: words.length,
        filename: filePart.filename
      });
    }

    if (pathname === '/api/resume/ai-enhance' && method === 'POST') {
      const { type, text } = JSON.parse(bodyBuffer.toString());
      if (!text) {
        return sendJSON(res, 400, { error: "Text payload is required." });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      let enhancedText = "";
      let isAiPowered = false;
      
      if (apiKey) {
        try {
          const prompt = type === 'bio'
            ? `You are an expert resume writer. Rewrite the following professional summary bio to make it highly engaging, standard for top tech companies, and highlight key strengths. Keep it concise, professional, and matching a first-person or third-person standard narrative (do not include headings or extra text, just output the enhanced paragraph). Maximum 3-4 sentences. Original text: "${text}"`
            : `You are an expert technical resume writer. Rewrite the following project description to emphasize measurable impact, technologies used, and professional outcome. Keep it concise, and output exactly 2 to 3 bullet points using standard format (do not include markdown headings, just return the list of bullet points). Original text: "${text}"`;
            
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt }
                  ]
                }
              ]
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
              enhancedText = data.candidates[0].content.parts[0].text.trim();
              isAiPowered = true;
            }
          }
        } catch (err) {
          console.error("[Gemini API call failed, falling back to heuristics]", err);
        }
      }
      
      if (!isAiPowered) {
        enhancedText = runHeuristicOptimizer(type, text);
      }
      
      eventEmitter.emit('portfolioUpdated', { username, update: 'aiEnhanced' });
      return sendJSON(res, 200, { enhancedText, isAiPowered });
    }
    
    // Path not found
    return sendJSON(res, 404, { error: `Endpoint not found: ${method} ${pathname}` });
    
  } catch (error) {
    console.error(`[Server API Error]`, error);
    return sendJSON(res, 500, { error: error.message || "Internal server error." });
  }
}

function runHeuristicOptimizer(type, text) {
  let cleaned = text.trim();
  
  if (type === 'bio') {
    if (cleaned.length < 30) {
      return `Results-driven Software Engineer with a passion for building high-performance web applications. Experienced in utilizing modern javascript libraries and frameworks to build scalable frontend architectures and robust backend services.`;
    }
    
    let optimized = cleaned
      .replace(/\b(helped build|worked on|helped with)\b/gi, 'spearheaded the engineering of')
      .replace(/\b(made|created|built)\b/gi, 'architected and deployed')
      .replace(/\b(handled|did|took care of)\b/gi, 'orchestrated')
      .replace(/\b(good at|know)\b/gi, 'proficient in utilizing');
      
    if (!optimized.includes('%') && !optimized.toLowerCase().includes('latency')) {
      optimized += " Dedicated to optimizing component rendering pathways to improve rendering latency by 30% and boost lighthouse audit scores.";
    }
    return optimized;
  }
  
  if (type === 'project') {
    if (cleaned.length < 20) {
      return `• Architected and developed the application interface utilizing modern tech stack components.\n• Engineered backend queries to optimize response delivery, reducing load latency by 25%.\n• Maintained continuous integration pipelines to facilitate smooth team deployment cycles.`;
    }
    
    let bulletPoints = [];
    const sentences = cleaned.split(/[.•\n]/).map(s => s.trim()).filter(s => s.length > 8);
    
    if (sentences.length > 0) {
      sentences.forEach((sentence, idx) => {
        let enhanced = sentence;
        if (/^(i |we )?(helped|worked|did|made|created|built|handled)/i.test(enhanced)) {
          enhanced = enhanced.replace(/^(i |we )?(helped build|worked on|helped with)/i, 'Spearheaded the engineering of')
                             .replace(/^(i |we )?(made|created|built)/i, 'Architected and deployed')
                             .replace(/^(i |we )?(handled|did|took care of)/i, 'Orchestrated');
        } else {
          enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
        }
        
        if (idx === 0 && !enhanced.includes('%')) {
          enhanced += ", increasing page speeds and system efficiency metrics by 25%";
        }
        if (idx === 1 && !enhanced.includes('latency')) {
          enhanced += ", reducing query latency by 30% and securing concurrent user requests";
        }
        
        bulletPoints.push(`• ${enhanced}.`);
      });
    }
    
    if (bulletPoints.length === 0) {
      bulletPoints.push(`• Engineered the project flow and structure from scratch, deploying key features.`);
      bulletPoints.push(`• Optimized code performance to decrease resource consumption metrics by 20%.`);
    } else if (bulletPoints.length === 1) {
      bulletPoints.push(`• Deployed secure endpoints to improve data transit safety, reducing load overhead by 15%.`);
    }
    
    return bulletPoints.slice(0, 3).join('\n');
  }
  
  return cleaned;
}

module.exports = {
  handleApiRequest
};
