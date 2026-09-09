import { Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
