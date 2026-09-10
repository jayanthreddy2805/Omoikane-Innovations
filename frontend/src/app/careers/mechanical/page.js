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
import InternationalPhoneInput from '@/components/common/InternationalPhoneInput';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/v-field-21-utils/field';
import { Input } from '@/components/ui/v-field-21-utils/input';

const mechanicalRoles = [
  {
    id: "mech-design",
    number: "01",
    shortTitle: "DESIGN",
    title: "3D & 2D MECHANICAL DESIGN",
    displayTitle: "MECHANICAL DESIGN ENGINEER", // for the intro
    subtitle: "Drone Structures",
    description: "Design geometry, assemblies, and physical prototypes for UAV airframes, CAD modeling, and manufacturing drawings.",
    visual: "/images/careers/mech-design.jpg",
    work: [
      "3D CAD Modeling (SolidWorks, CATIA, Fusion 360)",
      "2D Drawings & GD&T",
      "Assembly Design & BOM Creation",
      "Material Selection (Carbon Fiber, Aluminum, Polymers)",
      "Design for Manufacturing (DFM) & Assembly (DFA)"
    ],
    tech: [
      "Multirotor, Fixed-Wing & VTOL Airframe Design",
      "Lightweight Frame Optimization",
      "Folding Arms, Landing Gear & Payload Mounts",
      "Agri Drone Tank & Structural Layout",
      "Light-Show Drone Compact Frame Design"
    ],
    fullSkills: [
      {
        category: "CAD & MODELING",
        items: [
          "SolidWorks / CATIA / Fusion 360",
          "Advanced Surface Modeling",
          "Parametric Design",
          "Large Assembly Management"
        ]
      },
      {
        category: "MATERIALS & MANUFACTURING",
        items: [
          "Carbon Fiber Composites",
          "Aluminum CNC Machining",
          "Injection Molding Design",
          "Rapid Prototyping (3D Printing)"
        ]
      }
    ]
  },
  {
    id: "mech-assembly",
    number: "02",
    shortTitle: "ASSEMBLY",
    title: "MECHANICAL ASSEMBLY & INTEGRATION",
    displayTitle: "ASSEMBLY & INTEGRATION ENGINEER",
    subtitle: "Hardware Build",
    description: "Lead system integration, physical prototyping, and the full mechanical product build for aerospace platforms.",
    visual: "/images/careers/mech-assembly.jpg",
    work: [
      "Mechanical Assembly & Integration",
      "Tolerance Stack-Up & Fitment Validation",
      "Fasteners, Joints & Adhesives Selection",
      "Wiring & Mechanical Routing Coordination",
      "Prototype Build & Testing"
    ],
    tech: [
      "Full Drone Assembly (Frame, Electronics & Payload)",
      "VTOL Integration (Fixed-Wing & Multirotor Systems)",
      "Payload Drop Mechanisms (Actuators & Servo Systems)",
      "Agri Bot Mechanical Integration"
    ],
    fullSkills: [
      {
        category: "HARDWARE BUILD",
        items: [
          "Precision Assembly",
          "Wiring Harness Routing",
          "Torque Specifications",
          "Adhesive Bonding Techniques"
        ]
      },
      {
        category: "INTEGRATION & TESTING",
        items: [
          "Fitment Validation",
          "Mechanism Testing (Actuators)",
          "Payload Integration",
          "Pre-flight Hardware Checklist"
        ]
      }
    ]
  },
  {
    id: "struct-therm",
    number: "03",
    shortTitle: "STRUCTURAL",
    title: "STRUCTURAL & THERMAL ANALYSIS",
    displayTitle: "STRUCTURAL & THERMAL ENGINEER",
    subtitle: "Environmental Engineering",
    description: "Conduct advanced simulation, structural validation, and reliability engineering for high-performance UAVs.",
    visual: "/images/careers/mech-structural.jpg",
    work: [
      "Structural Analysis (Stress, Strain, Deformation)",
      "Thermal Analysis (Heat Dissipation & Cooling)",
      "Vibration & Shock Analysis for UAVs",
      "FEA Tools (ANSYS, SolidWorks Simulation)",
      "Fatigue & Lifecycle Analysis"
    ],
    tech: [
      "Airframe Strength Validation (Flight Loads)",
      "Motor Vibration Impact on Structures",
      "Thermal Performance of Embedded Electronics",
      "Payload Stress Analysis (Drop & Load Conditions)"
    ],
    fullSkills: [
      {
        category: "SIMULATION & FEA",
        items: [
          "Linear & Non-Linear Static Analysis",
          "Dynamic & Modal Analysis",
          "Computational Fluid Dynamics (CFD)",
          "Thermal Flow Simulation"
        ]
      },
      {
        category: "VALIDATION",
        items: [
          "Flight Load Validation",
          "Vibration & Shock Testing",
          "Heat Sink Optimization",
          "Material Fatigue Assessment"
        ]
      }
    ]
  },
  {
    id: "prod-eng",
    number: "04",
    shortTitle: "PRODUCT",
    title: "ENCLOSURE & PRODUCT DESIGN",
    displayTitle: "PRODUCT ENGINEER",
    subtitle: "System Hardware",
    description: "Design and optimize hardware enclosures, battery housings, and mass-manufacturable systems.",
    visual: "/images/careers/mech-product.jpg",
    work: [
      "Enclosure Design (IP-Rated, Weatherproof, Dustproof)",
      "Thermal Management (Heat Sinks, Airflow Design)",
      "EMI/EMC Considerations & Shielding Basics",
      "Cable Routing & Connector Integration",
      "Industrial & Product Design Aesthetics"
    ],
    tech: [
      "Flight Controller & Avionics Enclosures",
      "Battery Housing & Power Module Casing",
      "Agri Drone Spray System Housing",
      "Outdoor Rugged Systems for Defense Environments"
    ],
    fullSkills: [
      {
        category: "PRODUCT & MANUFACTURING",
        items: [
          "Design for Manufacturing (DFM)",
          "Design for Assembly (DFA)",
          "Assembly Design",
          "BOM Creation"
        ]
      },
      {
        category: "ENCLOSURES & HOUSINGS",
        items: [
          "IP-Rated Enclosure Design",
          "Flight Controller Enclosures",
          "Battery Housing",
          "Power Module Casing",
          "Agri Drone Spray System Housing",
          "Light Show Drone Frame Design"
        ]
      }
    ]
  }
];

