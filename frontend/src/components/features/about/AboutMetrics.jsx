import styles from "./AboutMetrics.module.css";

const figures = [
  { label: "Years of experience", value: "10+" },
  { label: "Delivered projects", value: "80+" },
  { label: "Global clients", value: "50+" },
  { label: "Client retention", value: "98%" },
];

export default function AboutMetrics() {
  return (
    <section className={styles.section} aria-label="Company figures">
      <div className={styles.inner}>
        <dl className={styles.rail}>
          {figures.map(({ label, value }) => (
            <div className={styles.item} key={label}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
