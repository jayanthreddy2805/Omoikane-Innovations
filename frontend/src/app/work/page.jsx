import { pageMetadata } from "@/lib/siteMetadata";
import WorkClient from "@/components/features/work/WorkClient";

export const metadata = pageMetadata("/work", "Products & Systems | Omoikane Innovations", "Explore Omoikane Innovations' products and systems: flight controllers, 4-in-1 electronic speed controllers, GNSS positioning modules, and communication systems.");

export default function WorkPage() {
  return <WorkClient />;
}
