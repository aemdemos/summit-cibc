export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'article-cards-grid';
  let ctaEl = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const type = cols[0].textContent.trim().toLowerCase();

    if (type === 'cta') {
      const link = cols[1].querySelector('a');
      if (link) {
        ctaEl = link;
        ctaEl.classList.add('article-cards-cta');
      }
      return;
    }

    // Regular article card: col1 = image, col2 = content
    const card = document.createElement('div');
    card.className = 'article-card';

    const imageEl = cols[0].querySelector('picture, img');
    if (imageEl) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'article-card-image';
      imageWrap.append(imageEl);
      card.append(imageWrap);
    }

    const body = document.createElement('div');
    body.className = 'article-card-body';

    // Move all content from col2 (or col1 if single col)
    const content = cols[1] || cols[0];
    body.append(...content.childNodes);

    // Find the last link and style it as read-time
    const links = body.querySelectorAll('a');
    const lastLink = links[links.length - 1];
    if (lastLink) {
      const parent = lastLink.closest('p') || lastLink;
      parent.classList.add('article-card-read-time');
    }

    card.append(body);
    grid.append(card);
  });

  el.textContent = '';
  el.append(grid);

  if (ctaEl) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'article-cards-cta-wrap';
    ctaWrap.append(ctaEl);
    el.append(ctaWrap);
  }
}
