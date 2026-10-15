import React from 'react';
import { ExternalLink } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

export default function SourceLink({ source }) {
  if (!source || !source.url) return null;

  return (
    <div className={styles.sourceContainer}>
      <span className={styles.sourceLabel}>Source:</span>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sourceLink}
        title={`Visit official source: ${source.label}`}
      >
        <span>{source.label || "Official Website"}</span>
        <ExternalLink size={11} className={styles.sourceIcon} />
      </a>
    </div>
  );
}
