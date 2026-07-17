// Page: Prompt Generator

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
    <div class="generator-layout animate-fade-in">
      <div class="glass-panel generator-card">
        <h2 style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #60a5fa, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎯 Configure Practice Question</h2>
        
        <!-- Topic Selection -->
        <div class="form-group">
          <label class="form-label">Select Topics (Multiple)</label>
          <div class="chips-container" id="topics-container">
            ${AVAILABLE_TOPICS.map(topic => `
              <div class="chip" data-topic="${topic}">${topic}</div>
            `).join('')}
          </div>
        </div>

        <!-- Difficulty Selection -->
        <div class="form-group">
          <label class="form-label">Difficulty</label>
          <div class="difficulty-selectors">
            <button class="diff-select-btn" data-diff="Easy">Easy</button>
            <button class="diff-select-btn active" data-diff="Medium">Medium</button>
            <button class="diff-select-btn" data-diff="Hard">Hard</button>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="form-group">
          <label class="form-label">Target Programming Language</label>
          <select class="select-input" id="lang-selector">
            <option value="JavaScript" selected>JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C">C</option>
          </select>
        </div>

        <!-- Custom Details -->
        <div class="form-group">
          <label class="form-label">Custom Concept details (Optional)</label>
          <textarea class="textarea-input" id="custom-details" placeholder="e.g. 'I want to practice sliding window with exactly K distinct characters' or 'Make it test edge case inputs with large zeros'" rows="3"></textarea>
        </div>

        <button class="btn btn-primary" id="generate-btn" style="width: 100%;">
          Generate LLM Prompt
        </button>
      </div>

      <div class="glass-panel prompt-display-card">
        <h2 style="margin-bottom: 1rem; color: var(--text-primary);">🤖 Copy Prompt to LLM</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
          Paste this prompt into ChatGPT, Gemini, or Claude. Copy the JSON response they provide and paste it in the next step.
        </p>
        
        <textarea class="textarea-input prompt-textarea" id="prompt-output" readonly placeholder="Your generated LLM prompt will appear here..."></textarea>
        
        <div style="display: flex; gap: 1rem; margin-top: auto;">
          <button class="btn btn-secondary" id="copy-btn" disabled style="flex: 1;">
            📋 Copy Prompt
          </button>
          <a href="#/import" class="btn btn-primary" style="flex: 1; text-decoration: none; text-align: center;">
            Next: Import JSON ➡️
          </a>
        </div>
      </div>
    </div>
  `;

  // --- Event Listeners ---

  // Topic chips toggling
  const topicsDiv = container.querySelector('#topics-container');
  topicsDiv.addEventListener('click', (e) => {
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

  // Difficulty selections
  const diffBtns = container.querySelectorAll('.diff-select-btn');
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.diff;
    });
  });

  // Generate Prompt
  const generateBtn = container.querySelector('#generate-btn');
  const promptOutput = container.querySelector('#prompt-output');
  const copyBtn = container.querySelector('#copy-btn');
  const langSelector = container.querySelector('#lang-selector');
  const customDetailsText = container.querySelector('#custom-details');

  generateBtn.addEventListener('click', () => {
    selectedLanguage = langSelector.value;
    const customDetails = customDetailsText.value.trim();

    const promptText = buildPrompt({
      topics: selectedTopics,
      difficulty: selectedDifficulty,
      language: selectedLanguage,
      customDetails
    });

    promptOutput.value = promptText;
    copyBtn.disabled = false;
    showToast('Prompt generated successfully!', 'success');
  });

  // Copy Prompt to Clipboard
  copyBtn.addEventListener('click', () => {
    promptOutput.select();
    navigator.clipboard.writeText(promptOutput.value);
    showToast('Prompt copied to clipboard!', 'success');
  });
}
