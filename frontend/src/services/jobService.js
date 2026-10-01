/**
 * ============================================================================
 * JOB SERVICE - Omoikane Innovations
 * ============================================================================
 * 
 * Provides job catalog retrieval, search, filtering, and resume matching.
 * 
 * FUTURE FASTAPI BACKEND INTEGRATION:
 * When connecting a real Python backend, replace mock implementations with:
 *   - GET /api/jobs
 *   - GET /api/jobs/{id}
 *   - POST /api/jobs/match
 * 
 * Example:
 *   const res = await fetch(`${API_BASE_URL}/api/jobs`);
 *   return await res.json();
 * ============================================================================
 */

import { DEMO_JOBS } from '../data/demoJobs.js';
import { calculateJobMatch, DEMO_RESUME_PROFILE } from '../data/demoResume.js';

export const jobService = {
  /**
   * Retrieves all available demo job openings
   */
  async getAllJobs() {
    // Simulated async network call
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEMO_JOBS]), 200);
    });
  },

  /**
   * Retrieves a specific job by its unique identifier
   */
  async getJobById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = DEMO_JOBS.find(j => j.id.toLowerCase() === id.toLowerCase());
        resolve(found || null);
      }, 150);
    });
  },

  /**
   * Searches and filters jobs by keyword, location, or skill
   */
  async searchJobs(query = {}) {
    const { keyword, location, skill, entryLevel } = query;
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...DEMO_JOBS];

        if (keyword) {
          const kw = keyword.toLowerCase();
          results = results.filter(job => 
            job.title.toLowerCase().includes(kw) ||
            job.department.toLowerCase().includes(kw) ||
            job.shortDescription.toLowerCase().includes(kw) ||
            job.requiredSkills.some(s => s.toLowerCase().includes(kw))
          );
        }

        if (location) {
          const loc = location.toLowerCase();
          results = results.filter(job => job.location.toLowerCase().includes(loc));
        }

        if (skill) {
          const sk = skill.toLowerCase();
          results = results.filter(job => 
            job.requiredSkills.some(s => s.toLowerCase().includes(sk)) ||
            (job.preferredSkills && job.preferredSkills.some(s => s.toLowerCase().includes(sk)))
          );
        }

        if (entryLevel) {
          results = results.filter(job => job.isEntryLevel);
        }

        resolve(results);
      }, 200);
    });
  },

  /**
   * Matches all demo jobs against candidate resume data
   */
  async matchJobs(resumeProfile = DEMO_RESUME_PROFILE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const matchedList = DEMO_JOBS.map(job => {
          const matchResult = calculateJobMatch(job, resumeProfile);
          return {
            ...job,
            match: matchResult
          };
        });

        // Sort by match percentage descending
        matchedList.sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);
        resolve(matchedList);
      }, 300);
    });
  }
};
