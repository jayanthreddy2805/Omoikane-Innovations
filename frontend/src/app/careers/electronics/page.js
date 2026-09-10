"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Building, MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';
import templateStyles from '@/components/common/CareerTemplate.module.css';
import CustomSelect from '@/components/common/CustomSelect';
import FileUpload from '@/components/common/FileUpload';
import SubmitButton from '@/components/common/SubmitButton';
import FormSuccessState from '@/components/common/FormSuccessState';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/v-field-21-utils/field';
import { Input } from '@/components/ui/v-field-21-utils/input';

const electronicsRoles = [
  {
    id: "hardware-eng",
    number: "01",
    shortTitle: "HARDWARE",
    title: "HARDWARE DESIGN ENGINEER",
    displayTitle: "HARDWARE DESIGN ENGINEER",
    subtitle: "System Architecture",
    description: "Architect and design complete electronic systems for autonomous vehicles and robotics.",
    visual: "/images/careers/embedded-pcb.jpg", 
    work: [
      "System-level electronics architecture",
      "Power delivery network design",
      "Microcontroller / MPU selection",
      "Sensor integration and interfaces",
      "EMI/EMC mitigation strategies"
    ],
    tech: [
      "Altium Designer / KiCad",
      "STM32 / NXP / TI processors",
      "High-speed digital design",
      "Power electronics (DC-DC)",
      "Signal integrity analysis"
    ],
    fullSkills: [
      {
        category: "HARDWARE ARCHITECTURE",
        items: [
          "System-Level Block Diagrams",
          "Component Selection & Sourcing",
          "Power Budget Analysis",
          "Thermal Constraints Planning"
        ]
      },
      {
        category: "SCHEMATIC DESIGN",
        items: [
          "Complex Mixed-Signal Schematics",
          "High-Speed Digital Interfaces (DDR, PCIe, USB 3.0)",
          "Analog Sensor Interfaces",
          "Power Delivery Networks"
        ]
      }
    ]
  },
  {
    id: "pcb-eng",
    number: "02",
    shortTitle: "PCB LAYOUT",
    title: "PCB DESIGN ENGINEER",
    displayTitle: "PCB DESIGN ENGINEER",
    subtitle: "Board Layout",
    description: "Translate complex schematics into highly optimized, manufacturable PCB layouts.",
    visual: "/images/careers/python-architecture.jpg", // Placeholder
    work: [
      "Multilayer PCB routing (up to 12+ layers)",
      "Impedance-controlled routing",
      "High-density interconnects (HDI)",
      "Rigid-flex PCB design",
      "Design for Manufacturing (DFM/DFA)"
    ],
    tech: [
      "Altium Designer",
      "IPC Standards",
      "Stackup design",
      "High-speed routing guidelines",
      "Thermal via management"
    ],
    fullSkills: [
      {
        category: "LAYOUT ENGINEERING",
        items: [
          "High-Density Interconnect (HDI) Design",
          "Blind, Buried, and Microvias",
          "Matched Length & Differential Pair Routing",
          "BGA Escape Routing"
        ]
      },
      {
        category: "MANUFACTURING",
        items: [
          "Gerber / ODB++ Generation",
          "Liaison with Fab Houses",
          "Yield Optimization",
          "Assembly Documentation"
        ]
      }
    ]
  },
  {
    id: "rf-eng",
    number: "03",
    shortTitle: "RF SYSTEMS",
    title: "RF SYSTEM DESIGNER",
    displayTitle: "RF SYSTEM DESIGNER",
    subtitle: "Wireless Communications",
    description: "Design and validate long-range, high-bandwidth radio systems for drone telemetry and control.",
    visual: "/images/careers/web-dev-dashboard.jpg", // Placeholder
    work: [
      "RF circuit design (sub-GHz, 2.4GHz, 5GHz)",
      "Antenna matching and tuning",
      "Link budget analysis",
      "Co-site interference mitigation",
      "FCC/CE compliance testing"
    ],
    tech: [
      "Vector Network Analyzers (VNA)",
      "Spectrum Analyzers",
      "HFSS / CST Microwave Studio",
      "Smith Charts",
      "SDR platforms"
    ],
    fullSkills: [
      {
        category: "RF ENGINEERING",
        items: [
          "Antenna Design & Matching",
          "Sub-GHz telemetry protocols",
          "Link Budget Calculations",
          "Interference Mitigation"
        ]
      },
      {
        category: "TESTING & COMPLIANCE",
        items: [
          "FCC / CE Certification Prep",
          "Spectrum Analysis",
          "VNA Calibration",
          "EMI Shielding Design"
        ]
      }
    ]
  },
  {
    id: "test-eng",
    number: "04",
    shortTitle: "TESTING",
    title: "TEST ENGINEER",
    displayTitle: "TEST ENGINEER",
    subtitle: "Validation & Reliability",
    description: "Develop automated test fixtures and validate electronics under extreme conditions.",
    visual: "/images/careers/mech-structural.jpg", // Placeholder
    work: [
      "Automated Test Equipment (ATE) development",
      "Hardware-in-the-loop (HIL) testing",
      "Environmental testing (thermal, vibration)",
      "End-of-line (EOL) test fixture design",
      "Failure mode analysis"
    ],
    tech: [
      "Python / LabVIEW",
      "Oscilloscopes / Logic Analyzers",
      "Data acquisition systems (DAQ)",
      "Environmental chambers",
      "JTAG / Boundary Scan"
    ],
    fullSkills: [
      {
        category: "VALIDATION",
        items: [
          "Hardware-in-the-Loop (HIL)",
          "Automated Python Test Scripts",
          "Thermal & Vibration Testing",
          "Data Acquisition Setup"
        ]
      },
      {
        category: "FAILURE ANALYSIS",
        items: [
          "Root Cause Investigation",
          "JTAG Debugging",
          "Signal Integrity Probing",
          "Yield Improvement"
        ]
      }
    ]
  }
];

