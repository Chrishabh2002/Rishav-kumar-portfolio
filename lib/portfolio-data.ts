/**
 * Single source of truth for every piece of résumé content rendered on the site.
 * Sections import from here so copy stays in sync across UI, AI assistant and SEO.
 */

export const profile = {
  name: "Rishav Kumar",
  initials: "RK",
  headline: "AI Software Engineer",
  altHeadline: "AI Security Engineer",
  roles: [
    "AI Software Engineer",
    "AI Security Engineer",
    "Backend & Automation Engineer",
    "ML / LLM Systems Builder",
  ],
  location: "Noida, India",
  phone: "+91 6398904235",
  phoneHref: "+916398904235",
  email: "chrishabh2002@gmail.com",
  linkedin: "https://linkedin.com/in/rishav-kumar-983a5b273",
  github: "https://github.com/Chrishabh2002",
  resume: "/Rishav-Kumar-Resume.pdf",
  avatar:
    "https://storage.googleapis.com/cosmic-project-image-assets/images/620d6fa5-1ebf-4853-9fd3-ab1ae0148eb9/Rishabh.jpg",
  summary:
    "Engineer with experience building backend platforms, automation tools, and AI systems for real-world operational use. Worked on command-execution agents, production APIs, and security-oriented workflows across fast-moving startup teams. Strong with Python, Linux environments, system debugging, and designing software that balances speed, reliability, and scale.",
  openTo: ["AI / Backend Engineering roles", "LLM & agent systems", "Security automation"],
  availability: "Open to work",
} as const;

export type Experience = {
  id: string;
  title: string;
  altTitle?: string;
  company: string;
  mode: string;
  period: string;
  location: string;
  /** Official company logo in /public/logos (transparent PNG, tuned for dark UI). */
  logoImage: string;
  /** Iconify fallback rendered if the logo file ever fails to load. */
  logo: string;
  website?: string;
  accent: string;
  current?: boolean;
  description: string[];
  techStack: string;
};

export const experiences: Experience[] = [
  {
    id: "cyberrant",
    title: "AI Software Engineer",
    altTitle: "AI Security Engineer",
    company: "Cyberrant Limited",
    mode: "Remote",
    period: "Oct 2025 — Present",
    location: "London, UK",
    logoImage: "/logos/cyberrant.png",
    logo: "mdi:shield-lock-outline",
    website: "https://cyberrant.org",
    accent: "from-rose-500 to-orange-500",
    current: true,
    description: [
      "Worked on AI products built for cybersecurity operations, technical automation, and developer workflows",
      "Built controlled task-execution systems capable of running terminal operations in Linux environments",
      "Developed modules for command routing, execution tracking, and result summarization",
      "Improved workflow reliability through logging, retry handling, and environment diagnostics",
      "Assisted code inspection and vulnerability-oriented workflows for faster issue discovery",
    ],
    techStack: "Python, LLM Agents, Linux, Shell Scripting, FastAPI, Docker",
  },
  {
    id: "momntumai",
    title: "Software Engineer",
    company: "MomntumAI LLC",
    mode: "Remote",
    period: "Jan 2025 — Oct 2025",
    location: "Nashville, United States",
    logoImage: "/logos/momntumai.png",
    logo: "mdi:rocket-launch-outline",
    website: "https://momntumai.com",
    accent: "from-sky-500 to-cyan-500",
    description: [
      "Built backend services in Python powering live product workflows and user-facing features",
      "Redesigned API flows and data access patterns, improving response efficiency and retrieval speed",
      "Worked closely with changing product requirements in a fast-moving startup environment",
      "Assisted in deploying updates across 10+ production systems using CI/CD workflows, ensuring zero downtime releases",
      "Built and enhanced UI for mission-critical enterprise software, increasing usability by 30%",
      "Integrated multiple third-party APIs, reducing data retrieval latency by 40%",
      "Debugged and tested secure communication protocols, ensuring compliance with industry security standards",
      "Conducted peer code reviews, reducing production errors by 15%",
    ],
    techStack: "Python, Flask, FastAPI, React, Node.js, REST APIs, AWS, CI/CD",
  },
  {
    id: "myjobgrow",
    title: "Machine Learning Intern",
    company: "My Job Grow Private Limited",
    mode: "On-site",
    period: "Jul 2024 — Sep 2024",
    location: "Bengaluru, India",
    logoImage: "/logos/myjobgrow.png",
    logo: "mdi:chart-timeline-variant-shimmer",
    website: "https://myjobgrow.com",
    accent: "from-violet-500 to-fuchsia-500",
    description: [
      "Built end-to-end ML pipelines covering data preparation, training, and evaluation",
      "Improved model quality through structured experiments and metric-based evaluation",
      "Worked with Python, Pandas, Scikit-learn, and TensorFlow for production-style ML workflows",
      "Conducted data preprocessing, feature engineering, and model evaluation on large-scale datasets",
      "Applied supervised ML techniques (Regression, Classification, Decision Trees, Random Forests, SVM)",
      "Improved model accuracy through hyperparameter tuning and pipeline optimization",
    ],
    techStack: "Python, Scikit-learn, Pandas, Matplotlib, TensorFlow",
  },
];

