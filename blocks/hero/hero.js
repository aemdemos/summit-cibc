function setBackgroundFocus(img) {
  const { title } = img.dataset;
  if (!title?.includes('data-focal')) return;
  delete img.dataset.title;
  const [x, y] = title.split(':')[1].split(',');
  img.style.objectPosition = `${x}% ${y}%`;
}

function decorateBackground(bg) {
  const bgPic = bg.querySelector('picture');
  if (!bgPic) return;

  const img = bgPic.querySelector('img');
  setBackgroundFocus(img);

  const vidLink = bgPic.closest('a[href*=".mp4"]');
  if (!vidLink) return;
  const video = document.createElement('video');
  video.src = vidLink.href;
  video.loop = true;
  video.muted = true;
  video.inert = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'none');
  video.load();
  video.addEventListener('canplay', () => {
    video.play();
    bgPic.remove();
  });
  vidLink.parentElement.append(video, bgPic);
  vidLink.remove();
}

function decorateCTAs(fg) {
  const textCol = fg.querySelector('.fg-text');
  if (!textCol) return;

  const ctas = [];

  textCol.querySelectorAll('p').forEach((p) => {
    const strong = p.querySelector('strong');
    if (strong) {
      const links = [...strong.querySelectorAll('a')];
      links.forEach((a) => ctas.push(a));
      p.remove();
    } else {
      const link = p.querySelector('a:only-child');
      if (link && !p.textContent.trim().replace(link.textContent.trim(), '')) {
        ctas.push(link);
        p.remove();
      }
    }
  });

  textCol.querySelectorAll('a.btn, a.btn-primary, a.btn-secondary').forEach((a) => {
    if (!ctas.includes(a)) {
      ctas.push(a);
      if (a.parentElement?.tagName === 'P' || a.parentElement?.tagName === 'STRONG') {
        const wrapper = a.parentElement.tagName === 'STRONG' ? a.parentElement.closest('p') || a.parentElement : a.parentElement;
        if (wrapper.querySelectorAll('a').length === 0) wrapper.remove();
      }
    }
  });

  if (ctas.length > 0) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'hero-cta-group';
    ctas.forEach((a, i) => {
      a.classList.remove('btn-primary', 'btn-secondary');
      a.classList.add('btn');
      a.classList.add(i === 0 ? 'btn-primary' : 'btn-secondary');
      ctaWrap.append(a);
    });
    textCol.append(ctaWrap);
  }
}

/**
 * Convert a <ul> of links into a <select> dropdown + Go button.
 * Authored as: <ul><li><a href="url">Label</a></li>...</ul>
 * Renders as: <select><option value="url">Label</option>...</select> + Go
 */
function decorateSidePanel(panel) {
  const ul = panel.querySelector('ul');
  if (!ul) return;

  const select = document.createElement('select');
  select.className = 'hero-site-select';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a site:';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.append(placeholder);

  ul.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (link) {
      const option = document.createElement('option');
      option.value = link.href;
      option.textContent = link.textContent;
      select.append(option);
    }
  });

  const goBtn = document.createElement('button');
  goBtn.className = 'btn btn-primary hero-site-go';
  goBtn.textContent = 'Go';
  goBtn.addEventListener('click', () => {
    if (select.value) {
      window.open(select.value, '_blank');
    }
  });

  const dropdownWrap = document.createElement('div');
  dropdownWrap.className = 'hero-site-dropdown';
  dropdownWrap.append(select, goBtn);

  ul.replaceWith(dropdownWrap);
}

function decorateForeground(fg) {
  const { children } = fg;
  for (const [idx, child] of [...children].entries()) {
    const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    const text = heading || child.querySelector('p, a, ul');
    if (heading) {
      heading.classList.add('hero-heading');
      const detail = heading.previousElementSibling;
      if (detail) {
        detail.classList.add('hero-detail');
      }
    }
    if (text) {
      child.classList.add('fg-text');
      if (idx === 0) {
        child.closest('.hero').classList.add('hero-text-start');
      } else {
        child.closest('.hero').classList.add('hero-text-end');
        // Decorate side panel dropdowns
        decorateSidePanel(child);
      }
    }
  }

  decorateCTAs(fg);
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const fg = rows.pop();
  fg.classList.add('hero-foreground');
  decorateForeground(fg);
  if (rows.length) {
    const bg = rows.pop();
    bg.classList.add('hero-background');
    decorateBackground(bg);
  }
}
