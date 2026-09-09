import styles from './page.module.css';
import Link from 'next/link';

const jobs = [
  {
    id: "hw-design",
    title: "Hardware Design Engineer",
    department: "Electronics",
    location: "Bangalore, India",
    experience: "5+ Years",
    whatYouWillDo: "Design, develop, and test complex PCB architectures for mission-critical aerospace platforms.",
    requiredSkills: ["Altium Designer", "High-Speed Digital Design", "EMI/EMC Compliance"],
    niceToHave: ["Experience with DO-254 standards", "FPGA integration"],
    benefits: ["Competitive Equity", "Health Coverage", "Relocation Assistance"]
  },
  {
    id: "ai-dev",
    title: "AI & Computer Vision Developer",
    department: "Software",
    location: "Remote / Hybrid",
    experience: "3+ Years",
    whatYouWillDo: "Develop real-time object tracking algorithms for autonomous drone navigation systems.",
    requiredSkills: ["Python", "C++", "PyTorch/TensorFlow", "OpenCV"],
    niceToHave: ["CUDA optimization", "ROS2 experience"],
    benefits: ["Flexible Hours", "Learning Budget", "Top-tier Workstation"]
  }
];

export const metadata = {
  title: "Careers | Omoikane Innovations",
  description: "Join our team of engineers building the next generation of mission-critical systems and defense technology.",
};

export default function Careers() {
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>JOIN OUR <span className={styles.accent}>TEAM</span></h1>
        <div className={styles.divider}></div>
        <p className={styles.subtitle}>
          We are always looking for exceptional engineering talent to help us build the future of aerospace and defense technology.
        </p>
      </header>

      <section className={styles.jobList}>
        {jobs.map(job => (
          <div key={job.id} className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <div>
                <h2 className={styles.jobTitle}>{job.title}</h2>
                <div className={styles.jobMeta}>
                  <span className={styles.metaBadge}>{job.department}</span>
                  <span className={styles.metaBadge}>{job.location}</span>
                  <span className={styles.metaBadge}>{job.experience}</span>
                </div>
              </div>
              <Link href={`/careers/apply?role=${job.id}`} className={styles.applyBtn}>
                Apply Now
              </Link>
            </div>
            
            <div className={styles.jobBody}>
              <div className={styles.section}>
                <h3>What You'll Do</h3>
                <p>{job.whatYouWillDo}</p>
              </div>
              
              <div className={styles.requirementsGrid}>
                <div className={styles.section}>
                  <h3>Required Skills</h3>
                  <ul className={styles.list}>
                    {job.requiredSkills.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
                <div className={styles.section}>
                  <h3>Nice to Have</h3>
                  <ul className={styles.list}>
                    {job.niceToHave.map(skill => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>
                <div className={styles.section}>
                  <h3>Benefits</h3>
                  <ul className={styles.list}>
                    {job.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
