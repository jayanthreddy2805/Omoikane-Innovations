import { pageMetadata } from "@/lib/siteMetadata";

export const metadata = pageMetadata("/expertise", "Technology | Omoikane Innovations", "Explore Omoikane technology capabilities across aerospace and defense systems.");

export default function ExpertiseLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
