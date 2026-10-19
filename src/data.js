/**
 * SOHAM KHADATKAR - PORTFOLIO DATA REPOSITORY
 * 
 * All data strictly verified and extracted from candidate's official documents:
 * - Resume (Sohams_Official_Resume.pdf)
 * - Academic Research Papers & Lab Reports (SIT Nagpur, Symbiosis International University)
 * - Certification PDFs (Red Hat, IBM SkillsBuild, Tata Group, Unstop)
 */

export const personalInfo = {
  name: "Soham Khadatkar",
  fullName: "Soham Pradip Khadatkar",
  role: "Computer Science & Data Science Engineer",
  tagline: "Exploring the continuum from low-level 8051 assembly to transformer-driven NLP and enterprise data architectures.",
  bio: "Currently pursuing B.Tech in Computer Science and Engineering (Data Science) at Symbiosis Institute of Technology, Nagpur (Batch 2024–2028). Passionate about machine learning paradigms (RAG, BERT, LSTM), dimensional data warehousing (OLAP & ROLLUP), and deterministic low-level systems programming.",
  status: "Undergraduate Scholar • Available for Summer 2025/2026 Internships",
  location: "Nagpur, Maharashtra, India",
  email: "sohamkhadatkar34@gmail.com",
  phone: "+91 97663 17030",
  profileImage: "/soham_profile.jpg",
  resumeUrl: "/Soham_Khadatkar_Resume.pdf",
  gpa: "7.7",
  prn: "24070521099",
  semester: "Semester 4 (Batch 2024–2028)",
  institution: "Symbiosis Institute of Technology, Nagpur",
  university: "Symbiosis International (Deemed University), Pune",
  socials: {
    github: {
      label: "GitHub",
      url: "https://github.com/soham5999",
      username: "@soham5999"
    },
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/soham-khadatkar-991ab2315",
      username: "Soham Khadatkar"
    },
    hackerrank: {
      label: "HackerRank",
      url: "https://www.hackerrank.com/profile/sohamkhadatkar34",
      username: "@sohamkhadatkar34"
    },
    email: {
      label: "Email",
      url: "mailto:sohamkhadatkar34@gmail.com",
      username: "sohamkhadatkar34@gmail.com"
    }
  }
};

export const stats = [
  { value: "4th", label: "Semester Standing", detail: "B.Tech CSE (Data Science) 2024-28" },
  { value: "7.7", label: "Cumulative GPA", detail: "Symbiosis Institute of Technology" },
  { value: "6+", label: "Verified Credentials", detail: "Red Hat, IBM SkillsBuild, Tata, Unstop" },
  { value: "5+", label: "Major Systems & AI Projects", detail: "NLP, Data Warehousing, 8051 ALP" }
];

