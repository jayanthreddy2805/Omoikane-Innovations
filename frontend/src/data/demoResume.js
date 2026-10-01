/**
 * ============================================================================
 * DEMO RESUME DATA & MATCHER - Omoikane Innovations
 * ============================================================================
 * 
 * IMPORTANT DEMO NOTICE:
 * This file provides the mock extracted candidate profile for the demo resume
 * upload workflow. In production, a Python FastAPI microservice with OCR/PDF
 * parsing (e.g. PyMuPDF, LangChain, Unstructured) + LLM extraction will parse
 * any uploaded document dynamically into this schema.
 * ============================================================================
 */

export const DEMO_RESUME_PROFILE = {
  candidateName: "Demo Candidate",
  fileName: "Resume_SoftwareEngineer_Demo.pdf",
  fileType: "application/pdf",
  fileSize: "142 KB",
  uploadTimestamp: new Date().toISOString(),
  education: [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Bangalore Institute of Technology",
      year: "2024",
      grade: "8.6 / 10 CGPA"
    }
  ],
  experience: [
    {
      role: "Software Engineering Intern",
      organization: "TechNova Labs",
      duration: "6 Months",
      description: "Assisted in building REST APIs with Python and developed responsive UI dashboard widgets using React. Optimized PostgreSQL queries."
    }
  ],
  projects: [
    {
      title: "Real-Time Telemetry Dashboard",
      technologies: ["React", "JavaScript", "WebSocket", "CSS3"],
      description: "Constructed an interactive web portal visualizing simulated IoT sensor feeds with sub-second latency."
    },
    {
      title: "Data Analysis & ETL Pipeline",
      technologies: ["Python", "SQL", "Pandas", "Excel"],
      description: "Automated aggregation and cleaning of 500k+ data rows with automated reporting scripts."
    }
  ],
  skills: [
    "Python",
    "React",
    "SQL",
    "JavaScript",
    "HTML",
    "CSS",
    "Git"
  ],
  insights: {
    strongSkills: [
      "Python",
      "React",
      "SQL",
      "JavaScript"
    ],
    suggestedSkills: [
      "Data structures & Algorithms",
      "Cloud (AWS / Azure)",
      "Backend microservices architecture",
      "Docker & Containerization"
    ]
  }
};

/**
 * Calculates match percentage and skill alignment between candidate resume and a demo job
 */
export function calculateJobMatch(job, resumeProfile = DEMO_RESUME_PROFILE) {
  const candidateSkills = (resumeProfile.skills || []).map(s => s.toLowerCase());
  const required = (job.requiredSkills || []).map(s => s.toLowerCase());
  const preferred = (job.preferredSkills || []).map(s => s.toLowerCase());

  const matchedRequired = job.requiredSkills.filter(s => 
    candidateSkills.includes(s.toLowerCase())
  );
  
  const missingRequired = job.requiredSkills.filter(s => 
    !candidateSkills.includes(s.toLowerCase())
  );

  const matchedPreferred = (job.preferredSkills || []).filter(s => 
    candidateSkills.some(cs => s.toLowerCase().includes(cs) || cs.includes(s.toLowerCase()))
  );

  // Illustrative demo match scoring formula
  // Weighted: 80% on required skills match + 20% on preferred skills bonus
  const requiredWeight = required.length > 0 ? (matchedRequired.length / required.length) : 1;
  const preferredWeight = preferred.length > 0 ? (matchedPreferred.length / preferred.length) : 0;
  
  let rawScore = Math.round((requiredWeight * 80) + (preferredWeight * 20));
  
  // Clamp realistic demo scores
  if (job.id === "job-fed-02") {
    rawScore = 91; // React, JS, HTML, CSS all match!
  } else if (job.id === "job-swe-01") {
    rawScore = 82; // Python, JS, React, SQL match; Docker/Cloud to improve
  } else if (job.id === "job-da-03") {
    rawScore = 75; // SQL, Python match; Power BI/Excel to polish
  }

  // Suggest improvement areas based on missing required + key preferred
  const skillsToImprove = [];
  if (job.id === "job-swe-01") {
    skillsToImprove.push("Cloud (AWS)", "Docker", "FastAPI");
  } else if (job.id === "job-fed-02") {
    skillsToImprove.push("Next.js", "TypeScript");
  } else if (job.id === "job-da-03") {
    skillsToImprove.push("Power BI", "Advanced Excel Modeling");
  } else {
    skillsToImprove.push(...missingRequired, ...(job.preferredSkills || []).slice(0, 2));
  }

  return {
    jobId: job.id,
    jobTitle: job.title,
    matchPercentage: rawScore,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    skillsToImprove: skillsToImprove,
    isHighMatch: rawScore >= 80
  };
}
