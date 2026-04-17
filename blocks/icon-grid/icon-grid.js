/**
 * Icon Grid block
 *
 * Content model (rows):
 *   Row 1..N: Grid items
 *     Col 1: Icon (picture or span.icon)
 *     Col 2: Heading + description text
 *   Last row (optional): CTA
 *     Col 1: "cta"
 *     Col 2: Link element — renders only if link is present
 */

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const items = [];
  let ctaEl = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const type = cols[0].textContent.trim().toLowerCase();

    if (type === 'cta') {
      const link = cols[1].querySelector('a');
      if (link) {
        ctaEl = link;
        ctaEl.classList.add('icon-grid-cta');
      }
      return;
    }

    const item = document.createElement('div');
    item.className = 'icon-grid-item';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon-grid-icon';
    const pic = cols[0].querySelector('picture');
    const icon = cols[0].querySelector('.icon');
    if (pic) iconWrap.append(pic);
    else if (icon) iconWrap.append(icon);
    else iconWrap.innerHTML = cols[0].innerHTML;

    const textWrap = document.createElement('div');
    textWrap.className = 'icon-grid-text';
    textWrap.append(...cols[1].children);

    item.append(iconWrap, textWrap);
    items.push(item);
  });

  el.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'icon-grid-items';
  items.forEach((item) => grid.append(item));
  el.append(grid);

  if (ctaEl) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'icon-grid-cta-wrap';
    ctaWrap.append(ctaEl);
    el.append(ctaWrap);
  }
}
