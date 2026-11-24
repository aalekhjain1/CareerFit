/**
 * CareerFit - Resume & Job Readiness Analyzer
 * Main Application Controller (app.js)
 *
 * Coordinates:
 * - Tab navigation and routing
 * - Sample data loaders for quick live demonstration
 * - Form validation and multi-step loading animation
 * - Dynamic rendering across Dashboard, Skills Matrix, Suggestions, and History
 * - Clipboard operations for Prompt Engineering showcase
 * - Mobile responsive navigation drawer
 */

(function () {
  'use strict';

  // Sample Demo Data from Project Specification (Feature 7)
  const SAMPLE_DEMO = {
    candidateName: 'Rahul Sharma',
    targetRole: 'Software Development Intern',
    resumeText: `B.Tech Computer Science student. Skills include C++, Python, HTML, CSS, JavaScript, Data Structures and Algorithms, Git and GitHub. Completed a Student Management System project using Python and MySQL. Familiar with object-oriented programming and basic problem solving. Education: B.Tech Computer Science, 2027.`,
    jdText: `Software Development Intern. Requirements: Python, JavaScript, React, SQL, Git, Data Structures and Algorithms, Problem Solving, REST APIs. Responsibilities include developing web applications, debugging code, working with databases and collaborating with a development team.`
  };

  // State Management
  let currentAnalysis = null;
  let activeTab = 'dashboard';
  let activeSkillFilter = 'all';

  // DOM Elements Cache
  const DOM = {};

  /**
   * Initialize Cache of DOM Elements
   */
  function initDOMElements() {
    DOM.navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    DOM.tabPanels = document.querySelectorAll('.tab-panel');
    DOM.headerCrumb = document.getElementById('headerCrumb');
    DOM.historyNavBadge = document.getElementById('historyNavBadge');
    DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    DOM.sidebar = document.getElementById('sidebar');
    DOM.mobileBackdrop = document.getElementById('mobileBackdrop');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.loadingOverlay = document.getElementById('loadingOverlay');
    DOM.loadingStepText = document.getElementById('loadingStepText');
    DOM.loadingProgressBar = document.getElementById('loadingProgressBar');

    // Header buttons
    DOM.btnQuickSample = document.getElementById('btnQuickSample');

    // Dashboard Elements
    DOM.demoBanner = document.getElementById('demoBanner');
    DOM.btnDismissDemo = document.getElementById('btnDismissDemo');
    DOM.statTotalCount = document.getElementById('statTotalCount');
    DOM.statTotalSubtext = document.getElementById('statTotalSubtext');
    DOM.statLatestScore = document.getElementById('statLatestScore');
    DOM.statLatestBadge = document.getElementById('statLatestBadge');
    DOM.statMatchedSkills = document.getElementById('statMatchedSkills');
    DOM.statMissingSkills = document.getElementById('statMissingSkills');
    DOM.dashCandidatePill = document.getElementById('dashCandidatePill');
    DOM.dashGaugeCircle = document.getElementById('dashGaugeCircle');
    DOM.dashGaugeScore = document.getElementById('dashGaugeScore');
    DOM.dashVerdictTitle = document.getElementById('dashVerdictTitle');
    DOM.dashRoleLabel = document.getElementById('dashRoleLabel');
    DOM.dashScoreSkillMatch = document.getElementById('dashScoreSkillMatch');
    DOM.dashBarSkillMatch = document.getElementById('dashBarSkillMatch');
    DOM.dashScoreCompleteness = document.getElementById('dashScoreCompleteness');
    DOM.dashBarCompleteness = document.getElementById('dashBarCompleteness');
    DOM.dashScoreKeyword = document.getElementById('dashScoreKeyword');
    DOM.dashBarKeyword = document.getElementById('dashBarKeyword');
    DOM.dashScoreQuality = document.getElementById('dashScoreQuality');
    DOM.dashBarQuality = document.getElementById('dashBarQuality');
    DOM.dashHistoryTableBody = document.getElementById('dashHistoryTableBody');
    DOM.btnDashViewFull = document.getElementById('btnDashViewFull');
    DOM.btnDashNewAnalyze = document.getElementById('btnDashNewAnalyze');
    DOM.btnDashViewAllHistory = document.getElementById('btnDashViewAllHistory');
    DOM.btnQuickNavSkills = document.getElementById('btnQuickNavSkills');
    DOM.btnQuickNavSuggestions = document.getElementById('btnQuickNavSuggestions');
    DOM.btnQuickNavPrompt = document.getElementById('btnQuickNavPrompt');

    // Analyzer Form Elements
    DOM.inputCandidateName = document.getElementById('inputCandidateName');
    DOM.inputTargetRole = document.getElementById('inputTargetRole');
    DOM.inputResumeText = document.getElementById('inputResumeText');
    DOM.inputJdText = document.getElementById('inputJdText');
    DOM.resumeCharCounter = document.getElementById('resumeCharCounter');
    DOM.jdCharCounter = document.getElementById('jdCharCounter');
    DOM.btnLoadSampleResume = document.getElementById('btnLoadSampleResume');
    DOM.btnClearResume = document.getElementById('btnClearResume');
    DOM.btnLoadSampleJd = document.getElementById('btnLoadSampleJd');
    DOM.btnClearJd = document.getElementById('btnClearJd');
    DOM.btnRunAnalyze = document.getElementById('btnRunAnalyze');
    DOM.analyzerAlertBox = document.getElementById('analyzerAlertBox');
    DOM.analyzerAlertText = document.getElementById('analyzerAlertText');

    // Results Dashboard Elements
    DOM.liveResultsContainer = document.getElementById('liveResultsContainer');
    DOM.resBannerCandidate = document.getElementById('resBannerCandidate');
    DOM.resBannerTimestamp = document.getElementById('resBannerTimestamp');
    DOM.resGaugeCircle = document.getElementById('resGaugeCircle');
    DOM.resScoreNum = document.getElementById('resScoreNum');
    DOM.resScoreVerdict = document.getElementById('resScoreVerdict');
    DOM.resScoreBadge = document.getElementById('resScoreBadge');
    DOM.resBreakSkill = document.getElementById('resBreakSkill');
    DOM.resBarSkill = document.getElementById('resBarSkill');
    DOM.resBreakComplete = document.getElementById('resBreakComplete');
    DOM.resBarComplete = document.getElementById('resBarComplete');
    DOM.resBreakKeyword = document.getElementById('resBreakKeyword');
    DOM.resBarKeyword = document.getElementById('resBarKeyword');
    DOM.resBreakQuality = document.getElementById('resBreakQuality');
    DOM.resBarQuality = document.getElementById('resBarQuality');
    DOM.resCountMatchedBadge = document.getElementById('resCountMatchedBadge');
    DOM.resCountMissingBadge = document.getElementById('resCountMissingBadge');
    DOM.resCountAddBadge = document.getElementById('resCountAddBadge');
    DOM.resMatchedCluster = document.getElementById('resMatchedCluster');
    DOM.resMissingCluster = document.getElementById('resMissingCluster');
    DOM.resAdditionalCluster = document.getElementById('resAdditionalCluster');
    DOM.resSectionsGrid = document.getElementById('resSectionsGrid');
    DOM.resQualityChecklist = document.getElementById('resQualityChecklist');
    DOM.btnJumpToSkills = document.getElementById('btnJumpToSkills');
    DOM.btnJumpToSuggestions = document.getElementById('btnJumpToSuggestions');

    // Skills Tab Elements
    DOM.skillTabJdCount = document.getElementById('skillTabJdCount');
    DOM.skillTabMatchCount = document.getElementById('skillTabMatchCount');
    DOM.skillTabMissingCount = document.getElementById('skillTabMissingCount');
    DOM.skillTabAdditionalCount = document.getElementById('skillTabAdditionalCount');
    DOM.skillFilterButtons = document.getElementById('skillFilterButtons');
    DOM.skillMatrixTableBody = document.getElementById('skillMatrixTableBody');

    // Suggestions Tab Elements
    DOM.recommendationsList = document.getElementById('recommendationsList');
    DOM.recCountBadge = document.getElementById('recCountBadge');
    DOM.learningRoadmapGrid = document.getElementById('learningRoadmapGrid');
    DOM.kwMatchedTags = document.getElementById('kwMatchedTags');
    DOM.kwMissingTags = document.getElementById('kwMissingTags');

    // History Tab Elements
    DOM.historyTableBody = document.getElementById('historyTableBody');
    DOM.historyEmptyState = document.getElementById('historyEmptyState');
    DOM.btnClearAllHistory = document.getElementById('btnClearAllHistory');
    DOM.btnEmptyStateAnalyze = document.getElementById('btnEmptyStateAnalyze');

    // Prompt Engineering Elements
    DOM.btnCopyPrompt = document.getElementById('btnCopyPrompt');
    DOM.copyPromptBtnText = document.getElementById('copyPromptBtnText');
    DOM.promptTextContent = document.getElementById('promptTextContent');
    DOM.evolutionTabBtns = document.querySelectorAll('.evolution-tab-btn');
    DOM.evolutionPanes = document.querySelectorAll('.evolution-pane');
  }

  /**
   * Switch Active Application Tab
   */
  function switchTab(tabId) {
    activeTab = tabId;

    // Update active nav link
    DOM.navLinks.forEach((link) => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update tab panels
    DOM.tabPanels.forEach((panel) => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Header Breadcrumb Title
    const titles = {
      dashboard: 'Dashboard Overview',
      analyzer: 'Resume & Job Analyzer',
      skills: 'Skills Analysis Matrix',
      suggestions: 'Improvement Recommendations',
      history: 'Analysis History Records',
      'prompt-eng': 'AI Review Framework & Prompt Engineering'
    };
    if (DOM.headerCrumb) {
      DOM.headerCrumb.textContent = titles[tabId] || 'CareerFit';
    }

    // Close mobile drawer if open
    closeMobileSidebar();

    // Trigger tab-specific refresh if needed
    if (tabId === 'dashboard') {
      renderDashboard();
    } else if (tabId === 'skills') {
      renderSkillsTab();
    } else if (tabId === 'suggestions') {
      renderSuggestionsTab();
    } else if (tabId === 'history') {
      renderHistoryTab();
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Mobile Sidebar Drawer Controls
   */
  function openMobileSidebar() {
    DOM.sidebar.classList.add('mobile-open');
    DOM.mobileBackdrop.style.display = 'block';
  }

  function closeMobileSidebar() {
    DOM.sidebar.classList.remove('mobile-open');
    DOM.mobileBackdrop.style.display = 'none';
  }

  /**
   * Display Toast Notifications
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '✕';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Helper: Calculate SVG circular gauge dashoffset
   * Radius = 40 => Circumference = 2 * PI * 40 ~= 251.2
   */
  function updateGauge(circleElement, score) {
    if (!circleElement) return;
    const circumference = 251.2;
    const clampedScore = Math.max(0, Math.min(100, score || 0));
    const offset = circumference - (clampedScore / 100) * circumference;
    circleElement.style.strokeDasharray = `${circumference}`;
    circleElement.style.strokeDashoffset = `${offset}`;

    // Color stroke based on score threshold
    if (clampedScore >= 80) {
      circleElement.style.stroke = '#10B981'; // Green
    } else if (clampedScore >= 60) {
      circleElement.style.stroke = '#2563EB'; // Blue
    } else if (clampedScore >= 40) {
      circleElement.style.stroke = '#F59E0B'; // Amber
    } else {
      circleElement.style.stroke = '#EF4444'; // Red
    }
  }

  /**
   * Count words helper
   */
  function countWords(str) {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  /**
   * Update character & word counters for textareas
   */
  function updateCounters() {
    const resumeWords = countWords(DOM.inputResumeText.value);
    const jdWords = countWords(DOM.inputJdText.value);
    DOM.resumeCharCounter.textContent = `${resumeWords} words • ${DOM.inputResumeText.value.length} chars`;
    DOM.jdCharCounter.textContent = `${jdWords} words • ${DOM.inputJdText.value.length} chars`;
  }

  /**
   * Load Sample Data into Form
   */
  function loadSampleData() {
    DOM.inputCandidateName.value = SAMPLE_DEMO.candidateName;
    DOM.inputTargetRole.value = SAMPLE_DEMO.targetRole;
    DOM.inputResumeText.value = SAMPLE_DEMO.resumeText;
    DOM.inputJdText.value = SAMPLE_DEMO.jdText;
    updateCounters();
    DOM.analyzerAlertBox.style.display = 'none';
    showToast('Sample candidate resume and job description loaded!', 'success');
  }

  /**
   * Render Dashboard Tab
   */
  function renderDashboard() {
    const stats = CareerFitStorage.getStats();
    const hasUser = stats.hasUserAnalyses;

    // Notice Banner: clearly distinguishes demo/seed data from real user analyses
    if (hasUser) {
      DOM.demoBanner.classList.add('hidden');
      DOM.statTotalSubtext.textContent = 'Saved authentic analyses';
    } else {
      DOM.demoBanner.classList.remove('hidden');
      DOM.statTotalSubtext.textContent = '0 user analyses (showing demo)';
    }

    // Top Metric Cards
    DOM.statTotalCount.textContent = stats.totalCount;
    DOM.statLatestScore.textContent = `${stats.latestScore}%`;
    DOM.statLatestBadge.textContent = stats.latestScoreLabel;
    DOM.statLatestBadge.className = `badge ${stats.latestBadgeClass}`;
    DOM.statMatchedSkills.textContent = stats.latestMatchedSkills;
    DOM.statMissingSkills.textContent = stats.latestMissingSkills;

    // Latest Analysis Visual Gauge & Card
    const latest = stats.latestAnalysis;
    if (latest) {
      DOM.dashCandidatePill.textContent = latest.candidateName;
      DOM.dashGaugeScore.textContent = latest.scores?.total || 0;
      updateGauge(DOM.dashGaugeCircle, latest.scores?.total || 0);
      DOM.dashVerdictTitle.textContent = latest.scores?.label || 'Analyzed';
      DOM.dashRoleLabel.textContent = `Target: ${latest.targetRole}`;

      // Breakdown Bars
      const bd = latest.scores?.breakdown || {};
      const skillScore = bd.skillMatch?.score ?? 38;
      const skillPct = bd.skillMatch?.percentage ?? 75;
      DOM.dashScoreSkillMatch.textContent = `${skillScore} / 50 pts (${skillPct}%)`;
      DOM.dashBarSkillMatch.style.width = `${(skillScore / 50) * 100}%`;

      const compScore = bd.completeness?.score ?? 16;
      DOM.dashScoreCompleteness.textContent = `${compScore} / 20 pts`;
      DOM.dashBarCompleteness.style.width = `${(compScore / 20) * 100}%`;

      const kwScore = bd.keywordMatch?.score ?? 16;
      DOM.dashScoreKeyword.textContent = `${kwScore} / 20 pts`;
      DOM.dashBarKeyword.style.width = `${(kwScore / 20) * 100}%`;

      const qualScore = bd.quality?.score ?? 8;
      DOM.dashScoreQuality.textContent = `${qualScore} / 10 pts`;
      DOM.dashBarQuality.style.width = `${(qualScore / 10) * 100}%`;

      // Set as active analysis for inspection if none yet
      if (!currentAnalysis) {
        currentAnalysis = latest;
      }
    }

    // Render Recent Activity Preview Table
    const historyList = stats.historyList.slice(0, 5);
    DOM.dashHistoryTableBody.innerHTML = '';

    if (historyList.length === 0) {
      DOM.dashHistoryTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--color-muted);">
            No analyses recorded yet. Click <strong>Analyze My Resume</strong> to evaluate your first resume.
          </td>
        </tr>`;
    } else {
      historyList.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${item.displayDate}</strong>${item.isDemo ? ' <span class="badge badge-secondary" style="font-size:0.65rem;">DEMO</span>' : ''}</td>
          <td>${item.candidateName}</td>
          <td>${item.targetRole}</td>
          <td><span class="badge ${item.scores?.badgeClass || 'badge-info'}">${item.scores?.total || 0}/100</span></td>
          <td>
            <span style="color:var(--color-success); font-weight:600;">${item.skills?.matchedCount || 0} Matched</span> /
            <span style="color:var(--color-warning); font-weight:600;">${item.skills?.missingCount || 0} Missing</span>
          </td>
          <td>
            <button class="btn btn-outline btn-sm btn-open-analysis" data-id="${item.id}">View Report</button>
          </td>
        `;
        DOM.dashHistoryTableBody.appendChild(tr);
      });

      // Bind click listeners for "View Report" buttons in table
      DOM.dashHistoryTableBody.querySelectorAll('.btn-open-analysis').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openAnalysisById(id);
        });
      });
    }

    // Update History Counter Badge in Sidebar
    const allRecords = CareerFitStorage.getAll();
    DOM.historyNavBadge.textContent = allRecords.length;
  }

  /**
   * Run Analysis Engine with Multi-Step Loading Experience
   */
  function handleRunAnalysis() {
    const resumeText = DOM.inputResumeText.value.trim();
    const jdText = DOM.inputJdText.value.trim();
    const candidateName = DOM.inputCandidateName.value.trim();
    const targetRole = DOM.inputTargetRole.value.trim();

    // 1. Validation Check: Both inputs required
    if (!resumeText || !jdText) {
      let missingMsg = 'Please provide both your Resume and the Job Description to analyze.';
      if (!resumeText && !jdText) {
        missingMsg = 'Both Resume and Job Description inputs are empty. Please enter or load sample data.';
      } else if (!resumeText) {
        missingMsg = 'Resume content is empty. Please paste your resume text.';
      } else {
        missingMsg = 'Job Description is empty. Please paste the target job requirements.';
      }

      DOM.analyzerAlertText.textContent = missingMsg;
      DOM.analyzerAlertBox.style.display = 'flex';
      DOM.analyzerAlertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Hide error alert
    DOM.analyzerAlertBox.style.display = 'none';

    // 2. Start Loading Animation Overlay
    DOM.loadingOverlay.classList.add('active');
    DOM.loadingProgressBar.style.width = '20%';
    DOM.loadingStepText.textContent = 'Tokenizing text & scanning predefined skills dictionary...';

    // Staged step progression for realistic live demonstration
    setTimeout(() => {
      DOM.loadingProgressBar.style.width = '55%';
      DOM.loadingStepText.textContent = 'Cross-referencing job requirements & isolating skill gaps...';
    }, 250);

    setTimeout(() => {
      DOM.loadingProgressBar.style.width = '85%';
      DOM.loadingStepText.textContent = 'Calculating compatibility score & resume completeness...';
    }, 550);

    setTimeout(() => {
      DOM.loadingProgressBar.style.width = '100%';
      DOM.loadingStepText.textContent = 'Synthesizing personalized improvement recommendations...';
    }, 800);

    setTimeout(() => {
      try {
        // Execute Core Analysis Engine
        const analysis = CareerFitAnalyzer.analyze(resumeText, jdText, candidateName, targetRole);

        // Save Analysis to LocalStorage
        const saved = CareerFitStorage.save(analysis);
        currentAnalysis = saved;

        // Hide Loading Overlay
        DOM.loadingOverlay.classList.remove('active');

        // Render Live Results
        renderResults(currentAnalysis);

        // Refresh Dashboard and History
        renderDashboard();

        // Scroll to results
        DOM.liveResultsContainer.style.display = 'flex';
        DOM.liveResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        showToast('Resume analyzed successfully! Score: ' + currentAnalysis.scores.total + '/100', 'success');
      } catch (err) {
        DOM.loadingOverlay.classList.remove('active');
        DOM.analyzerAlertText.textContent = 'Error during analysis: ' + err.message;
        DOM.analyzerAlertBox.style.display = 'flex';
        console.error(err);
      }
    }, 1050);
  }

  /**
   * Render Analysis Results Snapshot (Inside Analyzer Tab)
   */
  function renderResults(analysis) {
    if (!analysis) return;

    DOM.liveResultsContainer.style.display = 'flex';

    // Banner info
    DOM.resBannerCandidate.textContent = `${analysis.candidateName} — ${analysis.targetRole}`;
    DOM.resBannerTimestamp.textContent = `Analyzed on ${analysis.displayDate}`;

    // Score Gauge & Verdict
    const score = analysis.scores?.total || 0;
    DOM.resScoreNum.textContent = score;
    DOM.resScoreVerdict.textContent = analysis.scores?.label || 'Match';
    DOM.resScoreBadge.textContent = `${score} / 100 — ${analysis.scores?.label || ''}`;
    DOM.resScoreBadge.className = `badge ${analysis.scores?.badgeClass || 'badge-info'}`;
    updateGauge(DOM.resGaugeCircle, score);

    // Breakdown Bars
    const bd = analysis.scores?.breakdown || {};
    const skillScore = bd.skillMatch?.score ?? 0;
    const skillPct = bd.skillMatch?.percentage ?? 0;
    DOM.resBreakSkill.textContent = `${skillScore} / 50 pts (${skillPct}% match)`;
    DOM.resBarSkill.style.width = `${(skillScore / 50) * 100}%`;

    const compScore = bd.completeness?.score ?? 0;
    const secFound = bd.completeness?.sectionsFound ?? 0;
    DOM.resBreakComplete.textContent = `${compScore} / 20 pts (${secFound} sections found)`;
    DOM.resBarComplete.style.width = `${(compScore / 20) * 100}%`;

    const kwScore = bd.keywordMatch?.score ?? 0;
    DOM.resBreakKeyword.textContent = `${kwScore} / 20 pts`;
    DOM.resBarKeyword.style.width = `${(kwScore / 20) * 100}%`;

    const qualScore = bd.quality?.score ?? 0;
    DOM.resBreakQuality.textContent = `${qualScore} / 10 pts`;
    DOM.resBarQuality.style.width = `${(qualScore / 10) * 100}%`;

    // Skills Clusters
    const skills = analysis.skills || {};
    DOM.resCountMatchedBadge.textContent = `${skills.matchedCount || 0} Matched`;
    DOM.resCountMissingBadge.textContent = `${skills.missingCount || 0} Missing`;
    DOM.resCountAddBadge.textContent = `${skills.additionalCount || 0} Additional`;

    // Render Matched Badges
    DOM.resMatchedCluster.innerHTML = '';
    if (skills.matched && skills.matched.length > 0) {
      skills.matched.forEach((s) => {
        const span = document.createElement('span');
        span.className = 'skill-tag skill-tag-matched';
        span.innerHTML = `✓ ${s.name} <small style="opacity:0.75;">(${s.category})</small>`;
        DOM.resMatchedCluster.appendChild(span);
      });
    } else {
      DOM.resMatchedCluster.innerHTML = '<span style="font-size:0.85rem; color:var(--color-muted);">No matching skills found.</span>';
    }

    // Render Missing Badges
    DOM.resMissingCluster.innerHTML = '';
    if (skills.missing && skills.missing.length > 0) {
      skills.missing.forEach((s) => {
        const span = document.createElement('span');
        span.className = 'skill-tag skill-tag-missing';
        span.innerHTML = `✕ ${s.name} <small style="opacity:0.75;">(${s.category} • ${s.priority})</small>`;
        DOM.resMissingCluster.appendChild(span);
      });
    } else {
      DOM.resMissingCluster.innerHTML = '<span style="font-size:0.85rem; color:var(--color-success);">All job-required skills are present! Excellent alignment.</span>';
    }

    // Render Additional Badges
    DOM.resAdditionalCluster.innerHTML = '';
    if (skills.additional && skills.additional.length > 0) {
      skills.additional.forEach((s) => {
        const span = document.createElement('span');
        span.className = 'skill-tag skill-tag-additional';
        span.innerHTML = `+ ${s.name} <small style="opacity:0.75;">(${s.category})</small>`;
        DOM.resAdditionalCluster.appendChild(span);
      });
    } else {
      DOM.resAdditionalCluster.innerHTML = '<span style="font-size:0.85rem; color:var(--color-muted);">No additional recognized skills beyond job description.</span>';
    }

    // Section Checks
    const sections = analysis.sections || {};
    DOM.resSectionsGrid.innerHTML = '';
    const sectionNames = ['Education', 'Skills', 'Projects', 'Experience', 'Certifications'];
    sectionNames.forEach((sec) => {
      const isPresent = !!sections[sec];
      const div = document.createElement('div');
      div.className = `section-check-card ${isPresent ? 'present' : 'missing'}`;
      div.innerHTML = `
        <span class="section-check-name">${sec}</span>
        <span class="badge ${isPresent ? 'badge-success' : 'badge-danger'}">
          ${isPresent ? '✓ Present' : '✕ Missing'}
        </span>
      `;
      DOM.resSectionsGrid.appendChild(div);
    });

    // Quality Checklist
    const q = analysis.qualityChecklist || {};
    DOM.resQualityChecklist.innerHTML = `
      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>📧</span>
          <span>Contact Email Address Present</span>
        </div>
        <span class="badge ${q.hasEmail ? 'badge-success' : 'badge-danger'}">${q.hasEmail ? 'Verified' : 'Missing'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>📱</span>
          <span>Phone / Contact Number Present</span>
        </div>
        <span class="badge ${q.hasPhone ? 'badge-success' : 'badge-danger'}">${q.hasPhone ? 'Verified' : 'Missing'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>🎓</span>
          <span>Education Information Included</span>
        </div>
        <span class="badge ${q.educationPresent ? 'badge-success' : 'badge-danger'}">${q.educationPresent ? 'Verified' : 'Missing'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>📂</span>
          <span>Academic or Personal Projects Included</span>
        </div>
        <span class="badge ${q.projectsPresent ? 'badge-success' : 'badge-danger'}">${q.projectsPresent ? 'Verified' : 'Missing'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>🛠️</span>
          <span>Organized Skills Section Present</span>
        </div>
        <span class="badge ${q.skillsSectionPresent ? 'badge-success' : 'badge-danger'}">${q.skillsSectionPresent ? 'Verified' : 'Missing'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>📏</span>
          <span>Resume Length Reasonable (${q.wordCount || 0} words)</span>
        </div>
        <span class="badge ${q.isLengthReasonable ? 'badge-success' : 'badge-warning'}">${q.isLengthReasonable ? 'Optimal' : 'Needs Adjustment'}</span>
      </div>

      <div class="quality-check-item">
        <div class="quality-check-left">
          <span>⚡</span>
          <span>Achievement & Action Verbs (${q.foundActionVerbs?.length || 0} detected)</span>
        </div>
        <span class="badge ${q.hasActionWords ? 'badge-success' : 'badge-warning'}">${q.hasActionWords ? 'Strong Verbs' : 'Weak Verbs'}</span>
      </div>
    `;
  }

  /**
   * Render Skills Tab (Full Matrix & Category Filtering)
   */
  function renderSkillsTab() {
    // If no active analysis, get from storage stats
    if (!currentAnalysis) {
      const stats = CareerFitStorage.getStats();
      currentAnalysis = stats.latestAnalysis;
    }

    if (!currentAnalysis) return;

    const skills = currentAnalysis.skills || {};
    DOM.skillTabJdCount.textContent = skills.jdRequiredCount || 0;
    DOM.skillTabMatchCount.textContent = skills.matchedCount || 0;
    DOM.skillTabMissingCount.textContent = skills.missingCount || 0;
    DOM.skillTabAdditionalCount.textContent = skills.additionalCount || 0;

    // Build consolidated list of all known skills evaluated in this session
    const matchedNames = new Set((skills.matched || []).map((s) => s.name));
    const missingNames = new Set((skills.missing || []).map((s) => s.name));
    const additionalNames = new Set((skills.additional || []).map((s) => s.name));

    // Combine all skills from dictionary that are relevant to this resume or JD
    const allDict = CareerFitAnalyzer.SKILLS_DICTIONARY || [];
    const relevantSkills = [];

    allDict.forEach((skill) => {
      let status = 'Not Required';
      let isRequiredInJd = false;
      let isFoundInResume = false;

      if (matchedNames.has(skill.name)) {
        status = 'Matched';
        isRequiredInJd = true;
        isFoundInResume = true;
      } else if (missingNames.has(skill.name)) {
        status = 'Missing';
        isRequiredInJd = true;
        isFoundInResume = false;
      } else if (additionalNames.has(skill.name)) {
        status = 'Additional';
        isRequiredInJd = false;
        isFoundInResume = true;
      }

      // Add if involved in analysis or if filter matches
      if (status !== 'Not Required') {
        relevantSkills.push({
          name: skill.name,
          category: skill.category,
          priority: skill.priority,
          description: skill.description,
          isRequiredInJd,
          isFoundInResume,
          status
        });
      }
    });

    // Filter by active category
    const filtered = relevantSkills.filter((s) => {
      if (activeSkillFilter === 'all') return true;
      return s.category === activeSkillFilter;
    });

    DOM.skillMatrixTableBody.innerHTML = '';
    if (filtered.length === 0) {
      DOM.skillMatrixTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2rem; color: var(--color-muted);">
            No skills found under category <strong>${activeSkillFilter}</strong> for this analysis.
          </td>
        </tr>`;
      return;
    }

    filtered.forEach((item) => {
      let badgeClass = 'badge-secondary';
      if (item.status === 'Matched') badgeClass = 'badge-success';
      if (item.status === 'Missing') badgeClass = 'badge-warning';
      if (item.status === 'Additional') badgeClass = 'badge-info';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span class="badge badge-secondary">${item.category}</span></td>
        <td>${item.isRequiredInJd ? '<span style="color:var(--color-success); font-weight:600;">✓ Yes</span>' : '<span style="color:var(--color-muted);">No</span>'}</td>
        <td>${item.isFoundInResume ? '<span style="color:var(--color-success); font-weight:600;">✓ Found</span>' : '<span style="color:var(--color-danger); font-weight:600;">✕ Absent</span>'}</td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
        <td style="font-size:0.84rem; color:var(--color-muted); max-width:320px;">${item.description}</td>
      `;
      DOM.skillMatrixTableBody.appendChild(tr);
    });
  }

  /**
   * Render Improvement Suggestions Tab
   */
  function renderSuggestionsTab() {
    if (!currentAnalysis) {
      const stats = CareerFitStorage.getStats();
      currentAnalysis = stats.latestAnalysis;
    }

    if (!currentAnalysis) return;

    // 1. Dynamic Action Items List
    const recs = currentAnalysis.recommendations || [];
    DOM.recCountBadge.textContent = `${recs.length} Identified`;
    DOM.recommendationsList.innerHTML = '';

    if (recs.length === 0) {
      DOM.recommendationsList.innerHTML = `
        <div class="rec-card rec-success">
          <div class="rec-icon-wrapper" style="color:var(--color-success);">✓</div>
          <div>
            <div class="rec-title">Outstanding Alignment!</div>
            <div class="rec-text">No critical weaknesses detected. Your resume demonstrates strong skill alignment and clean section structure.</div>
          </div>
        </div>`;
    } else {
      recs.forEach((rec) => {
        let typeClass = 'rec-info';
        if (rec.type === 'critical') typeClass = 'rec-critical';
        if (rec.type === 'warning') typeClass = 'rec-warning';
        if (rec.type === 'success') typeClass = 'rec-success';

        const div = document.createElement('div');
        div.className = `rec-card ${typeClass}`;
        div.innerHTML = `
          <div class="rec-icon-wrapper">
            <span style="font-size:1.1rem;">⚡</span>
          </div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--color-muted); margin-bottom:2px;">
              ${rec.category}
            </div>
            <div class="rec-title">${rec.title}</div>
            <div class="rec-text">${rec.text}</div>
          </div>
        `;
        DOM.recommendationsList.appendChild(div);
      });
    }

    // 2. Prioritized Learning Roadmap
    const roadmap = currentAnalysis.learningPriorities || [];
    DOM.learningRoadmapGrid.innerHTML = '';

    if (roadmap.length === 0) {
      DOM.learningRoadmapGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--color-muted);">
          No missing skills detected! You possess all primary technical skills required by this role.
        </div>`;
    } else {
      roadmap.forEach((item) => {
        let priorityBadge = 'badge-info';
        if (item.priority === 'High') priorityBadge = 'badge-danger';
        if (item.priority === 'Medium') priorityBadge = 'badge-warning';

        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.innerHTML = `
          <div class="roadmap-rank">#${item.rank}</div>
          <div class="roadmap-skill-name">${item.name}</div>
          <div class="roadmap-meta">
            <span class="badge ${priorityBadge}">${item.priority} Priority</span>
            <span class="badge badge-secondary">${item.timeframe}</span>
          </div>
          <div class="roadmap-desc">${item.description}</div>
          <div class="roadmap-action-box">
            <strong>Actionable Goal:</strong> ${item.suggestedAction}
          </div>
        `;
        DOM.learningRoadmapGrid.appendChild(card);
      });
    }

    // 3. Keyword Alignment Tags
    const kw = currentAnalysis.keywords || {};
    DOM.kwMatchedTags.innerHTML = '';
    DOM.kwMissingTags.innerHTML = '';

    if (kw.matched && kw.matched.length > 0) {
      kw.matched.forEach((w) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag skill-tag-matched';
        tag.textContent = `✓ ${w}`;
        DOM.kwMatchedTags.appendChild(tag);
      });
    } else {
      DOM.kwMatchedTags.innerHTML = '<span style="font-size:0.85rem; color:var(--color-muted);">No primary technical keywords matched.</span>';
    }

    if (kw.missing && kw.missing.length > 0) {
      kw.missing.forEach((w) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag skill-tag-missing';
        tag.textContent = `✕ ${w}`;
        DOM.kwMissingTags.appendChild(tag);
      });
    } else {
      DOM.kwMissingTags.innerHTML = '<span style="font-size:0.85rem; color:var(--color-success);">All critical job keywords appear in the resume!</span>';
    }
  }

  /**
   * Render History Tab Table
   */
  function renderHistoryTab() {
    const all = CareerFitStorage.getAll();
    DOM.historyTableBody.innerHTML = '';

    if (all.length === 0) {
      DOM.historyEmptyState.style.display = 'flex';
      DOM.historyNavBadge.textContent = '0';
      return;
    }

    DOM.historyEmptyState.style.display = 'none';
    DOM.historyNavBadge.textContent = all.length;

    all.forEach((item) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${item.displayDate}</strong>
          ${item.isDemo ? '<span class="badge badge-secondary" style="font-size:0.65rem; margin-left:4px;">DEMO</span>' : ''}
        </td>
        <td><strong>${item.candidateName}</strong></td>
        <td>${item.targetRole}</td>
        <td>
          <span class="badge ${item.scores?.badgeClass || 'badge-info'}">
            ${item.scores?.total || 0} / 100 • ${item.scores?.label || ''}
          </span>
        </td>
        <td><span style="color:var(--color-success); font-weight:600;">${item.skills?.matchedCount || 0} Matched</span></td>
        <td><span style="color:var(--color-warning); font-weight:600;">${item.skills?.missingCount || 0} Missing</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-outline btn-sm btn-history-open" data-id="${item.id}">Open</button>
            <button class="btn btn-danger btn-sm btn-history-delete" data-id="${item.id}">Delete</button>
          </div>
        </td>
      `;
      DOM.historyTableBody.appendChild(tr);
    });

    // Attach Open listeners
    DOM.historyTableBody.querySelectorAll('.btn-history-open').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openAnalysisById(id);
      });
    });

    // Attach Delete listeners
    DOM.historyTableBody.querySelectorAll('.btn-history-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this analysis record?')) {
          CareerFitStorage.delete(id);
          showToast('Analysis record deleted.', 'info');
          renderHistoryTab();
          renderDashboard();
        }
      });
    });
  }

  /**
   * Open and restore a historical analysis
   */
  function openAnalysisById(id) {
    const record = CareerFitStorage.getById(id);
    if (!record) {
      showToast('Analysis record not found.', 'danger');
      return;
    }

    currentAnalysis = record;
    switchTab('analyzer');
    renderResults(currentAnalysis);
    DOM.liveResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Loaded analysis for ${record.candidateName} (${record.scores.total}/100)`, 'info');
  }

  /**
   * Copy Prompt Engineering Text to Clipboard
   */
  function handleCopyPrompt() {
    const text = DOM.promptTextContent.innerText || DOM.promptTextContent.textContent;
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopiedSuccess).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        onCopiedSuccess();
      } catch (err) {
        showToast('Unable to copy automatically. Please select and copy manually.', 'warning');
      }
      document.body.removeChild(textarea);
    }

    function onCopiedSuccess() {
      DOM.copyPromptBtnText.textContent = 'Copied!';
      DOM.btnCopyPrompt.style.backgroundColor = 'var(--color-success)';
      DOM.btnCopyPrompt.style.borderColor = 'var(--color-success)';
      DOM.btnCopyPrompt.style.color = '#ffffff';
      showToast('Structured Prompt copied to clipboard!', 'success');

      setTimeout(() => {
        DOM.copyPromptBtnText.textContent = 'Copy Prompt';
        DOM.btnCopyPrompt.style.backgroundColor = '';
        DOM.btnCopyPrompt.style.borderColor = '';
        DOM.btnCopyPrompt.style.color = '';
      }, 2500);
    }
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Tab Navigation
    DOM.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Mobile Menu Toggle
    DOM.mobileMenuBtn.addEventListener('click', () => {
      if (DOM.sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });

    DOM.mobileBackdrop.addEventListener('click', closeMobileSidebar);

    // Quick Sample button in header
    DOM.btnQuickSample.addEventListener('click', () => {
      switchTab('analyzer');
      loadSampleData();
    });

    // Form Character & Word Counters
    DOM.inputResumeText.addEventListener('input', updateCounters);
    DOM.inputJdText.addEventListener('input', updateCounters);

    // Load Sample Buttons in Form
    DOM.btnLoadSampleResume.addEventListener('click', () => {
      DOM.inputCandidateName.value = SAMPLE_DEMO.candidateName;
      DOM.inputTargetRole.value = SAMPLE_DEMO.targetRole;
      DOM.inputResumeText.value = SAMPLE_DEMO.resumeText;
      updateCounters();
      showToast('Sample candidate resume loaded.', 'info');
    });

    DOM.btnClearResume.addEventListener('click', () => {
      DOM.inputResumeText.value = '';
      updateCounters();
    });

    DOM.btnLoadSampleJd.addEventListener('click', () => {
      DOM.inputJdText.value = SAMPLE_DEMO.jdText;
      updateCounters();
      showToast('Sample job description loaded.', 'info');
    });

    DOM.btnClearJd.addEventListener('click', () => {
      DOM.inputJdText.value = '';
      updateCounters();
    });

    // Run Analyze Button
    DOM.btnRunAnalyze.addEventListener('click', handleRunAnalysis);

    // Quick Jump Buttons in Analyzer Result
    DOM.btnJumpToSkills.addEventListener('click', () => switchTab('skills'));
    DOM.btnJumpToSuggestions.addEventListener('click', () => switchTab('suggestions'));

    // Dashboard Action Buttons
    DOM.btnDashViewFull.addEventListener('click', () => {
      switchTab('analyzer');
      if (currentAnalysis) {
        renderResults(currentAnalysis);
        DOM.liveResultsContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });

    DOM.btnDashNewAnalyze.addEventListener('click', () => {
      switchTab('analyzer');
      DOM.inputResumeText.focus();
    });

    DOM.btnDashViewAllHistory.addEventListener('click', () => switchTab('history'));
    DOM.btnQuickNavSkills.addEventListener('click', () => switchTab('skills'));
    DOM.btnQuickNavSuggestions.addEventListener('click', () => switchTab('suggestions'));
    DOM.btnQuickNavPrompt.addEventListener('click', () => switchTab('prompt-eng'));

    DOM.btnDismissDemo.addEventListener('click', () => {
      DOM.demoBanner.classList.add('hidden');
    });

    // Skills Category Filters
    if (DOM.skillFilterButtons) {
      DOM.skillFilterButtons.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          DOM.skillFilterButtons.querySelectorAll('button').forEach((b) => {
            b.className = 'btn btn-outline btn-sm';
          });
          e.currentTarget.className = 'btn btn-primary btn-sm active';
          activeSkillFilter = e.currentTarget.getAttribute('data-filter');
          renderSkillsTab();
        });
      });
    }

    // Clear All History Button
    DOM.btnClearAllHistory.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all analysis history? This cannot be undone.')) {
        CareerFitStorage.clearAll();
        currentAnalysis = null;
        showToast('All analysis records cleared.', 'info');
        renderHistoryTab();
        renderDashboard();
      }
    });

    DOM.btnEmptyStateAnalyze.addEventListener('click', () => {
      switchTab('analyzer');
    });

    // Prompt Engineering: Copy Button
    DOM.btnCopyPrompt.addEventListener('click', handleCopyPrompt);

    // Prompt Engineering: Evolution Tabs
    DOM.evolutionTabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        DOM.evolutionTabBtns.forEach((b) => b.classList.remove('active'));
        DOM.evolutionPanes.forEach((p) => p.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const evo = e.currentTarget.getAttribute('data-evo');
        const targetPane = document.getElementById(`pane-${evo}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  /**
   * Application Entry Point
   */
  function init() {
    initDOMElements();
    setupEventListeners();
    updateCounters();

    // Load initial seed sample if currentAnalysis is not set
    const stats = CareerFitStorage.getStats();
    currentAnalysis = stats.latestAnalysis;

    // Render initial views
    renderDashboard();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
