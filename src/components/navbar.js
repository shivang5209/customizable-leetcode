// Navigation bar component

export function renderNavbar(activeRoute) {
  const navContainer = document.getElementById('navbar-container');
  if (!navContainer) return;

  const routes = [
    { id: 'generator', label: '🎯 Prompt Generator', href: '#/' },
    { id: 'import', label: '📥 Import JSON', href: '#/import' },
    { id: 'library', label: '📚 Problem Library', href: '#/library' },
    { id: 'lab', label: '🎓 Lab Prep', href: '#/lab' }
  ];

  navContainer.innerHTML = `
    <nav class="navbar">
      <div class="navbar-logo">
        <span>⚡</span> Customizable LeetCode
      </div>
      <div class="navbar-links">
        ${routes.map(r => `
          <a class="nav-link ${activeRoute === r.id ? 'active' : ''}" href="${r.href}">
            ${r.label}
          </a>
        `).join('')}
      </div>
    </nav>
  `;
}
