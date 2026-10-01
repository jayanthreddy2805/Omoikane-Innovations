"use client";

import React from 'react';
import { Sparkles, Minus, X, RotateCcw, Bot } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function ChatHeader({ onMinimize, onClose, onReset, isMinimized }) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.botIconWrapper}>
          <Bot size={20} className={styles.botIcon} />
          <span className={styles.statusDot} title="Online" />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.headerTitleRow}>
            <span className={styles.headerTitle}>Company AI Assistant</span>
            <span className={styles.demoBadge}>DEMO</span>
          </div>
          <span className={styles.headerSubtitle}>
            Ask about our company, careers, jobs or your application.
          </span>
        </div>
      </div>

      <div className={styles.headerActions}>
        <button 
          className={styles.headerActionBtn} 
          onClick={onReset} 
          title="Start new conversation"
          aria-label="New conversation"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          className={styles.headerActionBtn} 
          onClick={onMinimize} 
          title={isMinimized ? "Expand" : "Minimize"}
          aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
        >
          <Minus size={16} />
        </button>
        <button 
          className={styles.headerActionBtn} 
          onClick={onClose} 
          title="Close assistant"
          aria-label="Close assistant"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
