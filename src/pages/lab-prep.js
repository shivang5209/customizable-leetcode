// Page: Lab Prep Dashboard — v2 redesign

import { LAB_PROGRAMS } from '../data/lab-programs';

// Map paradigm → CSS class and accent color for the card top border
const PARADIGM_META = {
  'Greedy Technique':     { cls: 'pt-greedy', color: '#10b981', gradient: 'linear-gradient(90deg,#10b981,#3b82f6)' },
  'Dynamic Programming':  { cls: 'pt-dp',     color: '#8b5cf6', gradient: 'linear-gradient(90deg,#8b5cf6,#3b82f6)' },
  'Divide and Conquer':   { cls: 'pt-dc',     color: '#f97316', gradient: 'linear-gradient(90deg,#f97316,#f43f5e)' },
  'Backtracking':         { cls: 'pt-bt',     color: '#f43f5e', gradient: 'linear-gradient(90deg,#f43f5e,#8b5cf6)' },
  'Graph Algorithm':      { cls: 'pt-graph',  color: '#3b82f6', gradient: 'linear-gradient(90deg,#3b82f6,#14b8a6)' },
  'Sorting Techniques':   { cls: 'pt-sort',   color: '#14b8a6', gradient: 'linear-gradient(90deg,#14b8a6,#3b82f6)' },
};

// Unique paradigms for filter pills
const ALL_PARADIGMS = ['All', ...Object.keys(PARADIGM_META)];

export function renderLabPrep(container) {
  let searchVal      = '';
  let paradigmFilter = 'All';

  // Count unique paradigms across programs
  const paradigmCounts = {};
  LAB_PROGRAMS.forEach(p => {
    paradigmCounts[p.paradigm] = (paradigmCounts[p.paradigm] || 0) + 1;
  });

  function getParadigmClass(paradigm) {
    return PARADIGM_META[paradigm]?.cls || 'pt-graph';
  }

  function getParadigmGradient(paradigm) {
    return PARADIGM_META[paradigm]?.gradient || 'var(--grad-brand)';
  }

  function renderList() {
    const listContainer = container.querySelector('#lab-list-container');
    if (!listContainer) return;

    const filtered = LAB_PROGRAMS.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          p.problemStatement.toLowerCase().includes(searchVal.toLowerCase());
      const matchParadigm = paradigmFilter === 'All' || p.paradigm === paradigmFilter;
      return matchSearch && matchParadigm;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3>No programs found</h3>
            <p>Try adjusting your search query or filter settings.</p>
            <button class="btn btn-secondary" onclick="document.querySelector('#lab-search').value=''; document.querySelector('#lab-search').dispatchEvent(new Event('input'))">
              Clear Search
            </button>
          </div>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map((p, i) => {
      const meta     = PARADIGM_META[p.paradigm] || {};
      const gradient = meta.gradient || 'var(--grad-brand)';
      const ptCls    = meta.cls || 'pt-graph';
      const delay    = Math.min(i * 0.05, 0.3);

      return `
        <div class="glass-panel lab-card animate-slide-up"
             style="animation-delay: ${delay}s;"
             onclick="window.location.hash='#/lab/study/${p.id}'">
          <div class="lab-card-accent" style="background: ${gradient};"></div>
          <div class="lab-card-body">
            <div class="lab-card-header">
              <div class="lab-card-title">${p.title}</div>
              <span class="badge badge-${p.difficulty.toLowerCase()}">${p.difficulty}</span>
            </div>
            <p class="lab-card-desc">${p.problemStatement}</p>
            <div class="lab-card-footer">
              <span class="paradigm-tag ${ptCls}">${p.paradigm}</span>
              <span class="lab-card-cta">Study &amp; Run →</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="animate-fade-in">

      <!-- Page Header -->
      <div class="page-header">
        <h1><span class="text-gradient">🎓 ADA Lab Prep</span></h1>
        <p>BCSL404 — Analysis and Design of Algorithms Lab. Study reference C programs, watch exact Udemy lectures, and solve prerequisite sub-challenges before your exam.</p>
      </div>

      <!-- Stats Bar -->
      <div class="lab-stats-bar">
        <div class="stat-chip animate-slide-up stagger-1">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <strong>${LAB_PROGRAMS.length}</strong>
            <span>Programs</span>
          </div>
        </div>
        <div class="stat-chip animate-slide-up stagger-2">
          <div class="stat-icon">🧠</div>
          <div class="stat-info">
            <strong>${Object.keys(paradigmCounts).length}</strong>
            <span>Paradigms</span>
          </div>
        </div>
        <div class="stat-chip animate-slide-up stagger-3">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <strong>21 July</strong>
            <span>Exam Date</span>
          </div>
        </div>
        <div class="stat-chip animate-slide-up stagger-4">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <strong>Judge0</strong>
            <span>C Compiler</span>
          </div>
        </div>
      </div>

      <!-- Search + Filter Pills -->
      <div class="lab-filters-bar">
        <div class="lab-search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" class="input-text" id="lab-search"
            placeholder="Search programs…" autocomplete="off">
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
          ${ALL_PARADIGMS.map(p => `
            <button class="filter-pill ${p === 'All' ? 'active' : ''}" data-paradigm="${p}">
              ${p === 'All' ? 'All Programs' : p}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Program Grid -->
      <div class="library-grid" id="lab-list-container"></div>

    </div>
  `;

  // Attach events
  const searchInput = container.querySelector('#lab-search');
  searchInput.addEventListener('input', (e) => {
    searchVal = e.target.value;
    renderList();
  });

  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      paradigmFilter = pill.dataset.paradigm;
      renderList();
    });
  });

  renderList();
}