export const skillsCategories = [
  {
    category: "Programming Languages",
    icon: "Code2",
    description: "Core languages used for systems programming, data engineering, and application logic.",
    skills: [
      { name: "C", level: "Proficient", icon: "c", highlight: "Academic foundation & pointer semantics" },
      { name: "Java", level: "Proficient", icon: "java", highlight: "Object-oriented architecture & OOP principles" },
      { name: "Python", level: "Advanced", icon: "python", highlight: "Red Hat certified, ML/NLP & data analysis" },
      { name: "SQL", level: "Advanced", icon: "database", highlight: "Complex joins, OLAP aggregation & star schemas" },
      { name: "JavaScript (ES6+)", level: "Intermediate", icon: "js", highlight: "Modern DOM, async/await, closures & APIs" },
      { name: "8051 Assembly", level: "Intermediate", icon: "cpu", highlight: "Register-level arithmetic, memory defrag & bitwise logic" }
    ]
  },
  {
    category: "AI, ML & Data Science",
    icon: "BrainCircuit",
    description: "Machine learning architectures, natural language processing, and generative AI concepts.",
    skills: [
      { name: "Retrieval-Augmented Gen (RAG)", level: "Certified", icon: "sparkles", highlight: "IBM SkillsBuild certified (ALM-COURSE_3825461)" },
      { name: "BERT Transformer Models", level: "Hands-on", icon: "network", highlight: "Bidirectional contextual embeddings for NLP research" },
      { name: "Long Short-Term Memory (LSTM)", level: "Hands-on", icon: "activity", highlight: "Sequential deep learning for textual temporal modeling" },
      { name: "Support Vector Machines (SVM)", level: "Hands-on", icon: "bar-chart", highlight: "Hyperplane classification & classical ML baselines" },
      { name: "Data Preprocessing & Scaling", level: "Proficient", icon: "sliders", highlight: "Feature extraction, tokenization & dataset sanitation" },
      { name: "Pandas & NumPy", level: "Proficient", icon: "table", highlight: "Matrix algebra, tabular data transformations" }
    ]
  },
  {
    category: "Data Warehousing & Architecture",
    icon: "Database",
    description: "Analytical databases, multidimensional modeling, and decision support infrastructure.",
    skills: [
      { name: "Star Schema Modeling", level: "Advanced", icon: "git-fork", highlight: "Fact tables & dimension hierarchies (customer, product, date)" },
      { name: "OLAP & ROLLUP Aggregation", level: "Advanced", icon: "layers", highlight: "Multi-level subtotals & grand-total analytical queries" },
      { name: "OLTP vs DSS Architecture", level: "Proficient", icon: "workflow", highlight: "Solving transactional silos for strategic organizational insight" },
      { name: "MySQL & Relational Design", level: "Proficient", icon: "server", highlight: "Normalization, referential integrity & query optimization" },
      { name: "Introduction to Data Concepts", level: "Certified", icon: "badge-check", highlight: "IBM SkillsBuild certified (MDL-215)" }
    ]
  },
  {
    category: "Systems, Tools & Environments",
    icon: "Terminal",
    description: "Hardware simulators, developer tools, version control, and Unix/terminal workflows.",
    skills: [
      { name: "EdSim51 Simulator", level: "Proficient", icon: "monitor", highlight: "8051 virtual hardware debugging & register inspection" },
      { name: "Git & GitHub", level: "Proficient", icon: "git-branch", highlight: "Version control, branching & open repositories" },
      { name: "VS Code & Jupyter Notebooks", level: "Daily Driver", icon: "file-code", highlight: "Interactive analysis & structured code development" },
      { name: "Microcontroller Memory Mgmt", level: "Hands-on", icon: "hard-drive", highlight: "Indirect addressing (@R0, @R1) & in-place RAM compaction" },
      { name: "Safety-Certified Control Logic", level: "Hands-on", icon: "shield-check", highlight: "Hazardous instruction elimination (SUBB avoidance)" }
    ]
  }
];

