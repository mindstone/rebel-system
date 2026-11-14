if (typeof FullCalendar !== 'undefined') {
  const events = [
    { title: 'Acme kickoff', start: '2026-06-08' },
    { title: 'Prototype review', start: '2026-06-18' },
    { title: 'Launch planning', start: '2026-06-25' },
  ];
  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth', initialDate: '2026-06-01', events,
    headerToolbar: { left: 'prev,next', center: 'title', right: 'dayGridMonth,listMonth' },
    height: 'auto', editable: false,
  });
  calendar.render();
  document.getElementById('notice').hidden = true;
  // FullCalendar uses the kit’s CSS variables, which follow the theme directly.
}
