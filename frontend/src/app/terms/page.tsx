import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Website Terms | Omoikane Innovations",
  description: "Terms for using the Omoikane Innovations public website.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <article className={styles.inner}>
        <header>
          <p className={styles.eyebrow}>Website information</p>
          <h1 className={styles.title}>Website Terms</h1>
          <p className={styles.lead}>
            These terms cover use of the public Omoikane Innovations website. Product sales,
            engineering work, and employment are subject to separate written arrangements.
          </p>
          <p className={styles.updated}>Updated 5 November 2026</p>
        </header>

        <div className={styles.sections}>
          <section className={styles.section}>
            <h2>Using this website</h2>
            <p>You may browse this site and contact us for legitimate enquiries. Please do not interfere with its operation, attempt unauthorised access, or use its forms to send unlawful or misleading material.</p>
          </section>

          <section className={styles.section}>
            <h2>Product and capability information</h2>
            <p>Descriptions, images, and technical information on this website are general information. Configurations, availability, suitability, and performance depend on the actual requirements and validation for a particular project. A website description is not a quotation, specification, guarantee, or offer to supply. Please discuss requirements with our team and rely on the relevant written agreement for a project.</p>
          </section>

          <section className={styles.section}>
            <h2>Information you send</h2>
            <p>Provide accurate details in enquiry and application forms. Do not submit classified information, trade secrets, or another party’s confidential material through a public form. Arrange a suitable confidential channel with us before sharing sensitive project material.</p>
            <p>Personal information submitted through the site is handled as described in our <Link href="/privacy">Privacy Notice</Link>.</p>
          </section>

          <section className={styles.section}>
            <h2>Website content</h2>
            <p>The Omoikane name, logos, text, and visual material on this site belong to their respective owners. You may view the site for your own evaluation; permission to reproduce or use its content for another purpose must be obtained from the relevant owner.</p>
          </section>

          <section className={styles.section}>
            <h2>External websites and updates</h2>
            <p>Links to other websites are provided for convenience. Their content and privacy practices are managed by their operators. We may revise this website and these terms; the updated date above will show when these terms were last changed.</p>
          </section>

          <section className={styles.section}>
            <h2>Contact</h2>
            <p>For questions about these terms or a potential project, email <a href="mailto:info@omoikaneinnovations.com">info@omoikaneinnovations.com</a>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
