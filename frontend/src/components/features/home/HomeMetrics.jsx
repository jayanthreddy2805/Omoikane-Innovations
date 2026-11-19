import styles from "./HomeMetrics.module.css";

const figures = [
  { label: "Years of experience", value: "10+" },
  { label: "Delivered projects", value: "80+" },
  { label: "Global clients", value: "50+" },
  { label: "Client retention", value: "98%" },
];

export default function HomeMetrics() {
  return (
    <section className={styles.section} aria-labelledby="home-metrics-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="home-metrics-heading" className={styles.heading}>
            Omoikane in numbers
          </h2>
          <span className={styles.accent} aria-hidden="true" />
        </div>

        <dl className={styles.list}>
          {figures.map(({ label, value }) => (
            <div className={styles.row} key={label}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
