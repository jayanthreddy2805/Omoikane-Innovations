"use client";

import React from 'react';
import styles from './page.module.css';
import LeadershipGallery from '@/components/leadership/LeadershipGallery';
import LeadershipHero from '@/components/leadership/LeadershipHero';

export default function LeadershipPage() {
  return (
    <div className={styles.pageContainer}>
      <LeadershipHero />
      
      <LeadershipGallery />
    </div>
  );
}