export default function MechanicalCareers() {
  const [activeRole, setActiveRole] = useState(mechanicalRoles[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setTimeout(() => {
      setSubmitStatus("success");
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('mech-hero');
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
      <section id="mech-hero" className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>MECHANICAL ENGINEERING</span>
          <h1 className={styles.headline}>
            ENGINEERED<br />
            TO MOVE.
          </h1>
          <p className={styles.heroSub}>
            We design structures, assemblies and physical systems<br />
            for drones, autonomous platforms and real-world products.
          </p>
        </div>
        <div className={styles.heroVisualFullHeader}>
          <Image 
            src="/images/careers/mech-assembly.jpg" 
            alt="Mechanical Engineering" 
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
          {mechanicalRoles.map((role) => {
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
            {mechanicalRoles.map((role) => {
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
              <span className={styles.roleIdentityEyebrow}>{activeRole.number} / MECHANICAL ENGINEERING</span>
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
                      <label htmlFor="mech-phone">Phone</label>
                      <InternationalPhoneInput
                        id="mech-phone"
                        value={phone}
                        onChange={setPhone}
                        variant="career"
                        required
                      />
                    </div>
                    <div className={templateStyles.inputGroup}>
                      <label>Applying For</label>
                      <CustomSelect 
                        options={[
                          ...mechanicalRoles.map(r => ({ id: r.id, label: r.title })),
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
