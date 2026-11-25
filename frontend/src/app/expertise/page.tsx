import styles from './page.module.css';
import { ExpertiseSection } from '@/components/features/expertise/ExpertiseSection';
import { TechMarquee } from '@/components/features/expertise/TechMarquee';
import { ExpertiseHero } from '@/components/features/expertise/ExpertiseHero';
import CallToAction from '@/components/shared/CallToAction';

export default function ExpertisePage() {
  return (
    <div className={styles.container}>
      
      {/* Ultra Clean Hero */}
      <ExpertiseHero />

      {/* Scrolling Technologies Marquee */}
      <TechMarquee />

      {/* Main Expertise Presentation */}
      <ExpertiseSection />

      {/* About Us CTA */}
      <CallToAction />

    </div>
  );
}
