'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './IntroLoader.module.css';

export default function IntroLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has already seen the intro this session
    const hasSeenIntro = sessionStorage.getItem('omoikane-intro-seen');
    
    if (hasSeenIntro) {
      setLoading(false);
      return;
    }

    // Set intro seen flag and wait for animation to finish before hiding overlay
    sessionStorage.setItem('omoikane-intro-seen', 'true');
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Wait for the whole boot sequence to complete

    return () => clearTimeout(timer);
  }, []);

  // Avoid hydration mismatch by not rendering anything until mounted
  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div 
            className={styles.introContainer}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.introGrid} />
            
            <motion.div 
              className={styles.scanline}
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            <div className={styles.introContent}>
              <motion.div 
                className={styles.statusText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                INITIALIZING
              </motion.div>

              <motion.div 
                className={styles.brandText}
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.3em' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              >
                OMOIKANE SYSTEM
              </motion.div>

              <div className={styles.progressBarContainer}>
                <motion.div 
                  className={styles.progressBarFill}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual page content underneath */}
      {children}
    </>
  );
}
