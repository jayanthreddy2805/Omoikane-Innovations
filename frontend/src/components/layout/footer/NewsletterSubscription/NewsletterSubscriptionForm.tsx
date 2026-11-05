"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import styles from "./NewsletterSubscriptionForm.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8080" : null);

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function NewsletterSubscriptionForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  if (!API_BASE_URL) {
    return (
      <p className={styles.privacyNote}>
        To request company updates, email <a href="mailto:info@omoikaneinnovations.com?subject=Company%20updates%20request">our team</a>.
        Please say that you agree to receive them. Read our <Link href="/privacy">Privacy Notice</Link>.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const consent = formData.get("consent") === "on";

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        setStatus("success");
        setMessage(data?.message || "You are subscribed to company updates.");
        form.reset();
        return;
      }

      setStatus("error");
      if (response.status === 429) {
        setMessage("Too many attempts. Please wait a moment and try again.");
      } else if (response.status === 400 && data?.message) {
        setMessage(data.message);
      } else {
        setMessage("We could not save your subscription. Please try again later.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to reach the server. Please try again later.");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Subscribe to company updates">
      <div className={styles.inputRow}>
        <label className={styles.srOnly} htmlFor="footer-subscription-email">
          Email address
        </label>
        <input
          className={styles.emailInput}
          id="footer-subscription-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={255}
          placeholder="Email address"
          required
        />
        <button className={styles.submitButton} type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving…" : "Subscribe"}
        </button>
      </div>

      <label className={styles.consent}>
        <input name="consent" type="checkbox" required />
        <span>I agree to receive product and company updates by email.</span>
      </label>
      <p className={styles.privacyNote}>Read our <Link href="/privacy">Privacy Notice</Link>.</p>

      {message && (
        <p
          className={status === "error" ? styles.errorMessage : styles.successMessage}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
