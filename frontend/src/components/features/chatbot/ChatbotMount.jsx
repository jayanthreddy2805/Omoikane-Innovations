"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ChatbotLauncher from "./ChatbotLauncher";

const ChatbotWidget = dynamic(() => import("./ChatbotWidget"), {
  ssr: false,
  loading: () => <ChatbotLauncher busy isOpen={false} />,
});

export default function ChatbotMount() {
  const [requested, setRequested] = useState(false);
  return requested
    ? <ChatbotWidget initiallyOpen />
    : <ChatbotLauncher isOpen={false} onClick={() => setRequested(true)} />;
}
