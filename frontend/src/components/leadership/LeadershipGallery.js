"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import Lenis from 'lenis';
import styles from './LeadershipGallery.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);
}

const PROFILES = [
  {
    id: 'alex',
    image: '/images/leadership/confidence.jpg',
    topTitle: 'ALEX KIM',
    bottomTitle: 'CEO',
    leftSubtitle: 'BACKGROUND',
    rightSubtitle: 'EXPERIENCE',
    leftText: 'Ex-Google PM. Built and sold two B2B SaaS products.',
    rightText: '10 yrs in operations and scalable automation.'
  },
  {
    id: 'maya',
    image: '/images/leadership/wisdom.jpg',
    topTitle: 'MAYA REED',
    bottomTitle: 'CTO',
    leftSubtitle: 'BACKGROUND',
    rightSubtitle: 'ACHIEVEMENTS',
    leftText: 'Ex-Stripe tech lead. Led infrastructure teams of 30+.',
    rightText: 'Open-source contributor with over 12K GitHub stars.'
  },
  {
    id: 'jonas',
    image: '/images/leadership/kindness.jpg',
    topTitle: 'JONAS LEE',
    bottomTitle: 'GROWTH',
    leftSubtitle: 'BACKGROUND',
    rightSubtitle: 'IMPACT',
    leftText: 'Scaled two products from 0 to $5M ARR.',
    rightText: 'Previously led growth initiatives at Notion and Linear.'
  },
  {
    id: 'sarah',
    image: '/images/leadership/creativity.jpg',
    topTitle: 'SARAH CHEN',
    bottomTitle: 'DESIGN',
    leftSubtitle: 'BACKGROUND',
    rightSubtitle: 'VISION',
    leftText: 'Award-winning product designer focused on minimal interfaces.',
    rightText: 'Former Design Lead at Airbnb and Apple.'
  }
];

