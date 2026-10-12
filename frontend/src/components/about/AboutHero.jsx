"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import styles from "./AboutHero.module.css";

const COMPANY_VIDEO = "/videos/omoikane.mp4";
const COMPANY_VIDEO_POSTER = "/images/about/omoikane-film-poster.jpg";

export default function AboutHero() {
  const prefersReducedMotion = useReducedMotion();
  const autoplayEnabled = prefersReducedMotion !== true;
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  };

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
              ref={videoRef}
              className={styles.filmVideo}
              src={COMPANY_VIDEO}
              poster={COMPANY_VIDEO_POSTER}
              autoPlay={autoplayEnabled}
              muted={isMuted}
              loop
              playsInline
              preload={autoplayEnabled ? "metadata" : "none"}
              controls={!autoplayEnabled}
              onVolumeChange={handleVolumeChange}
              aria-label="Omoikane Innovations company film"
            >
              Your browser does not support HTML video.
            </video>

            {autoplayEnabled && (
              <button
                type="button"
                id="about-hero-sound-toggle"
                className={styles.soundToggle}
                onClick={toggleSound}
                aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg
                    className={styles.soundIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    className={styles.soundIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>
            )}
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
