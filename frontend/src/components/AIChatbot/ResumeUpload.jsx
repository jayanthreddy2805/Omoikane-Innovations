"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { resumeService } from '@/services/resumeService';
import { DEMO_COMPANY_INFO } from '@/data/demoCompanyKnowledge';
import styles from './AIChatbot.module.css';

export default function ResumeUpload({ onBack, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const fileInputRef = useRef(null);

  const handleProcessFile = async (selectedFile) => {
    setError('');
    const validation = resumeService.validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');

    try {
      const parsedProfile = await resumeService.uploadAndAnalyze(selectedFile, ({ progress, label }) => {
        setProgress(progress);
        setProgressLabel(label);
      });

      setStatus('done');
      setTimeout(() => {
        onUploadSuccess(parsedProfile);
      }, 700);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to process resume.');
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleProcessFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      handleProcessFile(dropped);
    }
  };

  // Quick test demo resume without needing local file
  const handleTestWithDemoResume = () => {
    const mockFile = new File(
      ["Mock PDF binary stream containing sample candidate profile for Omoikane Innovations"], 
      "Resume_SoftwareEngineer_Demo.pdf", 
      { type: "application/pdf" }
    );
    handleProcessFile(mockFile);
  };

  return (
    <div className={styles.resumeUploadView}>
      <div className={styles.detailsBackHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back to conversation
        </button>
      </div>

      <div className={styles.uploadHeader}>
        <div className={styles.uploadIconHeader}>
          <UploadCloud size={28} className={styles.accentIcon} />
        </div>
        <h3 className={styles.uploadTitle}>Upload Your Resume</h3>
        <p className={styles.uploadSubtitle}>
          Upload your CV to simulate AI skill analysis and automatic job matching.
        </p>
      </div>

      {status === 'idle' || status === 'error' ? (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
          />
          <FileText size={40} className={styles.dropzoneIcon} />
          <p className={styles.dropzoneMainText}>
            <strong>Click to upload</strong> or drag and drop
          </p>
          <span className={styles.dropzoneMetaText}>
            PDF or DOCX (Max file size: 5 MB)
          </span>

          <button
            type="button"
            className={styles.browseBtn}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Choose File
          </button>
        </div>
      ) : (
        <div className={styles.progressContainer}>
          <div className={styles.progressFileRow}>
            <FileText size={24} className={styles.accentIcon} />
            <div className={styles.progressFileInfo}>
              <span className={styles.progressFileName}>{file?.name || "Resume_Demo.pdf"}</span>
              <span className={styles.progressFileLabel}>{progressLabel}</span>
            </div>
            <span className={styles.progressPercentage}>{progress}%</span>
          </div>

          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          {status === 'done' ? (
            <div className={styles.uploadSuccessBanner}>
              <CheckCircle2 size={18} className={styles.successIcon} />
              <span>Resume analyzed successfully! Loading profile...</span>
            </div>
          ) : (
            <div className={styles.analyzingBanner}>
              <span className={styles.pulseDot} />
              <span>Simulating AI parsing & entity extraction...</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className={styles.uploadErrorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Resume Button */}
      {status === 'idle' && (
        <div className={styles.quickDemoResumeSection}>
          <span className={styles.quickDemoDivider}>OR DEMO SHORTCUT</span>
          <button
            type="button"
            className={styles.demoResumeShortcutBtn}
            onClick={handleTestWithDemoResume}
          >
            <Sparkles size={16} /> Quick-Load Demo Candidate Resume (.PDF)
          </button>
        </div>
      )}

      {/* Privacy Notice */}
      <div className={styles.privacyNoticeCard}>
        <Shield size={16} className={styles.privacyShieldIcon} />
        <p className={styles.privacyNoticeText}>
          {DEMO_COMPANY_INFO.privacyNotice}
        </p>
      </div>
    </div>
  );
}
