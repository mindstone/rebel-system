// Embedded snapshot; no requests for data from the page.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const revenue = [148000, 172000, 186000, 214000, 246000, 278000];
const regions = ['North America', 'EMEA', 'Asia Pacific', 'Latin America'];
const regionRevenue = [570000, 340000, 206000, 128000];
const theme = matchMedia('(prefers-color-scheme: dark)');
const charts = [];

function render() {
  if (typeof Chart === 'undefined') return; // The HTML notices remain visible offline.
  charts.splice(0).forEach(chart => chart.destroy());
  const colour = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const palette = index => colour(`--rebel-chart-${index}`);
  const options = {
    responsive: true, maintainAspectRatio: false, animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: colour('--rebel-chart-text') }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: colour('--rebel-chart-text'), callback: value => `$${value / 1000}k` },
        grid: { color: colour('--rebel-chart-grid') }, border: { color: colour('--rebel-chart-axis') } },
    },
  };
  charts.push(new Chart(document.getElementById('revenue-chart'), {
    type: 'line',
    data: { labels: months, datasets: [{ label: 'Revenue', data: revenue,
      borderColor: palette(1), backgroundColor: palette(1), tension: 0.3, pointRadius: 4 }] },
    options,
  }));
  charts.push(new Chart(document.getElementById('region-chart'), {
    type: 'bar',
    data: { labels: regions, datasets: [{ label: 'Revenue', data: regionRevenue,
      backgroundColor: regionRevenue.map((_, index) => palette(index + 1)), borderRadius: 5 }] },
    options,
  }));
  document.getElementById('revenue-notice').hidden = true;
  document.getElementById('region-notice').hidden = true;
}
render();
theme.addEventListener('change', render);
