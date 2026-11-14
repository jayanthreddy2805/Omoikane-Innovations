import Image from "next/image";
import styles from "./TechMarquee.module.css";

export function TechMarquee() {
  return (
    <section className={styles.marqueeContainer} aria-label="Omoikane Innovations — Innovation is not our goal; it’s our standard.">
      <div className={styles.marqueeTrack} aria-hidden="true">
        {[0, 1].map(group => (
          <div className={styles.marqueeGroup} key={group}>
            {[0, 1, 2].map(item => (
              <div className={styles.brandUnit} key={item}>
                <Image src="/images/shared/omoikane-logo.png" alt="" width={44} height={44} />
                <span className={styles.companyName}>Omoikane Innovations</span>
                <span className={styles.quote}>Innovation is not our goal; it’s our standard.</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
