"use client";

import React from 'react';
import styles from './AIChatbot.module.css';

export default function SuggestedQuestions({ suggestions = [], onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={styles.suggestionsContainer}>
      {suggestions.map((item, idx) => (
        <button
          key={idx}
          className={styles.suggestionPill}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
