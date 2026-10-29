import CareerTemplate from '@/components/careers/CareerTemplate';

const mechanicalRoles = [
  {
    id: "mech-design",
    number: "01",
    title: "3D & 2D MECHANICAL DESIGN ENGINEER",
    subtitle: "Drone Structures",
    description: "Role Focus: UAV airframe design, CAD modeling, and manufacturing drawings",
    visual: "/images/careers/mechanical/mech-design.jpg",
    tech: [
      "3D CAD Modeling (SolidWorks, CATIA, Fusion 360)",
      "2D Drawings & GD&T",
      "Assembly Design & BOM Creation",
      "Material Selection (Carbon Fiber, Aluminum, Polymers)",
      "Design for Manufacturing (DFM) & Assembly (DFA)",
      "Multirotor, Fixed-Wing & VTOL Airframe Design",
      "Lightweight Frame Optimization",
      "Folding Arms, Landing Gear & Payload Mounts",
      "Agri Drone Tank & Structural Layout",
      "Light-Show Drone Compact Frame Design"
    ]
  },
  {
    id: "prod-eng",
    number: "02",
    title: "ENCLOSURE & PRODUCT DESIGN ENGINEER",
    subtitle: "System Hardware",
    description: "Role Focus: Electronics housing, ruggedization, and product-level design",
    visual: "/images/careers/mechanical/mech-product.jpg",
    tech: [
      "Enclosure Design (IP-Rated, Weatherproof, Dustproof)",
      "Thermal Management (Heat Sinks, Airflow Design)",
      "EMI/EMC Considerations & Shielding Basics",
      "Cable Routing & Connector Integration",
      "Industrial & Product Design Aesthetics",
      "Flight Controller & Avionics Enclosures",
      "Battery Housing & Power Module Casing",
      "Agri Drone Spray System Housing",
      "Outdoor Rugged Systems for Defense Environments"
    ]
  },
  {
    id: "mech-assembly",
    number: "03",
    title: "MECHANICAL ASSEMBLY & INTEGRATION ENGINEER",
    subtitle: "Hardware Build",
    description: "Role Focus: System integration, prototyping, and full product build",
    visual: "/images/careers/mechanical/mech-assembly.jpg",
    tech: [
      "Mechanical Assembly & Integration",
      "Tolerance Stack-Up & Fitment Validation",
      "Fasteners, Joints & Adhesives Selection",
      "Wiring & Mechanical Routing Coordination",
      "Prototype Build & Testing",
      "Full Drone Assembly (Frame, Electronics & Payload)",
      "VTOL Integration (Fixed-Wing & Multirotor Systems)",
      "Payload Drop Mechanisms (Actuators & Servo Systems)",
      "Agri Bot Mechanical Integration"
    ]
  },
  {
    id: "struct-therm",
    number: "04",
    title: "STRUCTURAL & THERMAL ANALYSIS ENGINEER",
    subtitle: "Environmental Engineering",
    description: "Role Focus: Simulation, validation, and reliability engineering",
    visual: "/images/careers/mechanical/mech-structural.jpg",
    tech: [
      "Structural Analysis (Stress, Strain, Deformation)",
      "Thermal Analysis (Heat Dissipation & Cooling)",
      "Vibration & Shock Analysis for UAVs",
      "FEA Tools (ANSYS, SolidWorks Simulation)",
      "Fatigue & Lifecycle Analysis",
      "Airframe Strength Validation (Flight Loads)",
      "Motor Vibration Impact on Structures",
      "Thermal Performance of Embedded Electronics",
      "Payload Stress Analysis (Drop & Load Conditions)"
    ]
  }
];

export default function MechanicalCareers() {
  const mechanicalData = {
    eyebrow: "MECHANICAL ENGINEERING",
    headline: "ENGINEERED<br />TO MOVE.",
    heroSub: "We design structures, assemblies and physical systems<br />for drones, autonomous platforms and real-world products.",
    heroVisual: "/images/careers/mechanical/hero.jpg",
    roles: mechanicalRoles,
    categoryLabel: "MECHANICAL",
    theme: "mechanical"
  };

  return <CareerTemplate data={mechanicalData} />;
}
