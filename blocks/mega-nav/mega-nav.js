function closeAllFlyouts(nav) {
  nav.querySelectorAll('.mega-nav-item.is-open').forEach((item) => {
    item.classList.remove('is-open');
  });
  nav.classList.remove('has-open-flyout');
}

function toggleFlyout(item, nav) {
  const isOpen = item.classList.contains('is-open');
  closeAllFlyouts(nav);
  if (!isOpen) {
    item.classList.add('is-open');
    nav.classList.add('has-open-flyout');
  }
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const navBar = document.createElement('nav');
  navBar.className = 'mega-nav-bar';
  navBar.setAttribute('aria-label', 'Main navigation');

  const navList = document.createElement('ul');
  navList.className = 'mega-nav-list';

  rows.forEach((row) => {
    const cols = [...row.children];
    const labelCol = cols[0];
    const flyoutCols = cols.slice(1);

    const li = document.createElement('li');
    li.className = 'mega-nav-item';

    const link = labelCol.querySelector('a');
    if (!link) return;

    const hasFlyout = flyoutCols.length > 0;

    if (hasFlyout) {
      const trigger = document.createElement('button');
      trigger.className = 'mega-nav-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = link.textContent;
      trigger.dataset.href = link.href;

      trigger.addEventListener('click', () => {
        const isOpen = li.classList.contains('is-open');
        toggleFlyout(li, el);
        trigger.setAttribute('aria-expanded', !isOpen);
      });

      const panel = document.createElement('div');
      panel.className = 'mega-nav-panel';

      const panelInner = document.createElement('div');
      panelInner.className = 'mega-nav-panel-inner';

      flyoutCols.forEach((col) => {
        const column = document.createElement('ul');
        column.className = 'mega-nav-column';
        const links = col.querySelectorAll('a');
        links.forEach((a) => {
          const colLi = document.createElement('li');
          colLi.append(a);
          column.append(colLi);
        });
        panelInner.append(column);
      });

      panel.append(panelInner);
      li.append(trigger, panel);
    } else {
      link.className = 'mega-nav-link';
      li.append(link);
    }

    navList.append(li);
  });

  navBar.append(navList);
  el.innerHTML = '';
  el.append(navBar);

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mega-nav')) {
      closeAllFlyouts(el);
    }
  });

  // Desktop: open on hover
  el.querySelectorAll('.mega-nav-item').forEach((item) => {
    const trigger = item.querySelector('.mega-nav-trigger');
    if (!trigger) return;

    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 900) {
        closeAllFlyouts(el);
        item.classList.add('is-open');
        el.classList.add('has-open-flyout');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 900) {
        item.classList.remove('is-open');
        el.classList.remove('has-open-flyout');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
