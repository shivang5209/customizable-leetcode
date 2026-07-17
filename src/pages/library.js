// Page: Problem Library — v2 redesign

import { getProblems, deleteProblem, getSubmissions } from '../utils/storage';
import { showToast } from '../components/toast';

const DIFF_PILLS = ['All', 'Easy', 'Medium', 'Hard'];

export function renderProblemLibrary(container) {
  let searchVal        = '';
  let difficultyFilter = 'All';

  function renderGrid() {
    const problems    = getProblems();
    const submissions = getSubmissions();
    const totalCount  = problems.length;

    const filtered = problems.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          p.topics.some(t => t.toLowerCase().includes(searchVal.toLowerCase()));
      const matchDiff   = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      return matchSearch && matchDiff;
    });

    // Update count badge
    const countEl = container.querySelector('#lib-count');
    if (countEl) countEl.textContent = `${filtered.length} problem${filtered.length !== 1 ? 's' : ''}`;

    const grid = container.querySelector('#library-grid-container');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">${totalCount === 0 ? '✨' : '🔍'}</div>
            <h3>${totalCount === 0 ? 'No problems yet' : 'No problems found'}</h3>
            <p>${totalCount === 0
              ? 'Generate your first custom challenge using the Prompt Generator.'
              : 'Try adjusting your search or filter settings.'
            }</p>
            ${totalCount === 0
              ? `<a href="#/" class="btn btn-primary">⚡ Generate First Problem</a>`
              : `<button class="btn btn-secondary" id="clear-filters-btn">Clear Filters</button>`
            }
          </div>
        </div>
      `;
      // Attach clear filters if visible
      const clearBtn = grid.querySelector('#clear-filters-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchVal = '';
          difficultyFilter = 'All';
          container.querySelector('#library-search').value = '';
          container.querySelectorAll('.filter-pill').forEach((p, i) => {
            p.classList.toggle('active', i === 0);
          });
          renderGrid();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map((p, i) => {
      const sub         = submissions[p.id];
      const isCompleted = sub && sub.completed;
      const delay       = Math.min(i * 0.04, 0.3);

      return `
        <div class="glass-panel problem-card animate-slide-up" data-id="${p.id}"
             style="animation-delay: ${delay}s; min-height: 210px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem;">
            <div class="problem-card-title">${p.title}</div>
            <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.85rem;">
            ${p.topics.slice(0, 3).map(t => `
              <span class="chip" style="font-size: 0.72rem; padding: 0.18rem 0.55rem; cursor: default;">${t}</span>
            `).join('')}
            ${p.topics.length > 3 ? `<span class="chip" style="font-size: 0.72rem; padding: 0.18rem 0.55rem; cursor: default;">+${p.topics.length - 3}</span>` : ''}
          </div>
          <div class="problem-card-meta">
            <span style="font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.3rem;
                         color: ${isCompleted ? 'var(--color-easy)' : 'var(--text-2)'};">
              ${isCompleted ? '✅ Completed' : '⏳ Unsolved'}
            </span>
            <div class="problem-card-actions">
              <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}">Delete</button>
              <a href="#/solve/${p.id}" class="btn btn-primary btn-sm" style="text-decoration: none;">Solve →</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Delete listeners
    grid.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm('Delete this problem and its submission history?')) {
          deleteProblem(btn.dataset.id);
          showToast('Problem deleted.', 'info');
          renderGrid();
        }
      });
    });
  }

  container.innerHTML = `
    <div class="animate-fade-in">

      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div class="page-header" style="margin-bottom: 0;">
          <h1><span class="text-gradient-teal">📚 Practice Library</span></h1>
          <p>Your custom AI-generated coding challenges. <span id="lib-count" style="color: var(--text-1); font-weight: 600;"></span></p>
        </div>
        <a href="#/" class="btn btn-primary" style="text-decoration: none; flex-shrink: 0;">⚡ New Problem</a>
      </div>

      <!-- Filters Bar -->
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-bottom: 2rem;">
        <div class="lab-search-wrap" style="flex: 1; min-width: 220px;">
          <span class="search-icon">🔍</span>
          <input type="text" class="input-text" id="library-search"
                 placeholder="Search by title or topic…" autocomplete="off">
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${DIFF_PILLS.map(d => `
            <button class="filter-pill ${d === 'All' ? 'active' : ''}" data-diff="${d}">
              ${d === 'All' ? 'All' : d}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Grid -->
      <div class="library-grid" id="library-grid-container"></div>
    </div>
  `;

  // Events
  container.querySelector('#library-search').addEventListener('input', (e) => {
    searchVal = e.target.value;
    renderGrid();
  });

  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      difficultyFilter = pill.dataset.diff;
      renderGrid();
    });
  });

  renderGrid();
}
