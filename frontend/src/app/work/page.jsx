import WorkClient from "@/components/features/work/WorkClient";

export const metadata = {
  title: "Products & Systems | Omoikane Innovations",
  description:
    "Explore Omoikane Innovations' mission-critical products and systems: flight controllers, 4-in-1 electronic speed controllers, encrypted tactical communications, GNSS positioning, and autonomous platforms.",
  openGraph: {
    title: "Products & Systems | Omoikane Innovations",
    description:
      "High-performance flight control, propulsion, tactical communications, and autonomous platforms engineered for aerospace, defense, and industrial environments.",
    url: "https://www.omoikaneinnovations.com/work",
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
