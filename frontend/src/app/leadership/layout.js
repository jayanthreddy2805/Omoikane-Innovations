import { pageMetadata } from "@/lib/siteMetadata";
export const metadata = {
  ...pageMetadata("/leadership", "Leadership | Omoikane Innovations", "Explore the leadership page template and how teams at Omoikane Innovations work."),
  robots: { index: false, follow: false },
};

export default function LeadershipLayout({ children }) { return children; }
