"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Bot, ChevronUp } from 'lucide-react';
import ChatHeader from './ChatHeader';
import WelcomeScreen from './WelcomeScreen';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import JobDetails from './JobDetails';
import JobSearch from './JobSearch';
import ResumeUpload from './ResumeUpload';
import ResumeAnalysis from './ResumeAnalysis';
import ApplicationModal from './ApplicationModal';
import { chatService } from '@/services/chatService';
import { jobService } from '@/services/jobService';
import { DEMO_JOBS } from '@/data/demoJobs';
import styles from './AIChatbot.module.css';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeView, setActiveView] = useState('chat'); // 'chat' | 'job-details' | 'resume-upload' | 'resume-analysis' | 'application'
  const [activeJob, setActiveJob] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([
    "What does the company do?",
    "What services do you provide?",
    "Explore careers",
    "Show me software engineering jobs."
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeView === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeView]);

  const getTimestamp = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Master send message handler
  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: getTimestamp()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setActiveView('chat');

    try {
      const response = await chatService.sendMessage({
        message: text,
        history: messages,
        activeJob,
        resumeData
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: getTimestamp(),
        suggestions: response.suggestions,
        action: response.action,
        jobs: response.jobs
      };

      setMessages(prev => [...prev, botMsg]);
      if (response.suggestions) {
        setCurrentSuggestions(response.suggestions);
      }

      // Handle auto-routing actions if returned
      if (response.action === 'open_resume_upload') {
        setTimeout(() => setActiveView('resume-upload'), 500);
      } else if (response.action === 'open_apply_guidance') {
        // Will present application modal if requested
      }
    } catch (err) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I encountered an unexpected error processing your request. Please try again or reach out to bd@omoikaneinnovations.com.",
        timestamp: getTimestamp()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Welcome screen action click
  const handleWelcomeAction = (act) => {
    if (act.action === 'open_job_search') {
      setActiveView('job-search');
    } else if (act.action === 'open_resume_upload') {
      setActiveView('resume-upload');
    } else if (act.query) {
      handleSendMessage(act.query);
    }
  };

  // Open job details
  const handleViewJob = (job) => {
    setActiveJob(job);
    setActiveView('job-details');
  };

  // Apply for job
  const handleApplyJob = (job) => {
    setActiveJob(job);
    setActiveView('application');
  };

  // Ask AI about this job
  const handleAskAboutJob = (job) => {
    setActiveJob(job);
    setActiveView('chat');
    handleSendMessage(`What skills are required for ${job.title}?`);
  };

  // Resume upload complete
  const handleResumeSuccess = (parsedProfile) => {
    setResumeData(parsedProfile);
    setActiveView('resume-analysis');

    const botMsg = {
      id: `bot-upload-${Date.now()}`,
      sender: 'bot',
      text: `Resume analyzed successfully! I have parsed your profile from ${parsedProfile.fileName}. You can view your skills breakdown, explore suggested areas, or match your background against our open engineering roles.`,
      timestamp: getTimestamp(),
      suggestions: [
        "Find jobs matching my resume",
        "What are my strongest skills?",
        "What skills am I missing for Software Engineer?"
      ]
    };
    setMessages(prev => [...prev, botMsg]);
    setCurrentSuggestions(botMsg.suggestions);
  };

  // Find matching jobs
  const handleFindMatchingJobs = () => {
    setActiveView('chat');
    handleSendMessage("Find jobs matching my resume");
  };

  // Reset conversation
  const handleResetConversation = () => {
    setMessages([]);
    setActiveJob(null);
    setActiveView('chat');
    setCurrentSuggestions([
      "What does the company do?",
      "What services do you provide?",
      "Explore careers",
      "Show me software engineering jobs."
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button Fixed Bottom-Right */}
      {!isOpen && (
        <motion.button
          className={styles.floatingTrigger}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open Company AI Assistant"
        >
          <div className={styles.triggerContent}>
            <span className={styles.triggerPulseRing} />
            <div className={styles.triggerIconBadge}>
              <Bot size={20} className={styles.triggerBotIcon} />
              <Sparkles size={12} className={styles.triggerSparkle} />
            </div>
            <span className={styles.triggerLabel}>AI Assistant</span>
          </div>
          <span className={styles.triggerOnlineBadge}>●</span>
        </motion.button>
      )}

      {/* Main Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${styles.assistantPanel} ${isMinimized ? styles.panelMinimized : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '640px' 
            }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header always visible */}
            <ChatHeader
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(prev => !prev)}
              onClose={() => setIsOpen(false)}
              onReset={handleResetConversation}
            />

            {/* Panel Body (Hidden when Minimized) */}
            {!isMinimized && (
              <div className={styles.panelContentArea}>
                {/* 0. Dedicated Job Search View */}
                {activeView === 'job-search' && (
                  <JobSearch
                    resumeData={resumeData}
                    onBack={() => setActiveView('chat')}
                    onViewJob={handleViewJob}
                    onApplyJob={handleApplyJob}
                    onAskAboutJob={handleAskAboutJob}
                  />
                )}

                {/* 1. Job Details View */}
                {activeView === 'job-details' && (
                  <JobDetails
                    job={activeJob}
                    onBack={() => setActiveView('chat')}
                    onApply={handleApplyJob}
                    onAskAboutJob={handleAskAboutJob}
                  />
                )}

                {/* 2. Resume Upload View */}
                {activeView === 'resume-upload' && (
                  <ResumeUpload
                    onBack={() => setActiveView('chat')}
                    onUploadSuccess={handleResumeSuccess}
                  />
                )}

                {/* 3. Resume Analysis View */}
                {activeView === 'resume-analysis' && (
                  <ResumeAnalysis
                    resumeData={resumeData}
                    onBack={() => setActiveView('chat')}
                    onFindMatchingJobs={handleFindMatchingJobs}
                    onAskAboutResume={(query) => {
                      setActiveView('chat');
                      handleSendMessage(query);
                    }}
                  />
                )}

                {/* 4. Application Flow Modal */}
                {activeView === 'application' && (
                  <ApplicationModal
                    job={activeJob}
                    resumeData={resumeData}
                    onBack={() => setActiveView('chat')}
                    onComplete={() => setActiveView('chat')}
                  />
                )}

                {/* 5. Standard Chat Feed */}
                {activeView === 'chat' && (
                  <div className={styles.chatFeedContainer}>
                    <div className={styles.chatScrollArea}>
                      {messages.length === 0 ? (
                        <WelcomeScreen onSelectAction={handleWelcomeAction} />
                      ) : (
                        <div className={styles.messagesList}>
                          {messages.map((msg) => (
                            <ChatMessage
                              key={msg.id}
                              message={msg}
                              onViewJob={handleViewJob}
                              onApplyJob={handleApplyJob}
                              onAskAboutJob={handleAskAboutJob}
                              onOpenResumeUpload={() => setActiveView('resume-upload')}
                              onSelectAction={(actionItem) => {
                                if (actionItem.query) handleSendMessage(actionItem.query);
                              }}
                            />
                          ))}

                          {/* Typing Indicator */}
                          {isTyping && (
                            <div className={`${styles.messageRow} ${styles.botRow}`}>
                              <div className={styles.msgAvatarWrapper}>
                                <div className={styles.botMsgAvatar}>
                                  <Bot size={16} />
                                </div>
                              </div>
                              <div className={styles.typingIndicatorWrapper}>
                                <span className={styles.typingDot} />
                                <span className={styles.typingDot} />
                                <span className={styles.typingDot} />
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Area (Suggestions + Input) */}
                    <div className={styles.chatFooterFixed}>
                      <SuggestedQuestions
                        suggestions={currentSuggestions}
                        onSelect={handleSendMessage}
                      />
                      <ChatInput
                        onSendMessage={handleSendMessage}
                        onOpenResumeUpload={() => setActiveView('resume-upload')}
                        disabled={isTyping}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
