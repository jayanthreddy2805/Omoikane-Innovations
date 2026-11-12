import React from 'react';
import styles from './ChatbotWidget.module.css';

const SUGGESTED_QUESTIONS = [
  { label: "About Omoikane", query: "Tell me about Omoikane Innovations" },
  { label: "Explore Technologies", query: "What technologies and product domains do you work on?" },
  { label: "Career Opportunities", query: "What career roles and opportunities are listed?" },
  { label: "Engineering Roles", query: "Tell me about your software, electronics, and mechanical engineering roles" },
  { label: "Contact the Company", query: "How can I contact Omoikane Innovations?" }
];

export default function QuickQuestions({ onSelectQuestion }) {
  return (
    <div className={styles.quickQuestionsSection}>
      <span className={styles.quickQuestionsLabel}>Suggested Questions:</span>
      <div className={styles.quickQuestionsGrid}>
        {SUGGESTED_QUESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className={styles.quickQuestionPill}
            onClick={() => onSelectQuestion(item.query)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
