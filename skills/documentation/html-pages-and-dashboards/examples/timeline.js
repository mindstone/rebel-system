if (typeof mermaid !== 'undefined') {
  const sources = [
    ['gantt', `gantt
      title Acme delivery
      dateFormat YYYY-MM-DD
      axisFormat %d %b
      section Report
      Research :a, 2026-06-01, 3d
      Draft :b, after a, 5d
      Review :c, after b, 2d`],
    ['flow', 'flowchart LR\n  A[Draft] --> B[Review] --> C[Publish]'],
  ];
  const theme = matchMedia('(prefers-color-scheme: dark)');
  async function render() {
    mermaid.initialize({ startOnLoad: false, theme: theme.matches ? 'dark' : 'default' });
    sources.forEach(([id, source]) => {
      const node = document.getElementById(id);
      node.removeAttribute('data-processed');
      node.textContent = source;
    });
    await mermaid.run({ nodes: sources.map(([id]) => document.getElementById(id)) });
    document.getElementById('notice').hidden = true;
  }
  function showError(error) {
    document.getElementById('notice').hidden = false;
    console.error('Diagram rendering failed', error);
  }
  // Serialize renders so a theme switch never overlaps an unfinished render.
  let pending = render().catch(showError);
  theme.addEventListener('change', () => { pending = pending.then(render).catch(showError); });
}
