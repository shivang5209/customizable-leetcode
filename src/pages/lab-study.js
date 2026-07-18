// Page: Lab Study & Simulator Workspace with Udemy Maps & LeetCode Prereq Practice

import loader from '@monaco-editor/loader';
import { LAB_PROGRAMS } from '../data/lab-programs';
import { PREREQ_CHALLENGES } from '../data/prereq-challenges';
import { renderMarkdown } from '../utils/markdown';
import { initSplitPane } from '../components/split-pane';
import { runCodeViaJudge0, runJavaScriptInBrowser } from '../engine/code-runner';
import { showToast } from '../components/toast';

// Static Mapping of lab programs to Udemy Course sections
const UDEMY_MAPPINGS = {
  kruskal: [
    'Section 22 | Lec 373: Introduction to Graphs',
    'Section 22 | Lec 374: Representation of Undirected Graph',
    'Section 22 | Lec 381: Disjoint Subsets (Union-Find Concept)',
    'Section 26 | Lec 412: Minimum Cost Spanning Tree - Introduction',
    'Section 26 | Lec 413: Kruskal\'s Method - MST',
    'Section 26 | Lec 414: Kruskal\'s Algorithm'
  ],
  prim: [
    'Section 22 | Lec 373: Introduction to Graphs',
    'Section 22 | Lec 374: Representation of Undirected Graph',
    'Section 26 | Lec 412: Minimum Cost Spanning Tree - Introduction',
    'Section 26 | Lec 415: Prim\'s Method - MST',
    'Section 26 | Lec 416: Prim\'s Algorithm'
  ],
  floyd: [
    'Section 27 | Dynamic Programming Introduction',
    'Section 27 | Floyd-Warshall All-Pairs Shortest Path'
  ],
  warshall: [
    'Section 27 | Dynamic Programming Introduction',
    'Section 27 | Transitive Closure (Warshall\'s Algorithm)',
    'Section 22 | Graphs - Adjacency Matrix & Connectivity'
  ],
  dijkstra: [
    'Section 22 | Lec 373: Introduction to Graphs',
    'Section 22 | Lec 375: Representation of Directed Graphs',
    'Section 26 | Lec 417: Dijkstra - Single Source Shortest Path',
    'Section 26 | Lec 418: Dijkstra Algorithm'
  ],
  topo: [
    'Section 22 | Lec 373: Introduction to Graphs',
    'Section 22 | Lec 375: Representation of Directed Graphs',
    'Section 22 | Lec 378: Depth First Search (DFS)'
  ],
  'knapsack-dp': [
    'Section 27 | Lec 420: Dynamic Programming - Introduction',
    'Section 27 | Lec 421: Recursion and Dynamic Programming',
    'Section 27 | Lec 422: 0/1 Knapsack Problem',
    'Section 27 | Lec 424: 0/1 Knapsack using Recursion',
    'Section 27 | Lec 425: 0/1 Knapsack using Memoization',
    'Section 27 | Lec 426: 0/1 Knapsack using Tabulation'
  ],
  'knapsack-greedy': [
    'Section 26 | Lec 408: What are Optimization Problems?',
    'Section 26 | Lec 409: Greedy Method - Introduction',
    'Section 26 | Lec 410: Knapsack Problem - Fractional',
    'Section 26 | Lec 411: Knapsack Algorithm'
  ],
  'subset-sum': [
    'Section 28 | Lec 440: Recursion - BruteForce - Backtracking',
    'Section 28 | Lec 441: Backtracking - Introduction',
    'Section 28 | Subset Sum Problem'
  ],
  'selection-sort': [
    'Section 20 | Lec 345: Selection Sort',
    'Section 20 | Lec 346: Program for Selection Sort',
    'Section 20 | Lec 347: Analysis of Selection Sort',
    'Section 20 | Lec 348: Let\'s Code Selection Sort'
  ],
  'quick-sort': [
    'Section 20 | Lec 349: Idea behind Quick Sort',
    'Section 20 | Lec 350: Quick Sort',
    'Section 20 | Lec 351: Analysis of Quick Sort',
    'Section 20 | Lec 352: Analysis of Quick Sort Continued...',
    'Section 20 | Lec 353: Let\'s Code Quick Sort'
  ],
  'merge-sort': [
    'Section 20 | Lec 354: Merging',
    'Section 20 | Lec 355: Iterative Merge Sort',
    'Section 20 | Lec 356: Let\'s Code Iterative Merge Sort',
    'Section 20 | Lec 357: Recursive Merge Sort',
    'Section 20 | Lec 358: Let\'s Code Recursive Merge Sort'
  ],
  nqueens: [
    'Section 28 | Lec 440: Recursion - BruteForce - Backtracking',
    'Section 28 | Lec 441: Backtracking - Introduction',
    'Section 28 | Lec 442: N-Queens Problem - Introduction',
    'Section 28 | Lec 443: N-Queens Problem - Solution',
    'Section 28 | Lec 444: N-Queens Algorithm'
  ]
};

