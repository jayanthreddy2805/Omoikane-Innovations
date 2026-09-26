"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SubmitButton from '../common/SubmitButton';
import InternationalPhoneInput from './InternationalPhoneInput';
import CustomSelect from './CustomSelect';
import FileUpload from './FileUpload';
import styles from './ApplyForm.module.css';

const ROLES_BY_DEPT = {
  software: [
    { id: 'web-dev', label: 'Web Developer' },
    { id: 'python-dev', label: 'Python Developer' },
    { id: 'ai-dev', label: 'AI Developer' },
    { id: 'firmware-eng', label: 'Embedded Firmware' },
    { id: 'other', label: 'Other' }
  ],
  mechanical: [
    { id: 'mech-design', label: '3D & 2D Mechanical Design' },
    { id: 'mech-assembly', label: 'Mechanical Assembly & Integration' },
    { id: 'struct-therm', label: 'Structural & Thermal Analysis' },
    { id: 'prod-eng', label: 'Product Engineering' },
    { id: 'other', label: 'Other' }
  ],
  electronics: [
    { id: 'hardware-eng', label: 'Hardware System Design' },
    { id: 'pcb-eng', label: 'PCB Layout & Routing' },
    { id: 'rf-eng', label: 'RF & Communications' },
    { id: 'test-eng', label: 'Testing & Integration' },
    { id: 'other', label: 'Other' }
  ]
};

const DEFAULT_ROLES = [
  ...ROLES_BY_DEPT.software.filter(r => r.id !== 'other'),
  ...ROLES_BY_DEPT.mechanical.filter(r => r.id !== 'other'),
  ...ROLES_BY_DEPT.electronics
];

export default function ApplyForm({ onSuccess }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('idle');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('other');
  const [availableRoles, setAvailableRoles] = useState(DEFAULT_ROLES);

  useEffect(() => {
    const urlDept = searchParams.get('dept');
    const urlRole = searchParams.get('role');
    
    let currentRoles = DEFAULT_ROLES;
    if (urlDept && ROLES_BY_DEPT[urlDept]) {
      currentRoles = ROLES_BY_DEPT[urlDept];
      setAvailableRoles(currentRoles);
    } else {
      setAvailableRoles(DEFAULT_ROLES);
    }

    if (urlRole) {
      const match = currentRoles.find(r => r.id === urlRole);
      if (match) {
        setRole(match.id);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="af-name" className={styles.label}>Name</label>
          <input 
            type="text" 
            id="af-name" 
            className={styles.input} 
            placeholder="Enter name"
            required 
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="af-email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="af-email" 
            className={styles.input} 
            placeholder="Enter email@gmail.com"
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="af-phone" className={styles.label}>Phone</label>
          <InternationalPhoneInput
            id="af-phone"
            value={phone}
            onChange={setPhone}
            variant="line"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Applying For</label>
          <div className={styles.selectWrapper}>
            <CustomSelect 
              options={availableRoles}
              value={role}
              onChange={setRole}
              placeholder="Select Role"
            />
          </div>
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <FileUpload id="af-cv" required />
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label htmlFor="af-message" className={styles.label}>Cover Letter / Message</label>
          <textarea 
            id="af-message" 
            className={styles.textarea} 
            placeholder="Tell us why you'd be a great fit..."
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
