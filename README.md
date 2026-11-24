# CareerFit — Resume & Job Readiness Analyzer

**CareerFit** is a complete, modern, responsive web application designed for college students, freshers, and entry-level job seekers to analyze their resumes against specific job descriptions. 

This project was built as a College Major Project for the subject **AI and Prompt Engineering**. It provides a fully functional, deterministic, client-side analysis engine with zero external API dependencies, zero cost, and zero server configuration.

---

## 📌 Problem Statement

College students and freshers applying for internships and entry-level tech roles frequently struggle with:
1. **The ATS Black Box:** Not knowing why their resume gets filtered out before reaching a recruiter.
2. **Hidden Skill Gaps:** Failing to identify specific technical competencies requested in job descriptions (e.g., Git, REST APIs, SQL, DSA).
3. **Weak Resume Presentation:** Missing critical sections (Education, Projects, Certifications), lacking contact details, or omitting quantifiable achievements.
4. **Vague AI Feedback:** Generic feedback from conversational LLMs that fabricate experience, provide cheerleading instead of critique, or recommend senior-level architectures infeasible for college students.

**CareerFit** solves this by providing instantaneous, transparent, reproducible resume analysis, skill matrix mapping, and a prioritized learning roadmap.

---

## 🚀 Key Features

### 1. Modern SaaS Dashboard
- **Welcome & Overview:** Clear application overview with clean statistics.
- **Dynamic Metric Cards:** Total resumes analyzed, latest compatibility score, matched skills count, and missing skills count.
- **Visual Score Representation:** Circular SVG gauge reflecting overall candidate readiness.
- **Demo vs. Authentic Data Differentiation:** Displays a seed demo preview initially, which seamlessly transitions to real user data as analyses are executed.

### 2. Resume & Job Description Analyzer
- **Dual Input Interface:** Separate textareas for Resume and Job Description with live word and character counters.
- **Optional Metadata:** Candidate name and target role inputs for personalized report generation.
- **One-Click Demo Fill:** "Load Sample Resume" and "Load Sample Job Description" buttons for frictionless live evaluation and vivas.
- **Multi-Step Loading Simulation:** Realistic visual progression illustrating text tokenization, requirement cross-referencing, multi-factor scoring, and recommendation synthesis.

### 3. Precision Analysis Engine
- **Predefined Skills Dictionary:** Categorized dictionary across:
  - *Programming Languages:* C, C++, Java, Python, JavaScript
  - *Web Development:* HTML, CSS, React, Node.js, Express, REST API
  - *Tools & DevOps:* Git, GitHub, VS Code, Docker
  - *Databases:* SQL, MySQL, MongoDB
  - *Core Computer Science:* Data Structures, Algorithms, Operating Systems, Computer Networks, DBMS
  - *Soft Skills:* Communication, Problem Solving, Teamwork, Leadership
- **Boundary-Aware Matching:** Strict regex boundary patterns avoid false positives (e.g., matching procedural "C" will not falsely match "CSS", "C++", or "Computer"; "Java" will not match "JavaScript"; "Git" will not match "GitHub").
- **Tri-Color Skill Categorization:**
  - 🟢 **Matched Skills:** Present in both resume and job posting.
  - 🟠 **Missing Skills:** Demanded by employer, absent in resume.
  - 🔵 **Additional Skills:** Possessed by candidate as bonus competencies.

### 4. Transparent Compatibility Scoring (0–100)
The score is calculated deterministically across 4 weighted components:
1. **Skill Match (50 Points):** Direct ratio of job-required skills present in the resume.
2. **Resume Completeness (20 Points):** Detection of 5 standard sections (Education, Skills, Projects, Experience, Certifications @ 4 points each).
3. **Keyword Alignment (20 Points):** Verification of domain engineering keywords and responsibilities.
4. **Resume Quality & Formatting (10 Points):** Email format check (2 pts), phone number check (2 pts), reasonable word count (2 pts), action verbs (2 pts), and quantifiable achievements/metrics (2 pts).

> **Important Academic Disclaimer:** This score is an educational compatibility benchmark designed to guide student preparation. It is not an actual commercial ATS algorithm and does not guarantee employment.

### 5. Skills Analysis Matrix & Filtering
- Granular breakdown table of all evaluated competencies.
- Interactive category filtering (Programming, Web Dev, Tools, Database, Core CS, Soft Skills).
- Status indicators for employer requirements vs. candidate resume proof.

### 6. Dynamic Improvement Recommendations & Learning Roadmap
- **Contextual Suggestions:** Dynamically generates advice based on missing sections (e.g. "Add a Projects section containing 2–3 relevant academic projects", "Consider learning Git and GitHub", "Include graduation year and GPA").
- **Prioritized Learning Priorities:** Ranked cards for missing skills featuring priority level, estimated completion timeframe (e.g. 1–2 weeks), and concrete project milestones.
- **Quality Checklist:** 7-point audit covering email, phone, sections, length, and action verbs.

### 7. LocalStorage Analysis History
- Persists user evaluations in browser storage across sessions.
- View previous analyses, inspect full historical reports, delete individual records, or clear all history.
- Handles empty history states gracefully.

