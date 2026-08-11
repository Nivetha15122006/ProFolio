const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  template: {
    type: String,
    default: "Developer"
  },
  theme: {
    type: String,
    default: "dark"
  },
  heroStyle: {
    type: String,
    default: "minimalist"
  },
  projectLayout: {
    type: String,
    default: "grid"
  },
  visibleSections: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },
  sectionOrder: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
