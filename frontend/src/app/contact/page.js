import React from 'react';
import Image from 'next/image';
import ContactForm from '@/components/common/ContactForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Contact | Omoikane Innovations',
  description: 'Talk to the team behind Omoikane\'s engineering work. Reach out to our headquarters in Bangalore, India.',
};

export default function ContactPage() {
  return (
    <div className={styles.pageWrapper}>
      
      {/* 1. EDITORIAL HERO */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              
              <div className={styles.heroTitleWrapper}>
                <h1 className={styles.heroTitleSolid}>LET'S CONNECT</h1>
                <h1 className={styles.heroTitleStroke}>LET'S CONNECT</h1>
              </div>

              <div className={styles.heroSubtitleBlock}>
                <p className={styles.heroSubtitle}>
                  Talk to the engineers and architects behind Omoikane. Whether you are scaling infrastructure, developing complex hardware, or initiating a strategic partnership, our channels are open.
                </p>
              </div>

            </div>
            
            <div className={styles.heroRight}>
              <div className={styles.heroImageWrapper}>
                <Image
                  src="/images/robot-arm-sketch.png"
                  alt="Robotic Arm Sketch"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.heroRobotImage}
                  priority
                />
                <div className={styles.pcbImageWrapper}>
                  <Image
                    src="/images/pcb-sketch.png"
                    alt="PCB Sketch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={styles.heroPcbImage}
                    priority
                  />
                </div>
                <div className={styles.hnImageWrapper}>
                  <Image
                    src="/images/hn.png"
                    alt="Hand Sketch"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={styles.heroHnImage}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENQUIRY SECTION */}
      <section className={styles.enquirySection}>
        <div className={styles.container}>
          
          <div className={styles.enquiryHeader}>
            <h2 className={styles.enquiryTitle}>CONTACT US</h2>
          </div>

          <div className={styles.enquiryGrid}>
            <div className={styles.enquiryContext}>
              <p className={styles.enquiryText}>
                Connect with the minds behind Omoikane. Whether it's a technical deep-dive or a strategic partnership, let's start the conversation.
              </p>
              <div className={styles.enquiryVisualContainer}>
                <div className={styles.enquiryVisualWrapper}>
                  <Image 
                    src="/images/enquiry-visual.png" 
                    alt="Engineering blueprint" 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={styles.enquiryImage} 
                  />
                </div>
              </div>
            </div>
            <div className={styles.formWrapper}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
