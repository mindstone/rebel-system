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
    const colour = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: {
      fontFamily: colour('--font-family-sans'),
      background: colour('--color-surface-1'),
      primaryColor: colour('--rebel-chart-1'),
      primaryBorderColor: colour('--rebel-chart-axis'),
      primaryTextColor: colour('--color-text-inverse'),
      lineColor: colour('--rebel-chart-axis'),
      textColor: colour('--color-text-primary'),
      titleColor: colour('--color-text-primary'),
      taskBkgColor: colour('--rebel-chart-1'),
      taskTextColor: colour('--color-text-inverse'),
      taskTextOutsideColor: colour('--color-text-primary'),
      taskBorderColor: colour('--rebel-chart-axis'),
      gridColor: colour('--rebel-chart-grid'),
      sectionBkgColor: colour('--color-surface-1'),
      altSectionBkgColor: colour('--color-bg-page'),
    } });
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
