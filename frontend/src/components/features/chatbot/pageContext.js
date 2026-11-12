/**
 * ============================================================================
 * CONTEXT-AWARE CHATBOT CONFIGURATION - Omoikane Innovations
 * ============================================================================
 * Detects current pathname and surfaces tailored greetings & quick action questions.
 * ============================================================================
 */

export function getPageContextData(pathname) {
  const p = (pathname || '/').toLowerCase();

  // 1. Careers Page Context
  if (p.includes('/careers') || p.includes('/apply')) {
    return {
      category: 'careers',
      greeting: "Looking to join the Omoikane Innovations engineering team? 🚀 Ask me about our Software, Electronics, or Mechanical openings, or attach your resume directly below!",
      quickQuestions: [
        { label: "Engineering Roles", query: "What software, electronics, and mechanical engineering roles are available?" },
        { label: "Attach & Review Resume", query: "How does the resume matching work for engineering positions?" },
        { label: "AI & ML Openings", query: "What skills are required for AI and Machine Learning roles?" },
        { label: "Engineering Internship", query: "Are there any engineering internships available?" },
        { label: "Hiring Process", query: "What is the application and hiring process at Omoikane?" }
      ]
    };
  }

  // 2. Services / Aerospace Context
  if (p.includes('/services/aerospace') || (p.includes('/services') && p.includes('aero'))) {
    return {
      category: 'aerospace',
      greeting: "Exploring our Aerospace & Avionics platforms? ✈️ Ask me about our OFC-X autonomous flight controller, UAV systems, or custom avionics architecture.",
      quickQuestions: [
        { label: "OFC-X Flight Controller", query: "Tell me about the OFC-X flight controller specifications" },
        { label: "UAV Capabilities", query: "What autonomous UAV platforms and airframes do you support?" },
        { label: "Redundancy & Safety", query: "What sensors and triple IMU redundancy are built into OFC-X?" },
        { label: "OEM Integration Quote", query: "How do I request an OEM quote for aerospace avionics?" }
      ]
    };
  }

  // 3. Services / Defense Context
  if (p.includes('/services/defense') || p.includes('/defense')) {
    return {
      category: 'defense',
      greeting: "Reviewing our Defense Technologies & Tactical Systems? 🛡️ Ask me about secure encrypted datalinks (OCOM-X), tactical electronics, and surveillance platforms.",
      quickQuestions: [
        { label: "OCOM-X Communications", query: "Tell me about OCOM-X autonomous communication and datalink system" },
        { label: "Defense AI & Vision", query: "What AI-driven analytics and tracking solutions do you provide?" },
        { label: "Rugged Electronics", query: "What environmental and rugged standards do your defense products meet?" },
        { label: "Defense Partnerships", query: "How can defense organizations partner with Omoikane Innovations?" }
      ]
    };
  }

  // 4. Products / Projects Showcase Context
  if (p.includes('/projects') || p.includes('/work')) {
    return {
      category: 'products',
      greeting: "Discovering our hardware products and projects? ⚡ Inquire about OFC-X, OESC propulsion, OGN-X precision satellite navigation, or custom OEM integration.",
      quickQuestions: [
        { label: "OFC-X Flight Controller", query: "What is OFC-X and its core specifications?" },
        { label: "OESC-60 / 100 Speed Controller", query: "What are the specs of OESC-60 and OESC-100?" },
        { label: "OGN-X Precision GNSS", query: "Tell me about OGN-X precision GPS module" },
        { label: "Request OEM Quote", query: "How can I request pricing and datasheets for your products?" }
      ]
    };
  }

  // 5. Contact Page Context
  if (p.includes('/contact')) {
    return {
      category: 'contact',
      greeting: "Have an enquiry for our engineering team? 📬 Ask me for our registered address, official contact emails, phone numbers, or office operating hours.",
      quickQuestions: [
        { label: "Headquarters Location", query: "Where is Omoikane Innovations located?" },
        { label: "Official Contact Emails", query: "What are your official email addresses?" },
        { label: "Phone & Office Hours", query: "What are your company phone numbers and office hours?" },
        { label: "Technology Licensing", query: "Do you offer technology licensing or custom engineering collaborations?" }
      ]
    };
  }

  // Default Homepage & General Context
  return {
    category: 'general',
    greeting: "Hi there! 👋 Welcome to Omoikane Innovations. I’m your company assistant. I can help you explore our technologies, engineering capabilities, career information, and contact details. How can I help you today?",
    quickQuestions: [
      { label: "About Omoikane", query: "Tell me about Omoikane Innovations" },
      { label: "Hardware Products (OFC-X)", query: "What products and flight controllers do you make?" },
      { label: "Core Capabilities", query: "What services and engineering capabilities do you provide?" },
      { label: "Career Opportunities", query: "What career roles and opportunities are listed?" },
      { label: "Contact Company", query: "How can I contact Omoikane Innovations?" }
    ]
  };
}
