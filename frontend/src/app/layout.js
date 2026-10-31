import { Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";
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
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
