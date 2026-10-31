"use client";

import React, { useState, useRef } from 'react';
import SubmitButton from '@/components/common/SubmitButton';
import InternationalPhoneInput from '@/components/common/InternationalPhoneInput';
import styles from './ContactForm.module.css';

/**
 * API base URL — uses Next.js public env variable if set,
 * defaults to localhost:8080 for local development.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function ContactForm({ onSuccess }) {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [phone, setPhone] = useState('');
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMsg('');

    const form = formRef.current;
    const payload = {
      name: form.elements['cf-name'].value.trim(),
      email: form.elements['cf-email'].value.trim(),
      company: form.elements['cf-company'].value.trim() || undefined,
      phone: phone.trim() || undefined,
      message: form.elements['cf-message'].value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 201) {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else if (res.status === 429) {
        setStatus('error');
        setErrorMsg('Too many submissions. Please wait a moment and try again.');
      } else if (res.status === 400 && data?.message) {
        setStatus('error');
        setErrorMsg(data.message);
      } else {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again later.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Unable to reach the server. Please check your connection and try again.');
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit} ref={formRef}>
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

      {status === 'error' && errorMsg && (
        <p className={styles.errorMessage} role="alert">{errorMsg}</p>
      )}

      <div className={styles.submitRow}>
        <SubmitButton status={status === 'error' ? 'idle' : status} />
      </div>
    </form>
  );
}
