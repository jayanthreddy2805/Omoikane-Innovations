/**
 * ============================================================================
 * DEMO COMPANY KNOWLEDGE BASE - Omoikane Innovations
 * ============================================================================
 * 
 * IMPORTANT DEMO NOTICE:
 * This file contains strictly APPROVED DEMO data for presentation and prototype
 * testing purposes. The company has not yet connected its official knowledge base
 * documents, vector database, or live enterprise APIs.
 * 
 * FUTURE RAG / PRODUCTION INSTRUCTIONS:
 * In production, this static file can be swapped for embeddings retrieved via
 * vector search (e.g. Pinecone, Qdrant, ChromaDB, PGVector) through a FastAPI backend.
 * Official documents (PDFs, DOCX, company brochures, policies) will be chunked
 * and ingested into that pipeline.
 * ============================================================================
 */

export const DEMO_COMPANY_INFO = {
  name: "Omoikane Innovations",
  tagline: "Engineering Digital Solutions & Autonomous Technologies",
  about: "Omoikane Innovations is a technology and innovation company focused on building digital solutions for businesses. We engineer cutting-edge web applications, AI platforms, automation pipelines, and data-driven systems built for real-world deployment.",
  
  // Official Approved Contact Information (Do NOT modify or invent others)
  location: "Bangalore, Karnataka, India",
  contactEmail: "bd@omoikaneinnovations.com",
  
  // Demo Office Hubs
  demoLocations: [
    { city: "Bengaluru", state: "Karnataka", country: "India", type: "Headquarters & R&D Hub" },
    { city: "Hyderabad", state: "Telangana", country: "India", type: "Engineering & Analytics Center" }
  ],

  // Approved Demo Services
  services: [
    {
      id: "web-dev",
      title: "Web Development",
      description: "Modern, high-performance web applications, responsive real-time dashboards, and full-stack cloud solutions built with modern React, Next.js, and scalable APIs."
    },
    {
      id: "ai-solutions",
      title: "AI Solutions",
      description: "Custom artificial intelligence systems, computer vision, natural language processing, predictive modeling, and intelligent automation tailored for enterprise workflows."
    },
    {
      id: "data-analytics",
      title: "Data Analytics",
      description: "End-to-end data pipelines, business intelligence dashboards, real-time telemetry processing, and advanced reporting with SQL, Python, and Power BI."
    },
    {
      id: "automation",
      title: "Automation",
      description: "Workflow orchestration, robotic process automation (RPA), intelligent bot systems, and backend automation to streamline operational bottlenecks."
    },
    {
      id: "custom-software",
      title: "Custom Software Development",
      description: "Tailor-made microservices, ground control software, embedded systems integration, and bespoke enterprise platforms built for resilience and scalability."
    }
  ],

  // Approved Demo FAQs
  faqs: [
    {
      question: "What does the company do?",
      answer: "Omoikane Innovations is a technology and innovation company focused on building digital solutions for businesses. Our demo services include web development, AI solutions, automation and data analytics."
    },
    {
      question: "What services do you offer?",
      answer: "Our demo services include web development, AI solutions, data analytics, automation and custom software development."
    },
    {
      question: "Where are you located?",
      answer: "Omoikane Innovations is based in Bangalore, Karnataka, India, with demo presence in Bengaluru and Hyderabad."
    },
    {
      question: "How can I contact the company?",
      answer: "You can reach out directly to our team at bd@omoikaneinnovations.com for any inquiries or collaborations."
    },
    {
      question: "Do you offer internships or entry-level positions?",
      answer: "Yes, our demo job openings welcome freshers and early-career talent with 0–2 years of experience across software engineering, frontend development, and data analytics."
    }
  ],

  // Strict Fallback Configurations (Hallucination Control)
  fallbackMessage: "I don't have enough approved information to answer that yet. Please contact our team at bd@omoikaneinnovations.com for more details.",
  salaryDisclaimer: "I don't have approved salary information for this role.",
  
  privacyNotice: "Demo prototype: Resume processing is currently simulated. In production, resume storage, processing and retention will follow the company's approved privacy and security requirements."
};
