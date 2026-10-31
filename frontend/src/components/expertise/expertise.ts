export type ExpertiseItem = {
  id: string;
  title: string;
  description: string;
  systems: string[];
};

export const expertise: ExpertiseItem[] = [
  {
    id: "aerospace",
    title: "Aerospace",
    description:
      "Engineering for precision, stability and real-time performance in high-reliability aerospace environments.",
    systems: ["UAV platforms and flight control", "Avionics and RF communication", "High-reliability aerospace systems"],
  },
  {
    id: "railways",
    title: "Railways",
    description:
      "Engineering for efficient operation and maintenance across industrial and railway environments.",
    systems: ["Predictive maintenance", "Industrial automation", "Intelligent control systems"],
  },
  {
    id: "automotive",
    title: "Automotive",
    description:
      "Electronics and embedded control for next-generation mobility and vehicle automation.",
    systems: ["Automotive ECU solutions", "Real-time embedded systems", "Vehicle automation"],
  },
  {
    id: "defense",
    title: "Defense",
    description:
      "Systems for reliable operations and situational awareness in demanding defense environments.",
    systems: ["Secure communication systems", "Autonomous surveillance platforms", "Rugged embedded electronics"],
  },
];
