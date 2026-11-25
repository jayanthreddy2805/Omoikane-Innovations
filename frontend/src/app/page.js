import { pageMetadata, SITE_URL } from "@/lib/siteMetadata";
import HomeClient from "@/components/features/home/HomeClient";

export const metadata = { ...pageMetadata("/", "Omoikane Innovations", "Designing and developing mission-critical products, autonomous systems, and advanced embedded solutions for aerospace, defense, and industrial applications."), metadataBase: new URL(SITE_URL), icons: { icon: "/omoikane-logo.png" } };

export default function Home() {
  return <HomeClient />;
}



