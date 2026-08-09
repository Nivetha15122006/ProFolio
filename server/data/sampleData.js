const sampleProfile = {
  personalInfo: {
    fullName: "Arjun Kumar",
    title: "AI & Full Stack Developer",
    email: "arjun.kumar@devmail.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    bio: "Passionate AI & Full Stack Developer with experience building responsive web applications and deploying machine learning models. Eager to solve real-world problems through clean, maintainable code.",
    website: "https://arjunkumar.dev",
    avatar: ""
  },
  socialLinks: [
    { id: "1", platform: "GitHub", url: "https://github.com/arjunkumar-dev" },
    { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/arjunkumar-dev" },
    { id: "3", platform: "Twitter", url: "https://twitter.com/arjunkumar_dev" }
  ],
  education: [
    {
      id: "edu_1",
      institution: "Indian Institute of Information Technology (IIIT), Bangalore",
      degree: "B.Tech",
      fieldOfStudy: "Computer Science and Engineering",
      startYear: "2022",
      endYear: "2026",
      cgpa: "9.2/10",
      description: "Specialized in Software Engineering and Artificial Intelligence. Active member of the Coding Club and Open Source Society."
    }
  ],
  skills: [
    { id: "sk_1", name: "JavaScript", category: "Programming Languages", level: "Expert" },
    { id: "sk_2", name: "Python", category: "Programming Languages", level: "Expert" },
    { id: "sk_3", name: "React", category: "Frameworks", level: "Expert" },
    { id: "sk_4", name: "Node.js", category: "Web Technologies", level: "Intermediate" },
    { id: "sk_5", name: "PostgreSQL", category: "Databases", level: "Intermediate" },
    { id: "sk_6", name: "Machine Learning", category: "AI/ML", level: "Intermediate" },
    { id: "sk_7", name: "Git", category: "Tools", level: "Expert" }
  ],
  projects: [
    {
      id: "proj_1",
      name: "Smart Agriculture Platform",
      shortDesc: "IoT-enabled dashboard for real-time soil moisture and crop health tracking using ML.",
      detailedDesc: "Developed a full-stack IoT platform integrating sensors with a React-based real-time dashboard. Implemented a light Random Forest model in Python to predict crop watering intervals. Created background event workers in Node.js to stream sensor data securely.",
      technologies: ["React", "Node.js", "Python", "PostgreSQL", "IoT"],
      githubUrl: "https://github.com/arjunkumar-dev/smart-agri",
      liveUrl: "https://smart-agri-demo.dev",
      image: "",
      type: "Academic Project",
      startDate: "2024-01",
      endDate: "2024-05"
    },
    {
      id: "proj_2",
      name: "Developer Productivity Dashboard",
      shortDesc: "SaaS dashboard tracking developer velocity and task automation with github integration.",
      detailedDesc: "Built an internal tool integrating GitHub webhooks. The frontend displays burndown charts, commit frequency, and issues resolved. Written natively in Node.js on the backend, utilizing custom EventEmitters to log commit events.",
      technologies: ["React", "Node.js", "ChartJS", "GitHub API"],
      githubUrl: "https://github.com/arjunkumar-dev/dev-velocity",
      liveUrl: "https://dev-velocity.dev",
      image: "",
      type: "Personal Project",
      startDate: "2024-08",
      endDate: "2024-11"
    }
  ],
  certifications: [
    {
      id: "cert_1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "2024-06",
      expiryDate: "2027-06",
      credentialId: "AWS-DVA-12345",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert_2",
      name: "TensorFlow Developer Certificate",
      issuer: "TensorFlow Certificate Network",
      issueDate: "2023-11",
      expiryDate: "2026-11",
      credentialId: "TF-DEV-98765",
      credentialUrl: "https://tensorflow.org/certificate"
    }
  ],
  achievements: [
    {
      id: "ach_1",
      title: "Smart City Hackathon Winner",
      description: "Won 1st place among 80 teams for proposing and prototyping an automated waste management grid system.",
      date: "2024-03",
      issuer: "Government of Karnataka"
    }
  ]
};

const samplePortfolio = {
  template: "Developer",
  theme: "dark",
  heroStyle: "minimalist",
  projectLayout: "grid",
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
  sectionOrder: [
    "hero",
    "about",
    "skills",
    "projects",
    "education",
    "certifications",
    "achievements",
    "contact"
  ]
};

const sampleUsers = [
  {
    username: "arjun",
    password: "password123",
    email: "arjun.kumar@devmail.com"
  }
];

module.exports = {
  sampleProfile,
  samplePortfolio,
  sampleUsers
};
