import styles from './page.module.css';

const stats = [
  { value: "25+", label: "Projects Delivered" },
  { value: "40+", label: "Engineers & Developers" },
  { value: "12+", label: "Industry Deployments" },
  { value: "100+", label: "Years Combined Experience" },
];

export const metadata = {
  title: "About Omoikane Innovations | Aerospace & Defense Technology",
  description: "Mission-critical engineering, embedded systems, and autonomous platforms for the modern defense sector.",
};

export default function About() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>ABOUT <span className={styles.accent}>US</span></h1>
        <div className={styles.divider}></div>
      </header>

      <section className={styles.missionSection}>
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.text}>
            To engineer and deploy the next generation of mission-critical systems, autonomous platforms, and defense electronics. We believe in uncompromised reliability and precision engineering.
          </p>
        </div>
        
        <div className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>Our Vision</h2>
          <p className={styles.text}>
            To be the premier indigenous developer of advanced defense technology, setting the standard for secure, resilient, and intelligent aerospace platforms worldwide.
          </p>
        </div>
      </section>

      <section className={styles.statsSection}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statBox}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
