import React from 'react';
import styles from './HowWeWork.module.css';

export default function HowWeWork() {
  const items = [
    {
      title: "BUILD FOR THE REAL WORLD",
      description: "Our engineering directly interacts with sensors, machines and physical systems."
    },
    {
      title: "WORK ACROSS DISCIPLINES",
      description: "Software works alongside AI, electronics and mechanical engineers."
    },
    {
      title: "OWN THE PRODUCT",
      description: "Architecture, implementation, deployment and iteration."
    },
    {
      title: "SOLVE DIFFICULT PROBLEMS",
      description: "Build systems that have to work outside the browser and outside the lab."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>HOW WE WORK</div>
        
        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.column}>
              <h3 className={styles.columnTitle}>{item.title}</h3>
              <p className={styles.columnDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
