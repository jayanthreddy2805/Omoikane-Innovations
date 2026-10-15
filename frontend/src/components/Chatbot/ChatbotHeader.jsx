import React from 'react';
import Image from 'next/image';
import { RotateCcw, Minus, X } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

export default function ChatbotHeader({
  isMinimized,
  onMinimize,
  onClose,
  onReset
}) {
  return (
    <div className={styles.headerContainer}>
      {/* Brand & Bot Info with Real Logo */}
      <div className={styles.headerLeft}>
        <div className={styles.headerLogoWrapper}>
          <Image
            src="/images/shared/omoikane-logo.png"
            alt="Omoikane Innovations"
            width={34}
            height={34}
            className={styles.headerLogoImage}
            priority
          />
          <span className={styles.headerActiveIndicator} />
        </div>
        <div className={styles.headerBrandInfo}>
          <h4 className={styles.headerCompanyName}>Omoikane Innovations</h4>
          <div className={styles.headerStatusRow}>
            <span className={styles.headerStatusDot} />
            <span className={styles.headerStatusText}>Company Assistant • Active</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.headerActionButton}
          onClick={onReset}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          className={styles.headerActionButton}
          onClick={onMinimize}
          title={isMinimized ? "Expand" : "Minimize"}
          aria-label={isMinimized ? "Expand" : "Minimize"}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          className={`${styles.headerActionButton} ${styles.headerCloseBtn}`}
          onClick={onClose}
          title="Close chat"
          aria-label="Close chat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
