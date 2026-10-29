'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleTitle, useIsDark, DARK, LIGHT } from '@/components/ui/particle-title';
import styles from './IntroLoader.module.css';

export default function IntroLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const dark = useIsDark();
  const finishedRef = useRef(false);

  const completeIntro = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      sessionStorage.setItem('omoikane-particle-intro-seen', 'true');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user has already seen the intro this session
    const hasSeen = sessionStorage.getItem('omoikane-particle-intro-seen');
    if (hasSeen) {
      setLoading(false);
      finishedRef.current = true;
      return;
    }

    // Safety fallback: guarantee home page shows quickly even if RAF is throttled
    const fallbackTimer = setTimeout(() => {
      completeIntro();
    }, 2200);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleTextGathered = () => {
    // Once "Omoikane Innovations" has assembled on screen:
    // Quick, crisp 300ms hold, then lift the curtain straight UP to reveal the home page!
    setTimeout(() => {
      completeIntro();
    }, 300);
  };

  const handleDismiss = () => {
    completeIntro();
  };

  const activePalette = dark ? DARK : LIGHT;
  const containerBg = dark ? '#0c0c0e' : '#F4F3EE';

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div 
            className={styles.introContainer}
            style={{ backgroundColor: containerBg }}
            initial={{ y: 0 }}
            exit={{ 
              y: '-100%',
              transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } 
            }}
            onClick={handleDismiss}
            role="button"
            tabIndex={0}
            aria-label="Skip to home page"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                handleDismiss();
              }
            }}
          >
            <div className={styles.particleWrapper}>
              <ParticleTitle 
                text="Omoikane Innovations"
                fullScreen={true}
                palette={activePalette}
                timing={{ travel: 1200, hold: 1000, field: 600 }}
                onTextGathered={handleTextGathered}
              />
            </div>

            <div 
              className={styles.skipHint} 
              style={{ color: dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(10, 10, 10, 0.35)' }}
              aria-hidden="true"
            >
              <span>Click to skip</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Page Content underneath the curtain */}
      <div className={styles.pageContent}>
        {children}
      </div>
    </>
  );
}
