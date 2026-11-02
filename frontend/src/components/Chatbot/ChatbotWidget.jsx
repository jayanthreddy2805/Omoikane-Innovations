"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotLauncher from './ChatbotLauncher';
import ChatbotHeader from './ChatbotHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import styles from './ChatbotWidget.module.css';

export default function ChatbotWidget({ initiallyOpen = false }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector('textarea')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen, isMinimized]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
    document.getElementById('company-assistant-launcher')?.focus();
  }, []);

  // Escape closes the assistant and restores focus to its launcher.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

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
      ? (userText ? `Attached resume: **${attachedFile.name}**\n${userText}` : `Attached resume: **${attachedFile.name}**`)
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
          source: { label: "Contact Us", url: "https://www.omoikaneinnovations.com/contact" }
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
        text: "I'm having trouble connecting right now. Please try again in a moment, or contact us at **info@omoikaneinnovations.com**, **+91-8861035848**, or **https://www.omoikaneinnovations.com/contact**.",
        timestamp: getTimestamp(),
        source: { label: "Contact Us", url: "https://www.omoikaneinnovations.com/contact" },
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
            id="company-assistant-dialog"
            ref={dialogRef}
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
              onClose={closeAssistant}
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
