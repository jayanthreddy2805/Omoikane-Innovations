import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Notice | Omoikane Innovations",
  description: "How Omoikane Innovations handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <article className={styles.inner}>
        <header>
          <p className={styles.eyebrow}>Website information</p>
          <h1 className={styles.title}>Privacy Notice</h1>
          <p className={styles.lead}>
            This notice explains what Omoikane Innovations collects when you use this website,
            why we use it, and how to contact us about your information.
          </p>
          <p className={styles.updated}>Updated 5 November 2026</p>
        </header>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2>Information you give us</h2>
            <ul>
              <li>Contact enquiries: your name, email, optional company and phone, and your message.</li>
              <li>Job applications: your name, email, optional phone, selected role, message, and uploaded CV or resume.</li>
              <li>Company updates: the email you use to request updates and, when you use the online subscription form, the time you agreed to receive them.</li>
            </ul>
            <p>Contact and subscription submissions also record the originating IP address for operational and security purposes.</p>
          </section>

          <section className={styles.section}>
            <h2>How we use it</h2>
            <p>We use enquiry details to review and respond to your request, application details to assess your interest in a role and contact you, and subscription details to manage your choice to receive company updates. We may use submission records to protect the forms from misuse and avoid duplicate submissions.</p>
            <p>Submitting an enquiry or job application does not sign you up for company updates. The subscription form asks for separate consent.</p>
          </section>

          <section className={styles.section}>
            <h2>Cookies and analytics</h2>
            <p>We save your cookie choice in an essential cookie for up to 180 days. Optional Vercel Web Analytics is off until you allow it. If enabled, it helps us understand aggregate visits; the website removes query strings and fragments from page URLs sent to analytics. We do not currently enable a separate marketing cookie category.</p>
            <p>You can change your choice at any time using “Cookie settings” in the footer.</p>
          </section>

          <section className={styles.section}>
            <h2>Service providers and storage</h2>
            <p>The website uses hosting and database services to operate. If email delivery is configured, an email provider processes the details needed to send confirmations and internal notifications; an application notification may include your uploaded resume. Access to submitted records is restricted to authorised administrators.</p>
            <p>There is no automatic deletion deadline configured for form records. If you want us to review or delete information you submitted, contact us using the address below. We will assess the request alongside any recordkeeping needs.</p>
          </section>

          <section className={styles.section}>
            <h2>Your choices and requests</h2>
            <p>You can ask about information you submitted, request a correction or deletion, or withdraw your company-update subscription by emailing <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>. Company-update emails may also include an unsubscribe link when sending is enabled.</p>
          </section>

          <section className={styles.section}>
            <h2>Changes and contact</h2>
            <p>We may update this notice as the website and its services change. The updated date above will show when this text was last revised. For questions about this notice or our handling of your information, email <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>. See also our <Link href="/terms">Website Terms</Link>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
