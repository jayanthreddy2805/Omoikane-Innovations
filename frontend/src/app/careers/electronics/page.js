import CareerTemplate from '@/components/careers/CareerTemplate';

const electronicsRoles = [
  {
    id: "hardware-eng",
    number: "01",
    title: "HARDWARE DESIGN ENGINEER",
    subtitle: "System Architecture",
    description: "Role Focus: End-to-end hardware architecture, power distribution systems, and high-reliability UAV electronics",
    visual: "/images/careers/electronics/embedded-pcb.jpg",
    tech: [
      "End-to-End Hardware Architecture (FC, ESC, Power Systems)",
      "Mixed-Signal Design (Analog + Digital Integration)",
      "High-Reliability Circuit Design (Defense-Grade)",
      "Real-Time Embedded Hardware Co-Design",
      "Sensor Interface Design (IMU, GNSS, LiDAR, Vision Modules)",
      "High-Current Design (100A–1000A Systems)",
      "BLDC Motor Control Hardware (ESC Design, Gate Drivers, FOC Basics)",
      "Battery Management Systems (BMS)",
      "Power Distribution Architecture for Multi-Motor Drones",
      "Thermal-Aware Power Design & Efficiency Optimization",
      "Communication Protocols: UART, SPI, I2C, CAN/CAN-FD",
      "MAVLink, PWM, PPM & DShot Integration",
      "Ethernet for High-Speed UAV Data Systems"
    ]
  },
  {
    id: "pcb-eng",
    number: "02",
    title: "PCB DESIGN ENGINEER",
    subtitle: "Board Layout",
    description: "Role Focus: High-density multilayer routing, impedance control, and military-grade signal integrity",
    visual: "/images/careers/electronics/firmware.jpg",
    tech: [
      "Multi-Layer PCB Design (6–12+ Layers, High-Density Layouts)",
      "High-Speed Routing (DDR3/DDR4/DDR5 Interfaces)",
      "Ethernet, USB, PCIe & SATA High-Speed Interfaces",
      "LVDS / FPD-Link & MIPI CSI/DSI Interfaces",
      "Differential Pair Routing (Length Matching & Skew Control)",
      "Controlled Impedance Routing (50Ω / 90Ω / 100Ω)",
      "Return Path & Reference Plane Management",
      "Signal Integrity & Power Integrity (SI/PI Analysis)",
      "EMI/EMC Compliance (Military-Grade Robustness)",
      "Thermal Management in PCB Design",
      "Camera & Vision System Interface Integration",
      "High-Speed Storage & Data Communication Systems",
      "Advanced PCB Optimization for Embedded & UAV Systems"
    ]
  },
  {
    id: "rf-eng",
    number: "03",
    title: "RF SYSTEM DESIGNER",
    subtitle: "Wireless Communications",
    description: "Role Focus: Long-range telemetry links, antenna integration, and aerospace RF spectrum validation",
    visual: "/images/careers/electronics/systems.jpg",
    tech: [
      "End-to-End RF Architecture (Tx/Rx Chain, Front-End Design)",
      "Antenna Integration & Impedance Matching (S11, VSWR Optimization)",
      "Multi-Band RF Systems (GNSS, Telemetry, Control Links)",
      "RF Link Budget & Range Optimization",
      "Low-Noise RF Design (LNA, Filters, Noise Control)",
      "Multi-Constellation GNSS (GPS, GLONASS, Galileo, BeiDou)",
      "GNSS Noise Mitigation & Filtering",
      "EMI/EMC Design for Aerospace Systems",
      "RF Shielding, Grounding & Isolation",
      "Interference Mitigation for ESC & Power Electronics",
      "Anti-Jamming & Anti-Spoofing Fundamentals",
      "RF Measurements (VNA, Spectrum Analyzer, Power Meter)",
      "RF PCB Layout & Impedance-Controlled Routing"
    ]
  },
  {
    id: "test-eng",
    number: "04",
    title: "TEST ENGINEER",
    subtitle: "Validation & Reliability",
    description: "Role Focus: Complex multi-board system bring-up, environmental testing, and reliability qualification",
    visual: "/images/careers/electronics/hero.jpg",
    tech: [
      "Hardware Bring-Up (Complex Multi-Board Systems)",
      "Environmental Testing (Thermal Cycling, Vibration, Shock)",
      "HALT/HASS & Reliability Qualification",
      "Failure Analysis & Root Cause Debugging (RCA)",
      "Lab Expertise: Oscilloscope, Spectrum Analyzer & VNA",
      "Power Testing & Validation"
    ]
  },
  {
    id: "prod-eng-elec",
    number: "05",
    title: "PRODUCT ENGINEER",
    subtitle: "Manufacturing & QA",
    description: "Role Focus: Hardware product lifecycle management, DFM/DFA coordination, and production scaling",
    visual: "/images/careers/electronics/embedded-pcb.jpg",
    tech: [
      "Design for Manufacturing (DFM) & Assembly (DFA)",
      "PCB Fabrication & Assembly (SMT, Reflow, Rework)",
      "Production Scaling & Cost Optimization",
      "Reliability Engineering (MTBF, Derating Techniques)",
      "Technical Documentation (Schematics, BOM, Test Procedures)"
    ]
  }
];

export default function ElectronicsCareers() {
  const electronicsData = {
    eyebrow: "ELECTRONICS ENGINEERING",
    headline: "POWERING<br />INTELLIGENCE.",
    heroSub: "We design the circuits, boards, and RF systems<br />that bring autonomous platforms to life.",
    heroVisual: "/images/careers/electronics/hero.jpg",
    roles: electronicsRoles,
    categoryLabel: "ELECTRONICS",
    theme: "electronics"
  };

  return <CareerTemplate data={electronicsData} />;
}