export type Project = {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  org: string;
  /** Logo of the company the project was built for, when it's commercial work. */
  orgLogo?: string;
  period: string;
  kind: "Commercial" | "Personal" | "Academic";
  accent: string;
  description: string;
  features: string[];
  techStack: string;
  aiContext: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "ask-rant-ai",
    title: "Ask Rant AI / Rant AI Agent",
    icon: "mdi:shield-search",
    tagline: "Cybersecurity guidance + local task execution agent",
    org: "Cyberrant Limited · London, UK",
    orgLogo: "/logos/cyberrant.png",
    period: "Oct 2025 — Present",
    kind: "Commercial",
    accent: "from-rose-500 to-orange-500",
    featured: true,
    description:
      "Commercial AI agents used for cybersecurity guidance and local technical task execution, with controlled shell access and structured reporting.",
    features: [
      "Contributed to commercial AI agents for cybersecurity guidance and local task execution",
      "Built features for shell command workflows, code checks, and automated diagnostics",
      "Added structured reporting for outputs, errors, and recommended next actions",
      "Command routing, execution tracking and result summarization modules",
    ],
    techStack: "Python, LLM Agents, Linux, Shell Scripting, FastAPI, Docker",
    aiContext:
      "Explain Ask Rant AI / Rant AI Agent: a commercial Cyberrant AI agent for cybersecurity guidance and controlled local command execution, with command routing, diagnostics and structured reporting.",
  },
  {
    id: "eaiser-ai",
    title: "EAiSER-AI",
    icon: "mdi:city-variant-outline",
    tagline: "AI-powered defect detection & maintenance automation platform",
    org: "MomntumAI LLC · Nashville, US",
    orgLogo: "/logos/momntumai.png",
    period: "Jan 2025 — Oct 2025",
    kind: "Commercial",
    accent: "from-sky-500 to-cyan-500",
    featured: true,
    description:
      "Civic-tech platform that detects public infrastructure issues from images and routes reports to the relevant authorities.",
    features: [
      "Civic-tech platform designed to detect public issues and route reports to relevant authorities",
      "Integrated OpenCV-based vision algorithms for fault detection, reducing manual inspection time by 40%",
      "Supported backend integrations, workflow stability, and feature delivery",
      "Collaborated in an Agile team to ship features, debug issues and optimize system performance",
    ],
    techStack: "Python, Flask, OpenCV, REST APIs, Supabase, Docker",
    aiContext:
      "Explain EAiSER-AI: a civic-tech defect detection and maintenance automation platform built at MomntumAI using OpenCV vision models, Flask backend and automated report routing.",
  },
  {
    id: "aievolve",
    title: "AIEvolve AI Agent",
    icon: "mdi:infinity",
    tagline: "Personal DevOps execution agent",
    org: "Personal Project",
    period: "Mar 2026 — Present",
    kind: "Personal",
    accent: "from-emerald-500 to-teal-500",
    featured: true,
    description:
      "A personal DevOps-focused execution agent that automates recurring engineering tasks end to end.",
    features: [
      "Built a personal DevOps-focused execution agent for recurring engineering tasks",
      "Handles command workflows, system checks, deployment assistance, and reporting",
      "Safe execution sandbox with logging, retries and environment diagnostics",
    ],
    techStack: "Python, LangChain, Shell Scripting, Docker, Linux, GCP",
    aiContext:
      "Explain AIEvolve AI Agent: Rishav's personal DevOps execution agent that handles command workflows, system checks, deployment assistance and reporting.",
  },
  {
    id: "snapfix-ai",
    title: "Snapfix-AI",
    icon: "mdi:wrench-cog-outline",
    tagline: "Computer-vision defect detection & maintenance automation",
    org: "Product Build",
    period: "2025",
    kind: "Personal",
    accent: "from-amber-500 to-yellow-500",
    description:
      "AI-powered defect detection and maintenance automation with Computer Vision and a Flask backend.",
    features: [
      "Integrated CV models reducing inspection time by 40%",
      "Designed REST APIs for automation & database management",
      "Prepared integration with Azure Cognitive Services",
      "Optimized system performance in Agile workflows",
    ],
    techStack: "Python, Flask, OpenCV, Azure Cognitive Services, Docker",
    aiContext:
      "Explain the Snapfix-AI project: CV-based defect detection, Flask backend, Azure Cognitive Services integration.",
  },
  {
    id: "stock-lstm",
    title: "Stock Price Prediction Model",
    icon: "mdi:chart-line",
    tagline: "LSTM time-series forecasting",
    org: "Personal Project",
    period: "2024",
    kind: "Personal",
    accent: "from-green-500 to-emerald-500",
    description: "Time series forecasting using LSTM networks for market trend prediction.",
    features: [
      "Implemented LSTM networks for time-series forecasting",
      "Analyzed stock datasets for trend and volatility patterns",
      "Optimized hyperparameters for accuracy",
      "Built a visualization dashboard for predictions",
    ],
    techStack: "TensorFlow, Keras, NumPy, Pandas, Matplotlib",
    aiContext: "Explain the LSTM stock prediction project and its typical pipeline.",
  },
  {
    id: "attendance",
    title: "AI-based Attendance System",
    icon: "mdi:face-recognition",
    tagline: "Real-time face recognition attendance",
    org: "Personal Project",
    period: "2024",
    kind: "Academic",
    accent: "from-indigo-500 to-blue-500",
    description: "Face recognition attendance tracker with real-time detection and secure logging.",
    features: [
      "Real-time face detection pipeline",
      "Secure attendance logging in SQLite",
      "Web dashboard for records and exports",
      "Accuracy optimizations for varied lighting",
    ],
    techStack: "Python, OpenCV, Flask, SQLite",
    aiContext: "Explain the face-recognition attendance system, its architecture and trade-offs.",
  },
  {
    id: "chatbot",
    title: "AI Chatbot (NLP + LLMs)",
    icon: "mdi:message-processing-outline",
    tagline: "Contextual assistant on transformers",
    org: "Personal Project",
    period: "2024",
    kind: "Personal",
    accent: "from-fuchsia-500 to-purple-500",
    description: "Contextual chatbot using transformers and LLMs with conversation memory.",
    features: [
      "Transformer models for dialogue understanding",
      "LLM integration with prompt orchestration",
      "React UI with streaming responses",
      "Conversation memory and context windows",
    ],
    techStack: "Python, Hugging Face, LangChain, Flask, React",
    aiContext: "Explain the LLM chatbot project and how conversation context is handled.",
  },
];

