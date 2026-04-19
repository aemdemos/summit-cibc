export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'testimonial-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const type = cols[0].textContent.trim().toLowerCase();
    const content = cols[1];

    if (type === 'quick-links') {
      const sidebar = document.createElement('div');
      sidebar.className = 'testimonial-sidebar';
      sidebar.append(...content.childNodes);
      grid.append(sidebar);
    } else {
      // Testimonial card
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      const portrait = content.querySelector('picture, img');
      if (portrait) {
        const portraitWrap = document.createElement('div');
        portraitWrap.className = 'testimonial-portrait';
        portraitWrap.append(portrait);
        card.append(portraitWrap);
      }

      const body = document.createElement('div');
      body.className = 'testimonial-body';
      body.append(...content.childNodes);

      // Style the <em> element as attribution
      const ems = body.querySelectorAll('em');
      ems.forEach((em) => {
        const parent = em.closest('p') || em;
        parent.classList.add('testimonial-attribution');
      });

      card.append(body);
      grid.append(card);
    }
  });

  el.textContent = '';
  el.append(grid);
}
