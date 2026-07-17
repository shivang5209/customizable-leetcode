// Application shell entry point and SPA router

import './styles/main.css';
import { renderNavbar } from './components/navbar';
import { renderPromptGenerator } from './pages/prompt-generator';
import { renderJSONImport } from './pages/json-import';
import { renderProblemView } from './pages/problem-view';
import { renderProblemLibrary } from './pages/library';
import { renderLabPrep } from './pages/lab-prep';
import { renderLabStudy } from './pages/lab-study';

// Populate initial shell container
const appShell = document.getElementById('app');
appShell.innerHTML = `
  <div class="app-container">
    <div id="navbar-container"></div>
    <main class="main-content" id="main-content"></main>
  </div>
`;

const mainContent = document.getElementById('main-content');

// Simple Hash Router
function handleRoute() {
  const hash = window.location.hash || '#/';
  
  // Clear any existing tooltips, workers, or timers if necessary
  mainContent.innerHTML = '';

  // Match routes
  const solveMatch = hash.match(/^#\/solve\/(.+)$/);
  const labStudyMatch = hash.match(/^#\/lab\/study\/(.+)$/);

  if (hash === '#/') {
    renderNavbar('generator');
    renderPromptGenerator(mainContent);
  } else if (hash === '#/import') {
    renderNavbar('import');
    renderJSONImport(mainContent);
  } else if (hash === '#/library') {
    renderNavbar('library');
    renderProblemLibrary(mainContent);
  } else if (hash === '#/lab') {
    renderNavbar('lab');
    renderLabPrep(mainContent);
  } else if (solveMatch) {
    const problemId = solveMatch[1];
    renderNavbar('solve');
    renderProblemView(mainContent, problemId);
  } else if (labStudyMatch) {
    const labId = labStudyMatch[1];
    renderNavbar('lab');
    renderLabStudy(mainContent, labId);
  } else {
    // Route not found -> redirect to home
    window.location.hash = '#/';
  }
}

// Router Event Listeners
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
