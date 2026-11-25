"use client";
import { useRef } from 'react';
import useDecorativeEffect from '@/hooks/useDecorativeEffect';
import styles from './CallToAction.module.css';
export default function DeferredCTAEffects() {
  const ref = useRef(null);
  const active = useDecorativeEffect(ref);
  return <div ref={ref} aria-hidden="true" className={styles.gradientEffect} style={{animationPlayState:active?'running':'paused'}} />;
}
