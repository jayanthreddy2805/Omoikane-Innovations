import CareerTemplate from '@/components/careers/CareerTemplate';


const softwareRoles = [
  {
    id: "web-dev",
    number: "01",
    title: "WEB DEVELOPER",
    subtitle: "App & Dashboard",
    description: "Role Focus: Control interfaces, monitoring dashboards, user apps",
    visual: "/images/careers/software/web-dev-dashboard.jpg",
    tech: [
      "Frontend: React.js / Next.js",
      "Backend: Node.js / Django",
      "UI/UX for Real-Time Systems",
      "WebSocket / Live Data Streaming",
      "Cloud Integration (AWS / Firebase)",
      "Fleet Management Dashboards",
      "Live Telemetry Visualization",
      "Mission Planning UI",
      "Agri Analytics Dashboards",
      "Light Show Control Interface",
      "Mobile App Development (Flutter / React Native) – Bonus",
      "Map Integration (Google Maps, Mapbox)",
      "Authentication & Security Systems"
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
    description: "Role Focus: AI integration, backend systems, and scalable product engineering",
    visual: "/images/careers/software/python-architecture.jpg",
    tech: [
      "Advanced Python (OOP, Async Programming, Multiprocessing)",
      "API Development (FastAPI, Flask, RESTful Design)",
      "AI/ML Pipeline Integration & Deployment",
      "Scalable System Design (Microservices Architecture)",
      "High-Performance Backend Optimization",
      "Containerization (Docker) & Deployment Pipelines",
      "Cloud Integration (AWS / GCP / Azure)",
      "Logging, Monitoring & Debugging (Prometheus, Grafana, ELK)",
      "Ground Control Software & Mission Planning",
      "Drone Fleet Management Systems",
      "Real-Time Telemetry & Data Pipelines",
      "Communication: REST APIs, MQTT, WebSockets"
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
    description: "Role Focus: Autonomy, perception, and intelligent decision systems",
    visual: "/images/careers/software/ai-vision.jpg",
    tech: [
      "Machine Learning & Deep Learning (CNNs, Transformers, RL basics)",
      "Computer Vision (object detection, tracking, segmentation)",
      "Sensor Fusion (Camera, IMU, GPS, LiDAR)",
      "Autonomous Navigation (path planning, obstacle avoidance)",
      "Swarm Intelligence (for light-show drones)",
      "Precision Agriculture (crop health, spraying optimization)",
      "Target Detection & Tracking (defense/payload systems)",
      "Autonomous VTOL Flight & Landing",
      "Multi-Drone Coordination (light shows, fleet operations)",
      "Python, PyTorch, TensorFlow, OpenCV",
      "ROS / ROS2",
      "Edge AI (NVIDIA Jetson, TensorRT)"
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
    description: "Role Focus: Flight controller programming, sensor integration, payload controls, real-time motor control",
    visual: "/images/careers/electronics/embedded-pcb.jpg",
    tech: [
      "Embedded C/C++ (Bare-Metal & RTOS)",
      "Microcontrollers (STM32, ARM Cortex, ESP32)",
      "Real-Time Firmware Development & Debugging",
      "Peripheral Drivers (UART, SPI, I2C, CAN, PWM)",
      "Sensor Integration (IMU, GPS, Barometer, LiDAR)",
      "Motor Control Interfaces (ESC, PWM, DShot)",
      "Hardware–Firmware Co-Design & Debugging",
      "Signal-Level Debugging (Oscilloscope & Logic Analyzer)",
      "Flight Controller Firmware (PX4 / ArduPilot Customization)",
      "VTOL & Multirotor Control Systems",
      "Payload Control & Actuator Systems",
      "Real-Time Telemetry & Communication Systems"
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
    heroVisual: "/images/careers/software/hero.jpg",
    roles: softwareRoles,
    categoryLabel: "SOFTWARE"
  };

  return <CareerTemplate data={softwareData} />;
}
