"use client";

import React from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import styles from "./AboutHero.module.css";

const COMPANY_VIDEO = "/videos/omoikane.mp4";
const COMPANY_VIDEO_POSTER = "/images/about/omoikane-film-poster.jpg";

export default function AboutHero() {
  const prefersReducedMotion = useReducedMotion();
  const autoplayEnabled = prefersReducedMotion !== true;

  return (
    <>
      <section className={styles.hero} aria-labelledby="about-hero-title">
        <div className={styles.container}>
          <header className={styles.intro}>
            <h1 id="about-hero-title" className={styles.headline}>
              <span className={styles.headlineLine}>Advanced systems.</span>
              <span className={`${styles.headlineLine} ${styles.headlineLineSecondary}`}>
                Built for the real world.
              </span>
            </h1>
          </header>

          <figure className={styles.film}>
            <video
              className={styles.filmVideo}
              src={COMPANY_VIDEO}
              poster={COMPANY_VIDEO_POSTER}
              autoPlay={autoplayEnabled}
              muted
              loop
              playsInline
              preload={autoplayEnabled ? "metadata" : "none"}
              controls={!autoplayEnabled}
              aria-label="Omoikane Innovations company film"
            >
              Your browser does not support HTML video.
            </video>
          </figure>
        </div>
      </section>

      <section className={styles.summarySection}>
        <div className={styles.container}>
          <div className={styles.summary}>
            <div className={styles.summaryLabel}>
              <span className={styles.summaryNumber}>01</span>
              <span>What we build</span>
            </div>

            <p className={styles.summaryCopy}>
              Omoikane Innovations is a product-focused technology company developing
              advanced embedded systems, autonomous platforms, and defense-grade
              solutions for aerospace, defense, and industrial applications. Its
              products are engineered for reliability, scalability, and real-world deployment.
            </p>

            <div className={styles.summaryAction}>
              <Link href="/expertise" className={styles.expertiseLink}>
                <span>Explore our expertise</span>
                <span className={styles.linkArrow} aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
