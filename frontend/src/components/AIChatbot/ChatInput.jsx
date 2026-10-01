"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function ChatInput({ onSendMessage, onOpenResumeUpload, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <button 
        type="button" 
        className={styles.attachResumeBtn}
        onClick={onOpenResumeUpload}
        title="Upload or analyze resume"
        aria-label="Upload resume"
      >
        <FileText size={18} />
      </button>

      <textarea
        ref={textareaRef}
        rows={1}
        className={styles.chatTextarea}
        placeholder="Ask about company, jobs, or upload resume..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <button
        type="button"
        className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ''}`}
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
