const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const { sampleProfile, samplePortfolio, sampleUsers } = require('../data/sampleData');

// Mongoose Models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Portfolio = require('../models/Portfolio');

const DATA_DIR = path.join(__dirname, '../data');
let useMongoDB = false;

// Ensure database files exist
async function initStorage() {
  // 1. Ensure file system directories are ready in case of fallback
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create file data directory:", err);
  }

  // 2. Attempt MongoDB connectivity (local Mongoose instance)
  try {
    console.log("[Database] Connecting to MongoDB...");
    // 2-second timeout so the server doesn't freeze if MongoDB is not running locally
    await mongoose.connect('mongodb://127.0.0.1:27017/profolio', {
      serverSelectionTimeoutMS: 2000
    });
    useMongoDB = true;
    console.log("[Database] MongoDB connected successfully.");
    
    // Seed initial admin/test account into MongoDB if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[Database] Seeding initial users into MongoDB...");
      await User.insertMany(sampleUsers);
      await Profile.create({ username: 'arjun', ...sampleProfile });
      await Portfolio.create({ username: 'arjun', ...samplePortfolio });
      console.log("[Database] MongoDB database seeded successfully.");
    }
  } catch (error) {
    console.warn("[Database] MongoDB connection failed. Falling back to local JSON database.");
    useMongoDB = false;
    
    // Seed fallback JSON files
    await checkAndSeed('users.json', sampleUsers);
    const initialProfiles = { "arjun": sampleProfile };
    await checkAndSeed('profiles.json', initialProfiles);
    const initialPortfolios = { "arjun": samplePortfolio };
    await checkAndSeed('portfolios.json', initialPortfolios);
  }
}

async function checkAndSeed(filename, seedData) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.access(filePath);
  } catch {
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
  if (useMongoDB) {
    try {
      return await User.find({}).lean();
    } catch (err) {
      console.error("MongoDB getUsers failed, falling back to JSON file:", err);
    }
  }
  const users = await readJSON('users.json');
  return Array.isArray(users) ? users : [];
}

async function saveUser(user) {
  if (useMongoDB) {
    try {
      const newUser = new User(user);
      await newUser.save();
      return;
    } catch (err) {
      console.error("MongoDB saveUser failed, falling back to JSON file:", err);
    }
  }
  const users = await getUsers();
  users.push(user);
  await writeJSON('users.json', users);
}

// Profile helper functions
async function getProfile(username) {
  if (useMongoDB) {
    try {
      let profile = await Profile.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }).lean();
      if (!profile) {
        if (username.toLowerCase() === 'arjun') {
          profile = await Profile.create({ username: 'arjun', ...sampleProfile });
        } else {
          return {
            personalInfo: { fullName: username, title: "", email: "", phone: "", location: "", bio: "", website: "", avatar: "" },
            socialLinks: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            achievements: []
          };
        }
      }
      return profile;
    } catch (err) {
      console.error("MongoDB getProfile failed, falling back to JSON file:", err);
    }
  }

  const profiles = await readJSON('profiles.json');
  const matchedKey = Object.keys(profiles).find(k => k.toLowerCase() === username.toLowerCase());
  if (!matchedKey || !profiles[matchedKey]) {
    return {
      personalInfo: { fullName: username, title: "", email: "", phone: "", location: "", bio: "", website: "", avatar: "" },
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
  if (useMongoDB) {
    try {
      const existing = await Profile.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      const key = existing ? existing.username : username;
      
      const { _id, __v, ...profileData } = profile;
      await Profile.findOneAndUpdate(
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { ...profileData, username: key },
        { upsert: true, returnDocument: 'after' }
      );
      return;
    } catch (err) {
      console.error("MongoDB saveProfile failed, falling back to JSON file:", err);
    }
  }

  const profiles = await readJSON('profiles.json');
  const matchedKey = Object.keys(profiles).find(k => k.toLowerCase() === username.toLowerCase()) || username;
  profiles[matchedKey] = profile;
  await writeJSON('profiles.json', profiles);
}

// Portfolio helper functions
async function getPortfolio(username) {
  if (useMongoDB) {
    try {
      let portfolio = await Portfolio.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }).lean();
      if (!portfolio) {
        if (username.toLowerCase() === 'arjun') {
          portfolio = await Portfolio.create({ username: 'arjun', ...samplePortfolio });
        } else {
          return samplePortfolio;
        }
      }
      return portfolio;
    } catch (err) {
      console.error("MongoDB getPortfolio failed, falling back to JSON file:", err);
    }
  }

  const portfolios = await readJSON('portfolios.json');
  const matchedKey = Object.keys(portfolios).find(k => k.toLowerCase() === username.toLowerCase());
  if (!matchedKey || !portfolios[matchedKey]) {
    return samplePortfolio;
  }
  return portfolios[matchedKey];
}

async function savePortfolio(username, portfolio) {
  if (useMongoDB) {
    try {
      const existing = await Portfolio.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
      const key = existing ? existing.username : username;
      
      const { _id, __v, ...portfolioData } = portfolio;
      await Portfolio.findOneAndUpdate(
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { ...portfolioData, username: key },
        { upsert: true, returnDocument: 'after' }
      );
      return;
    } catch (err) {
      console.error("MongoDB savePortfolio failed, falling back to JSON file:", err);
    }
  }

  const portfolios = await readJSON('portfolios.json');
  portfolios[username] = portfolio;
  await writeJSON('portfolios.json', portfolios);
}

module.exports = {
  initStorage,
  getUsers,
  saveUser,
  getProfile,
  saveProfile,
  getPortfolio,
  savePortfolio
};
