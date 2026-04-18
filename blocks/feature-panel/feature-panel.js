/**
 * Feature Panel block
 *
 * Content model (rows):
 *   Row 1..N: Cards — each row is one card
 *     Col 1: Card type — "quick-links" or empty (regular card)
 *     Col 2: Card content (image + heading + text + links
 *            for regular; heading + link list for quick-links)
 *   Last row (optional): CTA
 *     Col 1: "cta"
 *     Col 2: CTA Label | CTA URL — both must be present for CTA to render
 */

function buildRegularCard(content) {
  const card = document.createElement('div');
  card.className = 'feature-card feature-card-regular';
  card.append(...content.children);
  return card;
}

function buildQuickLinksCard(content) {
  const card = document.createElement('div');
  card.className = 'feature-card feature-card-quick-links';
  card.append(...content.children);
  return card;
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const cards = [];
  let ctaEl = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) {
      // Single-column row — treat as regular card
      cards.push(buildRegularCard(cols[0] || row));
      return;
    }

    const type = cols[0].textContent.trim().toLowerCase();
    const content = cols[1];

    if (type === 'cta') {
      const link = content.querySelector('a');
      if (link) {
        ctaEl = link;
        ctaEl.classList.add('feature-panel-cta');
        // Optional 3rd column: CSS class for the CTA
        if (cols[2]) {
          const cls = cols[2].textContent.trim();
          if (cls) ctaEl.classList.add(cls);
        }
      }
    } else if (type === 'quick-links') {
      cards.push(buildQuickLinksCard(content));
    } else {
      // Regular card (type column may contain "regular" or anything else)
      cards.push(buildRegularCard(content));
    }
  });

  el.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'feature-panel-grid';
  cards.forEach((card) => grid.append(card));
  el.append(grid);

  if (ctaEl) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'feature-panel-cta-wrap';
    ctaWrap.append(ctaEl);
    el.append(ctaWrap);
  }
}