export default function LeadershipGallery() {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const scrollContentRef = useRef(null);
  const sectionContentRef = useRef(null);
  const lenisRef = useRef(null);
  
  // Keep refs for elements we need to animate dynamically
  const galleryImageWrappers = useRef([]);
  const galleryImages = useRef([]);
  const contentWrappers = useRef([]);
  const contents = useRef([]);
  const listOfSplits = useRef([]);
  
  const [error, setError] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useGSAP(() => {
    if (!containerRef.current || !scrollWrapperRef.current || !scrollContentRef.current) return;

    try {
      // Initialize vertical Lenis
      lenisRef.current = new Lenis({
        lerp: 0.05,
        smoothWheel: true,
        smoothTouch: true,
      });

      let rafId;
      function raf(time) {
        lenisRef.current.raf(time);
        ScrollTrigger.update();
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // Setup Horizontal ScrollTrigger
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

      // Show scroll wrapper
      scrollWrapperRef.current.classList.remove(styles.isHidden);

      // Initialize SplitType for all content blocks
      contents.current.forEach((content, index) => {
        if (!content) return;
        content.classList.add(styles.isHidden);
        
        const contentTitleTop = content.querySelectorAll('[data-content="text-top"] div');
        const contentTitleBottom = content.querySelectorAll('[data-content="text-bottom"] div');
        const contentTextLeft = content.querySelectorAll('[data-content="text-left"] div');
        const contentTextRight = content.querySelectorAll('[data-content="text-right"] div');

        const titleTopSplits = Array.from(contentTitleTop, n => new SplitType(n, { types: 'chars' }));
        const titleBottomSplits = Array.from(contentTitleBottom, n => new SplitType(n, { types: 'chars' }));

        titleTopSplits[0]?.chars?.forEach(char => {
          const wrapper = document.createElement('div');
          wrapper.classList.add(styles.charWrap); // Using CSS module class for char-wrap
          char.parentNode.insertBefore(wrapper, char);
          wrapper.appendChild(char);
        });

        const textLeftSplits = Array.from(contentTextLeft, n => new SplitType(n, { types: 'lines' }));
        const textRightSplits = Array.from(contentTextRight, n => new SplitType(n, { types: 'lines' }));

        [textLeftSplits, textRightSplits].forEach(splits => {
          splits.forEach(split => {
            split.lines?.forEach(line => {
              const wrapper = document.createElement('div');
              wrapper.classList.add(styles.lineWrap); // Using CSS module class for line-wrap
              line.parentNode.insertBefore(wrapper, line);
              wrapper.appendChild(line);
            });
          });
        });

        listOfSplits.current[index] = {
          titleTopSplits,
          titleBottomSplits,
          textLeftSplits,
          textRightSplits,
        };
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (lenisRef.current) lenisRef.current.destroy();
      };
    } catch (e) {
      setError(e.toString());
    }
  }, { scope: containerRef });

  // Handle opening a gallery item
  const openContent = (index) => {
    if (openIndex !== null) return;
    
    setOpenIndex(index);
    contents.current[index].classList.remove(styles.isHidden);
    
    const currentWrapper = contentWrappers.current[index];
    const splits = listOfSplits.current[index];

    splits.titleTopSplits[0].chars.forEach(char => {
      char.style.willChange = 'transform, clip-path';
    });

    const currentAnimation = gsap.timeline({
      duration: 1.25,
      ease: 'power4.inOut',
      onStart: () => {
        sectionContentRef.current.classList.remove(styles.isHidden);
      },
      onComplete: () => {
        if (lenisRef.current) lenisRef.current.stop();
        scrollWrapperRef.current.classList.add(styles.isHidden);
        splits.titleTopSplits[0].chars.forEach(char => {
          char.style.willChange = 'auto';
        });
      },
    });

    currentAnimation
      .addLabel('start', 0)
      .addLabel('texts', 0.5)
      .add(() => {
        const flipState = Flip.getState(galleryImages.current[index]);
        currentWrapper.appendChild(galleryImages.current[index]);
        
        Flip.from(flipState, {
          duration: 1.25,
          ease: 'power4.inOut',
        });
      }, 'start')
      .to(
        galleryImageWrappers.current.filter((img, i) => i !== index),
        {
          clipPath: 'inset(100% 0 0 0)',
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0
      )
      .fromTo(
        [splits.titleTopSplits[0].elements, splits.titleTopSplits[0].elements],
        { xPercent: 15 },
        { xPercent: 0, duration: 1, ease: 'power3.out' },
        'start+=1.25'
      )
      .fromTo(
        [splits.titleTopSplits[0].chars, splits.titleBottomSplits[0].chars],
        { clipPath: 'inset(0 100% 0 0)', xPercent: 10 },
        { clipPath: 'inset(0 0% 0 0)', xPercent: 0, duration: 0.75, ease: 'power3.out' },
        'start+=1.25'
      )
      .fromTo(
        [
          ...splits.textLeftSplits.flatMap(split => split.lines),
          ...splits.textRightSplits.flatMap(split => split.lines),
        ],
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.025 },
        'start+=1.2'
      );
  };

  // Handle closing a gallery item
  const hideContent = (index) => {
    if (openIndex !== index) return;
    
    const currentWrapper = contentWrappers.current[index];
    const splits = listOfSplits.current[index];
    
    if (lenisRef.current) lenisRef.current.start();
    scrollWrapperRef.current.classList.remove(styles.isHidden);

    const currentAnimation = gsap.timeline({
      duration: 1.25,
      ease: 'power4.inOut',
      onComplete: () => {
        setOpenIndex(null);
        sectionContentRef.current.classList.add(styles.isHidden);
        contents.current[index].classList.add(styles.isHidden);
      },
    });

    currentAnimation
      .addLabel('start', 0)
      .fromTo(
        [splits.titleTopSplits[0].elements, splits.titleBottomSplits[0].elements],
        { xPercent: 0 },
        { xPercent: 10, ease: 'power3.out', duration: 1 },
        'start'
      )
      .fromTo(
        [splits.titleTopSplits[0].chars, splits.titleBottomSplits[0].chars],
        { clipPath: 'inset(0 0% 0 0)', xPercent: 0 },
        { clipPath: 'inset(0 100% 0 0)', xPercent: 10, ease: 'power3.out', duration: 0.75 },
        'start'
      )
      .to(
        [
          ...splits.textLeftSplits.flatMap(split => split.lines),
          ...splits.textRightSplits.flatMap(split => split.lines),
        ],
        { yPercent: 100, stagger: 0.025, duration: 0.75 },
        'start'
      )
      .add(() => {
        const contentWrapperImage = currentWrapper.querySelector(`.${styles.imageContainer}`);
        if (!contentWrapperImage) return;
        const flipState = Flip.getState(contentWrapperImage);
        galleryImageWrappers.current[index].appendChild(contentWrapperImage);
        Flip.from(flipState, {
          duration: 1.25,
          ease: 'power3.inOut',
        });
      }, 'start+=0.25')
      .to(
        galleryImageWrappers.current.filter((img, i) => i !== index),
        { clipPath: 'inset(0% 0 0 0)' }
      )
      .set(galleryImageWrappers.current, { clipPath: 'none' });
  };

  if (error) {
    return <div style={{position:'fixed', zIndex:9999, top:100, left:0, color:'red', background:'white', padding:'2rem', width:'100%', height:'100%'}}>{error}</div>;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', overflowX: 'hidden' }}>
      <div className={styles.scrollWrapper} data-scroll="wrapper" ref={scrollWrapperRef}>
        <div className={styles.galleryHeader}>
          <h2 className={styles.editorialHeading}>
            Forged by leaders<br/>
            <span className={styles.editorialItalic}>who have paved the way</span>
          </h2>
        </div>
        <section className={styles.scrollContent} data-scroll="content" ref={scrollContentRef}>
          <div className={styles.gallery}>
            {PROFILES.map((profile, i) => (
              <div 
                key={profile.id} 
                className={styles.galleryImage} 
                ref={el => galleryImageWrappers.current[i] = el}
                onClick={() => openContent(i)}
              >
                <div 
                  className={styles.imageContainer} 
                  ref={el => galleryImages.current[i] = el}
                >
                  <img src={profile.image} loading="lazy" alt={profile.topTitle} />
                </div>
                <div className={styles.cardNameOverlay}>
                  <h3>{profile.topTitle.toUpperCase()}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={`${styles.sectionContent} ${styles.isHidden}`} ref={sectionContentRef}>
        {PROFILES.map((profile, i) => (
          <div 
            key={profile.id} 
            className={`${styles.content} ${styles.isHidden}`} 
            ref={el => contents.current[i] = el}
            onClick={() => hideContent(i)}
          >
            <div className={styles.contentWrapper} ref={el => contentWrappers.current[i] = el}>
              <div className={styles.contentTitleTop} data-content="text-top">
                <div className={styles.titleBig}>{profile.topTitle}</div>
              </div>
              <div className={styles.contentTitleBottom} data-content="text-bottom">
                <div className={styles.titleBig}>{profile.bottomTitle}</div>
              </div>
              <div className={styles.contentTextLeft} data-content="text-left">
                <div className={styles.titleSmall}>{profile.leftSubtitle}</div>
                <div className={styles.paragraph}>{profile.leftText}</div>
              </div>
              <div className={styles.contentTextRight} data-content="text-right">
                <div className={styles.titleSmall}>{profile.rightSubtitle}</div>
                <div className={styles.paragraph}>{profile.rightText}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
