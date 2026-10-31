"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Upload, Building, MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CareerTemplate.module.css';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/form-field/field';
import { Input } from '@/components/ui/form-field/input';

const EASE = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, style = {} }) {
  const r = useRef(null);
  const inV = useInView(r, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={r}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function RevealLine({ children, delay = 0 }) {
  const r = useRef(null);
  const inV = useInView(r, { once: true, margin: '-40px' });
  return (
    <div ref={r} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={inV ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function CareerTemplate({ data }) {
  const {
    eyebrow,
    headline,
    heroSub,
    heroVisual,
    roles,
    categoryLabel,
    theme = "software"
  } = data;

  const [activeRole, setActiveRole] = useState(roles[0]);


  return (
    <div className={styles.pageContainer} data-theme={theme}>
      
      {/* A. HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <FadeUp delay={0.05}>
            <span className={styles.eyebrow}>{eyebrow}</span>
          </FadeUp>
          <RevealLine delay={0.12}>
            <h1 className={styles.headline} dangerouslySetInnerHTML={{ __html: headline }} />
          </RevealLine>
          <FadeUp delay={0.3}>
            <p className={styles.heroSub} dangerouslySetInnerHTML={{ __html: heroSub }} />
          </FadeUp>
          <FadeUp delay={0.42}>
            <div className={styles.heroCtas}>
              <button className={styles.primaryCta} onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}>
                EXPLORE ROLES ↓
              </button>
              <Link href={`/apply?dept=${theme}&role=${roles[0]?.id || 'other'}`} className={styles.secondaryCta} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', justifyContent: 'center' }}>
                SEND YOUR CV →
              </Link>
            </div>
          </FadeUp>
        </div>
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
        >
          <Image src={heroVisual} alt={`${categoryLabel} Engineering`} fill className={styles.heroImg} priority />
        </motion.div>
      </section>


      {/* C & D. ROLE EXPLORER */}
      <section id="roles" className={styles.roleExplorerSection}>
        <div className={styles.explorerLayout}>
          
          {/* Left Nav */}
          <nav className={styles.roleNav}>
            <ul className={styles.navList}>
              {roles.map((role) => (
                <li key={role.id}>
                  <button
                    className={`${styles.navItem} ${activeRole.id === role.id ? styles.navItemActive : ''}`}
                    onClick={() => setActiveRole(role)}
                  >
                      <span className={styles.navNumber}>{role.number}</span>
                      <div className={styles.navText}>
                        <span className={styles.navTitle}>{role.title}</span>
                        <span className={styles.navSubtitle}>{role.subtitle}</span>
                        {role.specialization && <span className={styles.navSpec}>{role.specialization}</span>}
                      </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Content */}
          <div className={styles.roleContentPane}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className={styles.roleDetails}
              >
                <div className={styles.roleHeader}>
                  <h2>{activeRole.title}</h2>
                  <span className={styles.roleSubtitle}>{activeRole.subtitle}</span>
                </div>
                
                <p className={styles.roleDesc}>{activeRole.description}</p>
                
                <div className={styles.roleVisualFull}>
                  <Image src={activeRole.visual} alt={activeRole.title} fill className={styles.roleVisualImg} />
                </div>
                
                <div className={styles.roleContentEditorial}>
                  {activeRole.work && activeRole.work.length > 0 && (
                    <div className={styles.editorialCol}>
                      <h3>THE WORK</h3>
                      <div className={styles.editorialWorkList}>
                        {activeRole.work.map((item, i) => {
                          const num = (i + 1).toString().padStart(2, '0');
                          // Split string if it contains a parenthesis or hyphen for subtitle, otherwise just render it
                          let main = item;
                          let sub = "";
                          if (item.includes('(')) {
                            const parts = item.split('(');
                            main = parts[0].trim();
                            sub = parts[1].replace(')', '').trim();
                          } else if (item.includes(' - ')) {
                            const parts = item.split(' - ');
                            main = parts[0].trim();
                            sub = parts[1].trim();
                          }
                          
                          return (
                            <div key={i} className={styles.editorialWorkItem}>
                              <span className={styles.workNum}>{num}</span>
                              <div className={styles.workText}>
                                <span className={styles.workMain}>{main}</span>
                                {sub && <span className={styles.workSub}>{sub}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.editorialCol}>
                    <h3>CORE SKILLS</h3>
                    <ul className={styles.editorialTechList}>
                      {activeRole.tech.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>



                <div className={styles.roleFooterActions}>
                  <div className={styles.roleApplyAction}>
                    <Link 
                      href={`/apply?dept=${theme}&role=${activeRole.id}`}
                      className={styles.premiumApplyBtn}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                      <span>APPLY FOR THIS ROLE →</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>




    </div>
  );
}
