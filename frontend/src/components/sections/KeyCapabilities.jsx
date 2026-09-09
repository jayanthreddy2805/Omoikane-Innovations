import styles from './KeyCapabilities.module.css';

const capabilities = [
  {
    id: "01",
    title: "Embedded Systems",
    description: "Mission-critical hardware and firmware for real-time edge processing."
  },
  {
    id: "02",
    title: "AI & Computer Vision",
    description: "Autonomous targeting, tracking, and object recognition systems."
  },
  {
    id: "03",
    title: "RF & Communication",
    description: "Secure, encrypted telemetry and datalinks for defense platforms."
  },
  {
    id: "04",
    title: "UAV & Autonomous Systems",
    description: "PX4-compatible flight controllers and autonomous navigation."
  }
];

export default function KeyCapabilities() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>ENGINEERING CAPABILITIES</h2>
          <div className={styles.divider}></div>
        </div>
        
        <div className={styles.grid}>
          {capabilities.map((cap) => (
            <div key={cap.id} className={styles.card}>
              <span className={styles.number}>{cap.id}</span>
              <h3 className={styles.cardTitle}>{cap.title}</h3>
              <p className={styles.cardDescription}>{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
