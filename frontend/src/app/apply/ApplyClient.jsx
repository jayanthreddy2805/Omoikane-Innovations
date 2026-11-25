"use client";

import { useState } from 'react';
import Image from '@/components/shared/LoadAwareImage';
import { Building2, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import ApplyForm from '@/components/features/apply/ApplyForm';
import FormSuccessState from '@/components/shared/FormSuccessState';
import styles from './page.module.css';

export default function ApplyPage({ query }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <noscript>Please email info@omoikaneinnovations.com or call +91-8861035848 to contact our team.</noscript>
      <div className={styles.ambientGlow}></div>
      
      {/* 2. ENQUIRY SECTION */}
      <section className={styles.enquirySection}>
        <div className={styles.container}>
          
          {!isSubmitted ? (
            <>
              <div className={styles.contactHeroWrapper}>
                <h1 className={styles.letsConnectTitle}>
                  <span className={styles.textWhite}>WORK WITH</span>{' '}
                  <span className={styles.textGrey}>US</span>
                </h1>
              </div>

              <div className={styles.enquiryGrid}>
                <div className={styles.enquiryContext} style={{order: 2}}>
                  <p className={styles.enquiryText}>
                    We are always looking for visionary engineers, designers, and builders. Apply below and show us what you can create.
                  </p>
                  
                  <div className={styles.contactDetailsBlock}>
                    <div className={styles.contactDetailsHeader}>
                      <h3>CONTACT OUR TEAM</h3>
                      <ArrowRight size={16} />
                    </div>
                    
                    <div className={styles.contactDetailsGrid}>
                      <div className={styles.contactDetailItem}>
                        <div className={styles.contactDetailLabel}>
                          <Building2 size={14} /> <span>OFFICE</span>
                        </div>
                        <div className={styles.contactDetailText}>
                          Monday–Friday<br />
                          9:00 am – 6:00 pm IST
                        </div>
                      </div>
                      
                      <div className={styles.contactDetailItem}>
                        <div className={styles.contactDetailLabel}>
                          <MapPin size={14} /> <span>LOCATION</span>
                        </div>
                        <div className={styles.contactDetailText}>
                          Bangalore, India
                        </div>
                      </div>

                      <div className={styles.contactDetailItem}>
                        <div className={styles.contactDetailLabel}>
                          <Mail size={14} /> <span>EMAIL</span>
                        </div>
                        <div className={styles.contactDetailText}>
                          info@omoikaneinnovations.com<br />
                          bd@omoikaneinnovations.com
                        </div>
                      </div>

                      <div className={styles.contactDetailItem}>
                        <div className={styles.contactDetailLabel}>
                          <Phone size={14} /> <span>PHONE</span>
                        </div>
                        <div className={styles.contactDetailText}>
                          +91-8861035848<br />
                          +91-9353627825
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formWrapper} style={{order: 1}}>
                  <ApplyForm query={query} onSuccess={() => setIsSubmitted(true)} />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.successWrapper}>
              <FormSuccessState variant="application" />
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
