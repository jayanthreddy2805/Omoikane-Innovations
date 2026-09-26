"use client";

import React, { useState } from 'react';
import SubmitButton from '../common/SubmitButton';
import InternationalPhoneInput from './InternationalPhoneInput';
import styles from './ContactForm.module.css';

export default function ContactForm({ onSuccess }) {
  const [status, setStatus] = useState('idle');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate network request
    // phone will contain the E.164 formatted value e.g. +918861035848
    setTimeout(() => {
      setStatus('success');
      if (onSuccess) onSuccess();
    }, 1500);
  };



  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="cf-name" className={styles.label}>Name</label>
          <input 
            type="text" 
            id="cf-name" 
            className={styles.input} 
            placeholder="Enter name"
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="cf-email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="cf-email" 
            className={styles.input} 
            placeholder="Enter email@gmail.com"
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cf-company" className={styles.label}>Company</label>
          <input 
            type="text" 
            id="cf-company" 
            className={styles.input} 
            placeholder="Enter company"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cf-phone" className={styles.label}>Phone</label>
          <InternationalPhoneInput
            id="cf-phone"
            value={phone}
            onChange={setPhone}
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="cf-message" className={styles.label}>Message</label>
          <textarea 
            id="cf-message" 
            className={styles.textarea} 
            placeholder="Write your message..."
            rows={5}
            required 
          />
        </div>
      </div>

      <div className={styles.submitRow}>
        <SubmitButton status={status} />
      </div>
    </form>
  );
}
