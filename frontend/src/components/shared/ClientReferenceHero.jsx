import Link from "next/link";
import styles from "./ClientReferenceHero.module.css";

export function ClientHomeHero() {
  return (
    <div className={styles.homeFrame}>
      <section className={styles.homeHero} id="hero" aria-labelledby="hero-headline" data-client-home-hero>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Indigenous technology &nbsp;|&nbsp; Global standards</div>
            <h1 id="hero-headline" data-client-hero-heading>
              Advanced <span>Defense, Aerospace &amp;</span> Embedded Systems
            </h1>
            <p data-client-hero-copy>We design and develop high-performance electronics and autonomous systems for a safer, smarter and self-reliant future.</p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/work">Explore Our Products →</Link>
              <Link className={`${styles.button} ${styles.outline}`} href="/expertise">Our Technology</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ClientPageHero({ title, breadcrumb = title }) {
  return (
    <div className={styles.pageFrame}>
      <section className={styles.pageHero} aria-labelledby="client-page-title">
        <div className={styles.container}>
          <div className={styles.eyebrow}>Indigenous technology · Global standards</div>
          <h1 id="client-page-title" data-client-hero-heading>{title}</h1>
          <div className={styles.breadcrumbs}><Link href="/">Home</Link> &nbsp;›&nbsp; {breadcrumb}</div>
        </div>
      </section>
    </div>
  );
}
