export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'footer-sitemap-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const column = document.createElement('div');
    column.className = 'footer-sitemap-column';

    // First cell: category label
    if (cells[0]) {
      const label = document.createElement('div');
      label.className = 'footer-sitemap-label';
      label.append(...cells[0].childNodes);
      column.append(label);
    }

    // Second cell: sub-links
    if (cells[1]) {
      const links = document.createElement('div');
      links.className = 'footer-sitemap-links';
      links.append(...cells[1].childNodes);
      column.append(links);
    }

    grid.append(column);
  });

  el.textContent = '';
  el.append(grid);
}
