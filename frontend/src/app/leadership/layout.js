import { pageMetadata } from "@/lib/siteMetadata";
export const metadata = {
  ...pageMetadata("/leadership", "Leadership | Omoikane Innovations", "Leadership oversight, engineering teams, and operational approach at Omoikane Innovations."),
  robots: { index: false, follow: false },
};

export default function LeadershipLayout({ children }) { return children; }
