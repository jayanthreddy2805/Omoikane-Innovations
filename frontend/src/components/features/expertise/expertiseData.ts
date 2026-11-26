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
    id: "defense",
    title: "Defense",
    description:
      "Systems for reliable operations and situational awareness in demanding defense environments.",
    systems: ["Secure communication systems", "Autonomous surveillance platforms", "Rugged embedded electronics"],
  },
];
