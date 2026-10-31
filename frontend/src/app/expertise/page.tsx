"use client";

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ExpertiseSection } from '@/components/expertise/ExpertiseSection';
import { TechMarquee } from '@/components/expertise/TechMarquee';
import { ExpertiseHero } from '@/components/expertise/ExpertiseHero';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
const DeferredMeshGradient = dynamic(() => import('@/components/expertise/DeferredMeshGradient'), { ssr: false });
import aboutStyles from '../about/page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ExpertisePage() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Lenis Smooth Scroll
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);



    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, { scope: containerRef });

  return (
    <main className={styles.container} ref={containerRef}>
      
      {/* Ultra Clean Hero */}
      <ExpertiseHero />

      {/* Scrolling Technologies Marquee */}
      <TechMarquee />

      {/* Main Expertise Presentation */}
      <ExpertiseSection />

      {/* About Us CTA */}
      <CallToAction />

    </main>
  );
}

function CallToAction() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
  } as const;

  return (
    <section className={aboutStyles.ctaSection}>
      <div className={aboutStyles.ctaCard}>
        <div className={aboutStyles.ctaHeroBg} />

        <DeferredMeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.85, backgroundColor: '#000812' }}
          colors={['#000812', '#0F172A', '#1E293B', '#334155']}
          speed={0.5}
        />

        {/* MeshGradient layer 2 — subtle metallic titanium highlights */}
        <DeferredMeshGradient
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.75, zIndex: 2, backgroundColor: 'transparent' }}
          colors={['#000812', '#475569', '#000812']}
          speed={0.35}
        />

        <motion.div
          className={aboutStyles.ctaContentCentered}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 className={aboutStyles.ctaTitleCentered} variants={itemVariants}>
            Ready to deploy your next <em>mission?</em>
          </motion.h2>

          <motion.div variants={itemVariants} style={{ marginTop: '1.5rem' }}>
            <button className={aboutStyles.ctaButtonPill} onClick={(e) => { e.preventDefault(); alert('Contact initiated.'); }}>
              <Sparkles size={16} strokeWidth={2.5} />
              Contact OMOIKANE
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={aboutStyles.ctaBottomSection}>
            <p className={aboutStyles.ctaSublabel}>BUILT FOR PERFORMANCE AND RELIABILITY.</p>
            <div className={aboutStyles.ctaTagsWrapper}>
              <div className={aboutStyles.ctaTags}>
                <span className={aboutStyles.ctaTag}>Embedded Systems</span>
                <span className={aboutStyles.ctaTag}>Flight Control</span>
                <span className={aboutStyles.ctaTag}>AI Integration</span>
                <span className={aboutStyles.ctaTag}>Robotic Platforms</span>
                <span className={aboutStyles.ctaTag}>Defense Tech</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
