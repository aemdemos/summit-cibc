export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'contact-strip-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const item = document.createElement('div');
    item.className = 'contact-strip-item';

    const icon = cols[0].querySelector('picture, img');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'contact-strip-icon';
      iconWrap.append(icon);
      item.append(iconWrap);
    }

    const body = document.createElement('div');
    body.className = 'contact-strip-body';
    body.append(...cols[1].childNodes);
    item.append(body);

    grid.append(item);
  });

  el.textContent = '';
  el.append(grid);
}
