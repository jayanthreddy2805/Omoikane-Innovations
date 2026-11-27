import Image, { getImageProps } from "next/image";
import Link from "next/link";
import styles from "./HeroBanner.module.css";

export function HomeHeroBanner() {
  const mobile = getImageProps({ src: '/images/reference/home-drone-mobile.jpg', alt: '', fill: true, sizes: '100vw' }).props;
  return (
    <div className={styles.homeFrame}>
      <section className={styles.homeHero} data-type-role="homeHero" id="hero" aria-labelledby="hero-headline" data-client-home-hero>
        <picture className={styles.homeBackdrop}>
          <source media="(max-width: 680px)" srcSet={mobile.srcSet} sizes="100vw" />
          <Image src="/images/reference/home-drone-desktop.jpg" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className={styles.homeBackdropImage} />
        </picture>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow} data-type-role="eyebrow">Indigenous technology &nbsp;|&nbsp; Global standards</div>
            <h1 id="hero-headline" data-client-hero-heading>
              <span className={styles.lineBreakGroup}>Advanced <span className={styles.heroAccent}>Defense</span></span>{' '}
              <br className={styles.mobileBreak} />
              <span className={styles.lineBreakGroup}><span className={styles.heroAccent}>Aerospace &amp;</span></span>{' '}
              <br className={styles.mobileBreak} />
              <span className={styles.lineBreakGroup}>Embedded Systems</span>
            </h1>
            <p data-client-hero-copy>We design and develop high-performance electronics and autonomous systems for a safer, smarter and self-reliant future.</p>
            <div className={styles.actions} data-type-role="actions">
              <Link className={styles.button} data-type-role="button" href="/work">Explore Our Products →</Link>
              <Link className={`${styles.button} ${styles.outline}`} data-type-role="button" href="/expertise">Our Technology</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PageHeroBanner({ title }) {
  return (
    <div className={styles.pageFrame}>
      <section className={styles.pageHero} data-type-role="pageHero" aria-labelledby="client-page-title">
        <div className={styles.container}>
          <h1 id="client-page-title" data-client-hero-heading>{title}</h1>
        </div>
      </section>
    </div>
  );
}
