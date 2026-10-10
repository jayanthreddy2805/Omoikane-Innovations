export type ExpertiseItem = {
  id: string;
  title: string;
  description: string;
};

export const expertise: ExpertiseItem[] = [
  {
    id: "aerospace",
    title: "Aerospace",
    description:
      "We develop advanced UAV platforms, flight control systems, avionics, and RF communication modules engineered for precision, stability, and real-time performance. Our products are designed for mission-critical aerospace operations and high-reliability environments.",
  },
  {
    id: "automotive",
    title: "Automotive",
    description:
      "We build intelligent automotive electronics, ECU solutions, and real-time embedded systems that support next-generation mobility and vehicle automation.",
  },
  {
    id: "defense",
    title: "Defense",
    description:
      "Our defense-grade technologies include secure communication systems, autonomous surveillance platforms, and rugged embedded electronics. Built for reliability and performance, our solutions support modern defense operations and situational awareness.",
  },
  {
    id: "railways",
    title: "Railways",
    description:
      "Our technologies enable predictive maintenance, automation, and intelligent control systems for industrial and railway environments, ensuring efficiency and reliability at scale.",
  },
];
