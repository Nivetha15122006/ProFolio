// Predefined role-based resume templates with realistic mock data
const roleTemplates = {
  software_frontend: {
    personalInfo: {
      fullName: "Jane Doe",
      title: "Senior Front-End Engineer",
      email: "jane.doe@frontenddev.com",
      phone: "+1 555 123 4567",
      location: "San Francisco, CA",
      bio: "Highly creative Front-End Developer with 4+ years of experience specializing in React, TypeScript, responsive layouts, and performance optimization. Dedicated to crafting fluid user interfaces and high-velocity workflows.",
      website: "https://janedoe.dev",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com/janedoe-dev" },
      { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/janedoe-dev" }
    ],
    education: [
      {
        id: "edu_fe_1",
        institution: "University of California, Berkeley",
        degree: "B.S.",
        fieldOfStudy: "Computer Science",
        startYear: "2018",
        endYear: "2022",
        cgpa: "3.8/4.0",
        description: "Focus on human-computer interaction and web standards."
      }
    ],
    skills: [
      { id: "sk_fe_1", name: "React", category: "Frameworks", level: "Expert" },
      { id: "sk_fe_2", name: "TypeScript", category: "Programming Languages", level: "Expert" },
      { id: "sk_fe_3", name: "CSS/TailwindCSS", category: "Design Tools", level: "Expert" },
      { id: "sk_fe_4", name: "Redux Toolkit", category: "Web Technologies", level: "Expert" }
    ],
    projects: [
      {
        id: "proj_fe_1",
        name: "E-Commerce CommerceFlow",
        shortDesc: "High-performance React storefront serving over 10k daily active buyers.",
        detailedDesc: "Rebuilt the legacy storefront in Next.js/React, improving dynamic page-speed index score by 35%. Optimized image loading strategies and reduced bundle size.",
        technologies: ["React", "Next.js", "Redux", "TailwindCSS"],
        githubUrl: "https://github.com/jane/commerceflow",
        liveUrl: "https://commerceflow-demo.dev",
        type: "Personal Project",
        startDate: "2023-02",
        endDate: "2023-08"
      },
      {
        id: "proj_fe_2",
        name: "Collaborative Whiteboard Canvas",
        shortDesc: "Real-time vector sketch board utilizing HTML5 Canvas and WebSocket rooms.",
        detailedDesc: "Developed a canvas painting board with zoom/pan and multi-user drawing replication using WebSockets. Handled local coordinate calculations.",
        technologies: ["JavaScript", "HTML5 Canvas", "WebSocket", "React"],
        githubUrl: "https://github.com/jane/whiteboard",
        liveUrl: "https://whiteboard-demo.dev",
        type: "Academic Project",
        startDate: "2022-09",
        endDate: "2022-12"
      }
    ],
    certifications: [
      {
        id: "cert_fe_1",
        name: "Meta Front-End Developer Certificate",
        issuer: "Coursera / Meta",
        issueDate: "2023-01",
        expiryDate: "",
        credentialId: "META-FE-9981",
        credentialUrl: "https://coursera.org"
      }
    ],
    achievements: [
      {
        id: "ach_fe_1",
        title: "UX Design Hackathon - 1st Place",
        description: "Designed and prototyped an eco-routing transport map in under 24 hours.",
        date: "2023-05",
        issuer: "TechCrunch Disrupt"
      }
    ]
  },
  
  software_backend: {
    personalInfo: {
      fullName: "Robert Smith",
      title: "Back-End Systems Engineer",
      email: "robert.smith@backendops.net",
      phone: "+1 555 987 6543",
      location: "Austin, TX",
      bio: "Back-end software engineer passionate about scalable API design, database query optimizations, cloud configurations, and distributed systems. Expert in Node.js, Docker, and PostgreSQL.",
      website: "https://robertsmith.codes",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com/robert-backend" }
    ],
    education: [
      {
        id: "edu_be_1",
        institution: "University of Texas, Austin",
        degree: "M.S.",
        fieldOfStudy: "Software Engineering",
        startYear: "2020",
        endYear: "2022",
        cgpa: "3.9/4.0",
        description: "Specialized in distributed database management systems."
      }
    ],
    skills: [
      { id: "sk_be_1", name: "Node.js", category: "Programming Languages", level: "Expert" },
      { id: "sk_be_2", name: "PostgreSQL", category: "Databases", level: "Expert" },
      { id: "sk_be_3", name: "Docker", category: "Tools", level: "Expert" },
      { id: "sk_be_4", name: "Redis Cache", category: "Web Technologies", level: "Intermediate" }
    ],
    projects: [
      {
        id: "proj_be_1",
        name: "Distributed API Gateway Manager",
        shortDesc: "A reverse proxy and request controller managing custom rate limits and payload audits.",
        detailedDesc: "Programmed a custom API gateway in Node.js utilizing stream handling to pipeline request payloads directly. Lowered CPU load overhead by 40%.",
        technologies: ["Node.js", "Redis", "Streams", "Docker"],
        githubUrl: "https://github.com/robert/gateway",
        liveUrl: "",
        type: "Personal Project",
        startDate: "2023-04",
        endDate: "2023-10"
      },
      {
        id: "proj_be_2",
        name: "Log Pipeline Event Streaming Hub",
        shortDesc: "Scalable pub-sub logging queue piping process logs to file write streams.",
        detailedDesc: "Created a real-time event pipeline in raw Node.js utilizing custom event emitters to write structured audit traces into rotated files.",
        technologies: ["Node.js", "EventEmitters", "Writable Streams"],
        githubUrl: "https://github.com/robert/pipeline",
        liveUrl: "",
        type: "Academic Project",
        startDate: "2021-09",
        endDate: "2021-12"
      }
    ],
    certifications: [
      {
        id: "cert_be_1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023-04",
        expiryDate: "2026-04",
        credentialId: "AWS-ASA-2248",
        credentialUrl: "https://aws.amazon.com"
      }
    ],
    achievements: [
      {
        id: "ach_be_1",
        title: "Open Source Contributor of the Year",
        description: "Contributed core query optimizations directly into a major SQL library.",
        date: "2023-11",
        issuer: "OpenSource Coalition"
      }
    ]
  },

  ml_vision: {
    personalInfo: {
      fullName: "Dr. Sarah Chen",
      title: "Computer Vision Research Engineer",
      email: "sarah.chen@ai-labs.org",
      phone: "+1 555 333 4444",
      location: "Boston, MA",
      bio: "R&D engineer with a PhD in Machine Learning. Specializing in convolutional networks, object localization, image segmentation, and edge AI deployment. Experienced with PyTorch and CUDA.",
      website: "https://sarahchen.ai",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com/sarahchen-vision" }
    ],
    education: [
      {
        id: "edu_ml_1",
        institution: "Massachusetts Institute of Technology (MIT)",
        degree: "PhD",
        fieldOfStudy: "Electrical Engineering & Computer Science",
        startYear: "2018",
        endYear: "2023",
        cgpa: "4.0/4.0",
        description: "Thesis: Real-time Object Tracking in High-Occlusion Video Streams."
      }
    ],
    skills: [
      { id: "sk_ml_1", name: "Python", category: "Programming Languages", level: "Expert" },
      { id: "sk_ml_2", name: "PyTorch", category: "AI/ML", level: "Expert" },
      { id: "sk_ml_3", name: "OpenCV", category: "AI/ML", level: "Expert" },
      { id: "sk_ml_4", name: "CUDA Optimization", category: "Tools", level: "Intermediate" }
    ],
    projects: [
      {
        id: "proj_ml_1",
        name: "Autonomous Lane & Object Tracker",
        shortDesc: "CNN model detecting vehicle lanes and street obstacles at 60 FPS on edge accelerators.",
        detailedDesc: "Designed and trained a custom ResNet-based lane detection model. Quantized weights to INT8 to run inference on Jetson devices.",
        technologies: ["Python", "PyTorch", "OpenCV", "TensorRT"],
        githubUrl: "https://github.com/sarah/lane-tracker",
        liveUrl: "",
        type: "Academic Project",
        startDate: "2022-01",
        endDate: "2022-08"
      },
      {
        id: "proj_ml_2",
        name: "Synthetic Image Augmentation Toolkit",
        shortDesc: "GAN framework generating realistic medical scan datasets to resolve data scarcity.",
        detailedDesc: "Created generative adversarial networks to synthesize labeled MRI scan graphics, reducing training bias for clinical segmentation tools.",
        technologies: ["Python", "TensorFlow", "Generative AI"],
        githubUrl: "https://github.com/sarah/med-gan",
        liveUrl: "",
        type: "Personal Project",
        startDate: "2023-01",
        endDate: "2023-06"
      }
    ],
    certifications: [
      {
        id: "cert_ml_1",
        name: "NVIDIA Deep Learning Institute Specialist",
        issuer: "NVIDIA",
        issueDate: "2021-10",
        expiryDate: "",
        credentialId: "NV-DLI-877",
        credentialUrl: "https://nvidia.com"
      }
    ],
    achievements: [
      {
        id: "ach_ml_1",
        title: "Best Paper Award - CVPR Workshop",
        description: "Awarded top research paper for novel image augmentation techniques using GANs.",
        date: "2023-06",
        issuer: "CVPR Committee"
      }
    ]
  },

  ml_nlp: {
    personalInfo: {
      fullName: "Elena Rostova",
      title: "NLP Systems Scientist",
      email: "elena.rostova@nlpworks.com",
      phone: "+1 555 456 7890",
      location: "Seattle, WA",
      bio: "AI Developer focusing on Natural Language Processing, Transformer architectures, semantic vector search, and Large Language Model (LLM) fine-tuning. Proficient with HuggingFace, PyTorch, and vector databases.",
      website: "https://elena-nlp.ai",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com/elena-nlp" }
    ],
    education: [
      {
        id: "edu_nlp_1",
        institution: "University of Washington",
        degree: "M.S.",
        fieldOfStudy: "Computational Linguistics",
        startYear: "2020",
        endYear: "2022",
        cgpa: "3.95/4.0",
        description: "Specialized in semantic search and machine translation algorithms."
      }
    ],
    skills: [
      { id: "sk_nlp_1", name: "Python", category: "Programming Languages", level: "Expert" },
      { id: "sk_nlp_2", name: "Transformers (HuggingFace)", category: "AI/ML", level: "Expert" },
      { id: "sk_nlp_3", name: "Semantic Search", category: "AI/ML", level: "Expert" },
      { id: "sk_nlp_4", name: "Qdrant VectorDB", category: "Databases", level: "Intermediate" }
    ],
    projects: [
      {
        id: "proj_nlp_1",
        name: "Enterprise Semantic Knowledge Graph",
        shortDesc: "Semantic vector search engine parsing thousands of PDF manuals in 50ms.",
        detailedDesc: "Built an internal semantic Q&A interface using sentence-transformers to index unstructured PDFs. Integrated a vector index backend for rapid retrieval.",
        technologies: ["Python", "HuggingFace", "Qdrant", "FastAPI"],
        githubUrl: "https://github.com/elena/semantic-search",
        liveUrl: "",
        type: "Personal Project",
        startDate: "2023-03",
        endDate: "2023-09"
      },
      {
        id: "proj_nlp_2",
        name: "Custom Sentiment Tokenizer",
        shortDesc: "A custom token classification network evaluating customer review logs.",
        detailedDesc: "Fine-tuned a RoBERTa model to extract key product qualities and sentiment polarity from raw customer logs and chat feedback pipelines.",
        technologies: ["Python", "PyTorch", "Transformers"],
        githubUrl: "https://github.com/elena/sentiment-roberta",
        liveUrl: "",
        type: "Academic Project",
        startDate: "2021-10",
        endDate: "2022-02"
      }
    ],
    certifications: [
      {
        id: "cert_nlp_1",
        name: "DeepLearning.AI NLP Specialization",
        issuer: "DeepLearning.AI / Coursera",
        issueDate: "2022-05",
        expiryDate: "",
        credentialId: "DL-NLP-4482",
        credentialUrl: "https://coursera.org"
      }
    ],
    achievements: [
      {
        id: "ach_nlp_1",
        title: "Kaggle Bronze Medal - NLP Text Matching",
        description: "Placed in the top 7% in a text classification contest matching scientific queries to papers.",
        date: "2022-08",
        issuer: "Kaggle"
      }
    ]
  },

  creator_designer: {
    personalInfo: {
      fullName: "Alex Rivera",
      title: "UI/UX Product Designer",
      email: "alex.rivera@productdesign.co",
      phone: "+1 555 888 9999",
      location: "New York, NY",
      bio: "Visual thinker and UX researcher with 3+ years of experience crafting interactive layouts, designing visual design systems, conducting user tests, and drafting mobile wireframes.",
      website: "https://alexrivera.design",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/alex-design" }
    ],
    education: [
      {
        id: "edu_des_1",
        institution: "Pratt Institute",
        degree: "B.F.A.",
        fieldOfStudy: "Communications Design (UI/UX focus)",
        startYear: "2019",
        endYear: "2023",
        cgpa: "3.75/4.0",
        description: "Coursework on digital product design, usability engineering, and typography."
      }
    ],
    skills: [
      { id: "sk_des_1", name: "Figma", category: "Design Tools", level: "Expert" },
      { id: "sk_des_2", name: "Adobe Creative Cloud", category: "Design Tools", level: "Expert" },
      { id: "sk_des_3", name: "Wireframing & UI Prototyping", category: "Tools", level: "Expert" },
      { id: "sk_des_4", name: "CSS Flexbox/Grid layouts", category: "Design Tools", level: "Intermediate" }
    ],
    projects: [
      {
        id: "proj_des_1",
        name: "Micro-Investing Mobile App UI",
        shortDesc: "Complete interactive Figma design flow and visual system for a high-security banking app.",
        detailedDesc: "Created 80+ high-fidelity frames for target users. Conducted usability interviews with 15 users, lowering friction rates in checkout by 25%.",
        technologies: ["Figma", "Interaction Design", "User Testing"],
        githubUrl: "",
        liveUrl: "https://figma.com/file/investing-ui-mock",
        type: "Personal Project",
        startDate: "2023-01",
        endDate: "2023-06"
      },
      {
        id: "proj_des_2",
        name: "Local Library Portal Redesign",
        shortDesc: "Re-conceptualized portal wireframes mapping user booking and archive search flows.",
        detailedDesc: "Designed interactive responsive wireframes. Built out component states and simplified information structures for older demographic accessibility.",
        technologies: ["Figma", "Information Architecture", "Wireframing"],
        githubUrl: "",
        liveUrl: "",
        type: "Academic Project",
        startDate: "2022-09",
        endDate: "2022-12"
      }
    ],
    certifications: [
      {
        id: "cert_des_1",
        name: "Google UX Design Professional Certificate",
        issuer: "Google / Coursera",
        issueDate: "2022-04",
        expiryDate: "",
        credentialId: "GGL-UX-765",
        credentialUrl: "https://coursera.org"
      }
    ],
    achievements: [
      {
        id: "ach_des_1",
        title: "Behance Featured Project - Mobile Banking",
        description: "Design mockups were selected and featured in the official UI/UX design showcase category.",
        date: "2023-08",
        issuer: "Behance Curation Team"
      }
    ]
  },

  creator_writer: {
    personalInfo: {
      fullName: "Maya Patel",
      title: "Technical Writer & Developer Advocate",
      email: "maya.patel@techwriter.dev",
      phone: "+1 555 666 7777",
      location: "Denver, CO",
      bio: "Technical writer, blogger, and content strategist dedicated to simplifying developer tutorials, coding documentation, API guides, and editing educational tech video scripts.",
      website: "https://mayapateledu.dev",
      avatar: ""
    },
    socialLinks: [
      { id: "1", platform: "GitHub", url: "https://github.com/mayawrites-codes" }
    ],
    education: [
      {
        id: "edu_wri_1",
        institution: "University of Colorado, Boulder",
        degree: "B.A.",
        fieldOfStudy: "English & Computer Science (Minor)",
        startYear: "2018",
        endYear: "2022",
        cgpa: "3.7/4.0",
        description: "Coursework in computing concepts, web design, and technical writing style."
      }
    ],
    skills: [
      { id: "sk_wri_1", name: "Technical Writing", category: "Writing Tools", level: "Expert" },
      { id: "sk_wri_2", name: "Markdown & Docs-as-Code", category: "Tools", level: "Expert" },
      { id: "sk_wri_3", name: "JavaScript / Python basics", category: "Programming Languages", level: "Intermediate" },
      { id: "sk_wri_4", name: "Video Production & Editing", category: "Writing Tools", level: "Intermediate" }
    ],
    projects: [
      {
        id: "proj_wri_1",
        name: "Full Stack Node.js Video Tutorial Series",
        shortDesc: "A complete 10-part video course explaining streams, buffers, and event loops.",
        detailedDesc: "Wrote all code walkthrough drafts, recorded high-fidelity screen tutorials, edited audio, and published scripts, achieving 5k+ developer views.",
        technologies: ["Node.js", "Video Editing", "Content Strategy"],
        githubUrl: "https://github.com/maya/node-streams-course",
        liveUrl: "https://youtube.com/maya-tech-course",
        type: "Personal Project",
        startDate: "2023-05",
        endDate: "2023-09"
      },
      {
        id: "proj_wri_2",
        name: "API Reference Documentation Re-draft",
        shortDesc: "A rewritten technical manual for an open-source HTTP client library.",
        detailedDesc: "Re-structured REST documentation guidelines. Created functional code snippets demonstrating GET/POST requests and response buffers.",
        technologies: ["Markdown", "REST APIs", "Technical Writing"],
        githubUrl: "https://github.com/maya/http-client-docs",
        liveUrl: "",
        type: "Academic Project",
        startDate: "2022-01",
        endDate: "2022-04"
      }
    ],
    certifications: [
      {
        id: "cert_wri_1",
        name: "Google Technical Writing Course I & II",
        issuer: "Google Tech Writers Network",
        issueDate: "2022-07",
        expiryDate: "",
        credentialId: "GGL-TW-281",
        credentialUrl: "https://developers.google.com/tech-writing"
      }
    ],
    achievements: [
      {
        id: "ach_wri_1",
        title: "Top Writer Badge - dev.to",
        description: "Awarded top contributor badge in Node.js and Web Development writing categories.",
        date: "2023-10",
        issuer: "Dev.to Community"
      }
    ]
  }
};

module.exports = roleTemplates;
