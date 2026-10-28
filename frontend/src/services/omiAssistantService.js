/**
 * ============================================================================
 * OMI ASSISTANT ENGINE - Omoikane Innovations
 * ============================================================================
 * Reliable, grounded retrieval engine adhering strictly to the official
 * company knowledge base without hallucination.
 * 
 * Supports:
 * - Natural Language query understanding and classification
 * - Grounded answers directly linked to official pages
 * - Contextual follow-up suggestions (up to 3)
 * - Strict fallback for unverified facts, metrics, salaries, or hiring counts
 * ============================================================================
 */

import { OFFICIAL_KNOWLEDGE_BASE } from '../data/omoikaneKnowledge.js';

export const omiAssistantService = {
  /**
   * Processes a visitor message and returns a grounded response object
   */
  async processMessage(rawMessage) {
    // Subtle conversational delay for realistic interactive feel
    await new Promise((resolve) => setTimeout(resolve, 450));

    if (!rawMessage || !rawMessage.trim()) {
      return {
        text: "Please feel free to ask any question about Omoikane Innovations' technologies, engineering capabilities, career roles, or contact details.",
        suggestions: ["About Omoikane", "Engineering Capabilities", "Explore Careers", "Contact Us"],
        source: null
      };
    }

    const query = rawMessage.trim();
    // Step 1: lowercase + strip punctuation
    let q = query.toLowerCase().replace(/[\u0027\u0022\u2018\u2019\u201c\u201d?,.!;:]/g, ' ').replace(/\s+/g, ' ').trim();
    // Step 2: expand abbreviations
    q = q.replace(/\bwt\b/g,'what').replace(/\bwts\b/g,'what is').replace(/\bwht\b/g,'what').replace(/\bu\b/g,'you').replace(/\bur\b/g,'your').replace(/\br\b/g,'are').replace(/\babt\b/g,'about').replace(/\btel\b/g,'tell').replace(/\binfo\b/g,'information').replace(/\bhq\b/g,'headquarters').replace(/\bpls\b/g,'please').replace(/\bplz\b/g,'please');
    // Step 3: fix common misspellings
    q = q.replace(/\bcomapny\b/g,'company').replace(/\bcompnay\b/g,'company').replace(/\bcomapy\b/g,'company').replace(/\bcompay\b/g,'company').replace(/\bservies\b/g,'services').replace(/\bservcies\b/g,'services').replace(/\bservces\b/g,'services').replace(/\bserices\b/g,'services').replace(/\bprovde\b/g,'provide').replace(/\bproduts\b/g,'products').replace(/\btechnolgy\b/g,'technology').replace(/\btecnology\b/g,'technology').replace(/\btechnlogies\b/g,'technologies').replace(/\baeropsace\b/g,'aerospace').replace(/\bdefnce\b/g,'defense').replace(/\bembeded\b/g,'embedded').replace(/\bcarrer\b/g,'career').replace(/\bcarrers\b/g,'careers').replace(/\bcontcat\b/g,'contact').replace(/\bvison\b/g,'vision').replace(/\bmision\b/g,'mission').replace(/\belectornics\b/g,'electronics').replace(/\belectonics\b/g,'electronics').replace(/\bmechanial\b/g,'mechanical').replace(/\bomoikain\b/g,'omoikane').replace(/\bomikane\b/g,'omoikane');
    // Step 4: collapse whitespace
    q = q.replace(/\s+/g,' ').trim();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. GREETINGS & IDENTITY
    // ──────────────────────────────────────────────────────────────────────────
    if (isGreeting(q)) {
      return {
        text: "Hello! Welcome to Omoikane Innovations. I'm Omi, your virtual assistant. I can help you learn about our technologies, product domains, engineering capabilities, career information, and contact details. What would you like to know?",
        suggestions: ["About Omoikane", "Products & Industries", "Engineering Capabilities", "Careers"],
        source: { label: "Official Website", url: OFFICIAL_KNOWLEDGE_BASE.company.website }
      };
    }

    if (isBotIdentityQuestion(q)) {
      return {
        text: "I am Omi, the official virtual assistant for Omoikane Innovations. I am an AI-powered guide designed to answer questions strictly using verified facts from our official website.",
        suggestions: ["What does Omoikane do?", "Core engineering capabilities", "Contact the team"],
        source: { label: "About Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. HIRING & APPLICATION POLICY (STRICT NO-HALLUCINATION)
    // ──────────────────────────────────────────────────────────────────────────
    if (isHiringStatusQuestion(q)) {
      return {
        text: `${OFFICIAL_KNOWLEDGE_BASE.careers.hiringPolicyNote}\n\nOur website lists technical roles and skill profiles across **Software Development**, **Electronics**, and **Mechanical Engineering**. You can review the roles and submit your profile directly through the forms on each career page.`,
        suggestions: ["Software development roles", "Electronics engineering roles", "Mechanical engineering roles"],
        source: { label: "Software Careers", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    if (isSalaryQuestion(q)) {
      return {
        text: `${OFFICIAL_KNOWLEDGE_BASE.careers.salaryPolicyNote}\n\nFor questions regarding recruitment procedures or potential opportunities, please contact our team at info@omoikaneinnovations.com.`,
        suggestions: ["Software career roles", "View AI Developer skills", "Contact Us"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (isHowToApplyQuestion(q)) {
      return {
        text: `${OFFICIAL_KNOWLEDGE_BASE.careers.applicationInstructions}\n\n• **Software Roles**: https://www.omoikaneinnovations.com/software-development/\n• **Electronics Roles**: https://www.omoikaneinnovations.com/electronics/\n• **Mechanical Roles**: https://www.omoikaneinnovations.com/mechanical/`,
        suggestions: ["Software development roles", "Electronics roles", "Contact team"],
        source: { label: "Career Opportunities", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. UNVERIFIED TECHNICAL SPECIFICATIONS (DRONE RANGE, PAYLOAD, PRICES)
    // ──────────────────────────────────────────────────────────────────────────
    if (isUnpublishedMetricQuestion(q)) {
      return {
        text: OFFICIAL_KNOWLEDGE_BASE.safeFallbacks.unverifiedSpecification(extractMetricTopic(q)),
        suggestions: ["Aerospace capabilities", "UAV platforms", "Contact for specifications"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. EXECUTIVE / LEADERSHIP SPECIFIC NAMES (CEO, FOUNDER)
    // ──────────────────────────────────────────────────────────────────────────
    if (isExecutiveNameQuestion(q)) {
      return {
        text: OFFICIAL_KNOWLEDGE_BASE.safeFallbacks.unverifiedExecutive,
        suggestions: ["About Omoikane", "Engineering Capabilities", "Contact Us"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. CONTACT DETAILS, EMAIL, PHONE, OFFICE HOURS, LICENSING, LOCATION
    // ──────────────────────────────────────────────────────────────────────────
    if (isEmailQuestion(q)) {
      return {
        text: `The official email addresses for Omoikane Innovations are:\n\n• **General Enquiries:** [info@omoikaneinnovations.com](mailto:info@omoikaneinnovations.com)\n• **Business Development & Partnerships:** [bd@omoikaneinnovations.com](mailto:bd@omoikaneinnovations.com)`,
        suggestions: ["What are the office hours?", "Phone numbers", "Office location"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (isOfficeHoursQuestion(q)) {
      return {
        text: `**Official Office Hours:**\n${OFFICIAL_KNOWLEDGE_BASE.company.officeHours} (IST).`,
        suggestions: ["Official email addresses", "Company phone numbers", "Contact Us"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (isContactQuestion(q)) {
      return {
        text: `**Official Contact Information:**\n\n• **Location:** ${OFFICIAL_KNOWLEDGE_BASE.company.location}\n• **General Enquiries:** [info@omoikaneinnovations.com](mailto:info@omoikaneinnovations.com)\n• **Business Development:** [bd@omoikaneinnovations.com](mailto:bd@omoikaneinnovations.com)\n• **Phone:** [tel:+918861035848](+91-8861035848) | [tel:+919353627825](+91-9353627825)\n• **Office Hours:** ${OFFICIAL_KNOWLEDGE_BASE.company.officeHours}`,
        suggestions: ["Technology licensing opportunity", "Visit Contact Page", "About Omoikane"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (isLocationQuestion(q)) {
      return {
        text: `Omoikane Innovations is headquartered in **${OFFICIAL_KNOWLEDGE_BASE.company.location}**.\n\n• **Official Emails:** info@omoikaneinnovations.com | bd@omoikaneinnovations.com\n• **Office Hours:** ${OFFICIAL_KNOWLEDGE_BASE.company.officeHours}\n• **Phones:** +91-8861035848 | +91-9353627825`,
        suggestions: ["Official email addresses", "Office hours", "Contact page"],
        source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (isLicensingOrCollaborationQuestion(q)) {
      return {
        text: `Yes, Omoikane Innovations actively supports **technology licensing**, **custom product integration**, and **strategic technical collaborations** across aerospace, defense, and industrial systems.\n\nTo discuss integration or technology licensing, please contact our business development team at [bd@omoikaneinnovations.com](mailto:bd@omoikaneinnovations.com) or submit an inquiry on our official Contact Us page.`,
        suggestions: ["Contact the team", "Aerospace capabilities", "Defense technologies"],
        source: { label: "Contact Us / Licensing", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 6. VISION, MISSION, APPROACH
    // ──────────────────────────────────────────────────────────────────────────
    if (isVisionQuestion(q)) {
      return {
        text: `**Company Vision:**\n\n"${OFFICIAL_KNOWLEDGE_BASE.company.vision}"`,
        suggestions: ["What is the company mission?", "About Omoikane", "Core engineering capabilities"],
        source: { label: "About Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }

    if (isMissionQuestion(q)) {
      return {
        text: `**Company Mission:**\n\n"${OFFICIAL_KNOWLEDGE_BASE.company.mission}"`,
        suggestions: ["What is the company vision?", "Products & Industries", "Explore engineering capabilities"],
        source: { label: "About Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }

    if (isEngineeringApproachQuestion(q)) {
      return {
        text: `**Engineering Approach:**\n\n${OFFICIAL_KNOWLEDGE_BASE.company.engineeringApproach}`,
        suggestions: ["Core engineering capabilities", "Aerospace technologies", "Contact team"],
        source: { label: "About Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }
    // 6c. SPECIFIC HARDWARE PRODUCTS (OFC-X, OESC, OGN-X, OCOM-X) & TOOLS
    if (q.includes('ofc-x') || q.includes('ofc x') || (q.includes('flight controller') && !q.includes('role') && !q.includes('career'))) {
      return {
        text: `**OFC-X — High-Performance Flight Controller**\n\n• **Category:** Flight Controller for Autonomous Platforms\n• **Core Features:**\n  - STM32 and AT32 microcontroller (MCU) platform options\n  - Multiple I/O and sensor interfaces for actuator and payload integration\n  - Precision, real-time control architecture designed for demanding UAV and defense applications\n  - Configurable around system-level requirements, operating conditions, and integration constraints\n\nFor custom configuration or OEM integration, please contact our engineering team at [info@omoikaneinnovations.com](mailto:info@omoikaneinnovations.com).`,
        suggestions: ['OESC Speed Controllers', 'OGN-X GNSS Module', 'Aerospace Capabilities'],
        source: { label: 'Products / OFC-X', url: 'https://www.omoikaneinnovations.com/services/' }
      };
    }

    if (q.includes('oesc') || q.includes('speed controller') || (q.includes('esc') && !q.includes('escape'))) {
      return {
        text: `**OESC-60 / OESC-100 — 4-in-1 Electronic Speed Controller (ESC)**\n\n• **Category:** Multirotor Propulsion Control\n• **Variants:** 60A (OESC-60) and 100A (OESC-100) options\n• **Core Features:**\n  - 6S to 12S LiPo battery platform options\n  - High-efficiency, high-current ESC platform for heavy-lift multirotor systems\n  - Advanced current and thermal protection mechanisms\n  - Robust power electronics design with heat dissipation and reliability considerations`,
        suggestions: ['OFC-X Flight Controller', 'OGN-X GNSS Module', 'Aerospace Capabilities'],
        source: { label: 'Products / OESC', url: 'https://www.omoikaneinnovations.com/services/' }
      };
    }

    if (q.includes('ogn-x') || q.includes('ogn x') || q.includes('gps module') || q.includes('gnss')) {
      return {
        text: `**OGN-X — Precision GNSS / GPS Module**\n\n• **Category:** Satellite Positioning & Navigation Architecture\n• **Core Features:**\n  - Multi-constellation GNSS support (GPS, GLONASS, Galileo, BeiDou/NavIC)\n  - RTK-ready (Real-Time Kinematic) architecture for centimeter-level positioning accuracy\n  - Compact, rugged enclosure and integration designed for demanding autonomous navigation and mapping`,
        suggestions: ['OFC-X Flight Controller', 'OCOM-X Communication', 'Aerospace Capabilities'],
        source: { label: 'Products / OGN-X', url: 'https://www.omoikaneinnovations.com/services/' }
      };
    }

    if (q.includes('ocom-x') || q.includes('ocom x') || (q.includes('communication system') && !q.includes('defense'))) {
      return {
        text: `**OCOM-X — Autonomous Communication System**\n\n• **Category:** Connected Autonomous Communications & Telemetry\n• **Core Features:**\n  - RF (Radio Frequency) and LTE cellular integration options\n  - Secure, encrypted data link architecture for telemetry, control, and payload transmission\n  - Low-power design approach ensuring extended mission endurance for airborne and ground platforms`,
        suggestions: ['OFC-X Flight Controller', 'OGN-X GNSS Module', 'Defense Technologies'],
        source: { label: 'Products / OCOM-X', url: 'https://www.omoikaneinnovations.com/services/' }
      };
    }

    if (q.includes('all products') || q.includes('list products') || q.includes('what products') || q.includes('hardware products') || q === 'products') {
      return {
        text: `**Omoikane Innovations Hardware Products & Subsystems:**\n\n1. **OFC-X (Flight Controller):** High-performance flight control for autonomous platforms, featuring STM32/AT32 MCUs and multi-sensor I/O.\n2. **OESC-60 / OESC-100 (4-in-1 ESC):** High-efficiency 60A/100A propulsion control supporting 6S–12S platforms with advanced thermal protection.\n3. **OGN-X (GNSS/GPS Module):** Precision multi-constellation satellite navigation with RTK-ready architecture for autonomous mapping and positioning.\n4. **OCOM-X (Communication System):** Reliable RF/LTE telemetry architecture with secure encryption and low-power design.\n\nAll products are developed around system-level requirements and are configurable by platform and OEM project requirements.`,
        suggestions: ['Tell me about OFC-X', 'Tell me about OESC', 'Contact for product pricing'],
        source: { label: 'Our Products', url: 'https://www.omoikaneinnovations.com/services/' }
      };
    }

    if (q.includes('tagline') || q.includes('motto') || q.includes('slogan') || q.includes('standard') || q.includes('goal')) {
      return {
        text: `**Omoikane Innovations Tagline & Motto:**\n\n> *"Innovation is not our goal; it’s our standard."*\n\n**Brand Slogan:** *"Indigenous technology · Global standards"*\n\nWe design, engineer, and own advanced defense, aerospace, and autonomous platforms locally in India to global reliability benchmarks.`,
        suggestions: ['What products do you offer?', 'About the company', 'Core engineering strengths'],
        source: { label: 'About Us', url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }

    if (q.includes('address') || q.includes('street') || q.includes('deepanjali nagar') || q.includes('vijayanagar') || q.includes('marenahalli')) {
      return {
        text: `**Official Registered Address:**\n\n${OFFICIAL_KNOWLEDGE_BASE.company.address}\n\n• **Location:** Bengaluru (Bangalore), Karnataka, India\n• **Email:** [info@omoikaneinnovations.com](mailto:info@omoikaneinnovations.com) | [omoikaneinnovations@gmail.com](mailto:omoikaneinnovations@gmail.com)\n• **Phone:** +91-8861035848 | +91-9353627825\n• **Office Hours:** Monday to Friday, 9:00 AM – 6:00 PM IST`,
        suggestions: ['Office location on map', 'General contact info', 'Send an enquiry'],
        source: { label: 'Contact Us', url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
      };
    }

    if (q.includes('tools') || q.includes('orcad') || q.includes('allegro') || q.includes('altium') || q.includes('ltspice') || q.includes('ansys') || q.includes('ecad') || q.includes('software used')) {
      return {
        text: `**Engineering Tools & Workflows at Omoikane Innovations:**\n\n• **ECAD & PCB Layout:** OrCAD, Cadence Allegro, Altium Designer, PADS\n• **Simulation & Modeling:** LTspice (circuit simulation), ANSYS (FEA stress & CFD aerodynamic modeling)\n• **Mechanical Design:** SolidWorks, CATIA, Fusion 360\n• **Engineering Practices:** Formal Design Reviews, DFM (Design for Manufacturing), and DFT (Design for Testing)`,
        suggestions: ['Hardware Design Engineer role', 'Our products (OFC-X, OESC)', 'Embedded firmware skills'],
        source: { label: 'Technology & Engineering', url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.services }
      };
    }

    if (q.includes('internship') || q.includes('intern') || q.includes('early career') || q.includes('student')) {
      return {
        text: `**Engineering Internship at Omoikane Innovations:**\n\n• **Role:** Engineering Internship – Hardware / Embedded Systems\n• **Location:** Bengaluru, Karnataka, India (Early Career)\n• **Description:** Project-based hands-on learning and mentorship working on real aerospace, UAV, and defense embedded hardware.\n• **How to Apply:** Send your resume and interest to [omoikaneinnovations@gmail.com](mailto:omoikaneinnovations@gmail.com) or [info@omoikaneinnovations.com](mailto:info@omoikaneinnovations.com) with the subject *"Internship Enquiry"*.`,
        suggestions: ['Hardware Design Engineer opening', 'Software development careers', 'Contact team'],
        source: { label: 'Careers', url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }


    // ──────────────────────────────────────────────────────────────────────────
    // 6b. COMPANY OVERVIEW (broad "tell me about", "what is omoikane", etc.)
    // ──────────────────────────────────────────────────────────────────────────
    if (isCompanyOverviewQuestion(q)) {
      return {
        text: `${OFFICIAL_KNOWLEDGE_BASE.company.overview}\n\nThe company is headquartered in **Bangalore, India**, and delivers solutions across aerospace, defense, automotive, and industrial domains.`,
        suggestions: ["What is the company vision?", "Which industries do you serve?", "Engineering capabilities"],
        source: { label: "About Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.aboutUs }
      };
    }
    // ──────────────────────────────────────────────────────────────────────────
    // 7. PRODUCT DOMAINS & INDUSTRIES (AEROSPACE, DEFENSE, AUTOMOTIVE, RAILWAYS)
    // ──────────────────────────────────────────────────────────────────────────

    if (isAerospaceQuestion(q)) {
      const aero = OFFICIAL_KNOWLEDGE_BASE.productDomains.find((d) => d.id === "aerospace");
      return {
        text: `**Aerospace Capabilities:**\n\n${aero.description}\n\n**Focus Areas:**\n${aero.capabilities.map((c) => `• ${c}`).join("\n")}`,
        suggestions: ["Defense technologies", "Embedded systems capabilities", "Autonomous platforms"],
        source: { label: aero.sourceLabel, url: aero.sourceUrl }
      };
    }

    if (isDefenseQuestion(q)) {
      const def = OFFICIAL_KNOWLEDGE_BASE.productDomains.find((d) => d.id === "defense");
      return {
        text: `**Defense Technologies:**\n\n${def.description}\n\n**Focus Areas:**\n${def.capabilities.map((c) => `• ${c}`).join("\n")}`,
        suggestions: ["Aerospace capabilities", "Secure communications", "Contact for defense inquiries"],
        source: { label: def.sourceLabel, url: def.sourceUrl }
      };
    }

    if (isAutomotiveQuestion(q)) {
      const auto = OFFICIAL_KNOWLEDGE_BASE.productDomains.find((d) => d.id === "automotive");
      return {
        text: `**Automotive Solutions:**\n\n${auto.description}\n\n**Key Areas:**\n${auto.capabilities.map((c) => `• ${c}`).join("\n")}`,
        suggestions: ["Railways and industrial systems", "Embedded systems capabilities", "Contact team"],
        source: { label: auto.sourceLabel, url: auto.sourceUrl }
      };
    }

    if (isRailwaysQuestion(q)) {
      const rail = OFFICIAL_KNOWLEDGE_BASE.productDomains.find((d) => d.id === "railways_industrial");
      return {
        text: `**Railways & Industrial Systems:**\n\n${rail.description}\n\n**Key Areas:**\n${rail.capabilities.map((c) => `• ${c}`).join("\n")}`,
        suggestions: ["Predictive maintenance", "Automotive solutions", "Engineering capabilities"],
        source: { label: rail.sourceLabel, url: rail.sourceUrl }
      };
    }

    if (isIndustriesOverviewQuestion(q)) {
      return {
        text: `Omoikane Innovations operates across four key sectors:\n\n1. **Aerospace:** Autonomous UAV platforms, flight control systems, custom avionics, and RF communication modules.\n2. **Defense:** Secure encrypted communications, surveillance technologies, autonomous platforms, and rugged embedded electronics.\n3. **Automotive:** Intelligent automotive electronics, Electronic Control Unit (ECU) solutions, and real-time vehicle automation.\n4. **Railways & Industrial Systems:** Predictive maintenance analytics, automated sensor monitoring, and intelligent control systems.`,
        suggestions: ["Aerospace capabilities", "Defense technologies", "Core engineering capabilities"],
        source: { label: "Services / Focused Areas", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.services }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 8. CORE ENGINEERING CAPABILITIES (EMBEDDED, AUTONOMOUS, AI, INTEGRATION)
    // ──────────────────────────────────────────────────────────────────────────
    if (isEmbeddedSystemsQuestion(q)) {
      const emb = OFFICIAL_KNOWLEDGE_BASE.coreEngineeringCapabilities.find((c) => c.id === "embedded_control");
      return {
        text: `**Embedded & Control Systems Capabilities:**\n\n${emb.description}\n\n**Core Pillars:**\n${emb.items.map((i) => `• ${i}`).join("\n")}`,
        suggestions: ["Autonomous and robotic capabilities", "Embedded Firmware Engineer role", "Aerospace technologies"],
        source: { label: emb.sourceLabel, url: emb.sourceUrl }
      };
    }

    if (isAutonomousRoboticQuestion(q)) {
      const autoRob = OFFICIAL_KNOWLEDGE_BASE.coreEngineeringCapabilities.find((c) => c.id === "autonomous_robotic");
      return {
        text: `**Autonomous & Robotic Platforms:**\n\n${autoRob.description}\n\n**Capabilities include:**\n${autoRob.items.map((i) => `• ${i}`).join("\n")}`,
        suggestions: ["Aerospace UAV platforms", "AI & Computer Vision capabilities", "Software development roles"],
        source: { label: autoRob.sourceLabel, url: autoRob.sourceUrl }
      };
    }

    if (isAICapabilitiesQuestion(q)) {
      const defAi = OFFICIAL_KNOWLEDGE_BASE.coreEngineeringCapabilities.find((c) => c.id === "defense_ai");
      return {
        text: `**Defense Electronics & AI Systems:**\n\n${defAi.description}\n\n**Core Capabilities:**\n${defAi.items.map((i) => `• ${i}`).join("\n")}`,
        suggestions: ["AI Developer role skills", "Autonomous and robotic capabilities", "Explore software careers"],
        source: { label: defAi.sourceLabel, url: defAi.sourceUrl }
      };
    }

    if (isCapabilitiesOverviewQuestion(q)) {
      return {
        text: `**Core Engineering Capabilities:**\n\n• **Embedded & Control Systems:** Advanced embedded electronics, flight controllers, RF communication modules, and real-time processing units.\n• **Autonomous & Robotic Platforms:** UAV platforms, autonomous ground vehicles, and intelligent monitoring systems.\n• **Defense Electronics & AI Systems:** High-performance rugged hardware, computer vision, AI-driven analytics, and tracking.\n• **Technology Integration:** System integration, custom engineering adaptation, and technology licensing.`,
        suggestions: ["Embedded systems capabilities", "Autonomous platforms", "Technology licensing"],
        source: { label: "Engineering Capabilities", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.services }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 9. CAREERS & TECHNICAL ROLES
    // ──────────────────────────────────────────────────────────────────────────
    // Python Developer vs AI Developer Comparison
    if (isPythonVsAIDeveloperQuestion(q)) {
      return {
        text: `**Difference between Python Developer and AI Developer roles at Omoikane Innovations:**\n\n• **Python Developer (Product-Level):** Focuses on core backend architecture, asynchronous programming, microservices, REST APIs (FastAPI/Flask), Docker containerization, data pipelines, and telemetry integration (MQTT, WebSockets).\n\n• **AI Developer:** Focuses on machine learning and deep learning algorithms, computer vision pipelines (detection, tracking, segmentation), sensor fusion for autonomous navigation, and edge AI deployment using PyTorch, TensorFlow, OpenCV, and ROS/ROS2.\n\nBoth roles collaborate closely on product-level platforms.`,
        suggestions: ["What skills are listed for AI Developer?", "What skills are listed for Python Developer?", "Software career page"],
        source: { label: "Software Development Careers", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // AI Developer Skills
    if (isAIDeveloperSkillsQuestion(q)) {
      const aiRole = OFFICIAL_KNOWLEDGE_BASE.careers.departments[0].roles.find((r) => r.title === "AI Developer");
      return {
        text: `**Skills listed for AI Developer:**\n\n${aiRole.skills.map((s) => `• ${s}`).join("\n")}\n\n**Role Focus:** ${aiRole.description}`,
        suggestions: ["Python Developer skills", "Software development roles", "How to apply"],
        source: { label: "Software Development Careers", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // Python Developer Skills
    if (isPythonDeveloperSkillsQuestion(q)) {
      const pyRole = OFFICIAL_KNOWLEDGE_BASE.careers.departments[0].roles.find((r) => r.title === "Python Developer (Product-Level)");
      return {
        text: `**Skills listed for Python Developer (Product-Level):**\n\n${pyRole.skills.map((s) => `• ${s}`).join("\n")}\n\n**Role Focus:** ${pyRole.description}`,
        suggestions: ["Difference with AI Developer", "Web Developer skills", "Software careers page"],
        source: { label: "Software Development Careers", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // Candidate background matching: "I know Python and machine learning"
    if (isPythonAndMLMatchingQuestion(q)) {
      return {
        text: `If you have background in **Python and machine learning**, two roles on our official Software Development page match your skill set:\n\n1. **AI Developer:** Focuses on machine learning, deep learning, computer vision, sensor fusion, PyTorch, TensorFlow, OpenCV, and ROS/ROS2.\n2. **Python Developer (Product-Level):** Focuses on Python OOP, asynchronous programming, FastAPI/Flask, REST APIs, and AI/ML pipeline integration into production.\n\nYou can review both role profiles on our Software Careers page.`,
        suggestions: ["AI Developer skills", "Python Developer skills", "Software Careers page"],
        source: { label: "Software Development Careers", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // Software Careers Overview
    if (isSoftwareCareersQuestion(q)) {
      const sw = OFFICIAL_KNOWLEDGE_BASE.careers.departments.find((d) => d.id === "software");
      return {
        text: `**Software Development Roles:**\n\n1. **Web Developer (App & Dashboard):** React.js, Next.js, Node.js, Django, WebSockets, telemetry visualization, security systems.\n2. **Python Developer (Product-Level):** Python, FastAPI/Flask, microservices, Docker, async programming, data pipelines.\n3. **AI Developer:** Machine learning, computer vision, sensor fusion, PyTorch, OpenCV, ROS/ROS2, edge AI.\n4. **Embedded Firmware Engineer:** Embedded C/C++, STM32, ARM Cortex, ESP32, bare-metal & RTOS, UART/SPI/CAN telemetry.`,
        suggestions: ["AI Developer skills", "Python vs AI Developer", "Electronics engineering roles"],
        source: { label: "Software Development Careers", url: sw.url }
      };
    }

    // Electronics Careers
    if (isElectronicsCareersQuestion(q)) {
      const elec = OFFICIAL_KNOWLEDGE_BASE.careers.departments.find((d) => d.id === "electronics");
      return {
        text: `**Electronics Engineering Roles:**\n\n1. **Hardware Design Engineer:** Circuit design, embedded hardware, power management, component selection.\n2. **PCB Design Engineer:** Multi-layer PCB layout, high-speed routing, signal integrity, EMI/EMC mitigation.\n3. **RF System Designer:** RF circuit design, antenna tuning, telemetry modules, spectrum analysis.\n4. **Test Engineer:** Hardware validation, environmental/stress testing, diagnostic test benches.\n5. **Product Engineer:** Hardware lifecycle, manufacturing coordination, technical documentation, QA compliance.`,
        suggestions: ["Mechanical engineering roles", "Software development roles", "Electronics careers page"],
        source: { label: "Electronics Careers", url: elec.url }
      };
    }

    // Mechanical Careers
    if (isMechanicalCareersQuestion(q)) {
      const mech = OFFICIAL_KNOWLEDGE_BASE.careers.departments.find((d) => d.id === "mechanical");
      return {
        text: `**Mechanical Engineering Roles:**\n\n1. **3D & 2D Mechanical Design Engineer:** CAD modeling (SolidWorks, CATIA, Fusion 360), GD&T, 2D fabrication drawings, rapid prototyping.\n2. **Enclosure & Product Design Engineer:** Rugged IP-rated enclosures, aerospace alloys/composites, sealing and impact resistance.\n3. **Mechanical Assembly & Integration Engineer:** Electromechanical integration, airframe and gimbal assembly, tolerance stack-up analysis.\n4. **Structural & Thermal Analysis Engineer:** FEA stress/deflection analysis, CFD aerodynamic modeling, thermal dissipation analysis.`,
        suggestions: ["Electronics engineering roles", "Software development roles", "Mechanical careers page"],
        source: { label: "Mechanical Careers", url: mech.url }
      };
    }

    // General Careers Overview
    if (isGeneralCareersQuestion(q)) {
      return {
        text: `Omoikane Innovations outlines technical roles across three main engineering disciplines:\n\n• **Software Development:** Web Developer, Python Developer, AI Developer, Embedded Firmware Engineer.\n• **Electronics Engineering:** Hardware Design, PCB Design, RF System Designer, Test Engineer, Product Engineer.\n• **Mechanical Engineering:** 3D/2D CAD Design, Enclosure Design, Assembly & Integration, Structural & Thermal Analysis.\n\n*Note:* The website presents role descriptions and required skills. For live vacancy inquiries or applications, visit the respective career page.`,
        suggestions: ["Software development roles", "Electronics roles", "Mechanical roles"],
        source: { label: "Careers Information", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 10. STRICT SAFE FALLBACK FOR UNVERIFIED / UNKNOWN QUESTIONS
    // ──────────────────────────────────────────────────────────────────────────
    return {
      text: OFFICIAL_KNOWLEDGE_BASE.safeFallbacks.unverifiedFact,
      suggestions: ["About Omoikane", "Core engineering capabilities", "Contact the team"],
      source: { label: "Contact Us", url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.contactUs }
    };
  },

  /**
   * Informational resume skill matching against official Omoikane career profiles
   */
  async analyzeResume(fileName, fileText = "") {
    await new Promise((r) => setTimeout(r, 600));

    const textLower = (fileText + " " + fileName).toLowerCase();

    // Comprehensive skill extraction matching across domains
    const detectedSkills = [];
    const skillCategories = [
      {
        category: "Software & Web Development",
        skills: [
          { name: "React / Next.js", match: ["react", "next.js", "nextjs", "jsx", "tsx", "redux"] },
          { name: "JavaScript / TypeScript", match: ["javascript", "typescript", "es6", "node", "nodejs"] },
          { name: "Python", match: ["python", "py", "fastapi", "flask", "django"] },
          { name: "APIs & WebSockets", match: ["rest api", "websocket", "websockets", "graphql", "telemetry"] },
          { name: "Backend Architecture", match: ["microservices", "docker", "kubernetes", "cloud", "aws", "gcp", "azure"] },
          { name: "Databases", match: ["sql", "postgresql", "mysql", "mongodb", "redis", "database"] }
        ]
      },
      {
        category: "AI, Machine Learning & Robotics",
        skills: [
          { name: "Machine Learning / Deep Learning", match: ["machine learning", "deep learning", "neural network", "ai", "data science"] },
          { name: "ML Frameworks (PyTorch/TensorFlow)", match: ["pytorch", "tensorflow", "keras", "scikit-learn"] },
          { name: "Computer Vision", match: ["computer vision", "opencv", "yolo", "object detection", "image processing", "segmentation"] },
          { name: "Robotics & Autonomous Navigation", match: ["ros", "ros2", "robot operating system", "slam", "sensor fusion", "autonomous", "uav", "drone"] },
          { name: "Edge AI / Embedded Computing", match: ["jetson", "nvidia jetson", "edge ai", "tensorrt", "embedded ai"] }
        ]
      },
      {
        category: "Electronics & Firmware Engineering",
        skills: [
          { name: "Embedded C / C++", match: ["embedded c", "c++", "bare metal", "low level"] },
          { name: "Microcontrollers (STM32/ESP32/ARM)", match: ["stm32", "arm cortex", "arm", "esp32", "microcontroller", "mcu", "pic", "arduino"] },
          { name: "RTOS & Systems Firmware", match: ["rtos", "freertos", "firmware", "device driver"] },
          { name: "Communication Protocols", match: ["can bus", "uart", "spi", "i2c", "rs232", "rs485", "telemetry"] },
          { name: "PCB Design & Hardware Architecture", match: ["pcb", "altium", "kicad", "circuit design", "hardware design", "schematic", "eda"] },
          { name: "RF & Signal Integrity", match: ["rf", "radio frequency", "antenna", "signal integrity", "emc", "emi", "telemetry module"] },
          { name: "Testing & Test Benches", match: ["test engineer", "hardware testing", "validation", "diagnostic", "oscilloscope", "qa"] }
        ]
      },
      {
        category: "Mechanical & Systems Design",
        skills: [
          { name: "CAD Modeling (SolidWorks/CATIA)", match: ["solidworks", "catia", "fusion 360", "cad", "autocad", "3d modeling", "creo"] },
          { name: "Mechanical & Enclosure Design", match: ["enclosure", "sheet metal", "gd&t", "rapid prototyping", "3d printing", "ip-rated"] },
          { name: "Structural & Thermal Analysis (FEA/CFD)", match: ["fea", "cfd", "ansys", "thermal analysis", "finite element", "aerodynamic", "structural analysis"] },
          { name: "Assembly & Electromechanical Integration", match: ["assembly", "integration", "electromechanical", "gimbal", "airframe", "tolerance"] }
        ]
      }
    ];

    const matchedByCategory = {};

    skillCategories.forEach((cat) => {
      cat.skills.forEach((s) => {
        if (s.match.some((m) => textLower.includes(m))) {
          if (!matchedByCategory[cat.category]) matchedByCategory[cat.category] = [];
          matchedByCategory[cat.category].push(s.name);
          detectedSkills.push(s.name);
        }
      });
    });

    // Determine matching departments and best roles
    const matchedRoles = [];

    if (detectedSkills.some((s) => s.includes("Python") || s.includes("Backend") || s.includes("APIs"))) {
      matchedRoles.push({
        title: "Python Developer (Product-Level)",
        department: "Software Development",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers,
        reason: "Strong fit for core backend architecture, microservices, and product data pipelines."
      });
    }

    if (detectedSkills.some((s) => s.includes("Machine Learning") || s.includes("Vision") || s.includes("Robotics") || s.includes("Edge AI") || s.includes("PyTorch"))) {
      matchedRoles.push({
        title: "AI Developer",
        department: "Software Development",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers,
        reason: "Direct match for computer vision, autonomous navigation, sensor fusion, and edge AI systems."
      });
    }

    if (detectedSkills.some((s) => s.includes("React") || s.includes("JavaScript") || s.includes("TypeScript"))) {
      matchedRoles.push({
        title: "Web Developer (App & Dashboard)",
        department: "Software Development",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers,
        reason: "Direct match for interactive dashboards, telemetry visualization, and web applications."
      });
    }

    if (detectedSkills.some((s) => s.includes("Embedded C") || s.includes("Microcontrollers") || s.includes("RTOS") || s.includes("Protocols"))) {
      matchedRoles.push({
        title: "Embedded Firmware Engineer",
        department: "Software Development",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers,
        reason: "Direct match for bare-metal/RTOS firmware, STM32 flight controllers, and edge processing."
      });
    }

    if (detectedSkills.some((s) => s.includes("PCB") || s.includes("RF") || s.includes("Testing"))) {
      matchedRoles.push({
        title: "Hardware / PCB Design Engineer",
        department: "Electronics Engineering",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.electronicsCareers,
        reason: "Direct match for multi-layer PCB design, RF modules, power architecture, and hardware validation."
      });
    }

    if (detectedSkills.some((s) => s.includes("CAD") || s.includes("Enclosure") || s.includes("Structural") || s.includes("Assembly"))) {
      matchedRoles.push({
        title: "Mechanical / Structural Design Engineer",
        department: "Mechanical Engineering",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.mechanicalCareers,
        reason: "Direct match for SolidWorks/CATIA modeling, rugged enclosures, FEA/CFD, and electromechanical assembly."
      });
    }

    if (matchedRoles.length === 0) {
      matchedRoles.push({
        title: "General Engineering / Technical Track",
        department: "Omoikane Technical Careers",
        url: OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers,
        reason: "Broad technical foundation suitable for evaluation across Software, Electronics, or Mechanical engineering."
      });
    }

    // Build skills breakdown text
    let skillsFormatted = "";
    const categoriesWithSkills = Object.keys(matchedByCategory);

    if (categoriesWithSkills.length > 0) {
      skillsFormatted = categoriesWithSkills.map((cat) => {
        return `* **${cat}:** ${matchedByCategory[cat].join(", ")}`;
      }).join("\n");
    } else {
      skillsFormatted = "* General engineering and technical foundation detected from document profile.";
    }

    const rolesFormatted = matchedRoles.map((r) => {
      return `* **${r.title}** (${r.department})\n  *Why:* ${r.reason}\n  *Apply Link:* [View Role Details](${r.url})`;
    }).join("\n\n");

    return {
      text: `### 📄 Resume Analysis for "${fileName}"\n\n#### 🎯 Identified Technical Skill Areas\n${skillsFormatted}\n\n---\n\n#### 💼 Aligned Official Career Roles at Omoikane Innovations\n${rolesFormatted}\n\n---\n\n⚠️ **Important Application Note:**\nThis AI matching is **strictly informational** based on job descriptions on our official website. It is **not** an official hiring decision or an automatic application submission. \n\nTo officially submit your candidacy:\n* Visit our [Careers Portal](${matchedRoles[0]?.url || OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers}) and submit your profile via the form\n* Or email your resume directly to: **info@omoikaneinnovations.com**`,
      suggestions: [
        `How do I apply for ${matchedRoles[0]?.title || "software roles"}?`,
        "Explore Software Development careers",
        "Contact the hiring team"
      ],
      source: { label: matchedRoles[0]?.department || "Careers Portal", url: matchedRoles[0]?.url || OFFICIAL_KNOWLEDGE_BASE.company.officialUrls.softwareCareers }
    };
  }
};

// ────────────────────────────────────────────────────────────────────────────
// QUERY CLASSIFICATION HELPER FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────

function isGreeting(q) {
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "namaste", "howdy"];
  return greetings.some((g) => q === g || q.startsWith(`${g} `) || q.endsWith(` ${g}`));
}

function isBotIdentityQuestion(q) {
  return (
    q.includes("who are you") ||
    q.includes("what is your name") ||
    q.includes("are you an ai") ||
    q.includes("are you human") ||
    q.includes("are you a robot") ||
    q.includes("tell me about yourself")
  );
}

function isHiringStatusQuestion(q) {
  return (
    q.includes("hiring now") ||
    q.includes("currently hiring") ||
    q.includes("are you hiring") ||
    q.includes("job openings") ||
    q.includes("open positions") ||
    q.includes("any vacancy") ||
    q.includes("vacancies") ||
    q.includes("recruiting now")
  );
}

function isSalaryQuestion(q) {
  return (
    q.includes("salary") ||
    q.includes("ctc") ||
    q.includes("compensation") ||
    q.includes("stipend") ||
    q.includes("pay package") ||
    q.includes("how much do you pay")
  );
}

function isHowToApplyQuestion(q) {
  return (
    q.includes("how to apply") ||
    q.includes("how do i apply") ||
    q.includes("where can i apply") ||
    q.includes("application process") ||
    q.includes("submit resume") ||
    q.includes("submit application")
  );
}

function isUnpublishedMetricQuestion(q) {
  const metricKeywords = [
    "range of your uav",
    "uav range",
    "drone range",
    "payload capacity",
    "max payload",
    "flight time",
    "endurance of drone",
    "price of uav",
    "drone price",
    "cost of drone",
    "delivery schedule",
    "battery capacity",
    "top speed of uav"
  ];
  return (
    metricKeywords.some((m) => q.includes(m)) ||
    ((q.includes("range") || q.includes("payload") || q.includes("flight time") || q.includes("price") || q.includes("cost")) &&
      (q.includes("drone") || q.includes("uav") || q.includes("product")))
  );
}

function extractMetricTopic(q) {
  if (q.includes("range")) return "UAV flight range";
  if (q.includes("payload")) return "payload capacity";
  if (q.includes("price") || q.includes("cost")) return "commercial pricing";
  if (q.includes("flight time") || q.includes("endurance")) return "flight endurance";
  return "exact technical metrics";
}

function isExecutiveNameQuestion(q) {
  return (
    q.includes("ceo") ||
    q.includes("founder") ||
    q.includes("who owns") ||
    q.includes("who runs") ||
    q.includes("executive") ||
    q.includes("leadership name")
  );
}

function isVisionQuestion(q) {
  return (
    q.includes("vision") &&
    !q.includes("computer vision")
  );
}

function isMissionQuestion(q) {
  return (
    q.includes("mission") &&
    !q.includes("mission critical") &&
    !q.includes("mission-critical")
  );
}

function isEngineeringApproachQuestion(q) {
  return (
    q.includes("engineering approach") ||
    q.includes("what makes its engineering approach different") ||
    q.includes("how does omoikane engineer")
  );
}

function isLocationQuestion(q) {
  return (
    q.includes("location") ||
    q.includes("located") ||
    q.includes("headquarters") ||
    q.includes("headquarter") ||
    (q.includes("office") && (q.includes("where") || q.includes("address") || q.includes("city") || q.includes("located"))) ||
    q.includes("where are you") ||
    q.includes("where is the company")
  );
}

function isCompanyOverviewQuestion(q) {
  if (
    q.includes("about company") ||
    q.includes("about the company") ||
    q.includes("tell me about company") ||
    q.includes("tell me about the company") ||
    q.includes("tell me about omoikane") ||
    q.includes("what is omoikane") ||
    q.includes("what does omoikane do") ||
    q.includes("what does the company do") ||
    q.includes("what does this company do") ||
    q.includes("what do you do") ||
    q.includes("who is omoikane") ||
    q.includes("company overview") ||
    q.includes("company profile") ||
    q.includes("company details") ||
    q.includes("about us") ||
    q === "about" ||
    q === "company"
  ) {
    return true;
  }

  // Any question asking what the company does
  if ((q.includes("what do") || q.includes("what does")) && (q.includes("company") || q.includes("omoikane") || q.includes("you do"))) {
    return true;
  }

  const isAskingAbout =
    q.includes("about") ||
    q.includes("tell me") ||
    q.includes("what is") ||
    q.includes("what does") ||
    q.includes("what do") ||
    q.includes("who is") ||
    q.includes("describe") ||
    q.includes("introduce") ||
    q.includes("know about") ||
    q.includes("learn about") ||
    q.includes("explain");

  const isCompanyWord =
    q.includes("company") ||
    q.includes("omoikane") ||
    q.includes("firm") ||
    q.includes("organization") ||
    q.includes("business") ||
    q.includes("you guys") ||
    q.includes("your work");

  return isAskingAbout && isCompanyWord;
}

function isEmailQuestion(q) {
  return (
    q.includes("email") ||
    q.includes("official email") ||
    q.includes("mail address") ||
    q.includes("email address")
  );
}

function isOfficeHoursQuestion(q) {
  return (
    q.includes("office hours") ||
    q.includes("working hours") ||
    q.includes("timings") ||
    q.includes("timing") ||
    q.includes("operating hours") ||
    (q.includes("when") && (q.includes("open") || q.includes("available") || q.includes("work")))
  );
}

function isContactQuestion(q) {
  return (
    q.includes("contact") ||
    q.includes("reach out") ||
    q.includes("get in touch") ||
    q.includes("touch with") ||
    q.includes("phone number") ||
    q.includes("phone") ||
    q.includes("call you") ||
    q.includes("contact the company") ||
    q.includes("how can i contact") ||
    q.includes("how to contact")
  );
}

function isLicensingOrCollaborationQuestion(q) {
  return (
    q.includes("licensing") ||
    q.includes("license") ||
    q.includes("customization") ||
    q.includes("collaboration") ||
    q.includes("partnership") ||
    q.includes("integrate your technology") ||
    q.includes("technology licensing")
  );
}

function isAerospaceQuestion(q) {
  return (
    q.includes("aerospace") ||
    q.includes("uav") ||
    q.includes("drone") ||
    q.includes("flight control") ||
    q.includes("avionics")
  );
}

function isDefenseQuestion(q) {
  return (
    q.includes("defense") ||
    q.includes("defence") ||
    q.includes("surveillance") ||
    q.includes("secure communication") ||
    q.includes("situational awareness")
  );
}

function isAutomotiveQuestion(q) {
  return (
    q.includes("automotive") ||
    q.includes("ecu") ||
    q.includes("vehicle automation")
  );
}

function isRailwaysQuestion(q) {
  return (
    q.includes("railway") ||
    q.includes("railways") ||
    q.includes("predictive maintenance") ||
    q.includes("industrial automation") ||
    q.includes("industrial systems")
  );
}

function isIndustriesOverviewQuestion(q) {
  return (
    q.includes("which industries") ||
    q.includes("industries does the company serve") ||
    q.includes("industries does it work in") ||
    q.includes("sectors") ||
    q.includes("product domains") ||
    q.includes("explore technologies") ||
    q.includes("what technologies") ||
    (q.includes("industries") && !q.includes("railway"))
  );
}

function isEmbeddedSystemsQuestion(q) {
  return (
    q.includes("embedded systems") ||
    q.includes("embedded electronics") ||
    q.includes("rf communication modules") ||
    q.includes("real-time processing units") ||
    (q.includes("embedded") && !q.includes("firmware engineer"))
  );
}

function isAutonomousRoboticQuestion(q) {
  return (
    q.includes("autonomous and robotic") ||
    q.includes("autonomous platforms") ||
    q.includes("robotic capabilities") ||
    q.includes("robotics") ||
    q.includes("ground platforms") ||
    q.includes("autonomous")
  );
}

function isAICapabilitiesQuestion(q) {
  return (
    (q.includes("ai capabilities") || q.includes("ai and computer vision") || q.includes("artificial intelligence")) &&
    !q.includes("career") &&
    !q.includes("developer role")
  );
}

function isCapabilitiesOverviewQuestion(q) {
  return (
    q.includes("engineering capabilities") ||
    q.includes("core capabilities") ||
    q.includes("technical capabilities") ||
    q.includes("what are your capabilities") ||
    q.includes("capabilities") ||
    q.includes("services") ||
    q.includes("service") ||
    q.includes("what are you providing") ||
    q.includes("what do you provide") ||
    q.includes("what do you offer") ||
    q.includes("what are you offering") ||
    q.includes("what do you do") ||
    q.includes("what does omoikane do") ||
    q.includes("what can you do") ||
    q.includes("what do you build") ||
    q.includes("what do you engineer")
  );
}

function isPythonVsAIDeveloperQuestion(q) {
  return (
    (q.includes("difference") && q.includes("python") && q.includes("ai")) ||
    (q.includes("compare") && q.includes("python") && q.includes("ai"))
  );
}

function isAIDeveloperSkillsQuestion(q) {
  return (
    (q.includes("ai developer") && (q.includes("skill") || q.includes("require") || q.includes("technolog"))) ||
    (q.includes("skills") && q.includes("ai role"))
  );
}

function isPythonDeveloperSkillsQuestion(q) {
  return (
    (q.includes("python developer") && (q.includes("skill") || q.includes("require") || q.includes("technolog"))) ||
    (q.includes("skills") && q.includes("python role"))
  );
}

function isPythonAndMLMatchingQuestion(q) {
  return (
    (q.includes("python") && q.includes("machine learning")) ||
    (q.includes("know python") && q.includes("ml")) ||
    (q.includes("which career page should i check") && q.includes("python"))
  );
}

function isSoftwareCareersQuestion(q) {
  return (
    q.includes("software development") ||
    q.includes("software career") ||
    q.includes("software roles") ||
    q.includes("web developer") ||
    q.includes("firmware engineer")
  );
}

function isElectronicsCareersQuestion(q) {
  return (
    q.includes("electronics") ||
    q.includes("hardware design engineer") ||
    q.includes("pcb design") ||
    q.includes("rf system designer")
  );
}

function isMechanicalCareersQuestion(q) {
  return (
    q.includes("mechanical") ||
    q.includes("cad modeling") ||
    q.includes("solidworks") ||
    q.includes("thermal analysis")
  );
}

function isGeneralCareersQuestion(q) {
  return (
    q.includes("careers") ||
    q.includes("career") ||
    q.includes("technical roles") ||
    q.includes("engineering roles") ||
    q.includes("career opportunities") ||
    q.includes("job") ||
    q.includes("jobs") ||
    q.includes("work with you") ||
    q.includes("join the team")
  );
}
