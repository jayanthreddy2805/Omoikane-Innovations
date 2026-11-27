"use client";
import { LoadAwarePhoto } from "@/components/shared/LoadAwareImage";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './LeadershipGallery.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const PROFILES = [
  {
    id: 'alex',
    image: '/images/leadership/confidence.jpg',
    topTitle: 'PROFILE 01',
    bottomTitle: 'DETAILS PENDING',
    leftSubtitle: 'PROFILE',
    rightSubtitle: 'BACKGROUND',
    leftText: 'Name and role pending approval.',
    rightText: 'Biography pending approval.'
  },
  {
    id: 'maya',
    image: '/images/leadership/wisdom.jpg',
    topTitle: 'PROFILE 02',
    bottomTitle: 'DETAILS PENDING',
    leftSubtitle: 'PROFILE',
    rightSubtitle: 'BACKGROUND',
    leftText: 'Name and role pending approval.',
    rightText: 'Biography pending approval.'
  },
  {
    id: 'jonas',
    image: '/images/leadership/kindness.jpg',
    topTitle: 'PROFILE 03',
    bottomTitle: 'DETAILS PENDING',
    leftSubtitle: 'PROFILE',
    rightSubtitle: 'BACKGROUND',
    leftText: 'Name and role pending approval.',
    rightText: 'Biography pending approval.'
  },
  {
    id: 'sarah',
    image: '/images/leadership/creativity.jpg',
    topTitle: 'PROFILE 04',
    bottomTitle: 'DETAILS PENDING',
    leftSubtitle: 'PROFILE',
    rightSubtitle: 'BACKGROUND',
    leftText: 'Name and role pending approval.',
    rightText: 'Biography pending approval.'
  }
];

