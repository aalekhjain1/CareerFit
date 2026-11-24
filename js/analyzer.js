/**
 * CareerFit - Resume & Job Readiness Analyzer
 * Core Analysis Engine (analyzer.js)
 *
 * Implements:
 * 1. Predefined Skills Dictionary across categories
 * 2. Tokenization and precision skill extraction (avoiding false positives)
 * 3. Skill comparison (Matched, Missing, Additional)
 * 4. Transparent 4-part compatibility scoring formula (0-100)
 * 5. Section detection (Education, Skills, Projects, Experience, Certifications)
 * 6. Quality checklist & measurable achievement detection
 * 7. Dynamic improvement recommendations & prioritized learning roadmap
 */

(function (window) {
  'use strict';

  // 1. Predefined Skills Dictionary
  const SKILLS_DICTIONARY = [
    // Programming Languages
    {
      name: 'C',
      category: 'Programming',
      // Strict regex matching single letter 'C', not part of C++, C#, CSS, or normal words
      pattern: /(?:^|[^a-zA-Z0-9+#])([Cc])(?![a-zA-Z0-9+#])/i,
      priority: 'Medium',
      description: 'Foundational procedural programming and memory management language.'
    },
    {
      name: 'C++',
      category: 'Programming',
      pattern: /(?:^|[^a-zA-Z0-9])(c\+\+|cpp)(?![a-zA-Z0-9+#])/i,
      priority: 'High',
      description: 'High-performance object-oriented programming language for systems & DSA.'
    },
    {
      name: 'Java',
      category: 'Programming',
      // Ensure 'Java' does not match 'JavaScript'
      pattern: /\bjava\b(?!\s*script)/i,
      priority: 'High',
      description: 'Robust, enterprise-standard object-oriented programming language.'
    },
    {
      name: 'Python',
      category: 'Programming',
      pattern: /\bpython\b/i,
      priority: 'High',
      description: 'Versatile language for backend, automation, data analysis, and AI/ML.'
    },
    {
      name: 'JavaScript',
      category: 'Programming',
      pattern: /\b(javascript|ecmascript)\b/i,
      priority: 'High',
      description: 'The standard dynamic scripting language powering modern web applications.'
    },

    // Web Development
    {
      name: 'HTML',
      category: 'Web Development',
      pattern: /\b(html|html5)\b/i,
      priority: 'Medium',
      description: 'Standard markup language for constructing web document structures.'
    },
    {
      name: 'CSS',
      category: 'Web Development',
      pattern: /\b(css|css3)\b/i,
      priority: 'Medium',
      description: 'Style sheet language for responsive layouts, styling, and animations.'
    },
    {
      name: 'React',
      category: 'Web Development',
      pattern: /\b(react|reactjs|react\.js)\b/i,
      priority: 'High',
      description: 'Leading component-based frontend library for building reactive user interfaces.'
    },
    {
      name: 'Node.js',
      category: 'Web Development',
      pattern: /\b(node|nodejs|node\.js)\b/i,
      priority: 'High',
      description: 'Asynchronous event-driven JavaScript runtime for scalable backend servers.'
    },
    {
      name: 'Express',
      category: 'Web Development',
      pattern: /\b(express|expressjs|express\.js)\b/i,
      priority: 'Medium',
      description: 'Fast, unopinionated web framework for Node.js REST APIs and microservices.'
    },
    {
      name: 'REST API',
      category: 'Web Development',
      pattern: /\b(rest\s*apis?|restful(\s*apis?)?|api\s*development)\b/i,
      priority: 'High',
      description: 'Architectural pattern for stateless client-server web services.'
    },

    // Tools & Developer Environments
    {
      name: 'Git',
      category: 'Tools',
      // Git without matching Github or GitLab
      pattern: /\bgit\b(?!\s*hub|\s*lab)/i,
      priority: 'High',
      description: 'Essential distributed version control system for tracking source code changes.'
    },
    {
      name: 'GitHub',
      category: 'Tools',
      pattern: /\b(github|gitlab)\b/i,
      priority: 'High',
      description: 'Cloud platform for code hosting, pull requests, CI/CD, and open-source collaboration.'
    },
    {
      name: 'VS Code',
      category: 'Tools',
      pattern: /\b(vs\s*code|visual\s*studio\s*code)\b/i,
      priority: 'Low',
      description: 'Popular extensible source-code editor configured with debuggers and extensions.'
    },
    {
      name: 'Docker',
      category: 'Tools',
      pattern: /\b(docker|containerization)\b/i,
      priority: 'Medium',
      description: 'Platform for developing, shipping, and running applications in isolated containers.'
    },

    // Databases
    {
      name: 'SQL',
      category: 'Database',
      pattern: /\b(sql|mysql|postgresql|sqlite)\b/i,
      priority: 'High',
      description: 'Domain-specific language for managing and querying relational database tables.'
    },
    {
      name: 'MySQL',
      category: 'Database',
      pattern: /\bmysql\b/i,
      priority: 'Medium',
      description: 'Widely used open-source Relational Database Management System (RDBMS).'
    },
    {
      name: 'MongoDB',
      category: 'Database',
      pattern: /\b(mongodb|mongo)\b/i,
      priority: 'Medium',
      description: 'Document-oriented NoSQL database designed for high availability and scalability.'
    },

    // Core Computer Science
    {
      name: 'Data Structures',
      category: 'Core CS',
      pattern: /\b(data\s+structures?|dsa)\b/i,
      priority: 'High',
      description: 'Fundamental data organization formats (Arrays, Linked Lists, Trees, Graphs, Hash Tables).'
    },
    {
      name: 'Algorithms',
      category: 'Core CS',
      pattern: /\b(algorithms?|algorithmic|dsa)\b/i,
      priority: 'High',
      description: 'Step-by-step problem-solving procedures, time/space complexity analysis (Big-O).'
    },
    {
      name: 'Operating Systems',
      category: 'Core CS',
      pattern: /\b(operating\s+systems?)\b/i,
      priority: 'High',
      description: 'Core concepts including processes, threads, synchronization, memory, and file systems.'
    },
    {
      name: 'Computer Networks',
      category: 'Core CS',
      pattern: /\b(computer\s+networks?|networking|tcp\/ip|osi\s+model)\b/i,
      priority: 'Medium',
      description: 'Communication protocols, OSI layers, TCP/UDP, DNS, HTTP/HTTPS architectures.'
    },
    {
      name: 'DBMS',
      category: 'Core CS',
      pattern: /\b(dbms|database\s+management\s+systems?|rdbms|relational\s+database)\b/i,
      priority: 'High',
      description: 'Database normalization, ACID transactions, indexing, and concurrency control.'
    },

    // Professional & Soft Skills
    {
      name: 'Communication',
      category: 'Other',
      pattern: /\b(communications?|verbal\s+communication|written\s+communication)\b/i,
      priority: 'Medium',
      description: 'Ability to clearly articulate technical concepts to peers and stakeholders.'
    },
    {
      name: 'Problem Solving',
      category: 'Other',
      pattern: /\b(problem[\s-]solving|analytical\s+thinking|analytical\s+skills?)\b/i,
      priority: 'High',
      description: 'Methodical approach to dissecting complex bugs and architecting logical solutions.'
    },
    {
      name: 'Teamwork',
      category: 'Other',
      pattern: /\b(teamwork|team\s+player|collaborative|collaboration|collaborating)\b/i,
      priority: 'Medium',
      description: 'Working harmoniously across cross-functional teams in agile sprints.'
    },
    {
      name: 'Leadership',
      category: 'Other',
      pattern: /\b(leadership|lead|mentoring|initiative|led\s+a\s+team)\b/i,
      priority: 'Low',
      description: 'Demonstrating ownership, initiative, and guiding team members toward goals.'
    }
  ];

  // Domain Keywords for Job Description alignment comparison
  const DOMAIN_KEYWORDS = [
    {
      label: 'web applications',
      pattern: /\b(web\s+applications?|web\s+development|web\s+apps?)\b/i,
      resumePattern: /\b(web|html|css|javascript|react|node|web\s+applications?)\b/i
    },
    {
      label: 'databases',
      pattern: /\b(databases?|relational\s+databases?|dbms)\b/i,
      resumePattern: /\b(databases?|sql|mysql|mongodb|postgres|dbms)\b/i
    },
    {
      label: 'debugging',
      pattern: /\b(debug|debugging)\b/i,
      resumePattern: /\b(debug|debugging)\b/i
    },
    {
      label: 'collaborating',
      pattern: /\b(collaborat(e|ing|ion)|team\s+collaboration)\b/i,
      resumePattern: /\b(collaborat(e|ing|ion)|teamwork|team\s+collaboration)\b/i
    },
    {
      label: 'testing',
      pattern: /\b(testing|unit\s+tests?|qa|test-driven)\b/i,
      resumePattern: /\b(testing|unit\s+tests?|qa|test-driven|tests?)\b/i
    },
    {
      label: 'object oriented',
      pattern: /\b(object[\s-]oriented|oop)\b/i,
      resumePattern: /\b(object[\s-]oriented|oop)\b/i
    },
    {
      label: 'frontend',
      pattern: /\bfrontend\b/i,
      resumePattern: /\b(frontend|html|css|react|javascript|ui)\b/i
    },
    {
      label: 'backend',
      pattern: /\bbackend\b/i,
      resumePattern: /\b(backend|node|express|python|java|sql|api)\b/i
    },
    {
      label: 'cloud',
      pattern: /\b(cloud|aws|azure|gcp)\b/i,
      resumePattern: /\b(cloud|aws|azure|gcp)\b/i
    },
    {
      label: 'agile / scrum',
      pattern: /\b(agile|scrum|sprints?)\b/i,
      resumePattern: /\b(agile|scrum|sprints?)\b/i
    },
    {
      label: 'clean code',
      pattern: /\b(clean\s+code|code\s+quality|maintainable)\b/i,
      resumePattern: /\b(clean\s+code|code\s+quality|maintainable)\b/i
    },
    {
      label: 'version control',
      pattern: /\b(version\s+control|git|github)\b/i,
      resumePattern: /\b(version\s+control|git|github|gitlab)\b/i
    }
  ];

  // Action verbs indicating measurable impact
  const ACTION_VERBS = [
    'built', 'developed', 'created', 'designed', 'implemented', 'optimized',
    'engineered', 'architected', 'enhanced', 'integrated', 'delivered', 'automated',
    'reduced', 'increased', 'improved', 'managed', 'led', 'achieved', 'solved', 'deployed',
    'completed'
  ];

  /**
   * Extract skills matching the predefined dictionary from raw text.
   * Avoids false positives by using regex boundary patterns.
   *
   * @param {string} text - Raw input text (resume or job description)
   * @returns {Array<Object>} List of matched skill definition objects
   */
  function extractSkills(text) {
    if (!text || typeof text !== 'string') return [];
    const normalized = text.toLowerCase();
    const matched = [];

    SKILLS_DICTIONARY.forEach((skill) => {
      // Test regex against text
      if (skill.pattern.test(text)) {
        matched.push({
          name: skill.name,
          category: skill.category,
          priority: skill.priority,
          description: skill.description
        });
      }
    });

    return matched;
  }

  /**
   * Detect presence of key standard resume sections
   *
   * @param {string} text - Resume content
   * @returns {Object} Status map for each section
   */
  function detectSections(text) {
    if (!text) return {};

    const patterns = {
      Education: /\b(education|academics|degree|b\.?tech|b\.?e\.?|bca|mca|b\.?sc|university|college|cgpa|gpa|percentage|batch|graduation|schooling)\b/i,
      Skills: /\b(skills?|technical skills?|competencies|tech stack|proficiencies|technologies|tools)\b/i,
      Projects: /\b(projects?|academic projects?|personal projects?|capstone|built|developed|mini project|major project)\b/i,
      Experience: /\b(experience|internships?|work history|employment|training|work experience|professional experience)\b/i,
      Certifications: /\b(certifications?|certificates?|coursework|courses?|licenses?|credentials?|achievements?|awards?)\b/i
    };

    const results = {};
    for (const [section, regex] of Object.entries(patterns)) {
      results[section] = regex.test(text);
    }
    return results;
  }

  /**
   * Evaluate Resume Quality and Formatting Checks
   *
   * @param {string} text - Resume text
   * @returns {Object} Quality metrics & checklist items
   */
  function evaluateQuality(text) {
    if (!text) return { checks: [], score: 0, wordCount: 0 };

    // 1. Email check
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const hasEmail = emailRegex.test(text);

    // 2. Phone check (matches Indian 10 digits, +91, international formats)
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}\b|\b\d{10}\b/;
    const hasPhone = phoneRegex.test(text);

    // 3. Word count check (Ideal college resume: 40 - 900 words)
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const isLengthReasonable = wordCount >= 40 && wordCount <= 900;

    // 4. Action verbs / Achievements check
    let foundActionVerbs = [];
    ACTION_VERBS.forEach((verb) => {
      const reg = new RegExp(`\\b${verb}\\b`, 'i');
      if (reg.test(text)) {
        foundActionVerbs.push(verb);
      }
    });
    const hasActionWords = foundActionVerbs.length >= 2;

    // 5. Measurable metrics check (percentages, numbers, years, metrics)
    const metricRegex = /\b(\d+(\.\d+)?%|\d+\s*(?:users|star|cgpa|gpa|stars|views|downloads)|\b20\d\d\b)\b/i;
    const hasMetrics = metricRegex.test(text);

    return {
      hasEmail,
      hasPhone,
      wordCount,
      isLengthReasonable,
      hasActionWords,
      foundActionVerbs,
      hasMetrics
    };
  }

  /**
   * Extract keywords from Job Description to test overall alignment
   */
  function extractKeywordsFromJD(jdText) {
    if (!jdText) return [];
    const foundKeywords = [];
    DOMAIN_KEYWORDS.forEach((kw) => {
      if (kw.pattern.test(jdText)) {
        foundKeywords.push(kw);
      }
    });
    return foundKeywords;
  }

  /**
   * Core Analysis Function
   *
   * @param {string} resumeText - Raw text of the resume
   * @param {string} jdText - Raw text of the target job description
   * @param {string} candidateName - Optional candidate name
   * @param {string} targetRole - Optional target role
   * @returns {Object} Comprehensive analysis report
   */
  function analyze(resumeText, jdText, candidateName, targetRole) {
    const resumeTrimmed = (resumeText || '').trim();
    const jdTrimmed = (jdText || '').trim();

    if (!resumeTrimmed || !jdTrimmed) {
      throw new Error('Both Resume and Job Description are required for analysis.');
    }

    // 1. Skill Extraction
    const resumeSkills = extractSkills(resumeTrimmed);
    const jdSkills = extractSkills(jdTrimmed);

    const resumeSkillNames = new Set(resumeSkills.map((s) => s.name));
    const jdSkillNames = new Set(jdSkills.map((s) => s.name));

    // Matching Skills (In both Resume and JD)
    const matchedSkills = jdSkills.filter((s) => resumeSkillNames.has(s.name));

    // Missing Skills (In JD, but NOT in Resume)
    const missingSkills = jdSkills.filter((s) => !resumeSkillNames.has(s.name));

    // Additional Skills (In Resume, but NOT requested in JD)
    const additionalSkills = resumeSkills.filter((s) => !jdSkillNames.has(s.name));

    // 2. Compatibility Score Breakdown (Total 100 points)

    // Component A: Skill Match (50 points)
    // Percentage of job-required skills that are present in the resume
    let skillMatchRatio = 0;
    if (jdSkills.length > 0) {
      skillMatchRatio = matchedSkills.length / jdSkills.length;
    } else {
      // If JD had no predefined skills, award partial credit if resume has any skills
      skillMatchRatio = resumeSkills.length > 0 ? 0.7 : 0.2;
    }
    const skillMatchScore = Math.round(skillMatchRatio * 50);

    // Component B: Resume Completeness (20 points)
    // 5 sections @ 4 points each
    const sections = detectSections(resumeTrimmed);
    let sectionsFoundCount = 0;
    ['Education', 'Skills', 'Projects', 'Experience', 'Certifications'].forEach((sec) => {
      if (sections[sec]) sectionsFoundCount++;
    });
    const completenessScore = sectionsFoundCount * 4; // Max 20

    // Component C: Keyword Match (20 points)
    // Checks industry terms, workflows, responsibilities mentioned in JD
    const jdKeywords = extractKeywordsFromJD(jdTrimmed);
    let matchedKeywords = [];
    let missingKeywords = [];

    if (jdKeywords.length > 0) {
      jdKeywords.forEach((kw) => {
        if (kw.resumePattern.test(resumeTrimmed)) {
          matchedKeywords.push(kw.label);
        } else {
          missingKeywords.push(kw.label);
        }
      });
      const kwRatio = matchedKeywords.length / jdKeywords.length;
      var keywordScore = Math.round(kwRatio * 20);
    } else {
      // Fallback keyword score based on action words & skill match
      matchedKeywords = ['general technical alignment'];
      var keywordScore = Math.min(16, Math.round(skillMatchRatio * 20));
    }

    // Component D: Resume Quality (10 points)
    const quality = evaluateQuality(resumeTrimmed);
    let qualityScore = 0;
    if (quality.hasEmail) qualityScore += 2;
    if (quality.hasPhone) qualityScore += 2;
    if (quality.isLengthReasonable) qualityScore += 2;
    if (quality.hasActionWords) qualityScore += 2;
    if (quality.hasMetrics) qualityScore += 2;

    // Total Overall Score (Clamped 0 - 100)
    let totalScore = skillMatchScore + completenessScore + keywordScore + qualityScore;
    totalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    // Categorization Label
    let scoreLabel = 'Low Match';
    let scoreBadgeClass = 'badge-danger';
    let scoreTheme = '#EF4444'; // Red

    if (totalScore >= 80) {
      scoreLabel = 'Strong Match';
      scoreBadgeClass = 'badge-success';
      scoreTheme = '#10B981'; // Green
    } else if (totalScore >= 60) {
      scoreLabel = 'Moderate Match';
      scoreBadgeClass = 'badge-info';
      scoreTheme = '#2563EB'; // Blue
    } else if (totalScore >= 40) {
      scoreLabel = 'Needs Improvement';
      scoreBadgeClass = 'badge-warning';
      scoreTheme = '#F59E0B'; // Amber
    }

    // Skill Match Percentage
    const skillMatchPercentage =
      jdSkills.length > 0 ? Math.round((matchedSkills.length / jdSkills.length) * 100) : 0;

    // 3. Dynamic Improvement Recommendations
    const recommendations = generateRecommendations({
      sections,
      missingSkills,
      matchedSkills,
      quality,
      jdSkills,
      skillMatchRatio,
      totalScore
    });

    // 4. Prioritized Learning Roadmap
    const learningPriorities = generateLearningPriorities(missingSkills);

    return {
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      candidateName: (candidateName || '').trim() || 'Anonymous Candidate',
      targetRole: (targetRole || '').trim() || 'Software Engineering / Intern',
      scores: {
        total: totalScore,
        label: scoreLabel,
        badgeClass: scoreBadgeClass,
        themeColor: scoreTheme,
        breakdown: {
          skillMatch: { score: skillMatchScore, max: 50, percentage: skillMatchPercentage },
          completeness: { score: completenessScore, max: 20, sectionsFound: sectionsFoundCount },
          keywordMatch: { score: keywordScore, max: 20, matchedCount: matchedKeywords.length },
          quality: { score: qualityScore, max: 10 }
        }
      },
      skills: {
        resumeCount: resumeSkills.length,
        jdRequiredCount: jdSkills.length,
        matchedCount: matchedSkills.length,
        missingCount: missingSkills.length,
        additionalCount: additionalSkills.length,
        matched: matchedSkills,
        missing: missingSkills,
        additional: additionalSkills
      },
      sections: {
        Education: sections.Education,
        Skills: sections.Skills,
        Projects: sections.Projects,
        Experience: sections.Experience,
        Certifications: sections.Certifications
      },
      keywords: {
        matched: matchedKeywords,
        missing: missingKeywords
      },
      qualityChecklist: {
        hasEmail: quality.hasEmail,
        hasPhone: quality.hasPhone,
        educationPresent: sections.Education,
        projectsPresent: sections.Projects,
        skillsSectionPresent: sections.Skills,
        isLengthReasonable: quality.isLengthReasonable,
        wordCount: quality.wordCount,
        hasActionWords: quality.hasActionWords,
        foundActionVerbs: quality.foundActionVerbs,
        hasMetrics: quality.hasMetrics
      },
      recommendations,
      learningPriorities,
      inputs: {
        resumeExcerpt: resumeTrimmed.substring(0, 300) + (resumeTrimmed.length > 300 ? '...' : ''),
        jdExcerpt: jdTrimmed.substring(0, 300) + (jdTrimmed.length > 300 ? '...' : '')
      }
    };
  }

  /**
   * Dynamically generate actionable recommendations based on gaps detected.
   */
  function generateRecommendations(data) {
    const recs = [];
    const { sections, missingSkills, quality, jdSkills, skillMatchRatio } = data;

    // Section 1: Projects Recommendation
    if (!sections.Projects) {
      recs.push({
        type: 'critical',
        category: 'Projects',
        icon: 'folder-plus',
        title: 'Add a Dedicated Projects Section',
        text: 'Add a Projects section containing 2–3 relevant academic or personal projects. Highlight the problem solved, tech stack, and GitHub repository links.'
      });
    } else if (!quality.hasActionWords || !quality.hasMetrics) {
      recs.push({
        type: 'warning',
        category: 'Projects',
        icon: 'trending-up',
        title: 'Quantify Project Achievements',
        text: 'Improve your project descriptions by explaining what you built, the technologies used, and measurable outcomes (e.g., "reduced query latency by 25%", "supported 100+ concurrent requests").'
      });
    }

    // Section 2: Education Recommendation
    if (!sections.Education) {
      recs.push({
        type: 'critical',
        category: 'Education',
        icon: 'graduation-cap',
        title: 'Include Your Education Details',
        text: 'Add your degree, university name, branch/major, expected graduation year, and relevant coursework (e.g., Data Structures, DBMS, OS).'
      });
    }

    // Section 3: Skills Section Recommendation
    if (!sections.Skills) {
      recs.push({
        type: 'critical',
        category: 'Skills Section',
        icon: 'cpu',
        title: 'Create an Organized Skills Section',
        text: 'Create a clearly organized technical skills section categorized into Languages, Web Technologies, Databases, and Core CS Fundamentals for quick reviewer scanning.'
      });
    }

    // Section 4: Specific Missing Skills (e.g. Git, DSA, SQL, Web)
    const missingNames = missingSkills.map((s) => s.name);

    if (missingNames.includes('Git') || missingNames.includes('GitHub')) {
      recs.push({
        type: 'warning',
        category: 'Tools',
        icon: 'git-branch',
        title: 'Highlight Git & GitHub Experience',
        text: 'Consider learning Git and GitHub, as these tools are mandatory for collaboration in modern software engineering teams. Add links to your active repositories.'
      });
    }

    if (missingNames.includes('Data Structures') || missingNames.includes('Algorithms')) {
      recs.push({
        type: 'warning',
        category: 'Core CS',
        icon: 'code',
        title: 'Showcase Problem Solving & DSA',
        text: 'The job specifically requires Data Structures & Algorithms. Include mentions of DSA coursework, competitive programming handles (LeetCode/Codeforces), or algorithmic projects.'
      });
    }

    if (missingNames.includes('SQL') || missingNames.includes('MySQL') || missingNames.includes('MongoDB')) {
      recs.push({
        type: 'warning',
        category: 'Databases',
        icon: 'database',
        title: 'Demonstrate Database Management Knowledge',
        text: 'The employer seeks database skills. Detail how you modeled schemas, wrote queries, or integrated databases in your academic projects.'
      });
    }

    // General high missing skills count
    if (missingSkills.length >= 3 || skillMatchRatio < 0.5) {
      recs.push({
        type: 'info',
        category: 'Job Alignment',
        icon: 'target',
        title: 'Bridge High-Priority Skill Gaps',
        text: 'Focus on acquiring the required skills that appear in the job description (' +
          missingSkills.slice(0, 3).map((s) => s.name).join(', ') +
          ') through hands-on weekend projects before applying.'
      });
    }

    // Section 5: Contact Info
    if (!quality.hasEmail || !quality.hasPhone) {
      recs.push({
        type: 'critical',
        category: 'Contact Info',
        icon: 'mail',
        title: 'Provide Clear Contact Information',
        text: 'Ensure both a professional email address and an active phone number are prominent at the very top of your resume header.'
      });
    }

    // Section 6: Resume Length
    if (quality.wordCount < 70) {
      recs.push({
        type: 'warning',
        category: 'Resume Length',
        icon: 'file-text',
        title: 'Expand Resume Content',
        text: `Your resume is quite brief (${quality.wordCount} words). Add detailed project descriptions, coursework, tools used, and technical responsibilities.`
      });
    }

    // Fallback if resume is already solid
    if (recs.length === 0) {
      recs.push({
        type: 'success',
        category: 'Polish',
        icon: 'check-circle',
        title: 'Well-Structured Resume Profile',
        text: 'Your resume covers key sections and required skills effectively. Ensure your GitHub projects have clean READMEs and working live demo links.'
      });
    }

    return recs;
  }

  /**
   * Sort and prioritize missing skills into a clear learning roadmap
   */
  function generateLearningPriorities(missingSkills) {
    if (!missingSkills || missingSkills.length === 0) {
      return [];
    }

    // Priority ordering weight: High -> Medium -> Low
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };

    return [...missingSkills]
      .sort((a, b) => (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1))
      .map((skill, index) => {
        let timeframe = '1–2 Weeks';
        let suggestedAction = `Build a mini application or practice core concepts of ${skill.name}.`;

        if (skill.category === 'Core CS') {
          timeframe = '2–3 Weeks';
          suggestedAction = `Review fundamental theory and solve 15–20 standard questions on ${skill.name}.`;
        } else if (skill.category === 'Tools') {
          timeframe = '3–5 Days';
          suggestedAction = `Learn CLI commands for ${skill.name} and incorporate it into an existing GitHub repository.`;
        } else if (skill.category === 'Programming' || skill.category === 'Web Development') {
          timeframe = '2 Weeks';
          suggestedAction = `Complete a tutorial project implementing REST APIs or UI components with ${skill.name}.`;
        }

        return {
          rank: index + 1,
          name: skill.name,
          category: skill.category,
          priority: skill.priority,
          timeframe,
          suggestedAction,
          description: skill.description
        };
      });
  }

  // Export module to global window
  window.CareerFitAnalyzer = {
    SKILLS_DICTIONARY,
    extractSkills,
    detectSections,
    evaluateQuality,
    analyze,
    generateRecommendations,
    generateLearningPriorities
  };
})(window);