export const projects = [
  {
    id: "fake-news-detection",
    title: "Fake News Detection using ML & Deep Learning",
    subtitle: "SIT Academic Research Capstone",
    guide: "Guided by Prof. Dr. Deepak Asudani (SIT Nagpur)",
    period: "Academic Year 2025–2026",
    summary: "A multi-paradigm NLP research investigation evaluating Support Vector Machines (classical ML), LSTM (sequential deep learning), and BERT (transformer embeddings) to detect textual misinformation across digital platforms.",
    details: [
      "Conducted research in partial fulfillment of B.Tech CSE at Symbiosis International University.",
      "Formulated a comparative benchmark evaluating three distinct learning paradigms against noisy online news datasets.",
      "Applied lexical feature extraction, tokenization, sequence padding for LSTM, and bidirectional self-attention embeddings via BERT.",
      "Addressed the critical scaling limitation of manual fact-checking by creating automated algorithmic detection pipelines."
    ],
    technologies: ["Python", "BERT", "LSTM", "SVM", "NLP", "Scikit-Learn", "PyTorch/TensorFlow", "Deep Learning"],
    metrics: [
      { label: "Paradigms Evaluated", value: "3" },
      { label: "Architecture", value: "Transformers + RNNs" },
      { label: "Focus", value: "Misinformation Mitigation" }
    ],
    github: "https://github.com/soham5999",
    featured: true,
    category: "Machine Learning & NLP",
    accent: "from-cyan-500/20 to-blue-600/20",
    badge: "Featured Research"
  },
  {
    id: "olap-star-schema-rollup",
    title: "OLAP Star-Schema & Multi-Level ROLLUP Engine",
    subtitle: "Enterprise Data Warehousing Mini-Project",
    guide: "Department of Computer Science & Engineering, SIT Nagpur",
    period: "AY 2025–2026 (Semester 4)",
    summary: "An enterprise data warehouse architecture modeling multi-dimensional retail analytics with a central Fact Sales table and Customer, Product, and Date dimension tables, executing hierarchical ROLLUP aggregations.",
    details: [
      "Engineered star-schema dimensional models separating business transaction measures from descriptive dimensional attributes.",
      "Created dimension entities: `dim_customer` (names, cities), `dim_product` (categories, names), and `dim_date` (time-series temporal analysis).",
      "Executed advanced MySQL ROLLUP operations to calculate multiple hierarchical subtotals and grand totals in a single unified execution cycle.",
      "Optimized query performance for executive decision support systems without repetitive transactional queries."
    ],
    technologies: ["MySQL", "Data Warehousing", "Star Schema", "OLAP", "ROLLUP SQL", "Business Intelligence"],
    metrics: [
      { label: "Schema Type", value: "Star Schema" },
      { label: "Operation", value: "Hierarchical ROLLUP" },
      { label: "Dimensions", value: "Product, Customer, Date" }
    ],
    github: "https://github.com/soham5999",
    featured: true,
    category: "Data Warehousing",
    accent: "from-indigo-500/20 to-purple-600/20",
    badge: "Data Architecture"
  },
  {
    id: "safety-certified-comparator",
    title: "Safety-Certified Dual Number Comparator",
    subtitle: "8051 Low-Level Assembly Architecture",
    guide: "Microcontroller & Embedded Systems Lab",
    period: "2026",
    summary: "A safety-critical comparison algorithm that eliminates hazardous instructions (SUBB, CJNE, DJNZ) to prevent carry-flag corruption in mission-critical automotive and industrial controllers.",
    details: [
      "Engineered an algorithm operating under strict safety-certified hardware constraints where subtractive operations are forbidden.",
      "Implemented a deterministic 'countdown race' using simultaneous decrement operations (DEC R0, DEC R1) within a zero-flag arbitration loop.",
      "Utilized JZ (Jump if Zero) as a finish-line sensor to determine A > B (01H), A = B (00H), or A < B (FFH) stored in register 60H.",
      "Eliminated the vulnerability where background interrupt tasks could accidentally alter carry flags during SUBB executions."
    ],
    technologies: ["8051 Assembly", "Microcontrollers", "EdSim51", "Register Logic", "Safety-Critical Systems"],
    metrics: [
      { label: "Prohibited Ops", value: "SUBB, CJNE, DJNZ" },
      { label: "Arbitration", value: "Time-to-Zero Race" },
      { label: "Target", value: "Safety Controllers" }
    ],
    github: "https://github.com/soham5999",
    featured: true,
    category: "Embedded Systems",
    accent: "from-amber-500/20 to-orange-600/20",
    badge: "Systems Programming",
    image: "/8051_simulator_demo.jpg"
  },
  {
    id: "ram-defragmenter-logger",
    title: "In-Place Internal RAM Defragmenter & Compact Logger",
    subtitle: "Two-Pointer Embedded Memory Optimizer",
    guide: "Embedded Systems & Memory Architecture",
    period: "2026",
    summary: "An in-place memory compaction algorithm scanning 40H–5FH internal RAM, sliding valid event records to eliminate invalid gaps (FFH) and sanitizing unallocated boundary space with zero stack overhead.",
    details: [
      "Engineered for strict embedded memory limits where auxiliary RAM and stack allocations are strictly prohibited.",
      "Devised a two-pointer technique: Read Pointer (@R0) acts as an inspector, while Write Pointer (@R1) anchors contiguous valid data.",
      "Valid records slide into vacated memory segments in real time, achieving O(N) single-pass defragmentation.",
      "Flushed remaining memory cells from final write marker up to 60H with 00H to ensure zero data leakage and sanitized memory."
    ],
    technologies: ["8051 Assembly", "Indirect Addressing", "Memory Management", "Two-Pointer Logic", "EdSim51"],
    metrics: [
      { label: "RAM Range", value: "40H – 5FH" },
      { label: "Auxiliary Overhead", value: "0 Bytes" },
      { label: "Sanitization", value: "00H Flush" }
    ],
    github: "https://github.com/soham5999",
    featured: false,
    category: "Embedded Systems",
    accent: "from-emerald-500/20 to-teal-600/20",
    badge: "Memory Algorithms"
  },
  {
    id: "ngo-donor-dss",
    title: "NGO Donor Strategic Decision Support System",
    subtitle: "Enterprise Information Value Chain Analysis",
    guide: "Data Warehouse Case Analysis, SIT Nagpur",
    period: "2026",
    summary: "An enterprise data architecture study evaluating why operational OLTP donation CRMs fail to support strategic long-term planning, formulating a unified OLAP Decision Support System (DSS) with metadata governance.",
    details: [
      "Diagnosed the fundamental architectural limitations of isolated OLTP donation CRMs (the 'silo problem').",
      "Formulated a Strategic Information Value Chain transitioning operational data into multidimensional analytical models.",
      "Defined strategic metrics for nonprofit donor retention, churn velocity, and lifetime value forecasting.",
      "Established metadata governance protocols to bridge transactional donor logs into executive decision models."
    ],
    technologies: ["Data Architecture", "OLTP vs OLAP", "Decision Support Systems", "Metadata Governance", "SQL"],
    metrics: [
      { label: "Architecture", value: "OLTP to DSS" },
      { label: "Focus", value: "Donor Retention" },
      { label: "Deliverable", value: "Strategic Value Chain" }
    ],
    github: "https://github.com/soham5999",
    featured: false,
    category: "Data Warehousing",
    accent: "from-blue-500/20 to-cyan-600/20",
    badge: "Systems Architecture"
  }
];