### 8. AI Review Framework (Prompt Engineering Showcase)
- **Academic Component for AI & Prompt Engineering:** Demonstrates the Role-Context-Task-Output-Constraints (RCTOC) prompt design architecture.
- **Production Standard Prompt Card:** Ready-to-use structured prompt with a 1-click **Copy Prompt** button.
- **Interactive Evolution Comparison:** Compares Basic Prompt vs. Structured Prompt vs. Production Prompt, highlighting hallucination risks, persona drift, and negative constraint enforcement.
- **Viva Defense Points:** Prepares undergraduate students to explain client-side deterministic algorithms vs. generative LLMs.

---

## 🛠️ Technologies Used

- **HTML5:** Semantic markup, accessibility attributes, and responsive containers.
- **CSS3:** Pure custom modern SaaS design system, CSS Grid, Flexbox, CSS Variables, SVG circular gauges, and mobile media queries. No external frameworks or CDNs required.
- **JavaScript (ES6+):** Pure modular JavaScript (`analyzer.js`, `storage.js`, `app.js`).
- **Web Storage API (`window.localStorage`):** Persistent client-side session history.
- **SVG / Canvas:** Pure CSS/SVG vector data visualizations.

---

## 💻 How to Run Locally

Because CareerFit is built entirely with vanilla client-side technologies, no Node.js backend, Python server, database, or API keys are required.

### Method 1: Direct File Opening
1. Clone or download this repository.
2. Navigate to the project folder.
3. Double-click `index.html` (or right-click and select "Open with Google Chrome / Firefox / Safari / Edge").

### Method 2: Local Static Server (Optional)
If you prefer running via a local server:

Using Python:
```bash
# In the project root directory:
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

Using Node (`npx serve`):
```bash
npx serve .
```

Using VS Code:
- Install the **Live Server** extension and click **Go Live**.

---

## 🔬 Scoring Methodology Breakdown

$$\text{Overall Score} = \text{Skill Match (50)} + \text{Completeness (20)} + \text{Keyword Match (20)} + \text{Quality (10)}$$

| Component | Max Points | Evaluation Logic |
| :--- | :---: | :--- |
| **Skill Match** | 50 | $\frac{\text{Matched Skills}}{\text{Total Job Required Skills}} \times 50$ |
| **Completeness** | 20 | 4 points each for detected sections: `Education`, `Skills`, `Projects`, `Experience`, `Certifications`. |
| **Keyword Match** | 20 | $\frac{\text{Matched Domain Keywords}}{\text{Total Job Keywords}} \times 20$ (evaluates testing, debugging, databases, backend, etc.). |
| **Quality & Formatting** | 10 | 2 pts for Email + 2 pts for Phone + 2 pts for Length (70–900 words) + 2 pts for Action Verbs + 2 pts for Metrics/Achievements. |

### Score Classification
- **80 – 100:** Strong Match (Green) — High alignment with job requirements.
- **60 – 79:** Moderate Match (Blue) — Good foundation; 1–2 key tools or frameworks missing.
- **40 – 59:** Needs Improvement (Amber) — Multiple foundational skills or core sections missing.
- **Below 40:** Low Match (Red) — Significant misalignment between resume and job role.

---

## 🎯 Test Cases Covered

1. **Full Match:** Resume contains all requested skills $\rightarrow$ High score (85–100%).
2. **Partial Match:** Resume contains some required skills $\rightarrow$ Moderate score (60–79%) with prioritized missing skills.
3. **Minimal Match:** Resume contains almost no required skills $\rightarrow$ Low match (<40%) with comprehensive learning roadmap.
4. **Missing Projects:** Triggers high-priority recommendation: *"Add a Projects section containing 2–3 relevant academic or personal projects"*.
5. **Missing Education:** Prompts user to include degree, graduation year, and GPA.
6. **Empty Resume / Job Description:** Immediate visual validation alert preventing blank execution.
7. **Different Job Descriptions:** Produces distinct, content-dependent results tailored to each input.
8. **LocalStorage Persistence:** Saves multiple evaluations, supports reopening past analyses, and allows full deletion.
9. **One-Click Demo:** Loads sample candidate "Rahul Sharma" and Software Development Intern posting for live defense.
10. **Mobile Responsiveness:** Clean navigation drawer and responsive fluid layout on mobile and tablet viewports.

---

## ⚠️ Limitations

- **Client-Side Dictionary Scope:** Skill extraction relies on an engineered dictionary of common tech stacks and CS fundamentals. Extremely obscure or brand-new niche libraries may not be detected unless added to `SKILLS_DICTIONARY`.
- **Text-Based Parsing:** Requires text input (copy-pasted from PDF/Word). Does not perform OCR on scanned PDF image files.
- **Educational Approximation:** Evaluates keyword overlap and section presence; actual recruitment involves human context and behavioral interviewing.

---

## 🔮 Future Scope

- **PDF / DOCX File Drag-and-Drop:** Client-side text extraction using `pdf.js`.
- **Export to PDF Report:** One-click downloadable PDF summary of the analysis report.
- **Custom Skill Dictionary Expansion:** Allowing users to add customized tech stacks or non-tech roles (e.g., Marketing, Finance).
- **Optional Local LLM Hook (WebLLM / Ollama):** For users with capable GPUs wanting local generative phrasing improvements.

---

## 👥 Project Team

- **Student 1:** [Student Name] — Lead Developer & UI Architecture
- **Student 2:** [Student Name] — Analysis Engine & Regex Tokenization
- **Student 3:** [Student Name] — Prompt Engineering & Evaluation Framework

**Course:** AI and Prompt Engineering  
**Academic Year:** 2026–2027  
**Institution:** [College / University Name]
