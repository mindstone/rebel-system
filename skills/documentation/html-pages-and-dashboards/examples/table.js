// Small tables usually need only the kit; use Tabulator for sorting/filtering.
if (typeof Tabulator !== 'undefined') {
  const rows = [
    { company: 'Acme Corp', stage: 'Proposal', value: 24000 },
    { company: 'Example Studio', stage: 'Discovery', value: 12000 },
    { company: 'Example Works', stage: 'Negotiation', value: 36000 },
  ];
  const table = new Tabulator('#pipeline', {
    data: rows, layout: 'fitColumns',
    initialSort: [{ column: 'value', dir: 'desc' }],
    columns: [
      { title: 'Company', field: 'company', headerFilter: 'input' },
      { title: 'Stage', field: 'stage', headerFilter: 'input' },
      { title: 'Value (USD)', field: 'value', sorter: 'number', hozAlign: 'right', formatter: 'money', formatterParams: { symbol: '$', precision: 0 } },
    ],
  });
  table.on('tableBuilt', () => {
    document.getElementById('notice').hidden = true;
    document.getElementById('plain-table').hidden = true;
  });
}
