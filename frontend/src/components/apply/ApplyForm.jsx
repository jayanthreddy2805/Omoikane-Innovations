"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import SubmitButton from '@/components/common/SubmitButton';
import InternationalPhoneInput from '@/components/common/InternationalPhoneInput';
import CustomSelect from '@/components/common/CustomSelect';
import FileUpload from '@/components/common/FileUpload';
import styles from './ApplyForm.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

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
  const [errorMsg, setErrorMsg] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('other');
  const [department, setDepartment] = useState('');
  const [availableRoles, setAvailableRoles] = useState(DEFAULT_ROLES);
  const [resumeFile, setResumeFile] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const urlDept = searchParams.get('dept');
    const urlRole = searchParams.get('role');

    let currentRoles = DEFAULT_ROLES;
    if (urlDept && ROLES_BY_DEPT[urlDept]) {
      setDepartment(urlDept);
      currentRoles = ROLES_BY_DEPT[urlDept];
      setAvailableRoles(currentRoles);
    } else {
      setAvailableRoles(DEFAULT_ROLES);
    }

    if (urlRole) {
      const match = currentRoles.find(r => r.id === urlRole);
      if (match) {
        setRole(match.id);
        // If department was not in url, infer from match
        if (!urlDept) {
          for (const [d, rolesList] of Object.entries(ROLES_BY_DEPT)) {
            if (rolesList.some(r => r.id === match.id)) {
              setDepartment(d);
              break;
            }
          }
        }
      }
    }
  }, [searchParams]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    // Automatically infer department if not already selected
    for (const [deptKey, rolesList] of Object.entries(ROLES_BY_DEPT)) {
      if (rolesList.some(r => r.id === selectedRole)) {
        setDepartment(deptKey);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'submitting') return;

    if (!resumeFile) {
      setStatus('error');
      setErrorMsg('Please upload your resume before submitting.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const form = formRef.current;
    const nameVal = form.elements['af-name']?.value?.trim() || '';
    const emailVal = form.elements['af-email']?.value?.trim() || '';
    const messageVal = form.elements['af-message']?.value?.trim() || '';

    // Determine current role title
    const selectedOption = availableRoles.find(r => r.id === role);
    const roleTitle = selectedOption ? selectedOption.label : role;

    // Determine department
    let currentDept = department;
    if (!currentDept) {
      for (const [d, rolesList] of Object.entries(ROLES_BY_DEPT)) {
        if (rolesList.some(r => r.id === role)) {
          currentDept = d;
          break;
        }
      }
    }

    const formData = new FormData();
    formData.append('name', nameVal);
    formData.append('email', emailVal);
    if (phone.trim()) {
      formData.append('phone', phone.trim());
    }
    formData.append('department', currentDept || 'software');
    formData.append('role', role);
    formData.append('roleTitle', roleTitle);
    formData.append('message', messageVal);
    formData.append('resume', resumeFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/careers/apply`, {
        method: 'POST',
        // Do not set Content-Type header so browser sets multipart boundary
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (res.status === 201) {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else if (res.status === 429) {
        setStatus('error');
        setErrorMsg('Too many submissions. Please wait a moment and try again.');
      } else if (res.status === 413) {
        setStatus('error');
        setErrorMsg('File exceeds maximum size of 5 MB.');
      } else if (data?.message) {
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
              onChange={handleRoleChange}
              placeholder="Select Role"
            />
          </div>
        </div>

        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <FileUpload
            id="af-cv"
            required
            file={resumeFile}
            onChange={setResumeFile}
          />
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

      {status === 'error' && errorMsg && (
        <p className={styles.errorMessage} role="alert">{errorMsg}</p>
      )}

      <div className={styles.submitRow}>
        <SubmitButton status={status === 'error' ? 'idle' : status} />
      </div>
    </form>
  );
}
