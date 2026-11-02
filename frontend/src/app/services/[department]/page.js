import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

const SERVICES = {
  software: {
    title: 'Software',
    summary: 'Embedded software and control logic developed around the timing, interface and operating requirements of the target platform.',
    capabilities: ['Bare-metal and RTOS firmware', 'Real-time control and sensor processing', 'Hardware and software integration', 'Prototype evaluation and validation planning'],
  },
  electronics: {
    title: 'Electronics',
    summary: 'Electronic hardware development for embedded, autonomous and mission-critical systems, from architecture through board bring-up.',
    capabilities: ['System architecture and schematic capture', 'Multi-layer PCB design', 'RF, GNSS and power electronics integration', 'Board bring-up and design validation'],
  },
  mechanical: {
    title: 'Mechanical',
    summary: 'Mechanical design and integration for electronic products and autonomous platforms, aligned with enclosure, thermal and structural requirements.',
    capabilities: ['Enclosure and product design', 'Electromechanical integration', 'Structural and thermal analysis', 'Prototype and assembly support'],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SERVICES).map((department) => ({ department }));
}

export async function generateMetadata({ params }) {
  const { department } = await params;
  const service = SERVICES[department];
  if (!service) return {};
  return { title: `${service.title} Services | Omoikane Innovations`, description: service.summary };
}

export default async function DepartmentService({ params }) {
  const { department } = await params;
  const service = SERVICES[department];
  if (!service) notFound();

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>CAPABILITY AREA</p>
        <h1 className={styles.title}>{service.title} <span className={styles.accent}>SERVICES</span></h1>
        <div className={styles.divider} />
        <p className={styles.subtitle}>{service.summary}</p>
      </header>

      <section className={styles.capabilitySection} aria-labelledby="capability-heading">
        <h2 id="capability-heading" className={styles.sectionTitle}>Core capability</h2>
        <ul className={styles.capabilityList}>
          {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
      </section>

      <div className={styles.contactSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.sectionTitle}>Discuss your requirement</h2>
          <p className={styles.formDesc}>Share the platform, interfaces and operating conditions with our {service.title.toLowerCase()} team.</p>
          <Link href={`/contact?subject=${encodeURIComponent(`${service.title} services`)}#contact-form`} className={styles.submitBtn}>
            Contact the {service.title} team <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