export const certifications = [
  {
    id: "redhat-python",
    title: "Red Hat Training: Introduction to Python Programming (AD141)",
    issuer: "Red Hat Training",
    partner: "Symbiosis Institute of Technology, Nagpur",
    date: "Jan 7, 2026 & Feb 18, 2025",
    credentialId: "AD141-9.0",
    category: "Systems & Python",
    description: "Official Red Hat course covering enterprise Python programming, script modularization, data structures, and automation principles.",
    verificationUrl: "/RedHat_Python_Certificate.pdf",
    isLocalPdf: true,
    featured: true,
    icon: "ShieldAlert"
  },
  {
    id: "ibm-rag",
    title: "Introduction to Retrieval Augmented Generation (RAG)",
    issuer: "IBM SkillsBuild",
    partner: "Adobe Learning Manager System of Record",
    date: "05 Aug 2025 (GMT)",
    credentialId: "ALM-COURSE_3825461",
    learningHours: "1 hr 30 mins",
    category: "AI & Data Science",
    description: "Verified course in grounding generative language models with external knowledge retrieval, semantic embeddings, and vector lookup architectures.",
    verificationUrl: "/IBM_RAG_Certificate.pdf",
    isLocalPdf: true,
    featured: true,
    icon: "Brain"
  },
  {
    id: "ibm-data-concepts",
    title: "Introduction to Data Concepts",
    issuer: "IBM SkillsBuild",
    partner: "Moodle System of Record",
    date: "11 Feb 2025 (GMT)",
    credentialId: "MDL-215",
    learningHours: "1 hr 15 mins",
    category: "AI & Data Science",
    description: "Foundational data engineering principles covering structured vs unstructured data, relational stores, data pipelines, and analytical processing.",
    verificationUrl: "/IBM_Data_Concepts_Certificate.pdf",
    isLocalPdf: true,
    featured: true,
    icon: "Database"
  },
  {
    id: "tata-imagination-2024",
    title: "Tata Imagination Challenge 2024 - Student Track",
    issuer: "Tata Group",
    partner: "Organized via Unstop.com",
    date: "2024",
    credentialId: "Tata Group Student Track",
    category: "Competitions",
    description: "National student innovation challenge evaluating creative problem-solving, strategic thinking, and technological innovation.",
    verificationUrl: "https://drive.google.com/file/d/1yFJZu2z0mO1TEMt7dtJc54mtWTKa4wdN/view?usp=drive_link",
    isLocalPdf: false,
    featured: true,
    icon: "Trophy"
  },
  {
    id: "unstop-daily-quiz-excellence",
    title: "Certificate of Excellence - Engineering Daily Quiz Series",
    issuer: "Unstop.com",
    partner: "Engineering: February Series",
    date: "20 Feb 2025",
    credentialId: "Unstop Engineering Series",
    category: "Competitions",
    description: "Recognized for top-percentile technical problem solving across core engineering domains in the national February challenge.",
    verificationUrl: "https://drive.google.com/file/d/1IT2qKXf4a5ij4SBWKYminF59aOsV3YFs/view?usp=drive_link",
    isLocalPdf: false,
    featured: false,
    icon: "Award"
  },
  {
    id: "unstop-daily-quiz-participation",
    title: "Engineering Daily Quiz Series Participation",
    issuer: "Unstop.com",
    partner: "Engineering: February Series",
    date: "20 Feb 2025",
    credentialId: "Unstop Engineering Track",
    category: "Competitions",
    description: "Demonstrated sustained participation and commitment in competitive engineering quizzes and algorithmic reasoning.",
    verificationUrl: "https://drive.google.com/file/d/1FRvy_RmMIKJM-babPP8oBgkQP10oF2mH/view?usp=drive_link",
    isLocalPdf: false,
    featured: false,
    icon: "CheckCircle2"
  }
];

