import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import styles from './ChatbotWidget.module.css';

export default function ChatbotLauncher({ onClick, isOpen }) {
  return (
    <motion.button
      type="button"
      className={styles.launcherButton}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close Company Assistant" : "Open Omoikane Company Assistant"}
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
              priority
            />
          </div>
          <span className={styles.launcherText}>Chat with us</span>
          <span className={styles.launcherOnlineBadge} />
        </div>
      )}
    </motion.button>
  );
}
