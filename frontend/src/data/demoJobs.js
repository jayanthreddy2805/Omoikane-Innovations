/**
 * ============================================================================
 * DEMO JOBS DATABASE - Omoikane Innovations
 * ============================================================================
 * 
 * IMPORTANT DEMO NOTICE:
 * These are strictly DEMO job listings for the management prototype.
 * All application links, salaries, and requirements are simulated.
 * 
 * FUTURE API / BACKEND INSTRUCTIONS:
 * In production, these listings will be served by:
 *   GET /api/jobs
 *   GET /api/jobs/:id
 *   POST /api/jobs/match
 * connected to the company's ATS or relational database (PostgreSQL).
 * ============================================================================
 */

export const DEMO_JOBS = [
  {
    id: "job-swe-01",
    title: "Software Engineer",
    department: "Software Engineering",
    location: "Bengaluru",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experience: "0–2 years",
    isEntryLevel: true,
    featured: true,
    salary: "Competitive (Demo)",
    applyUrl: "#apply-swe-01",
    shortDescription: "Build scalable backend architectures, APIs, and real-time data pipelines for connected systems and intelligent platforms.",
    overview: "As a Software Engineer at Omoikane Innovations, you will work on building resilient microservices, high-throughput APIs, and mission-critical software pipelines. You will collaborate closely with AI and frontend engineers to deploy production-grade software.",
    requiredSkills: [
      "Python",
      "JavaScript",
      "React",
      "SQL"
    ],
    preferredSkills: [
      "FastAPI / Django",
      "Docker",
      "Git / GitHub",
      "RESTful APIs",
      "PostgreSQL"
    ],
    responsibilities: [
      "Develop and maintain robust, high-performance backend microservices using Python and modern frameworks.",
      "Integrate user-facing React components with backend REST and WebSocket endpoints.",
      "Design and optimize SQL database schemas, queries, and indexing for mission telemetry.",
      "Participate in code reviews, CI/CD pipeline automation, and automated testing.",
      "Collaborate with cross-functional teams spanning embedded electronics, AI, and cloud systems."
    ],
    qualifications: [
      "Bachelor's or Master's degree in Computer Science, Engineering, or related technical discipline (or equivalent practical experience).",
      "0 to 2 years of software engineering experience (freshers and graduates welcome).",
      "Solid understanding of object-oriented programming, data structures, and algorithms.",
      "Familiarity with relational databases (SQL, PostgreSQL) and version control (Git).",
      "Strong problem-solving mindset and passion for autonomous digital systems."
    ]
  },
  {
    id: "job-fed-02",
    title: "Frontend Developer",
    department: "Product & UI Engineering",
    location: "Bengaluru",
    workplaceType: "On-site / Hybrid",
    employmentType: "Full-time",
    experience: "0–2 years",
    isEntryLevel: true,
    featured: true,
    salary: "Competitive (Demo)",
    applyUrl: "#apply-fed-02",
    shortDescription: "Craft high-performance, responsive web interfaces, telemetry dashboards, and operator control consoles using React and Next.js.",
    overview: "We are seeking a passionate Frontend Developer to design intuitive, high-velocity user interfaces for our digital solutions and autonomous control platforms. You will transform complex telemetry and system data into elegant, reactive web experiences.",
    requiredSkills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS"
    ],
    preferredSkills: [
      "Next.js",
      "TypeScript",
      "Framer Motion",
      "Responsive UI Design",
      "WebSocket Integration"
    ],
    responsibilities: [
      "Build modular, reusable React and Next.js components following modern UI/UX design patterns.",
      "Develop responsive telemetry monitoring screens and interactive real-time dashboards.",
      "Optimize frontend performance, client-side caching, and lighthouse accessibility scores.",
      "Integrate RESTful and streaming WebSocket data sources smoothly into the UI layer.",
      "Work with UX designers and backend engineers to continuously polish product workflows."
    ],
    qualifications: [
      "Bachelor's degree in Computer Science, Design, Information Technology, or equivalent experience.",
      "0 to 2 years of frontend development experience with strong JavaScript and React proficiency.",
      "Deep understanding of HTML5 semantic structure, modern CSS (Flexbox, Grid, animations), and DOM manipulation.",
      "Portfolio or GitHub projects demonstrating modern React web applications.",
      "Eye for design details, responsive layouts, and user empathy."
    ]
  },
  {
    id: "job-da-03",
    title: "Data Analyst",
    department: "Data & Analytics",
    location: "Hyderabad",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experience: "0–2 years",
    isEntryLevel: true,
    featured: true,
    salary: "Competitive (Demo)",
    applyUrl: "#apply-da-03",
    shortDescription: "Analyze operational telemetry, generate executive business intelligence reports, and build automated visualization dashboards.",
    overview: "The Data Analyst will turn complex operational datasets into actionable intelligence. You will write high-performance SQL queries, automate analytical pipelines in Python, and build dynamic Power BI dashboards to assist strategic decisions.",
    requiredSkills: [
      "SQL",
      "Python",
      "Power BI",
      "Excel"
    ],
    preferredSkills: [
      "Pandas / NumPy",
      "Data Cleaning & ETL",
      "Statistical Analysis",
      "Tableau",
      "Data Visualization"
    ],
    responsibilities: [
      "Query, aggregate, and cleanse large-scale operational and telemetry datasets using SQL and Python.",
      "Develop and maintain executive reporting dashboards in Power BI and Excel.",
      "Identify trends, anomalies, and key performance metrics to guide product optimizations.",
      "Collaborate with engineering and business teams to automate recurring analytical pipelines.",
      "Present data-driven insights clearly to non-technical stakeholders and management."
    ],
    qualifications: [
      "Degree in Statistics, Mathematics, Computer Science, Data Science, or related quantitative field.",
      "0 to 2 years of experience analyzing data (fresh graduates with analytical projects encouraged).",
      "Strong command of SQL (joins, aggregations, window functions) and Python data libraries (Pandas).",
      "Demonstrated ability creating interactive reports in Power BI or Tableau.",
      "Strong analytical thinking, attention to data accuracy, and communication skills."
    ]
  }
];
