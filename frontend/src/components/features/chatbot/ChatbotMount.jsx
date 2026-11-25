"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import ChatbotLauncher from "./ChatbotLauncher";

const ChatbotWidget = dynamic(() => import("./ChatbotWidget"), {
  ssr: false,
  loading: () => <ChatbotLauncher busy isOpen={false} />,
});

export default function ChatbotMount() {
  const [requested, setRequested] = useState(false);
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/apply") return null;
  return requested
    ? <ChatbotWidget initiallyOpen />
    : <ChatbotLauncher isOpen={false} onClick={() => setRequested(true)} />;
}
