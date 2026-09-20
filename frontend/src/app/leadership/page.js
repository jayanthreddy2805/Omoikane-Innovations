"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import SplitType from 'split-type';
import Lenis from 'lenis';
import styles from './page.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LeadershipBackground from './LeadershipBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip, ScrollTrigger);
}

export default function LeadershipPage() {
  const containerRef = useRef(null);
  const [error, setError] = React.useState('');

  useEffect(() => {
    if (!containerRef.current) return;
    let lenis;
    let rafId;
    let ctx;
    try {

    ctx = gsap.context(() => {
      // Initialize vertical Lenis for the whole page
      lenis = new Lenis({
        lerp: 0.05,
        smoothWheel: true,
        smoothTouch: true,
      });

      function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // Setup Horizontal ScrollTrigger
      const scrollWrapper = containerRef.current.querySelector('[data-scroll="wrapper"]');
      const scrollContent = containerRef.current.querySelector('[data-scroll="content"]');
      
      gsap.to(scrollContent, {
        x: () => -(scrollContent.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapper,
          pin: true,
          scrub: 1,
          end: () => "+=" + (scrollContent.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true,
        }
      });

      const galleryImagesWrapper = containerRef.current.querySelectorAll('[data-gallery="image-wrapper"]');
      const galleryImages = containerRef.current.querySelectorAll('[data-gallery="image"]');

      const sectionContent = containerRef.current.querySelector('[data-content="section"]');
      const contents = containerRef.current.querySelectorAll('[data-content="details"]');
      const contentWrappers = containerRef.current.querySelectorAll('[data-content="details-wrapper"]');
      
      let listOfSplits = [];
      let currentOpenIndex = null;
      let isAnimating = false;
      let currentAnimation = null;

      scrollWrapper.classList.remove(styles.isHidden);

      contents.forEach((content, index) => {
          content.classList.add(styles.isHidden);
          listOfSplits[index] = initializeSplitText(content);
      });

      function initializeSplitText(content) {
          if (!content) return null;

          const contentTitleTop = content.querySelectorAll('[data-content="text-top"] div');
          const contentTitleBottom = content.querySelectorAll('[data-content="text-bottom"] div');
          const contentTextLeft = content.querySelectorAll('[data-content="text-left"] div');
          const contentTextRight = content.querySelectorAll('[data-content="text-right"] div');

          const titleTopSplits = Array.from(
              contentTitleTop,
              n => new SplitType(n, { types: 'chars' })
          );
          
          const titleBottomSplits = Array.from(
              contentTitleBottom,
              n => new SplitType(n, { types: 'chars' })
          );

          titleTopSplits[0]?.chars?.forEach(char => {
              const wrapper = document.createElement('div');
              wrapper.classList.add('char-wrap');
              char.parentNode.insertBefore(wrapper, char);
              wrapper.appendChild(char);
          });

          const textLeftSplits = Array.from(
              contentTextLeft,
              n => new SplitType(n, { types: 'lines' })
          );

          const textRightSplits = Array.from(
              contentTextRight,
              n => new SplitType(n, { types: 'lines' })
          );

          [textLeftSplits, textRightSplits].forEach(splits => {
              splits.forEach(split => {
              split.lines?.forEach(line => {
                  const wrapper = document.createElement('div');
                  wrapper.classList.add('line-wrap');
                  line.parentNode.insertBefore(wrapper, line);
                  wrapper.appendChild(line);
              });
              });
          });

          return {
              titleTopSplits,
              titleBottomSplits,
              textLeftSplits,
              textRightSplits,
          };
      }

      const openContent = index => {
          if (isAnimating) return;

          isAnimating = true;
          contents[index].classList.remove(styles.isHidden);
          const currentWrapper = contentWrappers[index];
          const splits = listOfSplits[index];

          splits.titleTopSplits[0].chars.forEach(char => {
              char.style.willChange = 'transform, clip-path';
          });

          currentAnimation = gsap.timeline({
              duration: 1.25,
              ease: 'power4.inOut',
              onStart: () => {
                  sectionContent.classList.remove(styles.isHidden);
              },
              onComplete: () => {
                  isAnimating = false;
                  currentOpenIndex = index;
                  lenis.stop();
                  scrollWrapper.classList.add(styles.isHidden);
                  currentAnimation = null;
                  splits.titleTopSplits[0].chars.forEach(char => {
                      char.style.willChange = 'auto';
                  });
              },
          });

          currentAnimation
              .addLabel('start', 0)
              .addLabel('texts', 0.5)
              .add(() => {
                  const flipState = Flip.getState(galleryImages[index]);
                  currentWrapper.appendChild(galleryImages[index]);
                  
                  Flip.from(flipState, {
                      duration: 1.25,
                      ease: 'power4.inOut',
                  });
              }, 'start')
              .to(
                  gsap.utils
                  .toArray(galleryImagesWrapper)
                  .filter((img, i) => i !== index),
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

      const hideContent = index => {
          if (isAnimating || currentOpenIndex === null) return;

          isAnimating = true;
          const currentWrapper = contentWrappers[index];
          const splits = listOfSplits[index];
          lenis.start();
          scrollWrapper.classList.remove(styles.isHidden);

          currentAnimation = gsap.timeline({
              duration: 1.25,
              ease: 'power4.inOut',
              onComplete: () => {
                isAnimating = false;
                currentOpenIndex = null;
                currentAnimation = null;
                sectionContent.classList.add(styles.isHidden);
                contents[index].classList.add(styles.isHidden);
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
              const contentWrapperImage = currentWrapper.querySelector('.image_container');
              if (!contentWrapperImage) return;
              const flipState = Flip.getState(contentWrapperImage);
              galleryImagesWrapper[index].appendChild(contentWrapperImage);
              Flip.from(flipState, {
                  duration: 1.25,
                  ease: 'power3.inOut',
              });
          }, 'start+=0.25')
          .to(
              gsap.utils.toArray(galleryImagesWrapper).filter((img, i) => i !== index),
              { clipPath: 'inset(0% 0 0 0)' }
          )
          .set(galleryImagesWrapper, { clipPath: 'none' });
      };

      galleryImagesWrapper.forEach((image, index) => {
          image.addEventListener('click', () => {
              if (currentOpenIndex === null) openContent(index);
          });
      });

      contentWrappers.forEach((content, index) => {
          content.addEventListener('click', () => {
              if (currentOpenIndex === index) hideContent(index);
          });
      });

    }, containerRef);
    } catch (e) { setError(e.toString()); }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      if (ctx) ctx.revert();
    };
  }, []);

  if (error) return <div style={{position:'fixed', zIndex:9999, top:100, left:0, color:'red', background:'white', padding:'2rem', width:'100%', height:'100%'}}>{error}</div>;

  return (
    <div ref={containerRef} style={{ width: '100%', overflowX: 'hidden' }}>
      <section className={styles.heroSection}>
        <LeadershipBackground />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              <span style={{ whiteSpace: 'nowrap' }}>LEADERSHIP BUILT ON</span> <br/>
              <span className={styles.heroItalic}>vision</span> & <span className={styles.heroItalic}>precision</span>
            </h1>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroText}>
              <p>Omoikane drives technological leaps by aligning deep-tech engineering with autonomous systems from day one.</p>
              <p>Our senior-led team partners with defense and enterprise sectors to build robust, bleeding-edge platforms that guarantee operational superiority.</p>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.btnPrimary}>EXPLORE</button>
              <button className={styles.btnSecondary}>CONTACT US</button>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.scrollWrapper} data-scroll="wrapper">
        <div className={styles.galleryHeader}>
          <h2 className={styles.editorialHeading}>
            Executive<br/>
            <span className={styles.editorialItalic}>Leadership</span>
          </h2>
        </div>
        <section className={styles.scrollContent} data-scroll="content">
          <div className={styles.gallery}>
            {/* 1 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/confidence.jpg" loading="lazy" alt="Confidence" />
              </div>
            </div>
            {/* 2 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/wisdom.jpg" loading="lazy" alt="Wisdom" />
              </div>
            </div>
            {/* 3 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/kindness.jpg" loading="lazy" alt="Kindness" />
              </div>
            </div>
            {/* 4 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/creativity.jpg" loading="lazy" alt="Creativity" />
              </div>
            </div>
            {/* 5 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/leadership.jpg" loading="lazy" alt="Leadership" />
              </div>
            </div>
            {/* 6 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/grace.jpg" loading="lazy" alt="Grace" />
              </div>
            </div>
            {/* 7 */}
            <div className={styles.galleryImage} data-gallery="image-wrapper">
              <div className={`${styles.imageContainer} image_container`} data-gallery="image">
                <img src="/images/leadership/passion.jpg" loading="lazy" alt="Passion" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={`${styles.sectionContent} ${styles.isHidden}`} data-content="section">
        {/* 1 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>CONFIDENCE</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>CHARISMA</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>CHARM</div>
              <div className={styles.paragraph}>Sharp wit, warm smile a magnetic presence. He walks in, and the room seems to pause, by his quiet strength.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>Presence</div>
              <div className={styles.paragraph}>Striking confidence, captivating charm, and elegance in every glance. A timeless blend of poise and presence, effortlessly charismatic.</div>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>WISDOM</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>INTELLECT</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>BRILLIANCE</div>
              <div className={styles.paragraph}>Quick mind, deep thoughts, a scholarly presence. His ideas illuminate the room, guided by penetrating insight.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>knowledge</div>
              <div className={styles.paragraph}>Deep understanding, thoughtful insights, and clarity in every word. A masterful blend of experience and intuition, naturally enlightening.</div>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>KINDNESS</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>GENEROSITY</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>Giving</div>
              <div className={styles.paragraph}>Open heart, helping hands, a benevolent force. His presence brings comfort, marked by selfless grace.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>Compassion</div>
              <div className={styles.paragraph}>Gentle spirit, nurturing soul, and warmth in every action. A beautiful harmony of empathy and understanding, naturally caring.</div>
            </div>
          </div>
        </div>

        {/* 4 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>CREATIVITY</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>ARTISTRY</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>Expression</div>
              <div className={styles.paragraph}>Fluid style, bold vision, a creative soul. He transforms the ordinary, through his unique perspective.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>Innovation</div>
              <div className={styles.paragraph}>Boundless imagination, artistic flair, and vision in every creation. A stunning fusion of originality and skill, naturally inspiring.</div>
            </div>
          </div>
        </div>

        {/* 5 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>LEADERSHIP</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>INFLUENCE</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>Impact</div>
              <div className={styles.paragraph}>Strong presence, clear purpose, a guiding light. He shapes the path forward, through determined leadership.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>Guidance</div>
              <div className={styles.paragraph}>Natural authority, inspiring presence, and direction in every decision. A powerful combination of vision and influence, naturally commanding</div>
            </div>
          </div>
        </div>

        {/* 6 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>GRACE</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>ELEGANCE</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>SOPHISTICATION</div>
              <div className={styles.paragraph}>Smooth demeanor, cultured taste, a refined presence. He elevates any setting, with natural elegance.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>POLISH</div>
              <div className={styles.paragraph}>Refined movement, sophisticated manner, and style in every gesture. A perfect balance of poise and dignity, naturally flowing.</div>
            </div>
          </div>
        </div>

        {/* 7 */}
        <div className={`${styles.content} ${styles.isHidden}`} data-content="details">
          <div className={styles.contentWrapper} data-content="details-wrapper">
            <div className={styles.contentTitleTop} data-content="text-top">
              <div className={styles.titleBig}>PASSION</div>
            </div>
            <div className={styles.contentTitleBottom} data-content="text-bottom">
              <div className={styles.titleBig}>INTENSITY</div>
            </div>
            <div className={styles.contentTextLeft} data-content="text-left">
              <div className={styles.titleSmall}>Drive</div>
              <div className={styles.paragraph}>Fierce determination, endless energy, a dynamic force. He ignites inspiration, through passionate pursuit.</div>
            </div>
            <div className={styles.contentTextRight} data-content="text-right">
              <div className={styles.titleSmall}>Enthusiasm</div>
              <div className={styles.paragraph}>Burning drive, intense focus, and fire in every pursuit. An explosive blend of energy and dedication, naturally motivating.</div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
