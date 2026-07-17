// Page: Problem Solve View (HackerRank-style)

import loader from '@monaco-editor/loader';
import { getProblem, saveSubmission, getSubmission } from '../utils/storage';
import { renderMarkdown } from '../utils/markdown';
import { initSplitPane } from '../components/split-pane';
import { runJavaScriptInBrowser, runCodeViaJudge0 } from '../engine/code-runner';
import { showToast } from '../components/toast';

export function renderProblemView(container, problemId) {
  const problem = getProblem(problemId);
  if (!problem) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center; max-width: 600px; margin: 2rem auto;">
        <h2>Problem Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">The requested problem does not exist in your local library.</p>
        <a href="#/library" class="btn btn-primary">Go to Library</a>
      </div>
    `;
    return;
  }

  // State
  let activeConsoleTab = 'testcases'; // 'testcases', 'output', 'verdict'
  let activeTestCaseIdx = 0;
  let isRunningCode = false;
  let editorInstance = null;
  let selectedLanguage = 'javascript';
  let executionResults = null;

  // Build the layout HTML
  container.innerHTML = `
    <div class="problem-editor-container animate-fade-in" id="split-container">
      
      <!-- LEFT PANE: DESCRIPTION -->
      <div class="pane left-pane" id="left-pane">
        <div class="pane-header">
          <span>📝 Problem Details</span>
          <a href="#/library" class="nav-link" style="font-size: 0.8rem;">📚 Library</a>
        </div>
        <div class="pane-body problem-details">
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
            <h1 style="margin: 0; font-size: 1.5rem;">${problem.title}</h1>
            <span class="badge badge-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
          </div>
          
          <div style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${(problem.topics || []).map(topic => `<span class="chip" style="cursor: default;">${topic}</span>`).join('')}
          </div>

          <div style="margin-top: 1rem;">
            ${renderMarkdown(problem.description)}
          </div>

          <h2>Examples</h2>
          ${problem.examples.map((ex, idx) => `
            <div class="example-box">
              <strong>Example ${idx + 1}:</strong><br>
              <strong>Input:</strong> ${ex.input}<br>
              <strong>Output:</strong> ${ex.output}<br>
              ${ex.explanation ? `<strong>Explanation:</strong> ${ex.explanation}` : ''}
            </div>
          `).join('')}

          <h2>Constraints</h2>
          <ul>
            ${problem.constraints.map(c => `<li>${c}</li>`).join('')}
          </ul>

          ${problem.hints && problem.hints.length > 0 ? `
            <h2 style="margin-top: 1.5rem;">Hints</h2>
            <div id="hints-accordion">
              ${problem.hints.map((hint, idx) => `
                <details style="margin-bottom: 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem 1rem;">
                  <summary style="cursor: pointer; font-weight: 500; color: var(--accent-blue);">Reveal Hint ${idx + 1}</summary>
                  <p style="margin: 0.5rem 0 0; color: var(--text-secondary); font-size: 0.9rem;">${hint}</p>
                </details>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- RESIZER BAR -->
      <div class="resizer" id="pane-resizer"></div>

      <!-- RIGHT PANE: EDITOR & CONSOLE -->
      <div class="pane right-pane" id="right-pane">
        
        <!-- PANE HEADER / CODE TOOLBAR -->
        <div class="pane-header">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span>💻 Code Editor</span>
            <select class="select-input" id="editor-lang-select" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; width: auto;">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>
          </div>
          <div>
            <button class="btn btn-secondary" id="reset-code-btn" style="padding: 0.2rem 0.6rem; font-size: 0.8rem;">Reset Code</button>
          </div>
        </div>

        <!-- THE MONACO EDITOR WRAPPER -->
        <div class="editor-wrapper">
          <div id="monaco-container"></div>
        </div>

        <!-- BOTTOM CONSOLE PANEL -->
        <div class="console-panel">
          <div class="console-tabs">
            <div class="console-tab active" data-tab="testcases">Test Cases</div>
            <div class="console-tab" data-tab="output">Console Output</div>
            <div class="console-tab" data-tab="verdict">Verdict</div>
          </div>

          <div class="console-body" id="console-tab-content">
            <!-- Content will be injected dynamically -->
          </div>

          <!-- ACTIONS BAR -->
          <div class="run-actions">
            <button class="btn btn-secondary" id="run-btn">▶️ Run Code</button>
            <button class="btn btn-primary" id="submit-btn">🚀 Submit Solution</button>
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

  // --- Boilerplate Generator Helpers ---
  function getBoilerplate(lang) {
    const fnName = problem.function_signature.name;
    const params = problem.function_signature.parameters;
    const returnType = problem.function_signature.return_type;

    if (lang === 'javascript') {
      const argsList = params.map(p => p.name).join(', ');
      return `/**
 * @param {${params.map(p => p.type).join(', ')}} ${params.map(p => p.name).join(', ')}
 * @return {${returnType}}
 */
function ${fnName}(${argsList}) {
    // Write your JavaScript solution here
    
}`;
    }

    if (lang === 'python') {
      const argsList = params.map(p => p.name).join(', ');
      return `def ${fnName}(${argsList}):
    # Write your Python solution here
    pass`;
    }

    if (lang === 'c') {
      const cType = (t) => {
        if (t.includes('[]')) return `${cType(t.replace('[]', ''))}*`;
        if (t === 'int') return 'int';
        if (t === 'string') return 'char*';
        if (t === 'boolean' || t === 'bool') return 'bool';
        return 'void';
      };

      const cParams = [];
      params.forEach(p => {
        const typeStr = cType(p.type);
        cParams.push(`${typeStr} ${p.name}`);
        if (p.type.includes('[]')) {
          cParams.push(`int ${p.name}Size`);
        }
      });
      
      let returnTypeStr = cType(returnType);
      if (returnType.includes('[]')) {
        cParams.push('int* returnSize');
      }

      const argsList = cParams.join(', ');
      
      return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
${returnTypeStr} ${fnName}(${argsList}) {
    // Write your C solution here
    
}`;
    }

    if (lang === 'cpp') {
      const cppType = (t) => {
        if (t.includes('[]')) return `vector<${cppType(t.replace('[]', ''))}>`;
        if (t === 'int') return 'int';
        if (t === 'string') return 'string';
        if (t === 'boolean' || t === 'bool') return 'bool';
        return 'void';
      };
      
      const argsList = params.map(p => `${cppType(p.type)}& ${p.name}`).join(', ');
      return `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    ${cppType(returnType)} ${fnName}(${argsList}) {
        // Write your C++ solution here
        
    }
};`;
    }

    if (lang === 'java') {
      const javaType = (t) => {
        if (t.includes('[]')) return `${javaType(t.replace('[]', ''))}[]`;
        if (t === 'int') return 'int';
        if (t === 'string') return 'String';
        if (t === 'boolean' || t === 'bool') return 'boolean';
        return 'void';
      };

      const argsList = params.map(p => `${javaType(p.type)} ${p.name}`).join(', ');
      return `import java.util.*;

class Solution {
    public ${javaType(returnType)} ${fnName}(${argsList}) {
        // Write your Java solution here
        
    }
}`;
    }

    return '';
  }

  // --- Load Submission / Saved Code ---
  const savedSubmission = getSubmission(problemId);
  if (savedSubmission) {
    selectedLanguage = savedSubmission.language || 'javascript';
  }
  container.querySelector('#editor-lang-select').value = selectedLanguage;

  // --- Initialize Monaco Editor ---
  loader.init().then(monaco => {
    const defaultVal = savedSubmission && savedSubmission.code
      ? savedSubmission.code
      : getBoilerplate(selectedLanguage);

    editorInstance = monaco.editor.create(container.querySelector('#monaco-container'), {
      value: defaultVal,
      language: selectedLanguage,
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: 'Fira Code, monospace',
      lineNumbers: 'on',
      tabSize: 4
    });

    // Save solution progress on change
    editorInstance.onDidChangeModelContent(() => {
      saveSubmission(problemId, {
        code: editorInstance.getValue(),
        language: selectedLanguage
      });
    });
  });

  // --- Handle Language Changes ---
  const langSelect = container.querySelector('#editor-lang-select');
  langSelect.addEventListener('change', (e) => {
    const newLang = e.target.value;
    
    // Check if user has saved code, else load boilerplate
    const currentCode = editorInstance.getValue();
    const currentBoilerplate = getBoilerplate(selectedLanguage);
    
    selectedLanguage = newLang;
    
    // If editor has boilerplate or empty, replace it safely
    if (!currentCode.trim() || currentCode === currentBoilerplate) {
      editorInstance.setValue(getBoilerplate(selectedLanguage));
    }

    // Update monaco language
    const model = editorInstance.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, selectedLanguage);
    }

    saveSubmission(problemId, {
      code: editorInstance.getValue(),
      language: selectedLanguage
    });
  });

  // Reset Code button
  const resetBtn = container.querySelector('#reset-code-btn');
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your code to the default template?')) {
      editorInstance.setValue(getBoilerplate(selectedLanguage));
    }
  });

  // --- Console Panel Tab Switching ---
  const tabs = container.querySelectorAll('.console-tab');
  const tabContent = container.querySelector('#console-tab-content');

  function renderConsoleTab() {
    tabs.forEach(tab => {
      if (tab.dataset.tab === activeConsoleTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (activeConsoleTab === 'testcases') {
      const tc = problem.test_cases[activeTestCaseIdx];
      
      tabContent.innerHTML = `
        <div class="tc-selector">
          ${problem.test_cases.map((_, idx) => `
            <button class="tc-btn ${idx === activeTestCaseIdx ? 'active' : ''}" data-idx="${idx}">
              Case ${idx + 1}
            </button>
          `).join('')}
        </div>
        <div class="tc-io animate-fade-in">
          <div>
            <div class="tc-io-label">Input Parameters</div>
            <div class="tc-io-val">${JSON.stringify(tc.input, null, 2)}</div>
          </div>
          <div>
            <div class="tc-io-label">Expected Output</div>
            <div class="tc-io-val" style="color: var(--color-easy);">${JSON.stringify(tc.expected_output)}</div>
          </div>
        </div>
      `;

      // Event listener for case selection
      tabContent.querySelectorAll('.tc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTestCaseIdx = parseInt(btn.dataset.idx);
          renderConsoleTab();
        });
      });
    }

    if (activeConsoleTab === 'output') {
      if (!executionResults) {
        tabContent.innerHTML = `<div style="color: var(--text-muted);">Run code first to see execution logs.</div>`;
        return;
      }

      if (!executionResults.success) {
        tabContent.innerHTML = `
          <div style="color: var(--color-hard); font-weight: 600; margin-bottom: 0.5rem;">Compilation / Runtime Error:</div>
          <pre style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 1rem; border-radius: 6px; color: #f87171; white-space: pre-wrap; word-break: break-all;">${executionResults.error || 'Unknown execution failure'}</pre>
        `;
        return;
      }

      // Show console outputs from test cases
      const resultsWithLogs = executionResults.results.filter(r => r.logs && r.logs.length > 0);
      if (resultsWithLogs.length === 0) {
        tabContent.innerHTML = `<div style="color: var(--text-muted);">No console outputs were printed.</div>`;
        return;
      }

      tabContent.innerHTML = resultsWithLogs.map((res, idx) => `
        <div style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
          <div style="font-weight: 600; color: var(--accent-blue); margin-bottom: 0.25rem;">Test Case ${idx + 1} logs:</div>
          <pre style="white-space: pre-wrap; font-size: 0.85rem; color: var(--text-primary);">${res.logs.join('\n')}</pre>
        </div>
      `).join('');
    }

    if (activeConsoleTab === 'verdict') {
      if (!executionResults) {
        tabContent.innerHTML = `<div style="color: var(--text-muted);">Run code first to see evaluation verdicts.</div>`;
        return;
      }

      if (!executionResults.success) {
        tabContent.innerHTML = `
          <div style="color: var(--color-hard); font-weight: 600;">Execution Failed</div>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">The code failed to compile or complete execution.</p>
        `;
        return;
      }

      const total = executionResults.results.length;
      const passed = executionResults.results.filter(r => r.passed).length;
      const allPassed = passed === total;

      tabContent.innerHTML = `
        <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">${allPassed ? '✅' : '❌'}</span>
          <div>
            <h3 style="margin: 0; color: ${allPassed ? 'var(--color-easy)' : 'var(--color-hard)'};">
              ${allPassed ? 'Accepted' : 'Wrong Answer'}
            </h3>
            <div style="color: var(--text-secondary); font-size: 0.85rem;">
              ${passed} / ${total} Test Cases Passed
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${executionResults.results.map((res, idx) => `
            <div style="border: 1px solid ${res.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border-radius: 6px; padding: 0.75rem 1rem; background: rgba(0,0,0,0.15);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 600;">Case ${idx + 1}</span>
                <span class="${res.passed ? 'tc-badge-pass' : 'tc-badge-fail'}">${res.passed ? 'PASSED' : 'FAILED'}</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.8rem;">
                <div>
                  <div style="color: var(--text-muted);">Expected</div>
                  <pre style="color: var(--color-easy);">${JSON.stringify(res.expected)}</pre>
                </div>
                <div>
                  <div style="color: var(--text-muted);">Your Output</div>
                  <pre style="color: ${res.passed ? 'var(--color-easy)' : 'var(--color-hard)'};">${JSON.stringify(res.actual)}</pre>
                </div>
              </div>
              ${res.timeMs ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; text-align: right;">Time: ${res.timeMs}ms</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeConsoleTab = tab.dataset.tab;
      renderConsoleTab();
    });
  });

  // Render initial console tab
  renderConsoleTab();

  // --- Run Code Execution Trigger ---
  const runBtn = container.querySelector('#run-btn');
  const submitBtn = container.querySelector('#submit-btn');

  async function handleRun(isSubmit = false) {
    if (isRunningCode) return;
    
    isRunningCode = true;
    runBtn.disabled = true;
    submitBtn.disabled = true;
    showToast('Running test cases...', 'info');

    // Switch tab to verdict to let user see progress
    activeConsoleTab = 'verdict';
    tabContent.innerHTML = `<div style="color: var(--text-primary);"><span style="display:inline-block; animation: spin 1s infinite linear; margin-right: 0.5rem;">⏳</span> Running compiler tests...</div>`;
    renderConsoleTab();

    const userCode = editorInstance.getValue();
    
    try {
      if (selectedLanguage === 'javascript') {
        executionResults = await runJavaScriptInBrowser(userCode, problem);
      } else {
        // Run via Judge0
        executionResults = await runCodeViaJudge0(userCode, selectedLanguage, problem);
      }

      if (executionResults.success) {
        const total = executionResults.results.length;
        const passed = executionResults.results.filter(r => r.passed).length;
        
        if (passed === total) {
          showToast('Accepted! All test cases passed!', 'success');
          // If submit, save the completion status
          if (isSubmit) {
            saveSubmission(problemId, {
              completed: true,
              code: userCode,
              language: selectedLanguage
            });
          }
        } else {
          showToast(`Wrong Answer. Passed ${passed}/${total} test cases.`, 'error');
        }
      } else {
        showToast('Execution error. Check compile/runtime console outputs.', 'error');
      }

    } catch (err) {
      console.error(err);
      executionResults = {
        success: false,
        error: `Compiler Engine Failed: ${err.message}`
      };
      showToast('Compiler failed to run.', 'error');
    } finally {
      isRunningCode = false;
      runBtn.disabled = false;
      submitBtn.disabled = false;
      renderConsoleTab();
    }
  }

  runBtn.addEventListener('click', () => handleRun(false));
  submitBtn.addEventListener('click', () => handleRun(true));
}
