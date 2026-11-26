"use client";

import React, { useRef, useState, useEffect, useSyncExternalStore } from "react";
import usePageVisible from "@/hooks/usePageVisible";
import styles from "./AboutHero.module.css";
import Link from "next/link";
import { ClientPageHero } from "@/components/shared/ClientReferenceHero";

const COMPANY_VIDEO = "/videos/about/omoikane.mp4";

const subscribeToMotion = (notify) => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", notify);
  return () => preference.removeEventListener("change", notify);
};
const getMotionPreference = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotionPreference = () => true;

export default function AboutHero() {
  const prefersReducedMotion = useSyncExternalStore(subscribeToMotion, getMotionPreference, getServerMotionPreference);
  const pageVisible = usePageVisible();
  const resumeTime = useRef(0);
  const autoplayEnabled = prefersReducedMotion !== true;
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!visible || !pageVisible || (!autoplayEnabled && !playRequested)) {
      resumeTime.current = video.currentTime;
      video.pause();
      if(video.hasAttribute('src')) { video.removeAttribute('src'); video.load(); }
      return;
    }
    if(!video.hasAttribute('src')) {
      video.src = video.canPlayType('video/webm') ? '/videos/about/omoikane.webm' : COMPANY_VIDEO;
      video.load();
      video.currentTime = resumeTime.current;
    }
    video.play().catch(() => {});
  }, [visible, pageVisible, autoplayEnabled, playRequested]);
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
      videoRef.current.play().catch(() => { });
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      <ClientPageHero title="About Omoikane Innovations" />
      <section className={styles.hero} aria-labelledby="about-intro-title">
        <div className={`${styles.container} ${styles.split}`}>
          <div className={styles.copy}>
            <div className={styles.kicker}>Who we are</div>
            <h2 id="about-intro-title" className={styles.title}>
              Indigenous engineering.<br />Global ambition.
            </h2>
            <p className={styles.lead} data-type-role="lead">
              Omoikane Innovations Pvt. Ltd. is a Bengaluru-based technology company focused on indigenous design and development of electronic hardware and autonomous systems for aerospace, defense, UAV and industrial applications.
            </p>
            <p className={styles.desc} data-type-role="desc">
              We bring together engineering thinking, product development discipline and a commitment to reducing import dependence through locally designed technology.
            </p>
            <Link className={styles.button} data-type-role="button" href="/contact">Start a conversation →</Link>
          </div>

          <figure className={styles.film}>
            <video
              ref={videoRef}
              className={styles.filmVideo}
              autoPlay={autoplayEnabled && visible}
              muted={isMuted}
              loop
              playsInline
              preload="none"
              controls={!autoplayEnabled}
              onVolumeChange={handleVolumeChange}
              onPlaying={() => setHasFrame(true)}
              onEmptied={() => setHasFrame(false)}
              aria-label="Omoikane Innovations company film"
            >
              Your browser does not support HTML video.
            </video>

            {!autoplayEnabled && !hasFrame && <button type="button" className={styles.filmPlay}
              onClick={() => setPlayRequested(true)}>Play company film</button>}

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
    </>
  );
}
