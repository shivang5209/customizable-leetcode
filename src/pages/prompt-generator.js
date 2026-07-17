// Page: Prompt Generator — v2 redesign

import { buildPrompt } from '../engine/prompt-builder';
import { showToast } from '../components/toast';

const AVAILABLE_TOPICS = [
  'Arrays', 'Strings', 'Hash Map', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Stack', 'Queue', 'Linked List', 'Trees',
  'Graphs', 'DFS/BFS', 'Dynamic Programming', 'Greedy',
  'Bit Manipulation', 'Recursion', 'Math', 'Sorting', 'Trie'
];

export function renderPromptGenerator(container) {
  let selectedTopics = [];
  let selectedDifficulty = 'Medium';
  let selectedLanguage = 'JavaScript';

  container.innerHTML = `
    <div class="animate-fade-in">

      <!-- Page Header -->
      <div class="page-header">
        <h1><span class="text-gradient">Generate Practice Questions</span></h1>
        <p>Configure your ideal coding challenge and get a prompt to paste into any AI chatbot. Then import the response to solve it right here.</p>
      </div>

      <!-- Workflow Steps Banner -->
      <div class="step-flow" style="margin-bottom: 2.5rem; gap: 0.5rem;">
        <div class="step-item stagger-1 animate-slide-up">
          <div class="step-number">1</div>
          <div class="step-text">
            <h4>Configure</h4>
            <p>Pick topics &amp; difficulty</p>
          </div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item stagger-2 animate-slide-up">
          <div class="step-number">2</div>
          <div class="step-text">
            <h4>Copy Prompt</h4>
            <p>Paste into ChatGPT / Gemini</p>
          </div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item stagger-3 animate-slide-up">
          <div class="step-number">3</div>
          <div class="step-text">
            <h4>Import JSON</h4>
            <p>Paste the AI's response</p>
          </div>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item stagger-4 animate-slide-up">
          <div class="step-number">4</div>
          <div class="step-text">
            <h4>Solve</h4>
            <p>Code in Monaco editor</p>
          </div>
        </div>
      </div>

      <!-- Two-column layout -->
      <div class="generator-layout">

        <!-- Left: Config Card -->
        <div class="glass-panel generator-card">
          <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.75rem; color: var(--text-1);">
            ⚙️ Question Settings
          </h2>

          <!-- Topics -->
          <div class="form-group">
            <label class="form-label">📌 Topics <span style="color: var(--text-3); font-weight: 400; text-transform: none; letter-spacing: 0;">(select one or more)</span></label>
            <div class="chips-container" id="topics-container">
              ${AVAILABLE_TOPICS.map(topic => `
                <div class="chip" data-topic="${topic}">${topic}</div>
              `).join('')}
            </div>
          </div>

          <!-- Difficulty -->
          <div class="form-group">
            <label class="form-label">🎯 Difficulty</label>
            <div class="difficulty-selectors">
              <button class="diff-select-btn" data-diff="Easy">Easy</button>
              <button class="diff-select-btn active" data-diff="Medium">Medium</button>
              <button class="diff-select-btn" data-diff="Hard">Hard</button>
            </div>
          </div>

          <!-- Language -->
          <div class="form-group">
            <label class="form-label">💻 Language</label>
            <select class="select-input" id="lang-selector">
              <option value="JavaScript" selected>JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="C">C</option>
            </select>
          </div>

          <!-- Custom details -->
          <div class="form-group">
            <label class="form-label">✏️ Custom Details <span style="color: var(--text-3); font-weight: 400; text-transform: none; letter-spacing: 0;">(optional)</span></label>
            <textarea class="textarea-input" id="custom-details"
              placeholder="e.g. 'Practice sliding window with exactly K distinct characters' or 'Include large input edge cases'"
              rows="3"
            ></textarea>
          </div>

          <button class="btn btn-primary btn-lg" id="generate-btn" style="width: 100%;">
            ⚡ Generate LLM Prompt
          </button>
        </div>

        <!-- Right: Output Card -->
        <div class="glass-panel prompt-display-card">
          <div style="margin-bottom: 1.25rem;">
            <h2 style="font-size: 1.1rem; font-weight: 700; color: var(--text-1); margin-bottom: 0.35rem;">🤖 Your LLM Prompt</h2>
            <p style="color: var(--text-2); font-size: 0.875rem;">Copy this and paste into ChatGPT, Gemini, or Claude. Then bring back the JSON response.</p>
          </div>

          <div class="workflow-hint">
            <span style="font-size: 1rem; flex-shrink: 0;">💡</span>
            <span>After pasting in an AI, copy its full JSON response and use <strong>Import JSON</strong> in the nav to add it to your library.</span>
          </div>

          <textarea class="textarea-input prompt-textarea" id="prompt-output" readonly
            placeholder="Your generated LLM prompt will appear here after you click Generate…"
          ></textarea>

          <div style="display: flex; gap: 0.75rem; margin-top: auto;">
            <button class="btn btn-secondary" id="copy-btn" disabled style="flex: 1;">
              📋 Copy Prompt
            </button>
            <a href="#/import" class="btn btn-primary" style="flex: 1; text-decoration: none;">
              Import JSON →
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  // ── Event Listeners ──────────────────────────────────────────

  // Topic chips
  container.querySelector('#topics-container').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const topic = chip.dataset.topic;
    if (selectedTopics.includes(topic)) {
      selectedTopics = selectedTopics.filter(t => t !== topic);
      chip.classList.remove('active');
    } else {
      selectedTopics.push(topic);
      chip.classList.add('active');
    }
  });

  // Difficulty
  container.querySelectorAll('.diff-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.diff-select-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.diff;
    });
  });

  // Generate
  const generateBtn  = container.querySelector('#generate-btn');
  const promptOutput = container.querySelector('#prompt-output');
  const copyBtn      = container.querySelector('#copy-btn');
  const langSelector = container.querySelector('#lang-selector');
  const customDetails= container.querySelector('#custom-details');

  generateBtn.addEventListener('click', () => {
    selectedLanguage = langSelector.value;
    const promptText = buildPrompt({
      topics: selectedTopics,
      difficulty: selectedDifficulty,
      language: selectedLanguage,
      customDetails: customDetails.value.trim()
    });
    promptOutput.value = promptText;
    copyBtn.disabled = false;
    showToast('Prompt generated!', 'success');
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptOutput.value);
    showToast('Prompt copied to clipboard!', 'success');
  });
}
