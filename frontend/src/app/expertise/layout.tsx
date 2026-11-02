import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expertise | Omoikane Innovations",
  description: "Explore Omoikane capabilities across aerospace, defense, automotive, railways and industrial systems.",
};

export default function ExpertiseLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
