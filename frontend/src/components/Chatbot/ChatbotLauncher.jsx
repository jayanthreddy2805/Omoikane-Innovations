import React from 'react';
import Image from 'next/image';
import { m as motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

export default function ChatbotLauncher({ onClick, isOpen, busy = false }) {
  return (
    <motion.button
      type="button"
      id="company-assistant-launcher"
      disabled={busy}
      aria-busy={busy || undefined}
      className={styles.launcherButton}
      onClick={onClick}
      initial={false}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close Company Assistant" : "Chat with us — Omoikane Company Assistant"}
      aria-expanded={isOpen}
      aria-controls={isOpen ? "company-assistant-dialog" : undefined}
      title={isOpen ? "Close Assistant" : "Chat with Omoikane Assistant"}
    >
      {isOpen ? (
        <X size={22} className={styles.launcherCloseIcon} />
      ) : (
        <div className={styles.launcherInner}>
          <div className={styles.launcherLogoWrapper}>
            <Image
              src="/images/shared/omoikane-logo.png"
              alt="Omoikane Innovations Logo"
              width={26}
              height={26}
              className={styles.launcherLogo}
            />
          </div>
          <span className={styles.launcherText}>Chat with us</span>
          <span className={styles.launcherOnlineBadge} />
        </div>
      )}
    </motion.button>
  );
}
