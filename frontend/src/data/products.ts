// OWNER TODO: attach dated evidence and approval fields listed in CLAIMS_TO_VERIFY.md.
export const products = [
  {
    id: "ofc-x",
    number: "01",
    title: "OFC-X — Flight Controller",
    description:
      "High-performance, reliable and flexible flight control for autonomous platforms.",
    engineering:
      "Omoikane develops flight controller configurations around MCU options, sensor and I/O interfaces, and the platform's operating conditions.",
    considerationsHeading: "Technical Considerations",
    considerationsCol1: [
      "STM32 / AT32 MCU options",
      "Multiple I/O and sensor interfaces",
      "Designed for demanding UAV applications",
    ],
    considerationsCol2: [
      "Host-platform interface definition",
      "Control-loop and prototype validation planning",
    ],
    images: {
      main: "/images/projects/flight-controller.webp",
      top: "/images/careers/electronics/embedded-pcb.jpg",
      bottom: "/images/leadership/uav-architecture-blueprint.png",
      alt: "Illustrative flight-controller engineering image; product photograph pending owner verification",
    },
    inquireSubject: "OFC-X Flight Controller",
  },
  {
    id: "oesc",
    number: "02",
    title: "OESC-60 / OESC-100 — 4-in-1 Electronic Speed Controller",
    description:
      "High-efficiency, high-current ESC platform for multirotor propulsion systems.",
    engineering:
      "The 4-in-1 controller is developed with 60A / 100A variants, 6S–12S platform options, and current and thermal protection in scope.",
    considerationsHeading: "Technical Considerations",
    considerationsCol1: [
      "60A / 100A variants",
      "6S–12S platform options",
      "Advanced current and thermal protection",
    ],
    considerationsCol2: [
      "Power and propulsion interface definition",
      "Current and thermal validation planning",
    ],
    images: {
      main: "/images/careers/electronics/embedded-pcb.jpg",
      top: "/images/careers/electronics/systems.jpg",
      bottom: "/images/capabilities/cap-03.jpg",
      alt: "Electronics imagery accompanying the OESC controller profile",
    },
    inquireSubject: "OESC-60 / OESC-100 Electronic Speed Controller",
  },
  {
    id: "ogn-x",
    number: "03",
    title: "OGN-X — GNSS / GPS Module",
    description:
      "Precision positioning architecture for autonomous navigation and mapping.",
    engineering:
      "The module's engineering scope includes multi-constellation GNSS options, an RTK-ready architecture, and compact integration for the host platform.",
    considerationsHeading: "Technical Considerations",
    considerationsCol1: [
      "Multi-constellation GNSS options",
      "RTK-ready architecture",
      "Compact, rugged integration",
    ],
    considerationsCol2: [
      "Antenna placement and host interface requirements",
      "Positioning and prototype validation planning",
    ],
    images: {
      main: "/images/projects/ground-platform.webp",
      top: "/images/projects/flight-controller.webp",
      bottom: "/images/about/domain-air.jpg",
      alt: "Autonomous platform imagery accompanying the OGN-X navigation profile",
    },
    inquireSubject: "OGN-X GNSS / GPS Module",
  },
  {
    id: "ocom-x",
    number: "04",
    title: "OCOM-X — Communication System",
    description:
      "Reliable communication architecture for connected autonomous systems.",
    engineering:
      "The system is developed around RF / LTE integration options, secure link architecture, and low-power design requirements.",
    considerationsHeading: "Technical Considerations",
    considerationsCol1: [
      "RF / LTE integration options",
      "Secure link architecture",
      "Low-power design approach",
    ],
    considerationsCol2: [
      "Host-system and telemetry interface requirements",
      "Link evaluation and validation planning",
    ],
    images: {
      main: "/images/projects/tactical-datalink.webp",
      top: "/images/about/domain-ground.jpg",
      bottom: "/images/contact/aeronautical-drawing-sketch.png",
      alt: "Communication and platform imagery accompanying the OCOM-X profile",
    },
    inquireSubject: "OCOM-X Communication System",
  },
];
