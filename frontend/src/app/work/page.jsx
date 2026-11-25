import { pageMetadata } from "@/lib/siteMetadata";
import WorkClient from "@/components/features/work/WorkClient";

export const metadata = pageMetadata("/work", "Products & Systems | Omoikane Innovations", "Explore Omoikane Innovations' mission-critical products and systems: flight controllers, 4-in-1 electronic speed controllers, encrypted tactical communications, GNSS positioning, and autonomous platforms.");

export default function WorkPage() {
  return <WorkClient />;
}
