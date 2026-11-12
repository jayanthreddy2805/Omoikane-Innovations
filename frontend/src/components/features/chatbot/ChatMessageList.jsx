import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import ChatMessage from './ChatMessage';
import QuickQuestions from './QuickQuestions';
import styles from './ChatbotWidget.module.css';

export default function ChatMessageList({
  messages,
  isTyping,
  onSelectSuggestion,
  onSelectQuickAction
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.chatScrollArea}>
      {/* 1. Welcome Card if No Messages */}
      {messages.length === 0 ? (
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeLogoBadge}>
            <Image
              src="/images/shared/omoikane-logo.png"
              alt="Omoikane Innovations"
              width={48}
              height={48}
              className={styles.welcomeLogoImage}
              priority
            />
          </div>
          <h3 className={styles.welcomeHeading}>Omoikane Innovations</h3>
          <p className={styles.welcomeGreeting}>
            Hi there! 👋 Welcome to Omoikane Innovations. I’m your company assistant. I can help you explore our technologies, engineering capabilities, career information, and contact details. How can I help you today?
          </p>

          <QuickQuestions onSelectQuestion={onSelectQuickAction} />
        </div>
      ) : (
        /* 2. Message History Stream */
        <div className={styles.messageStream}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectSuggestion={onSelectSuggestion}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className={`${styles.messageRow} ${styles.botRow}`}>
              <div className={styles.botAvatarContainer}>
                <Image
                  src="/images/shared/omoikane-logo.png"
                  alt="Omoikane Logo"
                  width={24}
                  height={24}
                  className={styles.botAvatarLogo}
                  priority
                />
              </div>
              <div className={styles.bubbleCol}>
                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typingBubble}`}>
                  <div className={styles.typingWave}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}
    </div>
  );
}