export type Skill = { name: string; icon: string; color: string; level: number };
export type SkillCategory = {
  id: string;
  label: string;
  icon: string;
  accent: string;
  blurb: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    icon: "mdi:code-braces",
    accent: "from-sky-500 to-cyan-400",
    blurb: "Core languages used daily for services, tooling and automation.",
    skills: [
      { name: "Python", icon: "logos:python", color: "#3776AB", level: 95 },
      { name: "Java", icon: "logos:java", color: "#EA2D2E", level: 80 },
      { name: "C", icon: "logos:c", color: "#5C6BC0", level: 78 },
      { name: "Shell Scripting", icon: "logos:bash-icon", color: "#4EAA25", level: 88 },
      { name: "TypeScript", icon: "logos:typescript-icon", color: "#3178C6", level: 82 },
      { name: "SQL", icon: "simple-icons:mysql", color: "#00758F", level: 85 },
    ],
  },
  {
    id: "ai",
    label: "AI & Generative AI",
    icon: "mdi:brain",
    accent: "from-fuchsia-500 to-violet-500",
    blurb: "LLM applications, agents and classic ML across the full lifecycle.",
    skills: [
      { name: "LLM Applications", icon: "mdi:robot-happy-outline", color: "#A78BFA", level: 92 },
      { name: "AI Agents", icon: "mdi:robot-industrial-outline", color: "#F472B6", level: 92 },
      { name: "RAG", icon: "mdi:database-search-outline", color: "#22D3EE", level: 88 },
      { name: "LangChain", icon: "simple-icons:langchain", color: "#1C3C3C", level: 85 },
      { name: "Hugging Face", icon: "logos:hugging-face-icon", color: "#FFD21E", level: 85 },
      { name: "PyTorch", icon: "logos:pytorch-icon", color: "#EE4C2C", level: 82 },
      { name: "TensorFlow", icon: "logos:tensorflow", color: "#FF6F00", level: 82 },
      { name: "Scikit-learn", icon: "simple-icons:scikitlearn", color: "#F7931E", level: 88 },
      { name: "OpenCV", icon: "logos:opencv", color: "#5C3EE8", level: 88 },
      { name: "Deep Learning", icon: "carbon:machine-learning-model", color: "#38BDF8", level: 84 },
      { name: "Pandas", icon: "simple-icons:pandas", color: "#150458", level: 90 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: "mdi:server-network",
    accent: "from-emerald-500 to-teal-500",
    blurb: "Production APIs and services designed for speed and reliability.",
    skills: [
      { name: "FastAPI", icon: "simple-icons:fastapi", color: "#009688", level: 92 },
      { name: "Flask", icon: "simple-icons:flask", color: "#94A3B8", level: 90 },
      { name: "REST APIs", icon: "mdi:api", color: "#34D399", level: 92 },
      { name: "Node.js", icon: "logos:nodejs-icon", color: "#5FA04E", level: 80 },
      { name: "API Integration", icon: "mdi:transit-connection-variant", color: "#2DD4BF", level: 88 },
      { name: "React.js", icon: "logos:react", color: "#61DAFB", level: 82 },
    ],
  },
  {
    id: "data",
    label: "Databases & Vectors",
    icon: "mdi:database-outline",
    accent: "from-amber-500 to-orange-500",
    blurb: "Relational, document and vector stores with clean schema design.",
    skills: [
      { name: "MongoDB", icon: "logos:mongodb-icon", color: "#47A248", level: 85 },
      { name: "Supabase", icon: "logos:supabase-icon", color: "#3ECF8E", level: 85 },
      { name: "SQLite", icon: "simple-icons:sqlite", color: "#003B57", level: 88 },
      { name: "FAISS", icon: "mdi:vector-triangle", color: "#0668E1", level: 82 },
      { name: "Schema Design", icon: "mdi:table-cog", color: "#FBBF24", level: 86 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    icon: "mdi:cloud-cog-outline",
    accent: "from-blue-500 to-indigo-500",
    blurb: "Shipping and operating services with containers and CI/CD.",
    skills: [
      { name: "Linux", icon: "logos:linux-tux", color: "#FCC624", level: 92 },
      { name: "Docker", icon: "logos:docker-icon", color: "#2496ED", level: 88 },
      { name: "AWS", icon: "logos:aws", color: "#FF9900", level: 80 },
      { name: "Google Cloud", icon: "logos:google-cloud", color: "#4285F4", level: 78 },
      { name: "Render", icon: "simple-icons:render", color: "#E5E7EB", level: 85 },
      { name: "Git", icon: "logos:git-icon", color: "#F05032", level: 92 },
      { name: "GitHub", icon: "simple-icons:github", color: "#E5E7EB", level: 92 },
      { name: "CI/CD", icon: "simple-icons:githubactions", color: "#2088FF", level: 86 },
    ],
  },
  {
    id: "cs",
    label: "Core CS",
    icon: "mdi:school-outline",
    accent: "from-cyan-500 to-sky-500",
    blurb: "Fundamentals behind the systems — not just the frameworks.",
    skills: [
      { name: "Data Structures & Algorithms", icon: "mdi:sitemap-outline", color: "#22D3EE", level: 88 },
      { name: "OOP", icon: "mdi:cube-outline", color: "#38BDF8", level: 90 },
      { name: "DBMS", icon: "mdi:database-cog-outline", color: "#60A5FA", level: 86 },
      { name: "Operating Systems", icon: "mdi:memory", color: "#818CF8", level: 85 },
      { name: "Computer Networks", icon: "mdi:lan-connect", color: "#34D399", level: 84 },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    icon: "mdi:tools",
    accent: "from-slate-400 to-slate-600",
    blurb: "The daily driver toolkit.",
    skills: [
      { name: "Jupyter Notebook", icon: "logos:jupyter", color: "#F37626", level: 92 },
      { name: "VS Code", icon: "logos:visual-studio-code", color: "#007ACC", level: 94 },
      { name: "Postman", icon: "logos:postman-icon", color: "#FF6C37", level: 90 },
      { name: "Google Colab", icon: "simple-icons:googlecolab", color: "#F9AB00", level: 88 },
      { name: "HTML5", icon: "logos:html-5", color: "#E34F26", level: 90 },
      { name: "CSS3", icon: "logos:css-3", color: "#1572B6", level: 88 },
    ],
  },
];

/** Flat marquee list of brand marks for the infinite tech ribbon. */
export const techMarquee = skillCategories
  .flatMap((c) => c.skills)
  .filter((s) => s.icon.startsWith("logos:") || s.icon.startsWith("simple-icons:"));

export const education = {
  school: "Galgotias University",
  logoImage: "/logos/galgotias.png",
  website: "https://www.galgotiasuniversity.edu.in",
  degree: "Bachelor of Technology (B.Tech)",
  field: "Computer Science Engineering",
  period: "Sep 2023 — May 2027",
  location: "Greater Noida, India",
  focus: ["AI & Machine Learning", "System Design", "Full-Stack Development", "Computer Networks"],
  note: "Active in hackathons, coding challenges, and AI research projects.",
};

export const achievements = [
  {
    title: "AI-driven Smart Agriculture Solution",
    description: "Automated plant disease detection and pesticide control using ML + IoT.",
    icon: "material-symbols:trophy",
    accent: "from-yellow-500 to-amber-500",
    tags: ["🥇 Winner", "Agriculture"],
  },
  {
    title: "Defense Tech Hackathon",
    description: "AI-powered surveillance prototype for real-time threat detection using computer vision.",
    icon: "material-symbols:security",
    accent: "from-red-500 to-rose-500",
    tags: ["🥇 Winner", "Defense Tech"],
  },
  {
    title: "Multiple Coding Competitions",
    description: "ML-driven prototypes under time constraints, showcasing rapid development.",
    icon: "material-symbols:code",
    accent: "from-sky-500 to-cyan-500",
    tags: ["🥇 Multiple Wins", "ML/AI"],
  },
];

/** Logo wall — every organisation Rishav has worked with or studied at. */
export const organisations = [
  {
    name: "Cyberrant Limited",
    logo: "/logos/cyberrant.png",
    href: "https://cyberrant.org",
    role: "AI Software Engineer",
    period: "Oct 2025 — Present",
    relation: "Current",
  },
  {
    name: "MomntumAI LLC",
    logo: "/logos/momntumai.png",
    href: "https://momntumai.com",
    role: "Software Engineer",
    period: "Jan — Oct 2025",
    relation: "Past",
  },
  {
    name: "My Job Grow",
    logo: "/logos/myjobgrow.png",
    href: "https://myjobgrow.com",
    role: "Machine Learning Intern",
    period: "Jul — Sep 2024",
    relation: "Past",
  },
  {
    name: "Galgotias University",
    logo: "/logos/galgotias.png",
    href: "https://www.galgotiasuniversity.edu.in",
    role: "B.Tech, Computer Science",
    period: "Sep 2023 — May 2027",
    relation: "Education",
    wide: true,
  },
];

export const stats = [
  { label: "Years building software", value: 2, suffix: "+", icon: "mdi:calendar-star", color: "text-cyan-400" },
  { label: "Production systems shipped", value: 10, suffix: "+", icon: "mdi:server", color: "text-sky-400" },
  { label: "Hackathon wins", value: 3, suffix: "+", icon: "mdi:trophy-outline", color: "text-amber-400" },
  { label: "Inspection time reduced", value: 40, suffix: "%", icon: "mdi:speedometer", color: "text-emerald-400" },
];

/** Compact résumé context injected into the on-site AI assistant. */
export const resumeContext = `
Rishav Kumar — ${profile.headline} (also titled ${profile.altHeadline}). ${profile.location}. ${profile.email}, ${profile.phone}.
Summary: ${profile.summary}
Experience:
${experiences
  .map(
    (e) =>
      `- ${e.title} at ${e.company} (${e.mode}), ${e.location}, ${e.period}: ${e.description.join("; ")}. Stack: ${e.techStack}.`,
  )
  .join("\n")}
Projects:
${projects.map((p) => `- ${p.title} (${p.kind}, ${p.org}, ${p.period}): ${p.description} Highlights: ${p.features.join("; ")}. Stack: ${p.techStack}.`).join("\n")}
Skills:
${skillCategories.map((c) => `- ${c.label}: ${c.skills.map((s) => s.name).join(", ")}`).join("\n")}
Education: ${education.degree} in ${education.field}, ${education.school}, ${education.location}, ${education.period}.
Achievements: ${achievements.map((a) => `${a.title} — ${a.description}`).join(" | ")}
Links: LinkedIn ${profile.linkedin}, GitHub ${profile.github}.
`.trim();
