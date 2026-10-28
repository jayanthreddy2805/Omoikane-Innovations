/**
 * ============================================================================
 * LOCAL RAG INDEX BUILDER — Omoikane Innovations
 * ============================================================================
 * Chunks official company documents from the company archive and generates
 * 768-dimensional local vector embeddings using Ollama (nomic-embed-text).
 * Stores the compiled index into src/data/rag_vector_index.json.
 * 
 * Run with: node scripts/build_rag_index.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

// Raw Document Chunks derived from the official company reference archive
const DOCUMENT_CHUNKS = [
  {
    id: "overview_identity",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Company Overview & Identity",
    url: "https://www.omoikaneinnovations.com/about-us/",
    content: "Omoikane Innovations Pvt. Ltd. is a product-driven technology company headquartered in Bengaluru, India. The company focuses on indigenous design and development of electronic hardware, advanced embedded systems, autonomous platforms, and defense-grade solutions for aerospace, defense, and industrial applications. Slogan: 'Indigenous technology · Global standards'. Tagline: 'Innovation is not our goal; it’s our standard.'",
    keywords: ["company", "overview", "identity", "omoikane", "bengaluru", "bangalore", "motto", "tagline", "standard", "indigenous"]
  },
  {
    id: "vision_mission",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Vision, Mission & Principles",
    url: "https://www.omoikaneinnovations.com/about-us/",
    content: "Vision: To be a trusted contributor and global leader in indigenous defense and embedded technologies by delivering high-performance, reliable, and scalable systems suitable for mission-critical industries. Mission: To design, develop, and deliver advanced products and platforms across Aerospace, Defense, and Industrial domains—enabling scalable technology integration and licensing worldwide for a safer, smarter, and self-reliant future. Values: Innovation, integrity, excellence, teamwork, and customer focus ('Your mission. Our engineering').",
    keywords: ["vision", "mission", "values", "principles", "goal", "purpose", "future", "self-reliant"]
  },
  {
    id: "product_ofc_x",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Products — OFC-X Flight Controller",
    url: "https://www.omoikaneinnovations.com/products.html?product=ofc-x",
    content: "OFC-X is an advanced, high-performance, reliable, and flexible autonomous flight controller designed for demanding UAV and unmanned aerial platform applications. Key specifications and design architecture include: STM32 and AT32 microcontroller (MCU) platform options; multiple I/O and sensor interfaces for flexible payload and actuator integration; real-time precision flight control algorithms; system integration and interface customization for OEM UAV manufacturers.",
    keywords: ["ofc-x", "ofc x", "flight controller", "autopilot", "stm32", "at32", "uav", "drone", "mcu", "avionics"]
  },
  {
    id: "product_oesc",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Products — OESC-60 / OESC-100 Electronic Speed Controller",
    url: "https://www.omoikaneinnovations.com/products.html?product=oesc",
    content: "OESC-60 / OESC-100 is a high-efficiency, high-current 4-in-1 Electronic Speed Controller (ESC) platform engineered for multirotor propulsion systems and extreme operational demands. Specifications: Available in 60A (OESC-60) and 100A (OESC-100) current variants; supports 6S to 12S LiPo battery platform voltages; equipped with advanced current monitoring and thermal protection mechanisms; built for heavy-lift drones and multirotor propulsion efficiency.",
    keywords: ["oesc", "oesc-60", "oesc-100", "speed controller", "esc", "4-in-1", "60a", "100a", "6s", "12s", "propulsion", "multirotor"]
  },
  {
    id: "product_ogn_x",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Products — OGN-X GNSS / GPS Module",
    url: "https://www.omoikaneinnovations.com/products.html?product=ogn-x",
    content: "OGN-X is a high-precision satellite positioning and navigation architecture engineered for autonomous UAV navigation, mapping, and defense platforms. Specifications: Multi-constellation GNSS options (GPS, GLONASS, Galileo, BeiDou/NavIC); RTK-ready (Real-Time Kinematic) architecture for centimeter-level positioning accuracy; compact, ruggedized enclosure and integration designed for demanding airborne environments.",
    keywords: ["ogn-x", "ogn x", "gnss", "gps", "navigation", "positioning", "satellite", "rtk", "mapping", "centimeter"]
  },
  {
    id: "product_ocom_x",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Products — OCOM-X Autonomous Communication System",
    url: "https://www.omoikaneinnovations.com/products.html?product=ocom-x",
    content: "OCOM-X is a reliable, secure communication system architecture for connected autonomous systems and unmanned operations. Specifications: RF (Radio Frequency) and LTE cellular integration options; secure, encrypted data link architecture for telemetry, control, and payload transmission; low-power design approach ensuring extended mission endurance for airborne and ground platforms.",
    keywords: ["ocom-x", "ocom x", "communication", "telemetry", "rf", "lte", "datalink", "encrypted", "secure", "radio"]
  },
  {
    id: "aerospace_sector",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Sector — Aerospace & UAV Solutions",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Aerospace capabilities at Omoikane Innovations: Design, integration, and development of Unmanned Aerial Vehicle (UAV) platforms, flight control systems (OFC-X), avionics, RF communication modules (OCOM-X), and multirotor propulsion control (OESC). Engineered for precision, aerodynamic stability, real-time control loops, and mission-critical reliability in airborne operations.",
    keywords: ["aerospace", "uav", "drone", "aviation", "avionics", "flight", "aerial", "aircraft", "platforms"]
  },
  {
    id: "defense_sector",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Sector — Defense & Secure Systems",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Defense capabilities at Omoikane Innovations: Secure, encrypted communication systems; autonomous surveillance platforms for ground and aerial situational awareness; ruggedized defense-grade embedded electronics hardened for extreme field conditions; intelligent real-time sensor processing and decision support.",
    keywords: ["defense", "surveillance", "military", "security", "rugged", "situational awareness", "encrypted", "anti-jamming"]
  },
  {
    id: "automotive_sector",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Sector — Automotive & Vehicle Automation",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Automotive capabilities at Omoikane Innovations: Intelligent automotive electronics; Electronic Control Unit (ECU) solutions; real-time embedded computing for next-generation vehicle automation, powertrain telemetry, driver assistance, efficiency, and vehicle safety.",
    keywords: ["automotive", "ecu", "electronic control unit", "vehicle", "automation", "mobility", "powertrain", "cars"]
  },
  {
    id: "railways_industrial_sector",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Sector — Railways & Industrial Automation",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Railways & Industrial Systems capabilities: Predictive maintenance systems using AI-driven sensor monitoring to prevent equipment failures; industrial automation hardware; intelligent control systems for rail networks and large-scale manufacturing facilities.",
    keywords: ["railways", "industrial", "predictive maintenance", "automation", "scada", "trains", "factories", "manufacturing"]
  },
  {
    id: "engineering_disciplines",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Technology — Core Engineering Disciplines",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Core engineering disciplines at Omoikane Innovations: 1. Hardware Design (system architecture, schematics, multi-layer high-speed PCB layout); 2. Embedded Platforms (MCU/SoC selection, bare-metal and RTOS firmware, board bring-up); 3. RF & GNSS (wireless telemetry, antennas, satellite positioning); 4. Power Electronics (ESC architecture, power management, thermal dissipation); 5. System Integration (cabling, electromechanical integration); 6. Prototyping & Validation (functional checks, environmental stress testing, test benches).",
    keywords: ["engineering", "disciplines", "hardware design", "embedded platforms", "rf", "gnss", "power electronics", "validation"]
  },
  {
    id: "engineering_tools",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Technology — Engineering Tools & Software",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Engineering design tools, simulation environments, and workflows used at Omoikane Innovations: ECAD & Layout: OrCAD, Cadence Allegro, Altium Designer, PADS; Circuit Simulation: LTspice; Structural & Aerodynamic Simulation: ANSYS (FEA stress and CFD aerodynamic modeling); Mechanical Design: SolidWorks, CATIA, Fusion 360; Workflows: Formal Design Reviews, DFM (Design for Manufacturing), DFT (Design for Testing).",
    keywords: ["tools", "software", "orcad", "allegro", "altium", "pads", "ltspice", "ansys", "solidworks", "catia", "dfm", "dft", "ecad"]
  },
  {
    id: "target_markets",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Markets — Target Industry Verticals",
    url: "https://www.omoikaneinnovations.com/about-us/",
    content: "Omoikane Innovations serves high-reliability markets: UAV Manufacturers & Drone OEMs, Defense & Aerospace Contractors, Government Agencies, Industrial Automation Firms, Agriculture & Survey Providers, and System Integrators.",
    keywords: ["markets", "clients", "industries", "uav manufacturers", "drone oems", "defense contractors", "government", "integrators"]
  },
  {
    id: "career_embedded_hardware",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Careers — Embedded Hardware Design Engineer",
    url: "https://www.omoikaneinnovations.com/career-detail.html",
    content: "Open Role: Embedded Hardware Design Engineer (Full-time, Bengaluru, India). Responsibilities: Design and develop schematics and multi-layer PCB layouts for UAV, aerospace, defense, and industrial electronics; component selection and BOM creation; cross-functional bring-up and prototyping; hardware debugging with oscilloscopes and diagnostic benches; following DFM, DFT, and reliability practices. Desired Skills: OrCAD / Allegro or Altium Designer; analog, digital, and power electronics; high-speed signal integrity, layer stack-up, and manufacturing constraints.",
    keywords: ["embedded hardware design engineer", "pcb design", "schematics", "orcad", "allegro", "altium", "bengaluru", "hardware engineer"]
  },
  {
    id: "career_internship",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Careers — Engineering Internship",
    url: "https://www.omoikaneinnovations.com/careers.html",
    content: "Open Opportunity: Engineering Internship – Hardware / Embedded Systems (Early Career, Bengaluru, India). Focus: Project-based hands-on learning and mentorship working on real aerospace, UAV, and defense embedded hardware. Activities: Schematic review, lab testing, board bring-up, component soldering, and firmware testing. How to Apply: Send resume to omoikaneinnovations@gmail.com or info@omoikaneinnovations.com with subject 'Internship Enquiry'.",
    keywords: ["internship", "intern", "early career", "student", "mentorship", "hardware internship", "embedded internship"]
  },
  {
    id: "careers_software_tracks",
    sourceFile: "company_knowledge/software-development",
    section: "Careers — Software Development Tracks",
    url: "https://www.omoikaneinnovations.com/software-development/",
    content: "Software Development Career Tracks at Omoikane Innovations: 1. Web Developer (App & Dashboard): React.js, Next.js, Node.js, Django, WebSockets, real-time telemetry dashboards, REST APIs, TypeScript; 2. Python Developer (Product-Level): Python OOP, FastAPI, Flask, microservices, Docker, async programming, MQTT, WebSockets, data pipelines; 3. AI Developer: Computer vision (detection, tracking, segmentation), PyTorch, TensorFlow, OpenCV, ROS/ROS2, Edge AI on NVIDIA Jetson; 4. Embedded Firmware Engineer: Embedded C/C++, STM32, ARM Cortex, ESP32, RTOS (FreeRTOS), CAN bus, UART, SPI, I2C, flight controller firmware.",
    keywords: ["software careers", "python developer", "ai developer", "web developer", "embedded firmware engineer", "react", "fastapi", "pytorch", "ros2"]
  },
  {
    id: "careers_electronics_mechanical",
    sourceFile: "company_knowledge/electronics-mechanical",
    section: "Careers — Electronics & Mechanical Tracks",
    url: "https://www.omoikaneinnovations.com/electronics/",
    content: "Electronics Engineering Tracks: Hardware Design Engineer, PCB Design Engineer, RF System Designer, Test Engineer, Product Engineer. Mechanical Engineering Tracks: 3D & 2D Mechanical Design Engineer (SolidWorks, CATIA, Fusion 360, GD&T), Enclosure & Product Design Engineer (rugged IP-rated enclosures, aerospace composites), Mechanical Assembly & Integration Engineer, Structural & Thermal Analysis Engineer (ANSYS, FEA, CFD).",
    keywords: ["electronics careers", "mechanical careers", "rf system designer", "cad engineer", "thermal analysis", "enclosure design"]
  },
  {
    id: "contact_location",
    sourceFile: "company_zip/omoikane-website/app.js",
    section: "Contact Details & Registered Headquarters",
    url: "https://www.omoikaneinnovations.com/contact-us/",
    content: "Registered Office & Headquarters: No. 45, 2nd Main, 6th Cross, Marenahalli, Deepanjali Nagar, Vijayanagar, Bengaluru – 560026, Karnataka, India. Located in Bengaluru (Bangalore), Karnataka, India ONLY. Email: info@omoikaneinnovations.com | omoikaneinnovations@gmail.com | Business Development: bd@omoikaneinnovations.com. Phone: +91-8861035848 | +91-9353627825. Office Hours: Monday to Friday, 9:00 AM – 6:00 PM IST.",
    keywords: ["contact", "address", "location", "headquarters", "bengaluru", "bangalore", "phone", "email", "office hours", "vijayanagar", "deepanjali nagar"]
  },
  {
    id: "licensing_integration",
    sourceFile: "company_zip/omoikane-website/README.txt",
    section: "Commercial — Custom Integration & Licensing",
    url: "https://www.omoikaneinnovations.com/services/",
    content: "Custom Integration & Technology Licensing: Omoikane Innovations designs proprietary hardware and embedded platforms that can be customized and licensed to OEMs, defense contractors, and system integrators worldwide. Products (OFC-X, OESC, OGN-X, OCOM-X) are configurable around customer platform interfaces, operating conditions, and mission constraints. Inquiries: bd@omoikaneinnovations.com.",
    keywords: ["licensing", "custom integration", "oem", "collaboration", "partnership", "contracts", "b2b"]
  },
  {
    id: "strict_policies",
    sourceFile: "company_knowledge/policies",
    section: "Company Policies & Confidentiality",
    url: "https://www.omoikaneinnovations.com/contact-us/",
    content: "Confidentiality and Verification Policies: 1. Specific product pricing, OEM quotes, and commercial terms are confidential and quoted upon formal project enquiry; 2. Specific employee salaries, stipends, and exact vacancy counts are not published publicly online; 3. Executive leadership names (CEO, founders) are not published on the website; inquiries should be directed to info@omoikaneinnovations.com; 4. The company location is Bengaluru, Karnataka, India ONLY (never Hyderabad).",
    keywords: ["policies", "salary", "pricing", "cost", "ceo", "founder", "hyderabad", "confidential"]
  }
];

async function generateEmbedding(text) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: EMBED_MODEL,
        prompt: text
      })
    });
    if (!res.ok) {
      throw new Error(`Ollama embedding HTTP error ${res.status}`);
    }
    const data = await res.json();
    return data.embedding;
  } catch (err) {
    console.error(`Failed to generate embedding:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`====================================================`);
  console.log(`Starting Local RAG Index Generation`);
  console.log(`Embedding Model: ${EMBED_MODEL}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Total Document Chunks: ${DOCUMENT_CHUNKS.length}`);
  console.log(`====================================================`);

  const indexedChunks = [];

  for (let i = 0; i < DOCUMENT_CHUNKS.length; i++) {
    const chunk = DOCUMENT_CHUNKS[i];
    process.stdout.write(`[${i + 1}/${DOCUMENT_CHUNKS.length}] Embedding: ${chunk.id} ... `);
    const start = Date.now();
    // Embed content combined with section title for strong semantic capture
    const textToEmbed = `${chunk.section}: ${chunk.content}`;
    const embedding = await generateEmbedding(textToEmbed);

    if (embedding && Array.isArray(embedding)) {
      indexedChunks.push({
        ...chunk,
        embeddingLength: embedding.length,
        embedding: embedding
      });
      console.log(`OK (${Date.now() - start}ms, dim: ${embedding.length})`);
    } else {
      console.log(`FAILED! Falling back to lexical indexing only.`);
      indexedChunks.push({
        ...chunk,
        embeddingLength: 0,
        embedding: null
      });
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'rag_vector_index.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    embedModel: EMBED_MODEL,
    dimension: indexedChunks[0]?.embeddingLength || 768,
    totalChunks: indexedChunks.length,
    chunks: indexedChunks
  }, null, 2), 'utf-8');

  console.log(`\n====================================================`);
  console.log(`RAG Vector Index generated successfully!`);
  console.log(`Saved to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
  console.log(`====================================================`);
}

main().catch(console.error);