export default function ElectronicsCareers() {
  const [activeRole, setActiveRole] = useState(electronicsRoles[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setTimeout(() => {
      setSubmitStatus("success");
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('elec-hero');
      const ctaSection = document.getElementById('role-cta');
      
      if (hero && ctaSection) {
        const scrollY = window.scrollY;
        const pastHero = scrollY > hero.offsetHeight;
        
        // Hide the sticky nav exactly when it touches the "APPLY FOR THIS ROLE" button section
        const pastRoleDisplay = scrollY > (ctaSection.offsetTop - 136);
        
        setIsScrolled(pastHero && !pastRoleDisplay);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.bespokeContainer}>

      {/* 0. HERO SECTION */}
      <section id="elec-hero" className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>ELECTRONICS ENGINEERING</span>
          <h1 className={styles.headline}>
            POWERING<br />
            INTELLIGENCE.
          </h1>
          <p className={styles.heroSub}>
            We design the circuits, boards, and RF systems<br />
            that bring autonomous platforms to life.
          </p>
        </div>
        <div className={styles.heroVisualFullHeader}>
          <Image 
            src="/images/careers/embedded-pcb.jpg" 
            alt="Electronics Engineering" 
            fill 
            className={styles.heroImageBg} 
            priority 
          />
          <div className={styles.heroOverlay}></div>
        </div>
      </section>
      
      {/* 1. COMPACT STICKY SWITCHER (appears on scroll) */}
      <div className={`${styles.stickyNavContainer} ${isScrolled ? styles.stickyNavVisible : ''}`}>
        <div className={styles.stickyNavInner}>
          {electronicsRoles.map((role) => {
            const isActive = activeRole.id === role.id;
            return (
              <button
                key={`sticky-${role.id}`}
                className={`${styles.stickyBtn} ${isActive ? styles.stickyBtnActive : ''}`}
                onClick={() => {
                  setActiveRole(role);
                  const offset = document.getElementById('role-display').offsetTop - 140;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                }}
              >
                <span className={styles.stickyNumber}>{role.number}</span>
                <span className={styles.stickyTitle}>{role.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FULL HORIZONTAL ROLE INDEX (Initial State) */}
      <section className={styles.roleIndexSection}>
        <div className={styles.indexWrapper}>
          <div className={styles.indexHorizontal}>
            {electronicsRoles.map((role) => {
              const isActive = activeRole.id === role.id;
              return (
                <button
                  key={role.id}
                  className={`${styles.indexCol} ${isActive ? styles.indexColActive : ''}`}
                  onClick={() => {
                    setActiveRole(role);
                    const offset = document.getElementById('role-display').offsetTop - 140;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                  }}
                >
                  <span className={styles.colNumber}>{role.number}</span>
                  <div className={styles.colText}>
                    <span className={styles.colTitle}>{role.title}</span>
                    <span className={styles.colSubtitle}>{role.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. THE CHOSEN ROLE DISPLAY */}
      <section id="role-display" className={styles.roleDisplaySection}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeRole.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className={styles.roleContentWrapper}
          >
            {/* INTRO */}
            <div className={styles.roleIntro}>
              <span className={styles.roleIdentityEyebrow}>{activeRole.number} / ELECTRONICS ENGINEERING</span>
              <h1 className={styles.roleIdentityTitle}>{activeRole.displayTitle}</h1>
              <h2 className={styles.roleIdentitySubtitle}>{activeRole.subtitle}</h2>
              <p className={styles.roleIdentityDesc}>{activeRole.description}</p>
            </div>

            {/* CINEMATIC HERO */}
            <div className={styles.roleCinematicVisual}>
              <Image 
                src={activeRole.visual} 
                alt={activeRole.title} 
                fill 
                className={styles.cinematicImage}
                priority 
              />
            </div>

            {/* THE WORK */}
            <div className={styles.editorialSection}>
              <h3 className={styles.editorialHeader}>THE WORK</h3>
              <div className={styles.editorialDivider}></div>
              <div className={styles.workList}>
                {activeRole.work.map((item, index) => {
                  const num = (index + 1).toString().padStart(2, '0');
                  
                  let main = item;
                  let sub = "";
                  if (item.includes('(')) {
                    const parts = item.split('(');
                    main = parts[0].trim();
                    sub = parts[1].replace(')', '').trim();
                  }

                  return (
                    <div key={index} className={styles.workRow}>
                      <span className={styles.workRowNumber}>{num}</span>
                      <div className={styles.workRowContent}>
                        <span className={styles.workRowMain}>{main}</span>
                        {sub && <span className={styles.workRowSub}>{sub}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TECHNOLOGIES */}
            <div className={styles.editorialSection}>
              <h3 className={styles.editorialHeader}>TECHNOLOGIES</h3>
              <div className={styles.editorialDivider}></div>
              <ul className={styles.techList}>
                {activeRole.tech.map((item, index) => (
                  <li key={index} className={styles.techItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* FULL TECHNICAL CAPABILITIES */}
            {activeRole.fullSkills && activeRole.fullSkills.length > 0 && (
              <div className={styles.editorialSection}>
                <h3 className={styles.editorialHeader}>FULL TECHNICAL CAPABILITIES</h3>
                <div className={styles.editorialDivider}></div>
                <div className={styles.specsGrid}>
                  {activeRole.fullSkills.map(group => (
                    <div key={group.category} className={styles.specColumn}>
                      <h4 className={styles.specCategoryLabel}>{group.category}</h4>
                      <div className={styles.specThinRule}></div>
                      <ul className={styles.specItems}>
                        {group.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPLY */}
            <div id="role-cta" className={styles.roleFooterActions}>
              <div className={styles.applyActionContainer}>
                <button 
                  className={styles.premiumApplyBtn}
                  onClick={() => {
                    setFormRole(activeRole.id);
                    const el = document.getElementById('apply');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                >
                  APPLY FOR THIS ROLE <span className={styles.arrow}>→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. WORK WITH US (Application Form) */}
      <section id="apply" className={templateStyles.applicationSection}>
        <AnimatePresence mode="wait">
          {submitStatus !== "success" ? (
            <motion.div 
              key="form-layout"
              className={templateStyles.applyLayout}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className={templateStyles.applyText}>
                <h2>WORK WITH US</h2>
                
                <div className={templateStyles.contactDivider}></div>

                <div className={templateStyles.contactIndex}>
                  <div className={templateStyles.contactIndexTitle}>
                    <a href="mailto:careers@omoikaneinnovations.com">CONTACT OUR TEAM <span>&rarr;</span></a>
                  </div>

                  <div className={templateStyles.contactGrid}>
                    <div className={templateStyles.contactGroup}>
                      <h4><Building size={16} strokeWidth={2} /> OFFICE</h4>
                      <p>Monday–Friday<br/>9:00 am – 6:00 pm</p>
                    </div>

                    <div className={templateStyles.contactGroup}>
                      <h4><MapPin size={16} strokeWidth={2} /> LOCATION</h4>
                      <p>Bangalore, India</p>
                    </div>

                    <div className={templateStyles.contactGroup}>
                      <h4><Mail size={16} strokeWidth={2} /> EMAIL</h4>
                      <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>
                      <a href="mailto:bd@omoikaneinnovations.com">bd@omoikaneinnovations.com</a>
                    </div>

                    <div className={templateStyles.contactGroup}>
                      <h4><Phone size={16} strokeWidth={2} /> PHONE</h4>
                      <a href="tel:+918861035848">+91-8861035848</a>
                      <a href="tel:+919353627825">+91-9353627825</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={templateStyles.applyFormContainer}>
                <form 
                  className={templateStyles.formElement} 
                  onSubmit={handleSubmit}
                >
                  <div className={templateStyles.formRow}>
                    <div className={templateStyles.inputGroup}>
                      <label htmlFor="name">Name</label>
                      <input type="text" id="name" required />
                    </div>
                    <div className={templateStyles.inputGroup}>
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" required />
                    </div>
                  </div>
                  
                  <div className={templateStyles.formRow}>
                    <div className={templateStyles.inputGroup}>
                      <label htmlFor="phone">Phone</label>
                      <input type="tel" id="phone" required />
                    </div>
                    <div className={templateStyles.inputGroup}>
                      <label>Applying For</label>
                      <CustomSelect 
                        options={[
                          ...electronicsRoles.map(r => ({ id: r.id, label: r.title })),
                          { id: 'other', label: 'Other' }
                        ]}
                        value={formRole}
                        onChange={(val) => setFormRole(val)}
                        placeholder="Select Role"
                      />
                    </div>
                  </div>

                  <div className={templateStyles.inputGroup}>
                    <FileUpload id="cv" required />
                  </div>

                  <div className={templateStyles.inputGroup}>
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea id="message" rows={4}></textarea>
                  </div>

                  <SubmitButton status={submitStatus} />
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-layout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <FormSuccessState />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
}
