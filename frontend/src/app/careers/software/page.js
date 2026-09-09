import CareerTemplate from '@/components/common/CareerTemplate';

const softwareCapabilities = [
  {
    id: "ai-autonomy",
    title: "AI / AUTONOMY",
    description: "Machine perception and decision systems.",
    relatedRoles: ["ai-dev", "python-dev"]
  },
  {
    id: "realtime",
    title: "REAL-TIME SYSTEMS",
    description: "Telemetry, communications and control.",
    relatedRoles: ["python-dev", "firmware-eng", "ai-dev"]
  },
  {
    id: "product",
    title: "PRODUCT SOFTWARE",
    description: "Applications, dashboards and interfaces.",
    relatedRoles: ["web-dev", "python-dev"]
  },
  {
    id: "connected",
    title: "CONNECTED SYSTEMS",
    description: "Data, APIs, fleets and mission systems.",
    relatedRoles: ["python-dev", "web-dev", "firmware-eng"]
  }
];

const softwareRoles = [
  {
    id: "web-dev",
    number: "01",
    title: "WEB DEVELOPER",
    subtitle: "App & Dashboard",
    specialization: "Product interfaces · Live data",
    description: "Build interfaces for monitoring, control and real-time operations.",
    visual: "/images/careers/web-dev-dashboard.jpg",
    work: [
      "Control interfaces",
      "Monitoring dashboards",
      "Fleet management",
      "Live telemetry",
      "Mission planning"
    ],
    tech: [
      "React / Next.js",
      "Node.js / Django",
      "UI/UX for real-time systems",
      "WebSocket / live data",
      "AWS / Firebase",
      "Agri analytics",
      "Light show control",
      "Mobile apps",
      "Maps",
      "Authentication / security"
    ],
    fullSkills: [
      {
        category: "PRODUCT & UI",
        items: [
          "Frontend: React.js / Next.js",
          "Backend: Node.js / Django",
          "UI/UX for Real-Time Systems",
          "Mobile App Development (Flutter / React Native) – Bonus"
        ]
      },
      {
        category: "OPERATIONS & CONTROL",
        items: [
          "Fleet Management Dashboards",
          "Mission Planning UI",
          "Agri Analytics Dashboards",
          "Light Show Control Interface"
        ]
      },
      {
        category: "REAL-TIME & PLATFORM",
        items: [
          "WebSocket / Live Data Streaming",
          "Live Telemetry Visualization",
          "Cloud Integration (AWS / Firebase)",
          "Map Integration (Google Maps, Mapbox)",
          "Authentication & Security Systems"
        ]
      }
    ]
  },
  {
    id: "python-dev",
    number: "02",
    title: "PYTHON DEVELOPER",
    subtitle: "Product-Level",
    specialization: "Backend · APIs · Services",
    description: "Build backend systems, APIs and product infrastructure for intelligent applications.",
    visual: "/images/careers/python-architecture.jpg",
    work: [
      "Scalable backend architectures",
      "Drone fleet systems",
      "API development",
      "Ground control software",
      "Real-time telemetry handling"
    ],
    tech: [
      "Advanced Python",
      "API development",
      "AI/ML integrations",
      "Scalable systems",
      "Docker / Cloud",
      "Monitoring",
      "REST / MQTT / WebSockets"
    ],
    fullSkills: [
      {
        category: "CORE ENGINEERING",
        items: [
          "Advanced Python (OOP, Async Programming, Multiprocessing)",
          "API Development (FastAPI, Flask, RESTful Design)",
          "High-Performance Backend Optimization",
          "Scalable System Design (Microservices Architecture)"
        ]
      },
      {
        category: "SYSTEMS & INFRASTRUCTURE",
        items: [
          "AI/ML Pipeline Integration & Deployment",
          "Containerization (Docker) & Deployment Pipelines",
          "Cloud Integration (AWS / GCP / Azure)",
          "Logging, Monitoring & Debugging (Prometheus, Grafana, ELK)"
        ]
      },
      {
        category: "DOMAIN OPERATIONS",
        items: [
          "Ground Control Software & Mission Planning",
          "Drone Fleet Management Systems",
          "Real-Time Telemetry & Data Pipelines",
          "Communication: REST APIs, MQTT, WebSockets"
        ]
      }
    ]
  },
  {
    id: "ai-dev",
    number: "03",
    title: "AI DEVELOPER",
    subtitle: "Autonomy & Perception",
    specialization: "Vision · ML · Sensor fusion",
    description: "Develop perception, machine-learning and autonomy systems for real-world environments.",
    visual: "/images/careers/ai-vision.jpg",
    work: [
      "Autonomous navigation",
      "Swarm intelligence",
      "Precision agriculture",
      "Target detection",
      "Multi-drone coordination"
    ],
    tech: [
      "Machine learning / Deep learning",
      "Computer vision",
      "Sensor fusion",
      "VTOL control",
      "PyTorch / TensorFlow",
      "OpenCV",
      "ROS / ROS2 / Edge AI"
    ],
    fullSkills: [
      {
        category: "CORE AI & VISION",
        items: [
          "Machine Learning & Deep Learning (CNNs, Transformers, RL basics)",
          "Computer Vision (object detection, tracking, segmentation)",
          "Python, PyTorch, TensorFlow, OpenCV",
          "Edge AI (NVIDIA Jetson, TensorRT)"
        ]
      },
      {
        category: "AUTONOMY & SENSORS",
        items: [
          "Autonomous Navigation (path planning, obstacle avoidance)",
          "Sensor Fusion (Camera, IMU, GPS, LiDAR)",
          "ROS / ROS2",
          "Autonomous VTOL Flight & Landing"
        ]
      },
      {
        category: "APPLIED DOMAINS",
        items: [
          "Swarm Intelligence (for light-show drones)",
          "Precision Agriculture (crop health, spraying optimization)",
          "Target Detection & Tracking (defense/payload systems)",
          "Multi-Drone Coordination (light shows, fleet operations)"
        ]
      }
    ]
  },
  {
    id: "firmware-eng",
    number: "04",
    title: "EMBEDDED FIRMWARE",
    subtitle: "Real-Time Systems",
    specialization: "Firmware · Sensors · Control",
    description: "Develop real-time firmware for sensors, controllers, communication and motor systems.",
    visual: "/images/careers/embedded-pcb.jpg",
    work: [
      "Flight controller programming",
      "Payload controls",
      "Hardware telemetry pipelines",
      "Sensor integration",
      "Real-time motor control"
    ],
    tech: [
      "C / C++",
      "STM32 / ARM Cortex / ESP32",
      "RTOS",
      "UART / SPI / I2C / CAN",
      "PWM / ESC / DShot",
      "IMU / GPS / Barometer / LiDAR",
      "PX4 / ArduPilot"
    ],
    fullSkills: [
      {
        category: "HARDWARE & FIRMWARE",
        items: [
          "Embedded C/C++ (Bare-Metal & RTOS)",
          "Microcontrollers (STM32, ARM Cortex, ESP32)",
          "Real-Time Firmware Development & Debugging",
          "Hardware–Firmware Co-Design & Debugging",
          "Signal-Level Debugging (Oscilloscope & Logic Analyzer)"
        ]
      },
      {
        category: "CONTROL & SENSORS",
        items: [
          "Peripheral Drivers (UART, SPI, I2C, CAN, PWM)",
          "Sensor Integration (IMU, GPS, Barometer, LiDAR)",
          "Motor Control Interfaces (ESC, PWM, DShot)",
          "Payload Control & Actuator Systems"
        ]
      },
      {
        category: "FLIGHT SYSTEMS",
        items: [
          "Flight Controller Firmware (PX4 / ArduPilot Customization)",
          "VTOL & Multirotor Control Systems",
          "Real-Time Telemetry & Communication Systems"
        ]
      }
    ]
  }
];

export default function SoftwareCareers() {
  const softwareData = {
    eyebrow: "SOFTWARE DEVELOPMENT",
    headline: "SOFTWARE THAT<br />MEETS THE REAL WORLD.",
    heroSub: "We build applications, real-time platforms,<br />autonomous software and interfaces for connected systems.",
    heroVisual: "/images/careers/hero.jpg",
    capabilities: softwareCapabilities,
    roles: softwareRoles,
    categoryLabel: "SOFTWARE"
  };

  return <CareerTemplate data={softwareData} />;
}
