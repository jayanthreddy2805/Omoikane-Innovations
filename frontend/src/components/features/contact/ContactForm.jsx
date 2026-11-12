"use client";

import React, { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SubmitButton from '@/components/shared/SubmitButton';
import InternationalPhoneInput from '@/components/shared/InternationalPhoneInput';
import styles from './ContactForm.module.css';

/**
 * API base URL — uses Next.js public env variable if set,
 * defaults to localhost:8080 for local development.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null);

export default function ContactForm({ onSuccess }) {
  const searchParams = useSearchParams();
  const enquirySubject = searchParams.get('subject')?.trim().slice(0, 120) || '';
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [phone, setPhone] = useState('');
  const formRef = useRef(null);

  if (!API_BASE_URL) {
    return (
      <div id="contact-form" className={styles.formUnavailable}>
        <h2>Contact our team</h2>
        <p>The online enquiry form is unavailable at the moment. Please email your enquiry directly.</p>
        <a href={`mailto:info@omoikaneinnovations.com?subject=${encodeURIComponent(enquirySubject || 'Website enquiry')}`}>
          Email Omoikane <span aria-hidden="true">→</span>
        </a>
        <p>See how we handle enquiries in our <Link href="/privacy">Privacy Notice</Link>.</p>
      </div>
    );
  }

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
      message: `${enquirySubject ? `[Enquiry: ${enquirySubject}]\n` : ''}${form.elements['cf-message'].value.trim()}`,
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
      } else if ((res.status === 400 || res.status === 409) && data?.message) {
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
    <form id="contact-form" aria-label="Contact Omoikane" tabIndex={-1} className={styles.formContainer} onSubmit={handleSubmit} ref={formRef}>
      {enquirySubject && <p className={styles.enquirySubject}>Enquiry about <strong>{enquirySubject}</strong></p>}
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="cf-name" className={styles.label}>Name</label>
          <input 
            type="text" 
            id="cf-name" 
            className={styles.input} 
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="cf-email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="cf-email" 
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cf-company" className={styles.label}>Company</label>
          <input 
            type="text" 
            id="cf-company" 
            className={styles.input} 
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

      <p className={styles.formNotice}>We use your details to review and respond to your enquiry. Read our <Link href="/privacy">Privacy Notice</Link>.</p>

      {status === 'error' && errorMsg && (
        <p className={styles.errorMessage} role="alert">{errorMsg}</p>
      )}

      <div className={styles.submitRow}>
        <SubmitButton status={status === 'error' ? 'idle' : status} />
      </div>
    </form>
  );
}
