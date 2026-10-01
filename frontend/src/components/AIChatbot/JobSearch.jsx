"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowLeft } from 'lucide-react';
import JobCard from './JobCard';
import { jobService } from '@/services/jobService';
import { DEMO_JOBS } from '@/data/demoJobs';
import styles from './AIChatbot.module.css';

export default function JobSearch({
  resumeData,
  onBack,
  onViewJob,
  onApplyJob,
  onAskAboutJob
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      if (resumeData) {
        const matched = await jobService.matchJobs(resumeData);
        setJobs(matched);
      } else {
        const all = await jobService.getAllJobs();
        setJobs(all);
      }
      setLoading(false);
    }
    loadJobs();
  }, [resumeData]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = 
      selectedLocation === 'All' || job.location.toLowerCase() === selectedLocation.toLowerCase();

    return matchesSearch && matchesLocation;
  });

  return (
    <div className={styles.jobSearchView}>
      <div className={styles.detailsBackHeader}>
        <button className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} /> Back to conversation
        </button>
        <span className={styles.demoTagSmall}>DEMO OPENINGS</span>
      </div>

      <div className={styles.searchBarWrapper}>
        <div className={styles.searchInputRow}>
          <Search size={16} className={styles.searchBarIcon} />
          <input
            type="text"
            className={styles.jobSearchInput}
            placeholder="Search by role or skill (e.g. Python, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.locationFilterChips}>
          {['All', 'Bengaluru', 'Hyderabad'].map(loc => (
            <button
              key={loc}
              className={`${styles.locChip} ${selectedLocation === loc ? styles.locChipActive : ''}`}
              onClick={() => setSelectedLocation(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchResultsContainer}>
        {loading ? (
          <div className={styles.searchLoading}>Loading demo opportunities...</div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.noJobsFound}>
            <p>No matching jobs were found for the selected criteria.</p>
            <span>Try searching for another skill, location or role.</span>
          </div>
        ) : (
          <div className={styles.embeddedJobsList}>
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={onViewJob}
                onApply={onApplyJob}
                onAskAboutJob={onAskAboutJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
