import Link from 'next/link';
import styles from './page.module.css';

export default async function DepartmentService({ params }) {
  const { department } = await params;
  
  const title = department.charAt(0).toUpperCase() + department.slice(1);
  
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>{title} <span className={styles.accent}>ENGINEERING</span></h1>
        <div className={styles.divider}></div>
        <p className={styles.subtitle}>
          Premium engineering services tailored for mission-critical {title.toLowerCase()} requirements.
        </p>
      </header>
      
      <div className={styles.contactSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.sectionTitle}>Discuss Your Requirement</h2>
          <p className={styles.formDesc}>Connect directly with our {title} team to explore custom solutions.</p>
          
          <div className={styles.premiumForm}>
            <Link href="/contact" className={styles.submitBtn}>
              Contact the {title} team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
