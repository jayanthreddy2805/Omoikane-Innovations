"use client";

import React from 'react';
import styles from './page.module.css';
import LeadershipGallery from '@/components/leadership/LeadershipGallery';
import LeadershipHero from '@/components/leadership/LeadershipHero';
import HowWeWork from '@/components/leadership/HowWeWork';

export default function LeadershipPage() {
  return (
    <div className={styles.pageContainer}>
      <LeadershipHero />
      
      <HowWeWork />

      <LeadershipGallery />
    </div>
  );
}
