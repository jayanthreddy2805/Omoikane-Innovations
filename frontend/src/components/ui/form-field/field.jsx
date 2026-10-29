// Field utility components for styled form fields
"use client";

import * as React from "react";
import styles from "./field.module.css";

export function Field({ children, className = "" }) {
  return (
    <div className={`${styles.field} ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {children}
    </label>
  );
}

export function FieldDescription({ children }) {
  return (
    <p className={styles.description}>{children}</p>
  );
}

export function FieldError({ children }) {
  return (
    <p className={styles.error}>{children}</p>
  );
}
