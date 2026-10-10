import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  // Phase 1 to 2: Scale up text to massive size to open the aperture
  const textScale = useTransform(scrollYProgress, [0, 0.35], [1, 15]);
  
  // Phase 2: Fade out the ENTIRE wrapper to seamlessly transition out of the mask
  // This removes the heavy stroke animation that was causing scroll lag!
  const overlayOpacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]);
  
  // Phase 1: Video has black overlay to look like "Black typography"
  const videoOverlayOpacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [0.85, 0.85, 0]);

  // Phase 3: Video immediately shrinks and moves to the right half of the screen
  // Using x and y instead of top/left is highly hardware accelerated, fixing the jitter!
  const videoWidth = useTransform(scrollYProgress, [0.35, 0.55], ["100vw", "48vw"]);
  const videoHeight = useTransform(scrollYProgress, [0.35, 0.55], ["100vh", "54vh"]);
  const videoX = useTransform(scrollYProgress, [0.35, 0.55], ["0vw", "48vw"]);
  const videoY = useTransform(scrollYProgress, [0.35, 0.55], ["0vh", "38vh"]);

  // Phase 4: Text content fades in concurrently
  const headlineOpacity = useTransform(scrollYProgress, [0.45, 0.60], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.45, 0.60], ["30px", "0px"]);
  
  const copyOpacity = useTransform(scrollYProgress, [0.55, 0.70], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.55, 0.70], ["30px", "0px"]);

  return (
    <div className={styles.heroContainer} ref={containerRef}>
      <div className={styles.stickyScene}>
        
        {/* NATIVE HTML VIDEO LAYER */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <motion.div 
            className={styles.videoWrapper}
            style={{ 
              width: videoWidth, 
              height: videoHeight, 
              x: videoX, 
              y: videoY 
            }}
          >
            <video
              src="/videos/omoikane.mp4"
              autoPlay muted loop playsInline
              className={styles.heroVideo}
            />
            <motion.div 
              className={styles.videoDarkOverlay} 
              style={{ opacity: videoOverlayOpacity }} 
            />
          </motion.div>
        </div>

        {/* SVG KNOCKOUT OVERLAY */}
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            pointerEvents: 'none', zIndex: 2, 
            opacity: overlayOpacity
          }}
        >
          <motion.svg 
            style={{ width: '100%', height: '100%', scale: textScale, transformOrigin: '50% 50%' }}
          >
            <defs>
              <mask id="knockoutMask">
                <rect width="100%" height="100%" fill="white" />
                <text
                  x="50%" y="50%"
                  textAnchor="middle" 
                  fill="black"
                  className={styles.maskText}
                >
                  <tspan x="50%" dy="-0.4em">OMOIKANE</tspan>
                  <tspan x="50%" dy="0.9em">INNOVATIONS</tspan>
                </text>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="#F5F6EF" mask="url(#knockoutMask)" />
          </motion.svg>
        </motion.div>

        {/* Phase 4: Editorial Statement (Strictly left column) */}
        <motion.div 
          className={styles.aboutStatement}
          style={{ 
            opacity: headlineOpacity, 
            y: headlineY,
            zIndex: 10,
            width: '38vw', /* Prevent overlap with video */
            top: '18vh'
          }}
        >
          <div className={styles.redLine} />
          <h2>
            TECHNOLOGY THAT MOVES <span className={styles.serif}>BEYOND THE SCREEN.</span>
          </h2>
        </motion.div>

        <motion.div 
          className={styles.aboutCopy}
          style={{ 
            opacity: copyOpacity, 
            y: copyY,
            zIndex: 10,
            width: '32vw',
            left: '6vw',
            bottom: '12vh'
          }}
        >
          <p>
            Omoikane develops deep-tech systems across autonomy, robotics, aerospace, 
            embedded engineering and AI — from first principle to real-world deployment.
          </p>
          <Link href="/expertise" className={styles.ctaButton}>
            EXPLORE OUR EXPERTISE <span style={{ marginLeft: '4px' }}>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

