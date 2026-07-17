// Simple client-side markdown renderer using regular expressions

export function renderMarkdown(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML entities to prevent XSS but allow our own rendering tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Preformatted Code Blocks: ```javascript ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
    return `<pre class="code-block language-${lang}"><code class="hljs">${code}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Bullet Lists
  // Match lines starting with - or * and group them into <ul>
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
  
  // Wrap consecutive <li> tags in <ul>
  // We do a simple replacement for groups of <li>
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Paragraphs and Line Breaks
  // Split by double newline, wrap non-HTML block items in <p>
  const blocks = html.split(/\n\n+/);
  const renderedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<li>')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  });

  return renderedBlocks.join('\n');
}
