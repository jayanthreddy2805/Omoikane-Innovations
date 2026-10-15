"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotLauncher from './ChatbotLauncher';
import ChatbotHeader from './ChatbotHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import styles from './ChatbotWidget.module.css';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Close or minimize on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isMinimized) {
          setIsMinimized(true);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Build conversation history for multi-turn context (last 6 messages)
  const buildHistory = (msgs) => {
    return msgs.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'bot',
      text: m.text
    }));
  };

  // Master send message dispatcher
  const handleSendMessage = async (rawText, attachedFile = null) => {
    if ((!rawText || !rawText.trim()) && !attachedFile) return;
    if (isTyping) return;

    const userText = rawText ? rawText.trim() : '';
    const displayText = attachedFile
      ? (userText ? `📎 Attached Resume: **${attachedFile.name}**\n${userText}` : `📎 Attached Resume: **${attachedFile.name}**`)
      : userText;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: displayText,
      timestamp: getTimestamp()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const conversationHistory = buildHistory(messages);

      const payload = attachedFile
        ? {
            message: userText || "Analyze my resume for engineering roles at Omoikane Innovations",
            conversationHistory,
            resume: {
              fileName: attachedFile.name,
              fileBase64: attachedFile.base64 || "",
              fileText: attachedFile.text || ""
            }
          }
        : { message: userText, conversationHistory };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let botResponse;
      if (res.ok) {
        botResponse = await res.json();
      } else {
        // API error — give a graceful contact message
        botResponse = {
          text: "I'm having trouble connecting right now. Please try again, or contact Omoikane Innovations directly at **info@omoikaneinnovations.com** or call **+91-8861035848**.",
          suggestions: ["Contact Us", "About Omoikane", "Career Opportunities"],
          source: { label: "Contact Us", url: "https://www.omoikaneinnovations.com/contact-us/" }
        };
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        timestamp: botResponse.timestamp || getTimestamp(),
        source: botResponse.source || null,
        suggestions: botResponse.suggestions || []
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('[Chatbot Error]:', err);
      const fallbackMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment, or reach out directly:\n\n📧 **info@omoikaneinnovations.com**\n📞 **+91-8861035848**\n🌐 **https://www.omoikaneinnovations.com/contact-us/**",
        timestamp: getTimestamp(),
        source: { label: "Contact Us", url: "https://www.omoikaneinnovations.com/contact-us/" },
        suggestions: ["About Omoikane", "Explore Technologies", "Contact the Company"]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <>
      {/* 1. Launcher Button */}
      <ChatbotLauncher
        isOpen={isOpen}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setIsMinimized(false);
        }}
      />

      {/* 2. Chat Dialog Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${styles.widgetPanel} ${isMinimized ? styles.widgetPanelMinimized : ''}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '60px' : '620px'
            }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-label="Omoikane Innovations AI Assistant"
          >
            {/* Header */}
            <ChatbotHeader
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized((prev) => !prev)}
              onClose={() => setIsOpen(false)}
              onReset={handleResetConversation}
            />

            {/* Panel Body (Hidden when Minimized) */}
            {!isMinimized && (
              <div className={styles.widgetBody}>
                <ChatMessageList
                  messages={messages}
                  isTyping={isTyping}
                  onSelectSuggestion={(sugg) => handleSendMessage(sugg)}
                  onSelectQuickAction={(act) => handleSendMessage(act)}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
