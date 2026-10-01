"use client";

import React from 'react';
import { Bot, User, CheckCircle, ExternalLink, ArrowRight, ShieldAlert } from 'lucide-react';
import JobCard from './JobCard';
import { DEMO_COMPANY_INFO } from '@/data/demoCompanyKnowledge';
import styles from './AIChatbot.module.css';

export default function ChatMessage({
  message,
  onViewJob,
  onApplyJob,
  onAskAboutJob,
  onOpenResumeUpload,
  onSelectAction
}) {
  const isBot = message.sender === 'bot';

  // Format message text with clean paragraphs and bullets
  const formatText = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className={styles.msgBullet}>
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      if (line.trim().match(/^[0-9]+\./)) {
        return (
          <div key={idx} className={styles.msgNumberedItem}>
            {line.trim()}
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className={styles.msgSpacer} />;
      }
      return <p key={idx} className={styles.msgParagraph}>{line}</p>;
    });
  };

  return (
    <div className={`${styles.messageRow} ${isBot ? styles.botRow : styles.userRow}`}>
      <div className={styles.msgAvatarWrapper}>
        {isBot ? (
          <div className={styles.botMsgAvatar}>
            <Bot size={16} />
          </div>
        ) : (
          <div className={styles.userMsgAvatar}>
            <User size={16} />
          </div>
        )}
      </div>

      <div className={styles.msgContentWrapper}>
        <div className={`${styles.msgBubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
          <div className={styles.msgText}>{formatText(message.text)}</div>

          {/* Embedded Services Grid if action is show_services */}
          {message.action === 'show_services' && (
            <div className={styles.embeddedServicesGrid}>
              {DEMO_COMPANY_INFO.services.map((svc) => (
                <div key={svc.id} className={styles.embeddedServiceCard}>
                  <h5 className={styles.serviceCardTitle}>{svc.title}</h5>
                  <p className={styles.serviceCardDesc}>{svc.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Embedded Careers Navigation Menu if action is show_careers_menu */}
          {message.action === 'show_careers_menu' && (
            <div className={styles.embeddedCareersMenu}>
              <button 
                className={styles.careerMenuBtn}
                onClick={() => onSelectAction({ query: "Show me all jobs" })}
              >
                🔎 Find jobs
              </button>
              <button 
                className={styles.careerMenuBtn}
                onClick={() => onSelectAction({ query: "Jobs matching my skills" })}
              >
                🎯 Jobs matching my skills
              </button>
              <button 
                className={styles.careerMenuBtn}
                onClick={onOpenResumeUpload}
              >
                📄 Upload resume
              </button>
              <button 
                className={styles.careerMenuBtn}
                onClick={() => onSelectAction({ query: "Do you have jobs in Bengaluru?" })}
              >
                📍 Jobs in Bengaluru
              </button>
              <button 
                className={styles.careerMenuBtn}
                onClick={() => onSelectAction({ query: "Do you have jobs in Hyderabad?" })}
              >
                📍 Jobs in Hyderabad
              </button>
            </div>
          )}

          {/* Embedded Job Cards List if jobs array is provided */}
          {message.jobs && message.jobs.length > 0 && (
            <div className={styles.embeddedJobsList}>
              {message.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={onViewJob}
                  onApply={onApplyJob}
                  onAskAboutJob={onAskAboutJob}
                />
              ))}
            </div>
          )}

          <div className={styles.msgMeta}>
            <span className={styles.msgTimestamp}>{message.timestamp}</span>
            {isBot && (
              <span className={styles.groundedTag}>
                ✓ Grounded Demo Knowledge
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
