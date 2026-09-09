import styles from './page.module.css';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: "UAV Flight Control Platform",
    category: "Aerospace",
    specs: ["GNSS", "Telemetry", "Real-time Processing", "Autonomous Navigation"],
    description: "Indigenous flight control architecture designed for mission-critical unmanned aerial vehicles."
  },
  {
    id: 2,
    title: "Secure Comm Datalink",
    category: "Defense",
    specs: ["AES-256", "Anti-jamming", "Low Latency"],
    description: "Highly secure encrypted telemetry datalink for defense platforms in contested environments."
  }
];

export const metadata = {
  title: "Projects & Products | Omoikane Innovations",
  description: "Explore our indigenous product development and mission-critical engineering projects.",
};

export default function Projects() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>PROJECTS & <span className={styles.accent}>PRODUCTS</span></h1>
        <p className={styles.subtitle}>Indigenous product development and mission-critical engineering projects.</p>
      </header>
      
      <section className={styles.projectGrid}>
        {projects.map(project => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.categoryBadge}>{project.category}</div>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            <p className={styles.projectDescription}>{project.description}</p>
            
            <div className={styles.specs}>
              {project.specs.map(spec => (
                <span key={spec} className={styles.specTag}>{spec}</span>
              ))}
            </div>
            
            <Link href={`/projects/${project.id}`} className={styles.viewBtn}>
              View Technical Details →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