export const education = [
  {
    institution: "Symbiosis Institute of Technology, Nagpur",
    parentUniversity: "Symbiosis International (Deemed University), Pune",
    degree: "Bachelor of Technology (B.Tech)",
    major: "Computer Science and Engineering (Data Science)",
    period: "July 2024 – July 2028",
    status: "Currently 4th Semester (Section B)",
    gpa: "7.7 / 10.0",
    prn: "24070521099",
    location: "Nagpur, Maharashtra",
    highlights: [
      "Specialization in Data Science, Machine Learning, and Big Data Architecture.",
      "Academic Capstone Project on Fake News Detection under Dr. Deepak Asudani.",
      "Comprehensive coursework in Data Warehousing & Mining, Operating Systems, Compilers, and Digital Electronics.",
      "Hands-on laboratory credentials in Advanced JavaScript, Microcontrollers (8051), and Data Structures."
    ]
  }
];

export const achievements = [
  {
    title: "Tata Imagination Challenge 2024 Participant",
    organization: "Tata Group & Unstop",
    year: "2024",
    description: "Qualified in the prestigious student innovation track organized nationwide by the Tata Group.",
    icon: "Trophy"
  },
  {
    title: "Certificate of Excellence in Engineering",
    organization: "Unstop.com",
    year: "2025",
    description: "Conferred Certificate of Excellence in the National Engineering Quiz Series for outstanding technical problem solving.",
    icon: "Award"
  },
  {
    title: "Red Hat Certified Python Training",
    organization: "Red Hat & SIT Nagpur",
    year: "2025 / 2026",
    description: "Successfully attended and qualified the enterprise-level Red Hat Introduction to Python Programming (AD141) curriculum.",
    icon: "ShieldCheck"
  },
  {
    title: "IBM SkillsBuild AI & Data Specialist Badges",
    organization: "IBM & Adobe Learning Manager",
    year: "2025",
    description: "Earned recognized system-of-record credentials in Retrieval Augmented Generation (RAG) and Modern Data Concepts.",
    icon: "Brain"
  }
];

export const navigationLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" }
];
