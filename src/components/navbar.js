// Navigation bar component — v2 redesign

export function renderNavbar(activeRoute) {
  const navContainer = document.getElementById('navbar-container');
  if (!navContainer) return;

  const routes = [
    { id: 'generator', label: 'Generate', icon: '🎯', href: '#/' },
    { id: 'import',    label: 'Import JSON', icon: '📥', href: '#/import' },
    { id: 'library',   label: 'Library', icon: '📚', href: '#/library' },
    { id: 'lab',       label: 'Lab Prep', icon: '🎓', href: '#/lab' }
  ];

  navContainer.innerHTML = `
    <nav class="navbar">
      <a class="navbar-logo" href="#/">
        <div class="navbar-logo-icon">⚡</div>
        <span class="navbar-logo-text">OwnLeetCode</span>
      </a>
      <div class="navbar-links">
        ${routes.map(r => `
          <a class="nav-link ${activeRoute === r.id ? 'active' : ''}" href="${r.href}">
            <span>${r.icon}</span> ${r.label}
          </a>
        `).join('')}
      </div>
    </nav>
  `;
}
