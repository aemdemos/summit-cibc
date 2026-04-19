export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'product-cards-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const card = document.createElement('div');
    card.className = 'product-card';

    // Col 1: image with optional bg color class
    const imageCol = cols[0];
    const img = imageCol.querySelector('picture, img');
    if (img) {
      const imageWrap = document.createElement('div');
      imageWrap.className = 'product-card-image';
      imageWrap.append(img);
      card.append(imageWrap);
    }

    // Col 2: content (category label in first <p>, heading, description, CTAs)
    const content = cols[1];
    const body = document.createElement('div');
    body.className = 'product-card-body';

    const children = [...content.children];
    children.forEach((child) => {
      // First <p> with all-caps text is the category label
      if (child.tagName === 'P' && child.textContent === child.textContent.toUpperCase()
          && child.textContent.length > 3 && !child.querySelector('a')) {
        child.classList.add('product-card-category');
      }
      body.append(child);
    });

    card.append(body);
    grid.append(card);
  });

  el.textContent = '';
  el.append(grid);
}
