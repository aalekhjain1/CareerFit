/**
 * CareerFit - Resume & Job Readiness Analyzer
 * LocalStorage Data Management (storage.js)
 *
 * Handles:
 * - Persisting user analyses to window.localStorage
 * - Retrieval, deletion, and full history clearing
 * - Calculating dashboard aggregation metrics (total count, latest score, skill counters)
 * - Distinguishing demo/sample seed data from authentic user analyses
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'careerfit_analyses_v1';

  // Seed sample analysis to show live dashboard initial state
  const SEED_SAMPLE = {
    id: 'demo-sample-01',
    isDemo: true,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    displayDate: 'Demo Sample • Just now',
    candidateName: 'Rahul Sharma',
    targetRole: 'Software Development Intern',
    scores: {
      total: 63,
      label: 'Moderate Match',
      badgeClass: 'badge-info',
      themeColor: '#2563EB',
      breakdown: {
        skillMatch: { score: 35, max: 50, percentage: 70 },
        completeness: { score: 12, max: 20, sectionsFound: 3 },
        keywordMatch: { score: 12, max: 20, matchedCount: 3 },
        quality: { score: 4, max: 10 }
      }
    },
    skills: {
      resumeCount: 12,
      jdRequiredCount: 10,
      matchedCount: 7,
      missingCount: 3,
      additionalCount: 5,
      matched: [
        { name: 'Python', category: 'Programming', priority: 'High' },
        { name: 'JavaScript', category: 'Programming', priority: 'High' },
        { name: 'Git', category: 'Tools', priority: 'High' },
        { name: 'SQL', category: 'Database', priority: 'High' },
        { name: 'Data Structures', category: 'Core CS', priority: 'High' },
        { name: 'Algorithms', category: 'Core CS', priority: 'High' },
        { name: 'Problem Solving', category: 'Other', priority: 'High' }
      ],
      missing: [
        { name: 'React', category: 'Web Development', priority: 'High', description: 'Leading component-based frontend library.' },
        { name: 'REST API', category: 'Web Development', priority: 'High', description: 'Architectural pattern for stateless web services.' },
        { name: 'Teamwork', category: 'Other', priority: 'Medium', description: 'Working harmoniously in cross-functional agile sprints.' }
      ],
      additional: [
        { name: 'C++', category: 'Programming', priority: 'High' },
        { name: 'HTML', category: 'Web Development', priority: 'Medium' },
        { name: 'CSS', category: 'Web Development', priority: 'Medium' },
        { name: 'GitHub', category: 'Tools', priority: 'High' },
        { name: 'MySQL', category: 'Database', priority: 'Medium' }
      ]
    },
    sections: {
      Education: true,
      Skills: true,
      Projects: true,
      Experience: false,
      Certifications: false
    },
    keywords: {
      matched: ['web applications', 'databases', 'version control'],
      missing: ['debugging', 'collaborating']
    },
    qualityChecklist: {
      hasEmail: false,
      hasPhone: false,
      educationPresent: true,
      projectsPresent: true,
      skillsSectionPresent: true,
      isLengthReasonable: true,
      wordCount: 41,
      hasActionWords: false,
      foundActionVerbs: ['completed'],
      hasMetrics: true
    },
    recommendations: [
      {
        type: 'warning',
        category: 'Web Development',
        icon: 'code',
        title: 'Bridge Frontend Gap with React',
        text: 'The job requires React. Build a mini responsive dashboard or portfolio using React and link the GitHub repository.'
      },
      {
        type: 'critical',
        category: 'Contact Info',
        icon: 'mail',
        title: 'Add Contact Details',
        text: 'Ensure your email and phone number are visible at the very top of your resume.'
      }
    ],
    learningPriorities: [
      {
        rank: 1,
        name: 'React',
        category: 'Web Development',
        priority: 'High',
        timeframe: '2 Weeks',
        suggestedAction: 'Build an interactive dashboard utilizing React hooks and reusable stateful components.',
        description: 'Leading component-based frontend library for reactive user interfaces.'
      },
      {
        rank: 2,
        name: 'REST API',
        category: 'Web Development',
        priority: 'High',
        timeframe: '1 Week',
        suggestedAction: 'Create CRUD API endpoints with Express or FastAPI and test with Postman.',
        description: 'Architectural pattern for stateless client-server web services.'
      }
    ],
    inputs: {
      resumeExcerpt: 'B.Tech Computer Science student. Skills include C++, Python, HTML, CSS, JavaScript, Data Structures and Algorithms, Git and GitHub. Completed a Student Management System project using Python and MySQL...',
      jdExcerpt: 'Software Development Intern. Requirements: Python, JavaScript, React, SQL, Git, Data Structures and Algorithms, Problem Solving, REST APIs...'
    }
  };

  /**
   * Safe localStorage wrapper with try/catch fallback
   */
  const Storage = {
    /**
     * Get all saved analyses
     * @returns {Array<Object>} List of analyses (sorted newest first)
     */
    getAll: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.warn('CareerFit Storage: Unable to read from localStorage', err);
        return [];
      }
    },

    /**
     * Check if authentic user analyses exist (excluding demo data)
     */
    hasUserAnalyses: function () {
      const all = this.getAll();
      return all.some((item) => !item.isDemo);
    },

    /**
     * Get single analysis by id
     */
    getById: function (id) {
      if (id === SEED_SAMPLE.id) return SEED_SAMPLE;
      const all = this.getAll();
      return all.find((item) => item.id === id) || null;
    },

    /**
     * Save a new analysis
     * @param {Object} analysis - The full analysis object from CareerFitAnalyzer.analyze
     * @returns {Object} Saved object with generated id
     */
    save: function (analysis) {
      try {
        const all = this.getAll();
        const newRecord = {
          ...analysis,
          id: 'cf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          isDemo: false
        };

        // Add to start of list (newest first)
        all.unshift(newRecord);

        // Limit storage to 50 records to prevent memory exhaustion
        if (all.length > 50) {
          all.length = 50;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return newRecord;
      } catch (err) {
        console.error('CareerFit Storage: Error saving analysis', err);
        throw new Error('Could not save analysis to local storage. Storage quota may be full.');
      }
    },

    /**
     * Delete an analysis by id
     */
    delete: function (id) {
      try {
        const all = this.getAll();
        const filtered = all.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
      } catch (err) {
        console.error('CareerFit Storage: Error deleting item', err);
        return false;
      }
    },

    /**
     * Clear all user analyses
     */
    clearAll: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      } catch (err) {
        console.error('CareerFit Storage: Error clearing data', err);
        return false;
      }
    },

    /**
     * Get aggregated metrics for the dashboard
     */
    getStats: function () {
      const all = this.getAll();
      const userAnalyses = all.filter((item) => !item.isDemo);

      if (userAnalyses.length > 0) {
        const latest = userAnalyses[0];
        const totalAnalyses = userAnalyses.length;
        const totalScores = userAnalyses.reduce((acc, curr) => acc + (curr.scores?.total || 0), 0);
        const avgScore = Math.round(totalScores / totalAnalyses);

        return {
          totalCount: totalAnalyses,
          hasUserAnalyses: true,
          latestScore: latest.scores?.total || 0,
          latestScoreLabel: latest.scores?.label || 'N/A',
          latestBadgeClass: latest.scores?.badgeClass || 'badge-info',
          latestMatchedSkills: latest.skills?.matchedCount || 0,
          latestMissingSkills: latest.skills?.missingCount || 0,
          avgScore: avgScore,
          latestAnalysis: latest,
          historyList: userAnalyses
        };
      }

      // If no user analyses exist, provide Seed Sample for preview with demo flag
      return {
        totalCount: 0,
        hasUserAnalyses: false,
        latestScore: SEED_SAMPLE.scores.total,
        latestScoreLabel: SEED_SAMPLE.scores.label,
        latestBadgeClass: SEED_SAMPLE.scores.badgeClass,
        latestMatchedSkills: SEED_SAMPLE.skills.matchedCount,
        latestMissingSkills: SEED_SAMPLE.skills.missingCount,
        avgScore: SEED_SAMPLE.scores.total,
        latestAnalysis: SEED_SAMPLE,
        historyList: [SEED_SAMPLE]
      };
    },

    /**
     * Get seed sample for testing
     */
    getSampleSeed: function () {
      return SEED_SAMPLE;
    }
  };

  window.CareerFitStorage = Storage;
})(window);
