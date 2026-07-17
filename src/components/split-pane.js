// Resizable Split-Pane Helper

export function initSplitPane(containerEl, leftPaneEl, resizerEl, rightPaneEl) {
  let isDragging = false;

  resizerEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    resizerEl.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const containerRect = containerEl.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    
    // Bounds check: 20% to 80% of container width
    const minWidth = 300;
    const maxWidth = containerRect.width - 350;
    
    let newWidth = relativeX;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    leftPaneEl.style.width = `${newWidth}px`;
    
    // Trigger Monaco editor layout resize if editor window exists
    if (window.dispatchEvent) {
      window.dispatchEvent(new Event('resize'));
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      resizerEl.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Save width preference to localStorage
      localStorage.setItem('leetcode_split_width', leftPaneEl.style.width);
    }
  });

  // Restore saved width
  const savedWidth = localStorage.getItem('leetcode_split_width');
  if (savedWidth) {
    leftPaneEl.style.width = savedWidth;
  }
}
