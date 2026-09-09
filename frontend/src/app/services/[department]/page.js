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
          
          <form className={styles.premiumForm}>
            <div className={styles.inputGroup}>
              <input type="text" id="name" placeholder=" " required className={styles.input} />
              <label htmlFor="name" className={styles.floatingLabel}>Full Name</label>
            </div>
            
            <div className={styles.inputGroup}>
              <input type="email" id="email" placeholder=" " required className={styles.input} />
              <label htmlFor="email" className={styles.floatingLabel}>Work Email</label>
            </div>
            
            <div className={styles.inputGroup}>
              <select id="requirement" required className={styles.select}>
                <option value="" disabled selected>Select Requirement Area...</option>
                <option>UAV / Drone</option>
                <option>Embedded System</option>
                <option>Defense Electronics</option>
                <option>AI / Computer Vision</option>
                <option>Custom Product Development</option>
              </select>
            </div>
            
            <button type="button" className={styles.submitBtn}>
              Submit Requirement →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