export function renderLabStudy(container, programId) {
  const program = LAB_PROGRAMS.find(p => p.id === programId);
  if (!program) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center; max-width: 600px; margin: 2rem auto;">
        <h2>Program Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The requested lab program does not exist in the database.</p>
        <a href="#/lab" class="btn btn-primary">Go to Lab Dashboard</a>
      </div>
    `;
    return;
  }

  // Prerequisite sub-challenge database lookup
  const prereqChallenge = PREREQ_CHALLENGES[programId] || null;

  // Dual-mode Workspace State
  let isPracticing = false; // true if practicing the LeetCode JS sub-challenge
  let activeStudyTab = 'prereqs'; // 'prereqs', 'refcode'
  let activeConsoleTab = 'testcases'; // 'testcases', 'output', 'verdict'
  let isRunningCode = false;
  let editorInstance = null;
  let executionResults = null;
  
  // Stdin for lab simulator
  let stdinVal = localStorage.getItem(`lab_stdin_${program.id}`) || program.sampleInput;

  // Build the layout HTML
  container.innerHTML = `
    <!-- PRACTICE BANNER -->
    <div id="prereq-banner" style="display: none; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2)); border-bottom: 1px solid var(--color-easy); padding: 0.75rem 2rem; align-items: center; justify-content: space-between;">
      <span style="font-weight: 600; color: #6ee7b7; font-size: 0.9rem;">
        ⚠️ PRACTICING PREREQUISITE: <span id="banner-prereq-title"></span> (JavaScript)
      </span>
      <button class="btn btn-primary" id="exit-practice-btn" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: var(--color-easy);">
        ⬅️ Return to Lab Program
      </button>
    </div>

    <div class="problem-editor-container animate-fade-in" id="split-container">
      
      <!-- LEFT PANE: STUDY HUB -->
      <div class="pane left-pane" id="left-pane">
        <div class="pane-header">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span id="study-panel-title">📖 Study Hub</span>
            <span class="badge badge-medium" style="text-transform: none; font-size: 0.7rem;">${program.paradigm}</span>
          </div>
          <a href="#/lab" class="nav-link" style="font-size: 0.8rem;">🎓 Lab Dashboard</a>
        </div>
        
        <!-- Study Tabs Navigation -->
        <div class="console-tabs" id="study-tabs-nav" style="background: rgba(0,0,0,0.15);">
          <div class="console-tab active" data-studytab="prereqs" style="flex: 1; text-align: center;">1. Prerequisites</div>
          <div class="console-tab" data-studytab="refcode" style="flex: 1; text-align: center;">2. Syllabus Code</div>
        </div>

        <div class="pane-body" id="study-tab-content">
          <!-- Injected dynamically -->
        </div>
      </div>

      <!-- RESIZER BAR -->
      <div class="resizer" id="pane-resizer"></div>

      <!-- RIGHT PANE: EDITOR & SIMULATOR -->
      <div class="pane right-pane" id="right-pane">
        
        <!-- EDITOR HEADER -->
        <div class="pane-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span id="editor-title">💻 Simulator (C Language)</span>
          </div>
          <div>
            <button class="btn btn-secondary" id="reset-code-btn" style="padding: 0.2rem 0.6rem; font-size: 0.8rem;">Reset Code</button>
          </div>
        </div>

        <!-- MONACO EDITOR CONTAINER -->
        <div class="editor-wrapper">
          <div id="monaco-container"></div>
        </div>

        <!-- CONSOLE PANEL -->
        <div class="console-panel" id="console-panel" style="height: 320px;">
          <div class="console-tabs" id="console-tabs-nav">
            <!-- Tabs injected dynamically -->
          </div>

          <div class="console-body" id="console-tab-content" style="padding: 0.85rem; height: calc(100% - 100px); overflow-y: auto;">
            <!-- Content will be injected dynamically -->
          </div>

          <!-- ACTIONS BAR -->
          <div class="run-actions">
            <button class="btn btn-primary" id="run-btn" style="padding: 0.5rem 1.5rem;">▶️ Run Code</button>
          </div>
        </div>

      </div>
    </div>
  `;

  // --- Initialize Resizer ---
  const splitContainer = container.querySelector('#split-container');
  const leftPane = container.querySelector('#left-pane');
  const resizer = container.querySelector('#pane-resizer');
  const rightPane = container.querySelector('#right-pane');
  initSplitPane(splitContainer, leftPane, resizer, rightPane);

  // --- Study Tab Rendering ---
  const studyTabContent = container.querySelector('#study-tab-content');
  const studyTabs = container.querySelectorAll('[data-studytab]');

  function renderStudyTab() {
    // If practicing, left panel renders the sub-challenge description only
    if (isPracticing && prereqChallenge) {
      container.querySelector('#study-tabs-nav').style.display = 'none';
      container.querySelector('#study-panel-title').innerText = '🎯 Prerequisite Task';
      studyTabContent.innerHTML = `
        <div class="problem-details">
          <h2 style="margin-top: 0; font-size: 1.3rem; color: var(--text-primary);">${prereqChallenge.title}</h2>
          <span class="badge badge-easy" style="margin-bottom: 1rem; text-transform: none;">LeetCode-style sub-challenge</span>
          
          <div style="margin-top: 1rem; line-height: 1.5;">
            ${renderMarkdown(prereqChallenge.description)}
          </div>
        </div>
      `;
      return;
    }

    // Normal Study Mode
    container.querySelector('#study-tabs-nav').style.display = 'flex';
    container.querySelector('#study-panel-title').innerText = '📖 Study Hub';

    studyTabs.forEach(t => {
      if (t.dataset.studytab === activeStudyTab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    if (activeStudyTab === 'prereqs') {
      const udemySections = UDEMY_MAPPINGS[programId] || [];
      const sectionsHtml = udemySections.map(sec => `
        <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.25rem;">📺</span>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Recommended watch</div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #93c5fd;">${sec}</div>
          </div>
        </div>
      `).join('');

      const challengeHtml = prereqChallenge 
        ? `
          <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
            <h3 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> LeetCode Sub-Challenge Practice
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
              Before writing the full lab code, test your understanding by solving the key sub-concept in JavaScript:
            </p>
            <div class="glass-panel" style="padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--accent-blue);">
              <div>
                <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${prereqChallenge.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">JS coding task & test runner</div>
              </div>
              <button class="btn btn-primary" id="start-practice-btn" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Solve Sub-Concept</button>
            </div>
          </div>
        ` 
        : '';

      studyTabContent.innerHTML = `
        <div class="problem-details">
          <h2 style="margin-top: 0; font-size: 1.35rem; color: var(--text-primary);">${program.title}</h2>
          <p style="color: var(--text-secondary); font-style: italic; margin-bottom: 1.5rem; font-size: 0.9rem;">
            ${program.problemStatement}
          </p>

          <!-- Udemy Mapping Recommendations -->
          <h3 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">
            📺 Udemy Reference Lectures (Abdul Bari)
          </h3>
          <div style="margin-bottom: 1.5rem;">
            ${sectionsHtml || '<p style="color: var(--text-muted); font-size: 0.85rem;">No direct Udemy sections mapped.</p>'}
          </div>

          <!-- Prerequisite Details -->
          ${renderMarkdown(program.prerequisites)}

          <!-- Sub-Challenge Link -->
          ${challengeHtml}
        </div>
      `;

      // Attach Practice Event Listener
      const practiceBtn = studyTabContent.querySelector('#start-practice-btn');
      if (practiceBtn) {
        practiceBtn.addEventListener('click', enterPrereqPractice);
      }
    }

    if (activeStudyTab === 'refcode') {
      studyTabContent.innerHTML = `
        <div class="problem-details">
          <h2 style="margin-top: 0; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.75rem;">Syllabus Reference Code</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            This is the exact code provided in your syllabus PDF. Use this implementation for your practical exam.
          </p>
          <pre class="code-block" style="font-size: 0.8rem; background: #030508; border: 1px solid var(--border-color); color: #abb2bf;"><code class="language-c">${program.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      `;
    }
  }

  studyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeStudyTab = tab.dataset.studytab;
      renderStudyTab();
    });
  });

  // Render the initial tab content immediately on page load
  renderStudyTab();

  // --- Monaco Editor Initialization ---
  let initialCodeValue = localStorage.getItem(`lab_code_${program.id}`) || program.code;

  loader.init().then(monaco => {
    editorInstance = monaco.editor.create(container.querySelector('#monaco-container'), {
      value: initialCodeValue,
      language: 'c',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: 'Fira Code, monospace',
      lineNumbers: 'on',
      tabSize: 4
    });

    editorInstance.onDidChangeModelContent(() => {
      if (!isPracticing) {
        localStorage.setItem(`lab_code_${program.id}`, editorInstance.getValue());
      } else {
        localStorage.setItem(`prereq_code_${prereqChallenge.id}`, editorInstance.getValue());
      }
    });
  });

  // Reset Code Button
  const resetBtn = container.querySelector('#reset-code-btn');
  resetBtn.addEventListener('click', () => {
    if (!isPracticing) {
      if (confirm('Are you sure you want to revert your edits to the default syllabus code?')) {
        editorInstance.setValue(program.code);
        localStorage.removeItem(`lab_code_${program.id}`);
        showToast('Reverted to syllabus code.', 'info');
      }
    } else {
      if (confirm('Are you sure you want to reset the sub-challenge boilerplate?')) {
        editorInstance.setValue(prereqChallenge.boilerplate);
        localStorage.removeItem(`prereq_code_${prereqChallenge.id}`);
        showToast('Reverted boilerplate.', 'info');
      }
    }
  });

  // --- Console Tab Content Management ---
  const consoleTabsNav = container.querySelector('#console-tabs-nav');
  const consoleTabContent = container.querySelector('#console-tab-content');

  function renderConsoleTab() {
    const tabs = consoleTabsNav.querySelectorAll('.console-tab');
    tabs.forEach(t => {
      if (t.dataset.tab === activeConsoleTab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    if (isPracticing && prereqChallenge) {
      // Practicing Mode Console: testcases (LeetCode style) vs verdict
      if (activeConsoleTab === 'testcases') {
        const tc = prereqChallenge.testCases[0]; // Renders the first test case parameters representation
        consoleTabContent.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">🎯 Prerequisite Test Case Inputs</div>
            <div>
              <div class="tc-io-label">Input parameters</div>
              <pre class="tc-io-val" style="font-size: 0.75rem; max-height: 80px;">${JSON.stringify(tc.input, null, 2)}</pre>
            </div>
            <div>
              <div class="tc-io-label">Expected Output</div>
              <pre class="tc-io-val" style="color: var(--color-easy); font-size: 0.75rem;">${JSON.stringify(tc.expected_output)}</pre>
            </div>
          </div>
        `;
      } else if (activeConsoleTab === 'verdict') {
        if (!executionResults) {
          consoleTabContent.innerHTML = `<div style="color: var(--text-muted);">Run code first to see LeetCode grading results.</div>`;
          return;
        }

        if (!executionResults.success) {
          consoleTabContent.innerHTML = `
            <div style="color: var(--color-hard); font-weight: 600; margin-bottom: 0.5rem;">Syntax / Runtime Error:</div>
            <pre style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 0.75rem; border-radius: 6px; color: #f87171; font-size: 0.8rem; white-space: pre-wrap; word-break: break-all;">${executionResults.error || 'Execution failed'}</pre>
          `;
          return;
        }

        const total = executionResults.results.length;
        const passed = executionResults.results.filter(r => r.passed).length;
        const allPassed = passed === total;

        consoleTabContent.innerHTML = `
          <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.25rem;">${allPassed ? '✅' : '❌'}</span>
            <div>
              <h3 style="margin: 0; color: ${allPassed ? 'var(--color-easy)' : 'var(--color-hard)'};">
                ${allPassed ? 'Prerequisite Accepted!' : 'Wrong Answer'}
              </h3>
              <div style="color: var(--text-secondary); font-size: 0.8rem;">
                ${passed} / ${total} Test Cases Passed
              </div>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${executionResults.results.map((res, idx) => `
              <div style="border: 1px solid ${res.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 6px; padding: 0.6rem; background: rgba(0,0,0,0.15); font-size: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <strong>Case ${idx + 1}</strong>
                  <span class="${res.passed ? 'tc-badge-pass' : 'tc-badge-fail'}">${res.passed ? 'PASSED' : 'FAILED'}</span>
                </div>
                <div>Expected: <code style="color: var(--color-easy);">${JSON.stringify(res.expected)}</code></div>
                <div>Returned: <code style="color: ${res.passed ? 'var(--color-easy)' : 'var(--color-hard)'};">${JSON.stringify(res.actual)}</code></div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else {
      // Normal Simulator Mode Console: stdin vs output
      if (activeConsoleTab === 'testcases') {
        consoleTabContent.innerHTML = `
          <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">⌨️ Standard Input (stdin)</span>
              <button class="btn btn-secondary" id="load-sample-btn" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">📋 Load PDF Sample Input</button>
            </div>
            <textarea class="textarea-input" id="stdin-textarea" style="flex: 1; min-height: 80px; font-family: var(--font-mono); font-size: 0.85rem; background: #040609; resize: none; margin-bottom: 0.5rem; padding: 0.5rem;" placeholder="Type terminal inputs here...">${stdinVal}</textarea>
            
            <div style="border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 0.25rem;">Expected PDF Output</div>
              <pre style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 4px; padding: 0.4rem; color: var(--color-easy); font-size: 0.75rem; white-space: pre-wrap; font-family: var(--font-mono); max-height: 65px; overflow-y: auto;">${program.sampleOutput}</pre>
            </div>
          </div>
        `;

        const loadSampleBtn = consoleTabContent.querySelector('#load-sample-btn');
        loadSampleBtn.addEventListener('click', () => {
          stdinVal = program.sampleInput;
          const txtArea = consoleTabContent.querySelector('#stdin-textarea');
          if (txtArea) txtArea.value = stdinVal;
          localStorage.setItem(`lab_stdin_${program.id}`, stdinVal);
          showToast('Sample input loaded!', 'success');
        });

        const txtArea = consoleTabContent.querySelector('#stdin-textarea');
        txtArea.addEventListener('input', (e) => {
          stdinVal = e.target.value;
          localStorage.setItem(`lab_stdin_${program.id}`, stdinVal);
        });
      } else if (activeConsoleTab === 'output') {
        if (!executionResults) {
          consoleTabContent.innerHTML = `<div style="color: var(--text-muted);">Run code first to see execution output.</div>`;
          return;
        }

        if (!executionResults.success) {
          consoleTabContent.innerHTML = `
            <div style="color: var(--color-hard); font-weight: 600; margin-bottom: 0.25rem;">Execution Error:</div>
            <pre style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 0.75rem; border-radius: 6px; color: #f87171; font-size: 0.8rem; white-space: pre-wrap; word-break: break-all;">${executionResults.error || 'Execution failed'}</pre>
          `;
          return;
        }

        consoleTabContent.innerHTML = `
          <div style="height: 100%; display: flex; flex-direction: column;">
            <div style="flex: 1; overflow-y: auto; margin-bottom: 0.5rem;">
              <div style="font-weight: 600; color: var(--accent-blue); font-size: 0.8rem; margin-bottom: 0.25rem;">Standard Output (stdout):</div>
              <pre style="background: rgba(255, 255, 255, 0.02); padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.8rem; white-space: pre-wrap; min-height: 50px;">${executionResults.stdout || '[No Output]'}</pre>
            </div>
            ${executionResults.stderr ? `
              <div style="flex: 1; overflow-y: auto;">
                <div style="font-weight: 600; color: var(--color-hard); font-size: 0.8rem; margin-bottom: 0.25rem;">Standard Error (stderr):</div>
                <pre style="background: rgba(239, 68, 68, 0.05); padding: 0.5rem; border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 4px; font-size: 0.8rem; color: #f87171; white-space: pre-wrap;">${executionResults.stderr}</pre>
              </div>
            ` : ''}
            <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right; border-top: 1px solid var(--border-color); padding-top: 0.25rem;">
              Time: ${executionResults.timeMs}ms
            </div>
          </div>
        `;
      }
    }
  }

  function renderConsoleTabsNav() {
    if (isPracticing) {
      consoleTabsNav.innerHTML = `
        <div class="console-tab ${activeConsoleTab === 'testcases' ? 'active' : ''}" data-tab="testcases">Sub-Challenge Test Cases</div>
        <div class="console-tab ${activeConsoleTab === 'verdict' ? 'active' : ''}" data-tab="verdict">Sub-Challenge Verdict</div>
      `;
    } else {
      consoleTabsNav.innerHTML = `
        <div class="console-tab ${activeConsoleTab === 'testcases' ? 'active' : ''}" data-tab="testcases">Stdin Inputs</div>
        <div class="console-tab ${activeConsoleTab === 'output' ? 'active' : ''}" data-tab="output">Console Output</div>
      `;
    }

    consoleTabsNav.querySelectorAll('.console-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeConsoleTab = tab.dataset.tab;
        renderConsoleTab();
      });
    });
  }

  // --- Transition Dual State functions ---

  function enterPrereqPractice() {
    if (!prereqChallenge) return;

    isPracticing = true;
    executionResults = null;
    activeConsoleTab = 'testcases';

    // Show banner
    container.querySelector('#prereq-banner').style.display = 'flex';
    container.querySelector('#banner-prereq-title').innerText = prereqChallenge.title;

    // Update panel headers
    container.querySelector('#editor-title').innerText = `💻 Practicing Sub-Concept (JavaScript)`;

    // Update study content on left
    renderStudyTab();

    // Toggle Monaco Editor to JS and load boilerplate
    const currentCodeModel = editorInstance.getModel();
    if (currentCodeModel) {
      const savedPrereqCode = localStorage.getItem(`prereq_code_${prereqChallenge.id}`);
      editorInstance.setValue(savedPrereqCode || prereqChallenge.boilerplate);
      monaco.editor.setModelLanguage(currentCodeModel, 'javascript');
    }

    // Refresh Console Tabs
    renderConsoleTabsNav();
    renderConsoleTab();
    
    showToast(`Loaded task: ${prereqChallenge.title}`, 'info');
  }

  function exitPrereqPractice() {
    isPracticing = false;
    executionResults = null;
    activeConsoleTab = 'testcases';

    // Hide banner
    container.querySelector('#prereq-banner').style.display = 'none';

    // Reset panel headers
    container.querySelector('#editor-title').innerText = `💻 Simulator (C Language)`;

    // Reset study panel left
    renderStudyTab();

    // Toggle Monaco Editor to C and restore lab code
    const currentCodeModel = editorInstance.getModel();
    if (currentCodeModel) {
      const savedLabCode = localStorage.getItem(`lab_code_${program.id}`);
      editorInstance.setValue(savedLabCode || program.code);
      monaco.editor.setModelLanguage(currentCodeModel, 'c');
    }

    // Refresh Console Tabs
    renderConsoleTabsNav();
    renderConsoleTab();
    
    showToast('Returned to Lab Program Simulator', 'info');
  }

  // Exit practice click event
  container.querySelector('#exit-practice-btn').addEventListener('click', exitPrereqPractice);

  // Initial console rendering
  renderConsoleTabsNav();
  renderConsoleTab();

  // --- Run Code Execution Trigger ---
  const runBtn = container.querySelector('#run-btn');

  async function handleRun() {
    if (isRunningCode) return;

    isRunningCode = true;
    runBtn.disabled = true;

    if (isPracticing && prereqChallenge) {
      // Practicing mode: Run JS code locally in worker
      showToast('Evaluating JavaScript solution...', 'info');
      activeConsoleTab = 'verdict';
      consoleTabContent.innerHTML = `<div style="color: var(--text-primary);"><span style="display:inline-block; animation: spin 1s infinite linear; margin-right: 0.5rem;">⏳</span> Grading JavaScript...</div>`;
      renderConsoleTab();
      renderConsoleTabsNav();

      const userJsCode = editorInstance.getValue();
      const mockProblem = {
        function_signature: prereqChallenge.functionSignature,
        test_cases: prereqChallenge.testCases
      };

      try {
        executionResults = await runJavaScriptInBrowser(userJsCode, mockProblem);
        if (executionResults.success) {
          const total = executionResults.results.length;
          const passed = executionResults.results.filter(r => r.passed).length;
          if (passed === total) {
            showToast('All Sub-Challenge tests passed!', 'success');
          } else {
            showToast(`Wrong Answer. Passed ${passed}/${total} test cases.`, 'error');
          }
        } else {
          showToast('Syntax or execution error.', 'error');
        }
      } catch (err) {
        executionResults = { success: false, error: err.message };
        showToast('Local execution runner failed.', 'error');
      } finally {
        isRunningCode = false;
        runBtn.disabled = false;
        renderConsoleTab();
      }
      
    } else {
      // Normal Simulator Mode: Run C code via Judge0
      showToast('Running C code in compiler...', 'info');
      activeConsoleTab = 'output';
      consoleTabContent.innerHTML = `
        <div style="color: var(--text-primary);">
          <span style="display:inline-block; animation: spin 1s infinite linear; margin-right: 0.5rem;">⏳</span> Compiling and executing...
        </div>
      `;
      renderConsoleTab();
      renderConsoleTabsNav();

      const userCode = editorInstance.getValue();

      try {
        executionResults = await runCodeViaJudge0(userCode, 'c', null, null, stdinVal);
        if (executionResults.success) {
          showToast('Compilation completed successfully!', 'success');
        } else {
          showToast('Execution error. Check compile logs.', 'error');
        }
      } catch (err) {
        executionResults = {
          success: false,
          error: `Compiler Engine Failed: ${err.message}`
        };
        showToast('Compiler failed to run.', 'error');
      } finally {
        isRunningCode = false;
        runBtn.disabled = false;
        renderConsoleTab();
      }
    }
  }

  runBtn.addEventListener('click', handleRun);
}
