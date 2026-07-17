// Page: JSON Import

import { validateProblemJSON } from '../engine/schema-validator';
import { saveProblem } from '../utils/storage';
import { showToast } from '../components/toast';

export function renderJSONImport(container) {
  container.innerHTML = `
    <div class="import-container animate-fade-in">
      <div class="glass-panel" style="padding: 2.5rem;">
        <h2 style="margin-bottom: 0.5rem; background: linear-gradient(135deg, #3b82f6, #14b8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">📥 Import LLM Problem JSON</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
          Paste the JSON object returned by your LLM below. We'll validate the structure and save it to your local practice library.
        </p>

        <!-- Validation Errors Box -->
        <div id="error-box" class="validation-errors" style="display: none;"></div>

        <div class="form-group">
          <label class="form-label" for="json-input">LLM JSON Response</label>
          <textarea class="textarea-input" id="json-input" placeholder="{\\n  \\"title\\": \\"Two Sum\\",\\n  \\"difficulty\\": \\"Easy\\",\\n  ..." rows="16" style="font-family: var(--font-mono); font-size: 0.85rem; background: #040609;"></textarea>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="#/" class="btn btn-secondary">
            ⬅️ Back to Generator
          </a>
          <button class="btn btn-primary" id="import-btn">
            Validate & Save Problem
          </button>
        </div>
      </div>
    </div>
  `;

  const importBtn = container.querySelector('#import-btn');
  const jsonInput = container.querySelector('#json-input');
  const errorBox = container.querySelector('#error-box');

  importBtn.addEventListener('click', () => {
    const rawJson = jsonInput.value.trim();
    if (!rawJson) {
      showToast('Please paste some JSON first.', 'error');
      return;
    }

    // Attempt clean up of markdown wrappers if LLM still provided them despite instruction
    let sanitizedJson = rawJson;
    if (sanitizedJson.startsWith('```')) {
      // Remove starting ```json or ``` and ending ```
      sanitizedJson = sanitizedJson.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
    }
    
    const validation = validateProblemJSON(sanitizedJson);

    if (!validation.isValid) {
      errorBox.style.display = 'block';
      
      const errorList = validation.errors 
        ? `<ul>${validation.errors.map(e => `<li>${e}</li>`).join('')}</ul>`
        : `<strong>Error:</strong> ${validation.error}`;
      
      errorBox.innerHTML = `
        <h4 style="margin-bottom: 0.5rem; font-weight: 600;">Validation Failed</h4>
        ${errorList}
      `;
      showToast('Validation failed. Please correct the errors and try again.', 'error');
      return;
    }

    // Success - save problem
    try {
      errorBox.style.display = 'none';
      const problemId = saveProblem(validation.data);
      showToast('Problem validated and saved to library!', 'success');
      
      // Navigate to problem solve page
      window.location.hash = `#/solve/${problemId}`;
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
