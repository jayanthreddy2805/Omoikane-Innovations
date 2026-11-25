import { pageMetadata, SITE_URL } from "@/lib/siteMetadata";
import { Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer";
import ChatbotMount from "@/components/features/chatbot/ChatbotMount";
import ConsentAwareAnalytics from "@/components/features/privacy/ConsentAwareAnalytics";
import CookiePreferences from "@/components/features/privacy/CookiePreferences";
import MotionPreferences from "@/components/layout/motion/MotionPreferences";
import "./globals.css";
import "./clientTypography.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});

export const metadata = { ...pageMetadata("/", "Omoikane Innovations", "Advanced UAVs, embedded electronics, autonomous platforms and defense technologies engineered for real-world deployment."), metadataBase: new URL(SITE_URL), icons: { icon: "/omoikane-logo.png" } };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable}`}
    >
      <body suppressHydrationWarning>
        <a href="#main-content" className="skipLink">Skip to main content</a>
        <MotionPreferences>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <ChatbotMount />
          <CookiePreferences />
          <ConsentAwareAnalytics />
        </MotionPreferences>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.omoikaneinnovations.com/#organization",
          name: "Omoikane Innovations",
          url: "https://www.omoikaneinnovations.com",
          logo: "https://www.omoikaneinnovations.com/omoikane-logo.png",
          sameAs: ["https://in.linkedin.com/company/omoikane-innovations"],
        })}</script>
      </body>
    </html>
  );
}
