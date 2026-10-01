"use client";

import React from 'react';
import { MessageSquare, Briefcase, FileUp, Target, HelpCircle, Sparkles } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function WelcomeScreen({ onSelectAction }) {
  const actions = [
    {
      id: "company",
      icon: <MessageSquare size={18} className={styles.actionIcon} />,
      label: "Ask about the company",
      query: "What does the company do?"
    },
    {
      id: "careers",
      icon: <Briefcase size={18} className={styles.actionIcon} />,
      label: "Explore careers",
      query: "Explore careers"
    },
    {
      id: "resume",
      icon: <FileUp size={18} className={styles.actionIcon} />,
      label: "Upload my resume",
      action: "open_resume_upload"
    },
    {
      id: "skills",
      icon: <Target size={18} className={styles.actionIcon} />,
      label: "Find jobs for my skills",
      query: "Find jobs matching my skills"
    },
    {
      id: "job",
      icon: <HelpCircle size={18} className={styles.actionIcon} />,
      label: "Ask about a job",
      query: "Show me software engineering jobs."
    }
  ];

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeAvatar}>
          <Sparkles size={24} className={styles.welcomeSparkle} />
        </div>
        <h3 className={styles.welcomeHeading}>Hi! I'm the Company AI Assistant 👋</h3>
        <p className={styles.welcomeText}>
          I can help you explore our company, find career opportunities, understand job requirements, and even review your resume.
        </p>
      </div>

      <div className={styles.quickActionsLabel}>HOW CAN I HELP YOU TODAY?</div>

      <div className={styles.quickActionsGrid}>
        {actions.map((act) => (
          <button
            key={act.id}
            className={styles.quickActionCard}
            onClick={() => onSelectAction(act)}
          >
            <div className={styles.actionCardContent}>
              <span className={styles.actionIconContainer}>{act.icon}</span>
              <span className={styles.actionCardLabel}>{act.label}</span>
            </div>
            <span className={styles.actionCardArrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
