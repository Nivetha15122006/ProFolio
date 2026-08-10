const fs = require('fs').promises;
const path = require('path');
const { sampleProfile, samplePortfolio, sampleUsers } = require('../data/sampleData');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure database files exist
async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Check & initialize files
    await checkAndSeed('users.json', sampleUsers);
    
    // Profiles file holds a map of username -> profile
    const initialProfiles = { "arjun": sampleProfile };
    await checkAndSeed('profiles.json', initialProfiles);
    
    // Portfolios file holds a map of username -> portfolio config
    const initialPortfolios = { "arjun": samplePortfolio };
    await checkAndSeed('portfolios.json', initialPortfolios);
  } catch (error) {
    console.error("Failed to initialize storage:", error);
  }
}

async function checkAndSeed(filename, seedData) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
  } catch {
    // File doesn't exist, create it with seed data
    await fs.writeFile(filePath, JSON.stringify(seedData, null, 2), 'utf8');
  }
}

async function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return {};
  }
}

async function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    throw error;
  }
}

// User helper functions
async function getUsers() {
  const users = await readJSON('users.json');
  return Array.isArray(users) ? users : [];
}

async function saveUser(user) {
  const users = await getUsers();
  users.push(user);
  await writeJSON('users.json', users);
}

// Profile helper functions
async function getProfile(username) {
  const profiles = await readJSON('profiles.json');
  const matchedKey = Object.keys(profiles).find(k => k.toLowerCase() === username.toLowerCase());
  if (!matchedKey || !profiles[matchedKey]) {
    // Return a default blank profile structure if none exists
    return {
      personalInfo: { fullName: "", title: "", email: "", phone: "", location: "", bio: "", website: "", avatar: "" },
      socialLinks: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: []
    };
  }
  return profiles[matchedKey];
}

async function saveProfile(username, profile) {
  const profiles = await readJSON('profiles.json');
  const matchedKey = Object.keys(profiles).find(k => k.toLowerCase() === username.toLowerCase()) || username;
  profiles[matchedKey] = profile;
  await writeJSON('profiles.json', profiles);
}

// Portfolio helper functions
async function getPortfolio(username) {
  const portfolios = await readJSON('portfolios.json');
  const matchedKey = Object.keys(portfolios).find(k => k.toLowerCase() === username.toLowerCase());
  if (!matchedKey || !portfolios[matchedKey]) {
    return samplePortfolio;
  }
  return portfolios[matchedKey];
}

async function savePortfolio(username, portfolio) {
  const portfolios = await readJSON('portfolios.json');
  portfolios[username] = portfolio;
  await writeJSON('portfolios.json', portfolios);
}

// Export initialization and functions
module.exports = {
  initStorage,
  getUsers,
  saveUser,
  getProfile,
  saveProfile,
  getPortfolio,
  savePortfolio
};
