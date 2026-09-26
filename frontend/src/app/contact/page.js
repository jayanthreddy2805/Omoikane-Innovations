"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import ContactForm from '@/components/common/ContactForm';
import FormSuccessState from '@/components/common/FormSuccessState';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow}></div>
      
      {/* 2. ENQUIRY SECTION */}
      <section className={styles.enquirySection}>
        <div className={styles.container}>
          
          {!isSubmitted ? (
            <>
              <div className={styles.contactHeroWrapper}>
                <h1 className={styles.letsConnectTitle}>
                  <span className={styles.textWhite}>LET'S</span>
                  <span className={styles.textGrey}>CONNECT</span>
                </h1>
                <div className={styles.drawingWrapper}>
                   <Image 
                      src="/images/contact/aer.png" 
                      alt="Aeronautical Drawing" 
                      fill
                      className={styles.drawingImage} 
                    />
                </div>
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
                          alt="Strategic blueprint" 
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
                    <ContactForm onSuccess={() => setIsSubmitted(true)} />
                  </div>
                </FadeUp>
              </div>
            </>
          ) : (
            <FadeUp delay={0.1}>
              <FormSuccessState />
            </FadeUp>
          )}

        </div>
      </section>

    </div>
  );
}
