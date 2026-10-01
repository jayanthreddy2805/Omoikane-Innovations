/**
 * ============================================================================
 * CHAT SERVICE - Omoikane Innovations
 * ============================================================================
 * 
 * Central message dispatcher and AI response orchestrator for the prototype.
 * 
 * FUTURE RAG & FASTAPI BACKEND INTEGRATION:
 * In production, this service forwards requests to the Python FastAPI backend:
 * 
 *   const response = await fetch('/api/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       message,
 *       conversation_history: history,
 *       active_job_id: activeJob?.id,
 *       resume_context: resumeData
 *     })
 *   });
 *   const data = await response.json();
 *   return data;
 * 
 * The FastAPI server will:
 * 1. Convert the query into dense vector embeddings.
 * 2. Query vector database (Pinecone/PGVector) for retrieved knowledge chunks.
 * 3. Construct a grounded prompt with context + strict system instructions.
 * 4. Stream or return the response from the LLM.
 * ============================================================================
 */

import { DEMO_COMPANY_INFO } from '../data/demoCompanyKnowledge.js';
import { DEMO_JOBS } from '../data/demoJobs.js';
import { calculateJobMatch } from '../data/demoResume.js';

export const chatService = {
  /**
   * Generates a conversational assistant response based on message, context, and state
   */
  async sendMessage({ message, history = [], activeJob = null, resumeData = null }) {
    // Artificial conversational thinking delay (500ms - 900ms) for realistic AI UX
    await new Promise(r => setTimeout(r, 650));

    const raw = message.trim();
    const q = raw.toLowerCase();

    // 1. Check for salary inquiries (strict policy)
    if (q.includes("salary") || q.includes("ctc") || q.includes("compensation") || q.includes("pay package")) {
      return {
        text: DEMO_COMPANY_INFO.salaryDisclaimer,
        suggestions: ["What skills are required?", "How do I apply?", "Explore careers"],
        action: null
      };
    }

    // 2. Company Overview / "What does the company do?"
    if (
      q.includes("what does the company do") ||
      q.includes("about the company") ||
      q.includes("who is omoikane") ||
      q.includes("tell me about omoikane") ||
      q === "about"
    ) {
      return {
        text: "Omoikane Innovations is a technology and innovation company focused on building digital solutions for businesses. Our demo services include web development, AI solutions, automation and data analytics.",
        suggestions: ["What services do you offer?", "Explore careers", "Where are you located?"],
        action: null
      };
    }

    // 3. Services / "What services do you provide?"
    if (
      q.includes("what services do you offer") ||
      q.includes("what services do you provide") ||
      q.includes("services do you offer") ||
      q.includes("what are your services") ||
      q.includes("services") && !q.includes("microservice")
    ) {
      return {
        text: "Our demo services include web development, AI solutions, data analytics, automation and custom software development.\n\nEach service is designed to solve real-world operational challenges through modern, resilient engineering.",
        suggestions: ["Explore careers", "Do you have software engineering jobs?", "Contact our team"],
        action: "show_services"
      };
    }

    // 4. Location inquiries
    if (q.includes("where are you located") || q.includes("location") || q.includes("office") || q.includes("headquarters")) {
      return {
        text: `Omoikane Innovations is located in ${DEMO_COMPANY_INFO.location}. In this demo, our development hubs are located in Bengaluru and Hyderabad.`,
        suggestions: ["Do you have jobs in Bengaluru?", "What services do you offer?", "Contact team"],
        action: null
      };
    }

    // 5. Contact inquiries
    if (q.includes("contact") || q.includes("reach out") || q.includes("email") || q.includes("phone")) {
      return {
        text: `You can reach our team directly at ${DEMO_COMPANY_INFO.contactEmail} for any enterprise, partnership, or general inquiries.`,
        suggestions: ["Explore careers", "What does the company do?", "Upload my resume"],
        action: null
      };
    }

    // 6. Careers Navigation / "Explore careers"
    if (
      q.includes("explore careers") ||
      q.includes("career opportunities") ||
      q.includes("careers") ||
      q.includes("openings") ||
      q === "jobs"
    ) {
      return {
        text: "How can I help with your career search?\n\nWe have demo engineering opportunities available in software, UI, and data analytics.",
        suggestions: ["🔎 Find jobs", "🎯 Jobs matching my skills", "📄 Upload resume", "📍 Find jobs by location"],
        action: "show_careers_menu"
      };
    }

    // 7. Software Engineering Jobs / "Show me software jobs" / "Do you have software engineering jobs?"
    if (
      q.includes("software engineering jobs") ||
      q.includes("software jobs") ||
      q.includes("software developer") ||
      q.includes("swe") ||
      q.includes("software engineer")
    ) {
      const swJobs = DEMO_JOBS.filter(j => j.id === "job-swe-01" || j.id === "job-fed-02");
      return {
        text: "Yes. In this demo, we have Software Engineer and Frontend Developer opportunities available in Bengaluru.",
        suggestions: ["View Software Engineer", "What skills are required?", "Upload my resume"],
        action: "show_jobs",
        jobs: swJobs
      };
    }

    // 8. Location-specific Job Search (Bengaluru / Hyderabad)
    if (q.includes("jobs in bengaluru") || q.includes("in bangalore") || q.includes("bengaluru")) {
      const blrJobs = DEMO_JOBS.filter(j => j.location.toLowerCase() === "bengaluru");
      return {
        text: "We currently have 2 demo opportunities located in Bengaluru: Software Engineer and Frontend Developer.",
        suggestions: ["View Software Engineer", "View Frontend Developer", "Upload my resume"],
        action: "show_jobs",
        jobs: blrJobs
      };
    }

    if (q.includes("jobs in hyderabad") || q.includes("in hyderabad") || q.includes("hyderabad")) {
      const hydJobs = DEMO_JOBS.filter(j => j.location.toLowerCase() === "hyderabad");
      return {
        text: "In Hyderabad, we have a demo Data Analyst role open for 0–2 years of experience.",
        suggestions: ["View Data Analyst", "What skills are required?", "Upload my resume"],
        action: "show_jobs",
        jobs: hydJobs
      };
    }

    // 9. Skill-specific Job Search (Python, React, SQL)
    if (q.includes("jobs for python") || q.includes("python jobs") || (q.includes("python") && q.includes("job"))) {
      const pyJobs = DEMO_JOBS.filter(j => j.requiredSkills.includes("Python"));
      return {
        text: "Here are the demo roles that require Python: Software Engineer (Bengaluru) and Data Analyst (Hyderabad).",
        suggestions: ["View Software Engineer", "View Data Analyst", "Find jobs matching my resume"],
        action: "show_jobs",
        jobs: pyJobs
      };
    }

    if (q.includes("frontend roles") || q.includes("frontend developer") || q.includes("react jobs") || q.includes("react")) {
      const feJobs = DEMO_JOBS.filter(j => j.requiredSkills.includes("React"));
      return {
        text: "We have demo frontend-focused roles available including Frontend Developer and Software Engineer.",
        suggestions: ["View Frontend Developer", "What skills are required?", "Upload my resume"],
        action: "show_jobs",
        jobs: feJobs
      };
    }

    // 10. Entry Level / Freshers
    if (q.includes("entry-level") || q.includes("entry level") || q.includes("fresher") || q.includes("freshers")) {
      return {
        text: "Yes! All 3 of our demo roles (Software Engineer, Frontend Developer, and Data Analyst) accept candidates with 0–2 years of experience, making them suitable for motivated entry-level candidates and recent graduates.",
        suggestions: ["Show me software engineering jobs.", "Upload my resume", "How do I apply?"],
        action: "show_jobs",
        jobs: DEMO_JOBS
      };
    }

    // 11. "Show all jobs" / "Find jobs" (exclude resume/matching queries)
    if (
      (q.includes("find jobs") || q.includes("show me all jobs") || q.includes("show jobs") || q.includes("open jobs")) &&
      !q.includes("resume") && !q.includes("skill") && !q.includes("match")
    ) {
      return {
        text: "Here are all available demo opportunities at Omoikane Innovations:",
        suggestions: ["Filter by Bengaluru", "Jobs matching my skills", "Upload my resume"],
        action: "show_jobs",
        jobs: DEMO_JOBS
      };
    }

    // 12. Job-Specific Questions (Skills, qualifications, fresher suitability)
    // If activeJob is selected OR the user explicitly refers to Software Engineer
    const targetJob = activeJob || (
      (q.includes("software engineer") || q.includes("this job") || q.includes("swe")) ? DEMO_JOBS[0] : null
    );

    if (
      q.includes("what skills are required") ||
      q.includes("skills required") ||
      q.includes("required skills") ||
      (q.includes("skills") && q.includes("required")) ||
      (q.includes("what skills") && !q.includes("missing"))
    ) {
      if (targetJob) {
        return {
          text: `For this demo ${targetJob.title} role, the main required skills are ${targetJob.requiredSkills.join(", ")}.`,
          suggestions: ["Is this suitable for a fresher?", "What skills am I missing?", "Apply for this role"],
          action: null
        };
      }
      return {
        text: "For the demo Software Engineer role, the main required skills are Python, JavaScript, React and SQL.",
        suggestions: ["Is this suitable for a fresher?", "Upload my resume", "View job details"],
        action: null
      };
    }

    if (q.includes("suitable for a fresher") || q.includes("for freshers") || q.includes("can a fresher apply")) {
      const jobTitle = targetJob ? targetJob.title : "Software Engineer";
      return {
        text: `The demo ${jobTitle} role accepts candidates with 0–2 years of experience, so it includes entry-level candidates.`,
        suggestions: ["What skills are required?", "How do I apply?", "Upload my resume"],
        action: null
      };
    }

    // 13. Resume Upload & Resume Questions
    if (q.includes("upload my resume") || q.includes("upload resume") || q.includes("review my resume")) {
      return {
        text: "I can review your resume and calculate your match percentage for our demo roles. Please upload your resume below (PDF or DOCX).",
        suggestions: ["Upload demo resume", "Find jobs for my skills"],
        action: "open_resume_upload"
      };
    }

    // Strongest skills
    if (q.includes("strongest skills") || q.includes("my strong skills") || q.includes("top skills")) {
      if (resumeData) {
        return {
          text: `Based on your demo resume analysis, your strongest verified skills are: ${resumeData.insights.strongSkills.join(", ")}.`,
          suggestions: ["Which jobs match my resume?", "What skills am I missing?", "Find jobs matching my resume"],
          action: null
        };
      }
      return {
        text: "Please upload your resume first so I can analyze and identify your strongest skills!",
        suggestions: ["Upload my resume", "Show all jobs"],
        action: "open_resume_upload"
      };
    }

    // Missing skills
    if (q.includes("what skills am i missing") || q.includes("skills am i missing") || q.includes("missing skills")) {
      if (resumeData) {
        const job = targetJob || DEMO_JOBS[0]; // defaults to Software Engineer
        const match = calculateJobMatch(job, resumeData);
        const improveList = match.skillsToImprove.join(", ");
        return {
          text: `For the demo ${job.title} role, you have strong alignment in ${match.matchedSkills.join(", ")}. To improve your match, consider building proficiency in: ${improveList}.`,
          suggestions: ["Find jobs matching my resume", "How do I apply?", "Resume insights"],
          action: null
        };
      }
      return {
        text: "Please upload your resume first to compare your skill set against the job requirements.",
        suggestions: ["Upload my resume", "What skills are required?"],
        action: "open_resume_upload"
      };
    }

    // Job matching / "Find jobs matching my resume" / "Which jobs match my resume"
    if (
      q.includes("matching my resume") ||
      q.includes("jobs match my resume") ||
      q.includes("jobs matching my skills") ||
      q.includes("find jobs for my skills")
    ) {
      if (resumeData) {
        const matchedJobs = DEMO_JOBS.map(j => ({
          ...j,
          match: calculateJobMatch(j, resumeData)
        })).sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

        return {
          text: "Here is your demo resume match breakdown. Your highest match is Frontend Developer (91%), followed by Software Engineer (82%).",
          suggestions: ["What skills am I missing for this job?", "How do I apply?", "Resume insights"],
          action: "show_matches",
          jobs: matchedJobs
        };
      }
      return {
        text: "To find jobs matched specifically to your skill set, please upload your resume first.",
        suggestions: ["Upload my resume", "Show me software jobs"],
        action: "open_resume_upload"
      };
    }

    // Qualification check / "Am I qualified for this job?"
    if (q.includes("am i qualified") || q.includes("do i qualify")) {
      const job = targetJob || DEMO_JOBS[0];
      if (resumeData) {
        const match = calculateJobMatch(job, resumeData);
        return {
          text: `You have an ${match.matchPercentage}% match for the ${job.title} role! You meet the core required skills (${match.matchedSkills.join(", ")}). You are in a strong position to apply.`,
          suggestions: ["What skills am I missing?", "How do I apply?", "View job details"],
          action: null
        };
      }
      return {
        text: `The ${job.title} role requires ${job.requiredSkills.join(", ")} and accepts 0–2 years experience. Upload your resume to see your exact match percentage.`,
        suggestions: ["Upload my resume", "What skills are required?"],
        action: "open_resume_upload"
      };
    }

    // Resume improvement / "How can I improve my resume for this role?"
    if (q.includes("improve my resume") || q.includes("improve resume") || q.includes("resume tips")) {
      const job = targetJob || DEMO_JOBS[0];
      return {
        text: `To tailor your resume for the demo ${job.title} position:\n1. Highlight backend API projects using Python and SQL.\n2. Feature real-time telemetry or dashboard experience with React.\n3. Add examples of Docker containerization or cloud deployments.`,
        suggestions: ["What skills am I missing for this job?", "Find jobs matching my resume", "How do I apply?"],
        action: null
      };
    }

    // 14. Application Guidance / "How do I apply?"
    if (q.includes("how do i apply") || q.includes("apply now") || q.includes("application process") || q.includes("how to apply")) {
      return {
        text: "Here is our demo application process:\n\n1. Select a job that aligns with your interests.\n2. Review the technical requirements.\n3. Upload your resume for automated review.\n4. Complete the candidate application form.\n5. Submit your application for team review.",
        suggestions: ["Select a job", "Upload my resume", "Contact team"],
        action: "open_apply_guidance"
      };
    }

    // 15. Default Strict Fallback (Hallucination Control)
    // If not in demo knowledge base, strictly route to contact email
    return {
      text: DEMO_COMPANY_INFO.fallbackMessage,
      suggestions: ["What does the company do?", "What services do you provide?", "Explore careers", "Contact our team"],
      action: null
    };
  }
};
