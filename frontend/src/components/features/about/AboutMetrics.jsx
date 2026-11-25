// OWNER TODO: attach dated evidence and approval fields listed in CLAIMS_TO_VERIFY.md.
import styles from "./AboutMetrics.module.css";

const figures = [
  { label: "Engineering Projects Delivered", value: "10+" },
  { label: "Skilled Engineers & Developers", value: "15+" },
  { label: "Industry Deployments", value: "5+" },
  { label: "Engineering Experience", value: "10+" },
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
