"use client";

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Send, Briefcase, User, Mail, Phone, FileText } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function ApplicationModal({ job, resumeData, onBack, onComplete }) {
  const [fullName, setFullName] = useState(resumeData?.candidateName || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('form'); // 'form' | 'submitting' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <div className={styles.applyModalView}>
      <div className={styles.detailsBackHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        <span className={styles.demoTagSmall}>DEMO APPLICATION</span>
      </div>

      {/* 5-Step Process Roadmap */}
      <div className={styles.applyRoadmap}>
        <div className={styles.roadmapHeader}>APPLICATION ROADMAP</div>
        <div className={styles.roadmapSteps}>
          <div className={`${styles.stepItem} ${styles.stepDone}`}>1. Select Job</div>
          <div className={`${styles.stepItem} ${styles.stepDone}`}>2. Review Specs</div>
          <div className={`${styles.stepItem} ${resumeData ? styles.stepDone : styles.stepActive}`}>3. Upload Resume</div>
          <div className={`${styles.stepItem} ${styles.stepActive}`}>4. Complete Form</div>
          <div className={styles.stepItem}>5. Submit Application</div>
        </div>
      </div>

      {status === 'success' ? (
        <div className={styles.applySuccessCard}>
          <div className={styles.successIconWrapper}>
            <CheckCircle size={44} className={styles.successIconLarge} />
          </div>
          <h3 className={styles.applySuccessTitle}>Application Submitted!</h3>
          <p className={styles.applySuccessDesc}>
            Thank you for applying for <strong>{job?.title || "Software Engineer"}</strong> at Omoikane Innovations.
          </p>
          <div className={styles.demoNoticeBox}>
            <strong>Management Prototype Notice:</strong> In production, applications are forwarded to the recruitment portal and recorded in the applicant tracking system (ATS).
          </div>
          <button className={styles.applyDoneBtn} onClick={onComplete}>
            Return to Assistant
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.applyForm}>
          <div className={styles.applyRoleSummary}>
            <Briefcase size={18} className={styles.accentIcon} />
            <div>
              <strong>Target Position: {job?.title || "Software Engineer"}</strong>
              <span>Location: {job?.location || "Bengaluru"} • {job?.employmentType || "Full-time"}</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              type="text"
              required
              className={styles.formInput}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address *</label>
            <input
              type="email"
              required
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aditi@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <input
              type="tel"
              className={styles.formInput}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Attached Resume</label>
            <div className={styles.attachedResumeCard}>
              <FileText size={16} className={styles.accentIcon} />
              <span>{resumeData ? resumeData.fileName : "Demo_Resume_Extracted.pdf"}</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Note to Hiring Team (Optional)</label>
            <textarea
              rows={2}
              className={styles.formTextarea}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us briefly about your technical interests and projects..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className={styles.submitAppBtn}
          >
            {status === 'submitting' ? 'Submitting Application...' : 'Submit Application →'}
          </button>
        </form>
      )}
    </div>
  );
}
