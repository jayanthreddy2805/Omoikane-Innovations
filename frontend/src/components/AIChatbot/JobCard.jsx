"use client";

import React from 'react';
import { MapPin, Briefcase, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function JobCard({ job, onViewDetails, onApply, onAskAboutJob }) {
  const match = job.match;

  return (
    <div className={styles.jobCard}>
      <div className={styles.jobCardHeader}>
        <div>
          <h4 className={styles.jobCardTitle}>{job.title}</h4>
          <span className={styles.jobDepartment}>{job.department}</span>
        </div>
        {match && (
          <div className={`${styles.matchBadge} ${match.isHighMatch ? styles.highMatch : styles.medMatch}`}>
            <span className={styles.matchScore}>{match.matchPercentage}%</span>
            <span className={styles.matchLabel}>Match</span>
          </div>
        )}
      </div>

      <div className={styles.jobMetaRow}>
        <span className={styles.jobMetaItem}>
          <MapPin size={13} /> {job.location}
        </span>
        <span className={styles.jobMetaItem}>
          <Briefcase size={13} /> {job.experience}
        </span>
        <span className={styles.jobMetaType}>{job.employmentType}</span>
      </div>

      <p className={styles.jobShortDesc}>{job.shortDescription}</p>

      {/* Matched / Missing skills if resume uploaded */}
      {match ? (
        <div className={styles.matchSkillsContainer}>
          <div className={styles.skillListGroup}>
            <span className={styles.skillGroupTitle}>
              <CheckCircle2 size={13} className={styles.matchedIcon} /> Matched Skills:
            </span>
            <div className={styles.skillsTagRow}>
              {match.matchedSkills.map((sk, i) => (
                <span key={i} className={styles.matchedTag}>✓ {sk}</span>
              ))}
            </div>
          </div>

          {match.skillsToImprove && match.skillsToImprove.length > 0 && (
            <div className={styles.skillListGroup}>
              <span className={styles.skillGroupTitle}>
                <AlertCircle size={13} className={styles.improveIcon} /> Skills to improve:
              </span>
              <div className={styles.skillsTagRow}>
                {match.skillsToImprove.map((sk, i) => (
                  <span key={i} className={styles.improveTag}>• {sk}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.skillsTagRow}>
          {job.requiredSkills.map((sk, i) => (
            <span key={i} className={styles.skillTag}>{sk}</span>
          ))}
        </div>
      )}

      <div className={styles.jobCardActions}>
        <button
          className={styles.jobViewBtn}
          onClick={() => onViewDetails(job)}
        >
          View Job
        </button>
        <button
          className={styles.jobApplyBtn}
          onClick={() => onApply(job)}
        >
          Apply <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
