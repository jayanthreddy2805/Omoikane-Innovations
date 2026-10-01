"use client";

import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Briefcase, GraduationCap, FolderGit2, Sparkles, Target } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function ResumeAnalysis({
  resumeData,
  onBack,
  onFindMatchingJobs,
  onAskAboutResume
}) {
  if (!resumeData) return null;

  return (
    <div className={styles.resumeAnalysisView}>
      <div className={styles.detailsBackHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back to conversation
        </button>
        <span className={styles.demoTagSmall}>DEMO ANALYSIS</span>
      </div>

      <div className={styles.analysisHeader}>
        <div className={styles.candidateBadge}>
          <Sparkles size={18} className={styles.sparkleIcon} />
          <h3>Candidate Profile</h3>
        </div>
        <p className={styles.candidateMeta}>
          File: <strong>{resumeData.fileName}</strong> ({resumeData.fileSize})
        </p>
      </div>

      {/* Primary Action Button */}
      <div className={styles.analysisMainCtaWrapper}>
        <button
          className={styles.findMatchPrimaryBtn}
          onClick={onFindMatchingJobs}
        >
          <Target size={18} /> Find jobs matching my resume →
        </button>
      </div>

      <div className={styles.analysisCard}>
        <h4 className={styles.analysisSectionTitle}>
          <CheckCircle2 size={16} className={styles.accentIcon} /> Extracted Technical Skills
        </h4>
        <div className={styles.skillsTagRow}>
          {resumeData.skills.map((skill, i) => (
            <span key={i} className={styles.skillTagPrimary}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className={styles.insightsCard}>
        <h4 className={styles.analysisSectionTitle}>
          <Sparkles size={16} className={styles.accentIcon} /> Resume Insights
        </h4>

        <div className={styles.insightGroup}>
          <span className={styles.insightLabel}>Strong Skills:</span>
          <div className={styles.skillsTagRow}>
            {resumeData.insights.strongSkills.map((sk, i) => (
              <span key={i} className={styles.matchedTag}>✓ {sk}</span>
            ))}
          </div>
        </div>

        <div className={styles.insightGroup}>
          <span className={styles.insightLabel}>Suggested Skills to Polish:</span>
          <div className={styles.skillsTagRow}>
            {resumeData.insights.suggestedSkills.map((sk, i) => (
              <span key={i} className={styles.improveTag}>• {sk}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Education & Experience */}
      <div className={styles.analysisCard}>
        <h4 className={styles.analysisSectionTitle}>
          <GraduationCap size={16} className={styles.accentIcon} /> Education
        </h4>
        {resumeData.education.map((edu, i) => (
          <div key={i} className={styles.profileItem}>
            <strong>{edu.degree}</strong>
            <span className={styles.profileItemSub}>{edu.institution} • {edu.grade} ({edu.year})</span>
          </div>
        ))}
      </div>

      <div className={styles.analysisCard}>
        <h4 className={styles.analysisSectionTitle}>
          <Briefcase size={16} className={styles.accentIcon} /> Experience
        </h4>
        {resumeData.experience.map((exp, i) => (
          <div key={i} className={styles.profileItem}>
            <strong>{exp.role} — {exp.organization}</strong>
            <span className={styles.profileItemSub}>{exp.duration}</span>
            <p className={styles.profileItemDesc}>{exp.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.analysisCard}>
        <h4 className={styles.analysisSectionTitle}>
          <FolderGit2 size={16} className={styles.accentIcon} /> Key Projects
        </h4>
        {resumeData.projects.map((proj, i) => (
          <div key={i} className={styles.profileItem}>
            <strong>{proj.title}</strong>
            <div className={styles.skillsTagRow}>
              {proj.technologies.map((t, idx) => (
                <span key={idx} className={styles.skillTagSmall}>{t}</span>
              ))}
            </div>
            <p className={styles.profileItemDesc}>{proj.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.resumeQuestionsSection}>
        <span className={styles.quickActionsLabel}>ASK ABOUT YOUR RESUME:</span>
        <div className={styles.quickQuestionsRow}>
          <button
            className={styles.quickResumeQBtn}
            onClick={() => onAskAboutResume("What are my strongest skills?")}
          >
            What are my strongest skills?
          </button>
          <button
            className={styles.quickResumeQBtn}
            onClick={() => onAskAboutResume("What skills am I missing for this job?")}
          >
            What skills am I missing?
          </button>
          <button
            className={styles.quickResumeQBtn}
            onClick={() => onAskAboutResume("Am I qualified for this job?")}
          >
            Am I qualified for this job?
          </button>
        </div>
      </div>
    </div>
  );
}
