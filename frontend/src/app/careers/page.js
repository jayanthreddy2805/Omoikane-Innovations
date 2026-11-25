import { pageMetadata } from "@/lib/siteMetadata";
import Link from 'next/link';
export const metadata = pageMetadata("/careers", "Careers | Omoikane Innovations", "Explore software, mechanical and electrical engineering careers at Omoikane Innovations.");
export default function CareersPage() {
  return <section style={{maxWidth: 1000, margin: '0 auto', padding: '160px 24px 80px'}}>
    <h1>Careers</h1><p>Explore our engineering departments and apply for a role.</p>
    <ul>{[['software', 'Software Development'], ['mechanical', 'Mechanical Engineering'], ['electronics', 'Electrical Engineering']].map(([slug, name]) => <li key={slug} style={{margin: '24px 0'}}><h2><Link href={`/careers/${slug}`}>{name}</Link></h2><Link href={`/apply?dept=${slug}`}>Apply to this department →</Link></li>)}</ul>
    <Link href="/apply">Submit an application →</Link>
  </section>;
}
