"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import ContactForm from '@/components/common/ContactForm';
import styles from './page.module.css';

/* ── Shared easing ── */
const EASE = [0.16, 1, 0.3, 1];

/* ── Reusable FadeUp ── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Masked text reveal ── */
function RevealLine({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        className={className}
        initial={{ y: '105%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. EDITORIAL HERO */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>

              {/* Eyebrow line */}
              <FadeUp delay={0.05}>
                <div className={styles.heroEyebrow}>
                  <span className={styles.heroEyebrowLine} />
                  <span>CONTACT</span>
                </div>
              </FadeUp>

              <div className={styles.heroTitleWrapper}>
                <RevealLine delay={0.1}>
                  <h1 className={styles.heroTitleSolid}>LET'S CONNECT</h1>
                </RevealLine>
                <RevealLine delay={0.18}>
                  <h1 className={styles.heroTitleStroke}>LET'S CONNECT</h1>
                </RevealLine>
              </div>

              <div className={styles.heroSubtitleBlock}>
                <FadeUp delay={0.35}>
                  <p className={styles.heroSubtitle}>
                    Talk to the engineers and architects behind Omoikane. Whether you are scaling infrastructure, developing complex hardware, or initiating a strategic partnership, our channels are open.
                  </p>
                </FadeUp>
              </div>

            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.heroImageWrapper}>

                {/* Images stagger in */}
                <motion.div
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                  initial={{ opacity: 0, x: 40, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                >
                  <Image
                    src="/images/contact/robot-arm-sketch.png"
                    alt="Robotic Arm Sketch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.heroRobotImage}
                    priority
                  />
                </motion.div>

                <motion.div
                  className={styles.pcbImageWrapper}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.42 }}
                >
                  <Image
                    src="/images/contact/pcb-sketch.png"
                    alt="PCB Sketch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={styles.heroPcbImage}
                    priority
                  />
                </motion.div>

                <motion.div
                  className={styles.hnImageWrapper}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.56 }}
                >
                  <Image
                    src="/images/contact/hn.png"
                    alt="Hand Sketch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={styles.heroHnImage}
                    priority
                  />
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENQUIRY SECTION */}
      <section className={styles.enquirySection}>
        <div className={styles.container}>
          
          <div className={styles.enquiryHeader}>
            <FadeUp>
              <h2 className={styles.enquiryTitle}>CONTACT US</h2>
            </FadeUp>
          </div>

          <div className={styles.enquiryGrid}>
            <FadeUp delay={0.1}>
              <div className={styles.enquiryContext}>
                <p className={styles.enquiryText}>
                  Connect with the minds behind Omoikane. Whether it's a technical deep-dive or a strategic partnership, let's start the conversation.
                </p>
                <div className={styles.enquiryVisualContainer}>
                  <div className={styles.enquiryVisualWrapper}>
                    <Image 
                      src="/images/contact/enquiry-visual.png" 
                      alt="Engineering blueprint" 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className={styles.enquiryImage} 
                    />
                  </div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.18}>
              <div className={styles.formWrapper}>
                <ContactForm />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

    </div>
  );
}
