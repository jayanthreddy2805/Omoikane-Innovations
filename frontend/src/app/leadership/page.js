import styles from './page.module.css';

const boardMembers = [
  {
    name: "Dr. Alistair Vance",
    role: "Chief Executive Officer & Founder",
    bio: "Former Director of Advanced Defense Systems with 25+ years of experience in autonomous flight architecture.",
    imagePlaceholder: "AV"
  },
  {
    name: "Sarah Jenkins",
    role: "Chief Technology Officer",
    bio: "Lead architect of the indigenous secure datalink protocol. Specializes in hardened edge-processing systems.",
    imagePlaceholder: "SJ"
  },
  {
    name: "Gen. (Ret.) Marcus Thorne",
    role: "Strategic Advisory Board Chair",
    bio: "30-year veteran of defense procurement and strategy. Advises on mission-critical platform deployment.",
    imagePlaceholder: "MT"
  },
  {
    name: "Dr. Elena Rostova",
    role: "VP of Artificial Intelligence",
    bio: "Pioneer in computer vision for autonomous targeting systems. Ph.D. in Machine Learning from MIT.",
    imagePlaceholder: "ER"
  }
];

export const metadata = {
  title: "Board of Directors | Omoikane Innovations",
  description: "Meet the leadership team driving the future of mission-critical engineering and aerospace defense.",
};

export default function Leadership() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>BOARD OF <span className={styles.accent}>DIRECTORS</span></h1>
        <div className={styles.divider}></div>
        <p className={styles.subtitle}>
          Our leadership team brings decades of experience from the aerospace, defense, and deep-tech sectors to guide our mission-critical engineering initiatives.
        </p>
      </header>

      <section className={styles.grid}>
        {boardMembers.map((member, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              {member.imagePlaceholder}
            </div>
            <div className={styles.info}>
              <h2 className={styles.name}>{member.name}</h2>
              <h3 className={styles.role}>{member.role}</h3>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
