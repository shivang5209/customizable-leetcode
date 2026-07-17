// Page: Problem Library

import { getProblems, deleteProblem, getSubmissions } from '../utils/storage';
import { showToast } from '../components/toast';

export function renderProblemLibrary(container) {
  let searchVal = '';
  let difficultyFilter = 'All';

  function renderGrid() {
    const problems = getProblems();
    const submissions = getSubmissions();

    // Filter problems
    const filtered = problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          p.topics.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
      const matchDiff = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      return matchSearch && matchDiff;
    });

    const listHtml = filtered.length > 0 
      ? filtered.map(p => {
          const sub = submissions[p.id];
          const isCompleted = sub && sub.completed;

          return `
            <div class="glass-panel problem-card animate-fade-in" data-id="${p.id}">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <div class="problem-card-title">${p.title}</div>
                <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
              </div>
              <div style="margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.3rem;">
                ${p.topics.slice(0, 3).map(t => `<span class="chip" style="font-size: 0.7rem; padding: 0.15rem 0.5rem; cursor: default;">${t}</span>`).join('')}
                ${p.topics.length > 3 ? `<span class="chip" style="font-size: 0.7rem; padding: 0.15rem 0.5rem; cursor: default;">+${p.topics.length - 3} more</span>` : ''}
              </div>
              <div class="problem-card-meta">
                <span style="font-size: 0.8rem; color: ${isCompleted ? 'var(--color-easy)' : 'var(--text-muted)'}; font-weight: 500;">
                  ${isCompleted ? '✅ Completed' : '⏳ Attempting'}
                </span>
                <div class="problem-card-actions">
                  <button class="btn btn-danger delete-btn" data-id="${p.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Delete</button>
                  <a href="#/solve/${p.id}" class="btn btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem; text-decoration: none;">Solve</a>
                </div>
              </div>
            </div>
          `;
        }).join('')
      : `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <h3>No problems found</h3>
          <p style="margin-top: 0.5rem;">Configure and generate a prompt first, then import the JSON response!</p>
        </div>
      `;

    container.querySelector('#library-grid-container').innerHTML = listHtml;

    // Attach delete listeners
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = btn.dataset.id;
        if (confirm('Are you sure you want to delete this problem and its submission history?')) {
          deleteProblem(id);
          showToast('Problem deleted.', 'info');
          renderGrid();
        }
      });
    });
  }

  container.innerHTML = `
    <div class="animate-fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="background: linear-gradient(135deg, #a78bfa, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">📚 Practice Library</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Your custom AI-generated programming challenges list.</p>
        </div>
        <a href="#/" class="btn btn-primary">➕ Generate New Problem</a>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="glass-panel" style="padding: 1.25rem; margin-bottom: 2rem; display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
        <div style="flex: 1; min-width: 250px;">
          <input type="text" class="input-text" id="library-search" placeholder="Search by title or topic..." value="${searchVal}">
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Difficulty:</span>
          <select class="select-input" id="library-diff-filter" style="width: auto; padding: 0.5rem 1.5rem 0.5rem 0.75rem;">
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <!-- Grid Container -->
      <div class="library-grid" id="library-grid-container"></div>
    </div>
  `;

  // Attach search/filter events
  const searchInput = container.querySelector('#library-search');
  searchInput.addEventListener('input', (e) => {
    searchVal = e.target.value;
    renderGrid();
  });

  const diffFilter = container.querySelector('#library-diff-filter');
  diffFilter.addEventListener('change', (e) => {
    difficultyFilter = e.target.value;
    renderGrid();
  });

  // Render initial list
  renderGrid();
}
