// Circle markers avoid Leaflet’s external marker-image dependency.
if (typeof L !== 'undefined') {
  const offices = [
    { name: 'Acme West', location: [51.50, -0.12] },
    { name: 'Acme East', location: [52.52, 13.40] },
  ];
  const map = L.map('map', { scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  const outline = L.rectangle([[49, -3], [55, 16]], { weight: 1, fillOpacity: 0.06 }).addTo(map);
  const markers = offices.map(office => L.circleMarker(office.location, { radius: 9 })
    .addTo(map).bindTooltip(office.name, { permanent: true, direction: 'top' }));
  map.fitBounds(outline.getBounds());
  function render() {
    const colour = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    document.getElementById('map').style.background = colour('--color-surface-elevated');
    outline.setStyle({ color: colour('--rebel-chart-axis') });
    markers.forEach(marker => marker.setStyle({ color: colour('--rebel-chart-1'), fillOpacity: 0.85 }));
  }
  render();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
  document.getElementById('notice').hidden = true;
}
