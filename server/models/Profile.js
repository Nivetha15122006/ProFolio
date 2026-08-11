const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  id: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true }
});

const EducationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  institution: { type: String, required: true },
  degree: { type: String, default: "" },
  fieldOfStudy: { type: String, default: "" },
  startYear: { type: String, default: "" },
  endYear: { type: String, default: "" },
  cgpa: { type: String, default: "" },
  description: { type: String, default: "" }
});

const SkillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: "" },
  level: { type: String, default: "" }
});

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  shortDesc: { type: String, default: "" },
  detailedDesc: { type: String, default: "" },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: "" },
  liveUrl: { type: String, default: "" },
  image: { type: String, default: "" },
  type: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" }
});

const CertificationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  issuer: { type: String, default: "" },
  issueDate: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  credentialId: { type: String, default: "" },
  credentialUrl: { type: String, default: "" }
});

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: String, default: "" },
  issuer: { type: String, default: "" }
});

const ProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  personalInfo: {
    fullName: { type: String, default: "" },
    title: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  socialLinks: [SocialLinkSchema],
  education: [EducationSchema],
  skills: [SkillSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  achievements: [AchievementSchema]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
