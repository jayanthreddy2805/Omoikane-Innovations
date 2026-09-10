"use client";

import { Check } from "lucide-react";
import styles from "./SubmitButton.module.css";

export default function SubmitButton({ status = "idle" }) {
  return (
    <button
      type="submit"
      className={`${styles.button} ${styles[status]}`}
      disabled={status === "submitting" || status === "success"}
    >
      <span className={styles.content}>
        {status === "submitting" ? (
          <span className={styles.text}>SENDING...</span>
        ) : status === "success" ? (
          <>
            <span className={styles.text}>APPLICATION SENT</span>
            <Check size={16} strokeWidth={3} className={styles.checkIcon} />
          </>
        ) : (
          <>
            <span className={styles.text}>SEND APPLICATION</span>
            <span className={styles.arrowWrapper}>
              <span className={styles.arrow}>&rarr;</span>
            </span>
          </>
        )}
      </span>
    </button>
  );
}
