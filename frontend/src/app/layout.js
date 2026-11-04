import { Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatbotMount from "@/components/Chatbot/ChatbotMount";
import CookiePreferences from "@/components/privacy/CookiePreferences";
import MotionPreferences from "@/components/layout/MotionPreferences";
import "./globals.css";

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

export const metadata = {
  metadataBase: new URL("https://www.omoikaneinnovations.com"),
  title: "Omoikane Innovations",
  description: "Advanced UAVs, embedded electronics, autonomous platforms and defense technologies engineered for real-world deployment.",
  icons: {
    icon: "/omoikane-logo.png",
    shortcut: "/omoikane-logo.png",
    apple: "/omoikane-logo.png",
  },
  openGraph: {
    title: "Omoikane Innovations",
    description: "Advanced UAVs, embedded electronics, autonomous platforms and defense technologies engineered for real-world deployment.",
    url: "https://omoikaneinnovations.com",
    siteName: "Omoikane Innovations",
    images: [
      {
        url: "/omoikane-logo.png",
        width: 1080,
        height: 1080,
        alt: "Omoikane Innovations Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Omoikane Innovations",
    description: "Advanced UAVs, embedded electronics, autonomous platforms and defense technologies engineered for real-world deployment.",
    images: ["/omoikane-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable}`}>
      <body>
        <a href="#main-content" className="skipLink">Skip to main content</a>
        <MotionPreferences>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <ChatbotMount />
          <CookiePreferences />
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
