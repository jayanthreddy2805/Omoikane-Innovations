import { pageMetadata } from "@/lib/siteMetadata";
import Link from "next/link";
import { ArrowUpRight, Code2, Cog, Cpu } from "lucide-react";
import styles from "./page.module.css";

export const metadata = pageMetadata(
  "/careers",
  "Careers | Omoikane Innovations",
  "Explore software, mechanical and electrical engineering careers at Omoikane Innovations."
);

const DEPARTMENTS = [
  { slug: "software", name: "Software Development", Icon: Code2 },
  { slug: "mechanical", name: "Mechanical Engineering", Icon: Cog },
  { slug: "electronics", name: "Electrical Engineering", Icon: Cpu },
];

export default function CareersPage() {
  return (
    <section className={styles.page} aria-labelledby="careers-heading">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Careers</p>
          <h1 id="careers-heading" className={styles.heading} data-client-hero-heading>Careers at Omoikane</h1>
          <p className={styles.lead}>Explore our engineering departments and apply for a role.</p>
        </header>

        <ul className={styles.departments} aria-label="Engineering departments">
          {DEPARTMENTS.map(({ slug, name, Icon }) => (
            <li key={slug} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.icon} aria-hidden="true"><Icon size={24} strokeWidth={1.7} /></span>
                <h2><Link href={`/careers/${slug}`} className={styles.nameLink}>{name}</Link></h2>
              </div>
              <div className={styles.cardActions}>
                <Link href={`/careers/${slug}`} className={styles.explore} aria-label={`Explore roles in ${name}`}>
                  Explore roles <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link href={`/apply?dept=${slug}`} className={styles.apply} aria-label={`Apply to ${name}`}>
                  Apply <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.application}>
          <div>
            <h2>Ready to apply?</h2>
            <p>Choose a department above, or submit an application directly.</p>
          </div>
          <Link href="/apply" className={styles.applicationLink}>Submit an application <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
