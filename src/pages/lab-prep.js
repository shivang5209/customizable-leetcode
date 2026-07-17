// Page: Lab Prep Dashboard

import { LAB_PROGRAMS } from '../data/lab-programs';

export function renderLabPrep(container) {
  let searchVal = '';
  let paradigmFilter = 'All';

  function renderList() {
    const listContainer = container.querySelector('#lab-list-container');
    if (!listContainer) return;

    const filtered = LAB_PROGRAMS.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          p.problemStatement.toLowerCase().includes(searchVal.toLowerCase());
      const matchParadigm = paradigmFilter === 'All' || p.paradigm.toLowerCase() === paradigmFilter.toLowerCase();
      return matchSearch && matchParadigm;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <h3>No programs found</h3>
          <p style="margin-top: 0.5rem;">Try adjusting your search query or filter settings.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(p => {
      return `
        <div class="glass-panel problem-card animate-fade-in" style="cursor: pointer;" onclick="window.location.hash='#/lab/study/${p.id}'">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
            <div class="problem-card-title">${p.title}</div>
            <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${p.problemStatement}
          </p>
          <div class="problem-card-meta" style="margin-top: auto;">
            <span class="chip" style="font-size: 0.75rem; padding: 0.2rem 0.6rem; cursor: default; background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #a78bfa;">
              ${p.paradigm}
            </span>
            <span style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 600;">Study & Run ➡️</span>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="animate-fade-in">
      <div style="margin-bottom: 2rem;">
        <h1 style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎓 ADA Lab Exam Prep (BCSL404)</h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Prepare for your lab practical exam on 21st. Read syllabus prerequisites, check exact program codes, and simulate runs with standard inputs.</p>
      </div>

      <!-- Filters Toolbar -->
      <div class="glass-panel" style="padding: 1.25rem; margin-bottom: 2rem; display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
        <div style="flex: 1; min-width: 250px;">
          <input type="text" class="input-text" id="lab-search" placeholder="Search by program title or description...">
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Paradigm:</span>
          <select class="select-input" id="lab-paradigm-filter" style="width: auto; padding: 0.5rem 1.5rem 0.5rem 0.75rem;">
            <option value="All">All Paradigms</option>
            <option value="Greedy Technique">Greedy Technique</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Divide and Conquer">Divide and Conquer</option>
            <option value="Backtracking">Backtracking</option>
            <option value="Graph Algorithm">Graph Algorithm</option>
          </select>
        </div>
      </div>

      <!-- Grid list -->
      <div class="library-grid" id="lab-list-container"></div>
    </div>
  `;

  // Attach search and filter events
  const searchInput = container.querySelector('#lab-search');
  searchInput.addEventListener('input', (e) => {
    searchVal = e.target.value;
    renderList();
  });

  const filterSelect = container.querySelector('#lab-paradigm-filter');
  filterSelect.addEventListener('change', (e) => {
    paradigmFilter = e.target.value;
    renderList();
  });

  renderList();
}
