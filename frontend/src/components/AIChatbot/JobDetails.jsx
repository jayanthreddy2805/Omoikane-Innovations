"use client";

import React from 'react';
import { ArrowLeft, MapPin, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function JobDetails({ job, onBack, onApply, onAskAboutJob }) {
  if (!job) return null;

  return (
    <div className={styles.jobDetailsView}>
      <div className={styles.detailsBackHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back to conversation
        </button>
      </div>

      <div className={styles.detailsHeader}>
        <span className={styles.detailsDept}>{job.department}</span>
        <h3 className={styles.detailsTitle}>{job.title}</h3>
        <div className={styles.detailsMeta}>
          <span><MapPin size={14} /> {job.location}</span>
          <span><Briefcase size={14} /> {job.experience}</span>
          <span>{job.employmentType} ({job.workplaceType})</span>
        </div>
      </div>

      <div className={styles.detailsActionBanner}>
        <button 
          className={styles.askAiJobBtn}
          onClick={() => onAskAboutJob(job)}
        >
          <Sparkles size={16} /> Ask AI about this job
        </button>
        <button 
          className={styles.applyNowBtn}
          onClick={() => onApply(job)}
        >
          Apply now →
        </button>
      </div>

      <div className={styles.detailsBody}>
        <div className={styles.detailsSection}>
          <h4>About the Role</h4>
          <p>{job.overview}</p>
        </div>

        <div className={styles.detailsSection}>
          <h4>Key Responsibilities</h4>
          <ul className={styles.detailsList}>
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div className={styles.detailsSection}>
          <h4>Required Skills</h4>
          <div className={styles.skillsTagRow}>
            {job.requiredSkills.map((sk, i) => (
              <span key={i} className={styles.skillTagPrimary}>{sk}</span>
            ))}
          </div>
        </div>

        {job.preferredSkills && job.preferredSkills.length > 0 && (
          <div className={styles.detailsSection}>
            <h4>Preferred Skills</h4>
            <div className={styles.skillsTagRow}>
              {job.preferredSkills.map((sk, i) => (
                <span key={i} className={styles.skillTag}>{sk}</span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.detailsSection}>
          <h4>Qualifications</h4>
          <ul className={styles.detailsList}>
            {job.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