export default function LeadershipGallery() {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const scrollContentRef = useRef(null);
  const sectionContentRef = useRef(null);

  // Keep refs for elements we need to animate dynamically
  const contentWrappers = useRef([]);
  const contents = useRef([]);
  const openerRefs = useRef([]);
  const closeButtonRefs = useRef([]);
  const profileAnimationRef = useRef(null);
  const profileTextRefs = useRef([]);

  const [error, setError] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const setTextRef = (index, key) => (el) => {
    if (!profileTextRefs.current[index]) {
      profileTextRefs.current[index] = {};
    }
    profileTextRefs.current[index][key] = el;
  };

  useGSAP(() => {
    if (!containerRef.current || !scrollWrapperRef.current || !scrollContentRef.current) return;

    try {
      // Show scroll wrapper
      scrollWrapperRef.current.classList.remove(styles.isHidden);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1101px)", () => {
        // Horizontal ScrollTrigger pinned gallery on desktop using native scroll
        gsap.to(scrollContentRef.current, {
          x: () => -(scrollContentRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: scrollWrapperRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + (scrollContentRef.current.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true,
          }
        });
      });

      contents.current.forEach((content) => {
        if (!content) return;
        content.classList.add(styles.isHidden);
      });

      return () => {
        mm.revert();
        profileAnimationRef.current?.kill();
      };
    } catch (e) {
      setError(e.toString());
    }
  }, { scope: containerRef });

  // Handle opening a gallery item
  const openContent = (index) => {
    if (openIndex !== null) return;

    profileAnimationRef.current?.kill();

    setOpenIndex(index);
    contents.current[index].classList.remove(styles.isHidden);
    // A zero-duration reduced-motion timeline does not run GSAP's onStart.
    // Visibility must follow the open action for both motion preferences.
    sectionContentRef.current.classList.remove(styles.isHidden);

    const currentWrapper = contentWrappers.current[index];
    const refs = profileTextRefs.current[index] || {};
    const titleEls = [refs.titleTop, refs.titleBottom].filter(Boolean);
    const bodyEls = [refs.leftSubtitle, refs.leftText, refs.rightSubtitle, refs.rightText].filter(Boolean);
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const d = (seconds) => (reduced ? 0 : seconds);

    if (reduced) {
      gsap.set([currentWrapper, ...titleEls, ...bodyEls], { opacity: 1, visibility: 'visible', clearProps: 'transform' });
      scrollWrapperRef.current.classList.add(styles.isHidden);
      requestAnimationFrame(() => {
        if (sectionContentRef.current?.classList.contains(styles.isHidden)) return;
        closeButtonRefs.current[index]?.focus({ preventScroll: true });
      });
      return;
    }

    const currentAnimation = gsap.timeline({
      onComplete: () => {
        if (profileAnimationRef.current !== currentAnimation) return;
        scrollWrapperRef.current.classList.add(styles.isHidden);
        closeButtonRefs.current[index]?.focus();
        profileAnimationRef.current = null;
      },
    });

    profileAnimationRef.current = currentAnimation;

    currentAnimation
      .addLabel('start', 0)
      .fromTo(
        currentWrapper,
        { opacity: 0, scale: reduced ? 1 : 0.96 },
        { opacity: 1, scale: 1, duration: d(0.65), ease: 'power3.out' },
        'start'
      )
      .fromTo(
        titleEls,
        { xPercent: reduced ? 0 : 12, yPercent: reduced ? 0 : 100, opacity: 0 },
        { xPercent: 0, yPercent: 0, opacity: 1, duration: d(0.65), ease: 'power3.out' },
        reduced ? 'start' : 'start+=0.15'
      )
      .fromTo(
        bodyEls,
        { yPercent: reduced ? 0 : 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: d(0.55), stagger: reduced ? 0 : 0.04, ease: 'power3.out' },
        reduced ? 'start' : 'start+=0.2'
      );
  };

  // Handle closing a gallery item
  const hideContent = useCallback((index) => {
    if (openIndex !== index) return;

    profileAnimationRef.current?.kill();

    const currentWrapper = contentWrappers.current[index];
    const refs = profileTextRefs.current[index] || {};
    const titleEls = [refs.titleTop, refs.titleBottom].filter(Boolean);
    const bodyEls = [refs.leftSubtitle, refs.leftText, refs.rightSubtitle, refs.rightText].filter(Boolean);
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const d = (seconds) => (reduced ? 0 : seconds);

    scrollWrapperRef.current.classList.remove(styles.isHidden);

    if (reduced) {
      gsap.set([currentWrapper, ...titleEls, ...bodyEls], { clearProps: 'opacity,transform,visibility' });
      setOpenIndex(null);
      sectionContentRef.current.classList.add(styles.isHidden);
      contents.current[index].classList.add(styles.isHidden);
      openerRefs.current[index]?.focus({ preventScroll: true });
      return;
    }

    const currentAnimation = gsap.timeline({
      onComplete: () => {
        if (profileAnimationRef.current !== currentAnimation) return;
        setOpenIndex(null);
        sectionContentRef.current.classList.add(styles.isHidden);
        contents.current[index].classList.add(styles.isHidden);
        scrollWrapperRef.current.classList.remove(styles.isHidden);
        openerRefs.current[index]?.focus();
        profileAnimationRef.current = null;
      },
    });

    profileAnimationRef.current = currentAnimation;

    currentAnimation
      .addLabel('start', 0)
      .to(
        titleEls,
        { xPercent: reduced ? 0 : 10, yPercent: reduced ? 0 : -100, opacity: 0, ease: 'power3.out', duration: d(0.5) },
        'start'
      )
      .to(
        bodyEls,
        { yPercent: reduced ? 0 : 100, opacity: 0, stagger: reduced ? 0 : 0.03, duration: d(0.45), ease: 'power3.out' },
        'start'
      )
      .to(
        currentWrapper,
        { opacity: 0, scale: reduced ? 1 : 0.96, duration: d(0.45), ease: 'power3.inOut' },
        reduced ? 'start' : 'start+=0.1'
      );
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        hideContent(openIndex);
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRefs.current[openIndex]?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hideContent, openIndex]);

  if (error) {
    return <div style={{ position: 'fixed', zIndex: 9999, top: 100, left: 0, color: 'red', background: 'white', padding: '2rem', width: '100%', height: '100%' }}>{error}</div>;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', overflowX: 'hidden' }}>
      <div className={styles.scrollWrapper} data-scroll="wrapper" ref={scrollWrapperRef}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.editorialHeading}>
            Leadership profiles
          </h2>
          <p>Template profiles. Names, roles and biographies are pending approval.</p>
        </div>
        <section className={styles.scrollContent} data-scroll="content" ref={scrollContentRef}>
          <div className={styles.gallery}>
            {PROFILES.map((profile, i) => (
              <button
                type="button"
                key={profile.id}
                className={styles.galleryImage}
                ref={el => {
                  openerRefs.current[i] = el;
                }}
                onClick={() => openContent(i)}
                aria-haspopup="dialog"
                aria-label={`Open profile for ${profile.topTitle}, ${profile.bottomTitle}`}
              >
                <div
                  className={styles.imageContainer}
                >
                  <LoadAwarePhoto src={profile.image} loading="lazy" alt="" />
                </div>
                <div className={styles.cardNameOverlay}>
                  <h3>{profile.topTitle.toUpperCase()}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className={`${styles.sectionContent} ${openIndex === null ? styles.isHidden : ''}`} ref={sectionContentRef}>
        {PROFILES.map((profile, i) => (
          <div
            key={profile.id}
            className={`${styles.content} ${openIndex !== i ? styles.isHidden : ''}`}
            ref={el => contents.current[i] = el}
            role="dialog"
            aria-modal="true"
            aria-hidden={openIndex !== i}
            aria-labelledby={`leadership-profile-${profile.id}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) hideContent(i);
            }}
          >
            <div className={styles.contentWrapper} ref={el => contentWrappers.current[i] = el}>
              <div className={styles.imageContainer} aria-hidden="true">
                <LoadAwarePhoto src={profile.image} loading="lazy" alt="" />
              </div>
              <button
                ref={el => { closeButtonRefs.current[i] = el; }}
                type="button"
                className={styles.closeButton}
                onClick={() => hideContent(i)}
                aria-label={`Close profile for ${profile.topTitle}`}
              >
                Close <span aria-hidden="true">×</span>
              </button>
              <div className={styles.contentTitleTop} data-content="text-top">
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'titleTop')} id={`leadership-profile-${profile.id}`} className={styles.titleBig}>{profile.topTitle}</div>
                </div>
              </div>
              <div className={styles.contentTitleBottom} data-content="text-bottom">
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'titleBottom')} className={styles.titleBig}>{profile.bottomTitle}</div>
                </div>
              </div>
              <div className={styles.contentTextLeft} data-content="text-left">
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'leftSubtitle')} className={styles.titleSmall}>{profile.leftSubtitle}</div>
                </div>
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'leftText')} className={styles.paragraph}>{profile.leftText}</div>
                </div>
              </div>
              <div className={styles.contentTextRight} data-content="text-right">
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'rightSubtitle')} className={styles.titleSmall}>{profile.rightSubtitle}</div>
                </div>
                <div className={styles.textMask}>
                  <div ref={setTextRef(i, 'rightText')} className={styles.paragraph}>{profile.rightText}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
