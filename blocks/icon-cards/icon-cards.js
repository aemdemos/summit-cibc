/**
 * Icon Cards block
 *
 * Content model (rows):
 *   Row 1..N: Cards
 *     Col 1: Icon (picture or span.icon)
 *     Col 2: Label + link
 */

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const cards = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const card = document.createElement('a');
    const link = cols[1].querySelector('a');
    card.className = 'icon-card';
    card.href = link ? link.href : '#';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon-card-icon';
    const pic = cols[0].querySelector('picture');
    const icon = cols[0].querySelector('.icon');
    if (pic) iconWrap.append(pic);
    else if (icon) iconWrap.append(icon);
    else iconWrap.innerHTML = cols[0].innerHTML;

    const label = document.createElement('span');
    label.className = 'icon-card-label';
    label.textContent = link ? link.textContent : cols[1].textContent.trim();

    card.append(iconWrap, label);
    cards.push(card);
  });

  el.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'icon-cards-grid';
  cards.forEach((card) => grid.append(card));
  el.append(grid);
}
