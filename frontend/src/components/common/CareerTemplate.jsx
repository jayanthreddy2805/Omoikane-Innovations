"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './CareerTemplate.module.css';
import CustomSelect from '@/components/common/CustomSelect';

export default function CareerTemplate({ data }) {
  const {
    eyebrow,
    headline,
    heroSub,
    heroVisual,
    capabilities,
    roles,
    categoryLabel,
    theme = "software"
  } = data;

  const [activeRole, setActiveRole] = useState(roles[0]);
  const [formRole, setFormRole] = useState("");
  const [hoveredCapability, setHoveredCapability] = useState(null);

  return (
    <div className={styles.pageContainer} data-theme={theme}>
      
      {/* A. HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.headline} dangerouslySetInnerHTML={{ __html: headline }}></h1>
          <p className={styles.heroSub} dangerouslySetInnerHTML={{ __html: heroSub }}></p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}>
              EXPLORE ROLES ↓
            </button>
            <button className={styles.secondaryCta} onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}>
              SEND YOUR CV →
            </button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image src={heroVisual} alt={`${categoryLabel} Engineering`} fill className={styles.heroImg} priority />
        </div>
      </section>

      {/* B. WHAT WE WORK ON */}
      <section className={styles.whatWeBuildSection}>
        <div className={styles.sectionHeader}>
          <h2>WHAT WE WORK ON</h2>
        </div>
        <div className={styles.wwbGrid}>
          {capabilities.map((cap) => (
            <div 
              key={cap.id} 
              className={styles.wwbItem}
              onMouseEnter={() => setHoveredCapability(cap.id)}
              onMouseLeave={() => setHoveredCapability(null)}
            >
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* C & D. ROLE EXPLORER */}
      <section id="roles" className={styles.roleExplorerSection}>
        <div className={styles.explorerLayout}>
          
          {/* Left Nav */}
          <nav className={styles.roleNav}>
            <span className={styles.navHeader}>{categoryLabel.toUpperCase()}<br/>{roles.length} ENGINEERING ROLES</span>
            <ul className={styles.navList}>
              {roles.map((role) => {
                const isHoverRelated = hoveredCapability && capabilities.find(c => c.id === hoveredCapability)?.relatedRoles?.includes(role.id);
                return (
                  <li key={role.id}>
                    <button
                      className={`${styles.navItem} ${activeRole.id === role.id ? styles.navItemActive : ''} ${isHoverRelated ? styles.navItemHighlighted : ''}`}
                      onClick={() => setActiveRole(role)}
                    >
                      <span className={styles.navNumber}>{role.number}</span>
                      <div className={styles.navText}>
                        <span className={styles.navTitle}>{role.title}</span>
                        <span className={styles.navSubtitle}>{role.subtitle}</span>
                        <span className={styles.navSpec}>{role.specialization}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
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
                  <span className={styles.roleEyebrow}>{data.categoryLabel} / {activeRole.number}</span>
                  <h2>{activeRole.title}</h2>
                  <span className={styles.roleSubtitle}>{activeRole.subtitle}</span>
                </div>
                
                <p className={styles.roleDesc}>{activeRole.description}</p>
                
                <div className={styles.roleVisualFull}>
                  <Image src={activeRole.visual} alt={activeRole.title} fill className={styles.roleVisualImg} />
                </div>
                
                <div className={styles.roleContentEditorial}>
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
                  
                  <div className={styles.editorialCol}>
                    <h3>TECHNOLOGIES</h3>
                    <ul className={styles.editorialTechList}>
                      {activeRole.tech.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>



                <div className={styles.roleFooterActions}>
                  <div className={styles.roleApplyAction}>
                    <button 
                      className={styles.premiumApplyBtn}
                      onClick={() => {
                        setFormRole(activeRole.id);
                        document.getElementById('apply').scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      APPLY FOR THIS ROLE →
                    </button>
                  </div>
                  
                  <div className={styles.rolePagination}>
                    <button 
                      className={styles.pageBtn}
                      onClick={() => {
                        const currentIndex = data.roles.findIndex(r => r.id === activeRole.id);
                        const prevIndex = currentIndex === 0 ? data.roles.length - 1 : currentIndex - 1;
                        setActiveRole(data.roles[prevIndex]);
                        window.scrollTo({ top: document.getElementById('roles').offsetTop - 100, behavior: 'smooth' });
                      }}
                    >
                      <span className={styles.pageArrow}>←</span> PREVIOUS ROLE
                    </button>
                    
                    <button 
                      className={styles.pageBtnCenter}
                      onClick={() => {
                        window.scrollTo({ top: document.getElementById('roles').offsetTop - 150, behavior: 'smooth' });
                      }}
                    >
                      ↑ BACK TO INDEX
                    </button>
                    
                    <button 
                      className={styles.pageBtn}
                      onClick={() => {
                        const currentIndex = data.roles.findIndex(r => r.id === activeRole.id);
                        const nextIndex = currentIndex === data.roles.length - 1 ? 0 : currentIndex + 1;
                        setActiveRole(data.roles[nextIndex]);
                        window.scrollTo({ top: document.getElementById('roles').offsetTop - 100, behavior: 'smooth' });
                      }}
                    >
                      NEXT ROLE <span className={styles.pageArrow}>→</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* E. HOW WE WORK (Generic for all roles) */}
      <section className={styles.whyJoinSection}>
        <div className={styles.sectionHeader}>
          <h2>HOW WE WORK</h2>
        </div>
        <div className={styles.whyGrid}>
          <div className={styles.whyItem}>
            <h3>BUILD FOR THE REAL WORLD</h3>
            <p>Our engineering directly interacts with sensors, machines and physical systems.</p>
          </div>
          <div className={styles.whyItem}>
            <h3>WORK ACROSS DISCIPLINES</h3>
            <p>Software works alongside AI, electronics and mechanical engineers.</p>
          </div>
          <div className={styles.whyItem}>
            <h3>OWN THE PRODUCT</h3>
            <p>Architecture, implementation, deployment and iteration.</p>
          </div>
          <div className={styles.whyItem}>
            <h3>SOLVE DIFFICULT PROBLEMS</h3>
            <p>Build systems that have to work outside the browser and outside the lab.</p>
          </div>
        </div>
      </section>

      {/* F. GENERAL APPLICATION CTA / FORM */}
      <section id="apply" className={styles.applicationSection}>
        <div className={styles.applyLayout}>
          <div className={styles.applyText}>
            <h2>WORK WITH US</h2>
            
            <div className={styles.contactDivider}></div>

            <div className={styles.contactIndex}>
              <div className={styles.contactIndexTitle}>
                <a href="mailto:careers@omoikaneinnovations.com">CONTACT OUR TEAM <span>&rarr;</span></a>
              </div>

              <div className={styles.contactGrid}>
                <div className={styles.contactGroup}>
                  <h4>OFFICE</h4>
                  <p>Monday–Friday<br/>9:00 am – 6:00 pm</p>
                </div>

                <div className={styles.contactGroup}>
                  <h4>LOCATION</h4>
                  <p>Bangalore, India</p>
                </div>

                <div className={styles.contactGroup}>
                  <h4>EMAIL</h4>
                  <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>
                  <a href="mailto:bd@omoikaneinnovations.com">bd@omoikaneinnovations.com</a>
                </div>

                <div className={styles.contactGroup}>
                  <h4>PHONE</h4>
                  <a href="tel:+918861035848">+91-8861035848</a>
                  <a href="tel:+919353627825">+91-9353627825</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.applyFormContainer}>
            <form className={styles.formElement}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" required />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" required />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Applying For</label>
                  <CustomSelect 
                    options={[
                      ...roles.map(r => ({ id: r.id, label: r.title })),
                      { id: 'other', label: 'Other' }
                    ]}
                    value={formRole}
                    onChange={(val) => setFormRole(val)}
                    placeholder="Select Role"
                  />
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                <label>Upload CV (PDF/DOC)</label>
                <div className={styles.fileDrop}>
                  <input type="file" id="cv" required className={styles.hiddenFile} />
                  <label htmlFor="cv" className={styles.fileDropLabel}>
                    <span className={styles.fileDropText}>DROP YOUR CV HERE<br/>PDF / DOC / DOCX</span>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                <label htmlFor="message">Message (Optional)</label>
                <textarea id="message" rows={4}></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                SEND APPLICATION →
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
