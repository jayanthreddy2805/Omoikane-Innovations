"use client";

import React from 'react';
import styles from './page.module.css';
import LeadershipGallery from '@/components/features/leadership/LeadershipGallery';
import LeadershipHero from '@/components/features/leadership/LeadershipHero';
import HowWeWork from '@/components/features/leadership/HowWeWork';

export default function LeadershipPage() {
  return (
    <div className={styles.pageContainer}>
      <LeadershipHero />
      
      <HowWeWork />

      <LeadershipGallery />
    </div>
  );
}
