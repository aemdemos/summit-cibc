import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';
import { setColorScheme } from '../section-metadata/section-metadata.js';

const { locale } = getConfig();

const HEADER_PATH = '/fragments/nav/cibc-header';
const HEADER_ACTIONS = [
  '/tools/widgets/scheme',
  '/tools/widgets/language',
  '/tools/widgets/toggle',
];

function closeAllMenus() {
  const openMenus = document.body.querySelectorAll('header .is-open');
  for (const openMenu of openMenus) {
    openMenu.classList.remove('is-open');
  }
}

function docClose(e) {
  if (e.target.closest('header')) return;
  closeAllMenus();
}

function toggleMenu(menu) {
  const isOpen = menu.classList.contains('is-open');
  closeAllMenus();
  if (isOpen) {
    document.removeEventListener('click', docClose);
    return;
  }

  // Setup the global close event
  document.addEventListener('click', docClose);
  menu.classList.add('is-open');
}

function decorateLanguage(btn) {
  const section = btn.closest('.section');
  btn.addEventListener('click', async () => {
    let menu = section.querySelector('.language.menu');
    if (!menu) {
      const content = document.createElement('div');
      content.classList.add('block-content');
      const fragment = await loadFragment(`${locale.prefix}${HEADER_PATH}/languages`);
      menu = document.createElement('div');
      menu.className = 'language menu';
      menu.append(fragment);
      content.append(menu);
      section.append(content);
    }
    toggleMenu(section);
  });
}

function decorateScheme(btn) {
  btn.addEventListener('click', async () => {
    const { body } = document;

    let currPref = localStorage.getItem('color-scheme');
    if (!currPref) {
      currPref = matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark-scheme' : 'light-scheme';
    }

    const theme = currPref === 'dark-scheme'
      ? { add: 'light-scheme', remove: 'dark-scheme' }
      : { add: 'dark-scheme', remove: 'light-scheme' };

    body.classList.remove(theme.remove);
    body.classList.add(theme.add);
    localStorage.setItem('color-scheme', theme.add);
    // Re-calculatie section schemes
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
      setColorScheme(section);
    }
  });
}

function decorateNavToggle(btn) {
  btn.addEventListener('click', () => {
    const header = document.body.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
}

async function decorateAction(header, pattern) {
  const link = header.querySelector(`[href*="${pattern}"]`);
  if (!link) return;

  const icon = link.querySelector('.icon');
  const text = link.textContent;
  const btn = document.createElement('button');
  if (icon) btn.append(icon);
  if (text) {
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;
    btn.append(textSpan);
  }
  const wrapper = document.createElement('div');
  wrapper.className = `action-wrapper ${icon.classList[1].replace('icon-', '')}`;
  wrapper.append(btn);
  link.parentElement.parentElement.replaceChild(wrapper, link.parentElement);

  if (pattern === '/tools/widgets/language') decorateLanguage(btn);
  if (pattern === '/tools/widgets/scheme') decorateScheme(btn);
  if (pattern === '/tools/widgets/toggle') decorateNavToggle(btn);
}

function decorateMenu() {
  // TODO: finish single menu support
  return null;
}

function decorateMegaMenu(li) {
  const menu = li.querySelector('.fragment-content');
  if (!menu) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'mega-menu';
  wrapper.append(menu);
  li.append(wrapper);
  return wrapper;
}

function decorateNavItem(li) {
  li.classList.add('main-nav-item');
  const link = li.querySelector(':scope > p > a');
  if (link) link.classList.add('main-nav-link');
  const menu = decorateMegaMenu(li) || decorateMenu(li);
  if (!(menu || link)) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu(li);
  });
}

function decorateBrandSection(section) {
  section.classList.add('brand-section');
  const brandLink = section.querySelector('a');
  const [, text] = brandLink.childNodes;
  const span = document.createElement('span');
  span.className = 'brand-text';
  span.append(text);
  brandLink.append(span);
}

function decorateNavSection(section) {
  section.classList.add('main-nav-section');
  const navContent = section.querySelector('.default-content');
  const navList = section.querySelector('ul');
  if (!navList) return;
  navList.classList.add('main-nav-list');

  const nav = document.createElement('nav');
  nav.append(navList);
  navContent.append(nav);

  const mainNavItems = section.querySelectorAll('nav > ul > li');
  for (const navItem of mainNavItems) {
    decorateNavItem(navItem);
  }
}

async function decorateActionSection(section) {
  section.classList.add('actions-section');
}

function isCibcHeader(fragment) {
  return !!fragment.querySelector('.mega-nav');
}

function decorateCibcUtilityBar(section) {
  section.classList.add('cibc-utility-bar');
  const right = document.createElement('div');
  right.className = 'utility-bar-right';

  const offers = document.createElement('a');
  offers.href = '/en/special-offers.html';
  offers.className = 'utility-link utility-offers';
  offers.textContent = 'Special Offers';
  right.append(offers);

  const lang = document.createElement('span');
  lang.className = 'utility-link utility-lang';
  lang.textContent = 'English';
  right.append(lang);

  section.querySelector('.default-content').append(right);
}

function decorateCibcBrandBar(section) {
  section.classList.add('cibc-brand-bar');
  const actions = document.createElement('div');
  actions.className = 'brand-bar-actions';

  const icons = ['search', 'location', 'profile'];
  icons.forEach((name) => {
    const btn = document.createElement('button');
    btn.className = `brand-icon brand-icon-${name}`;
    btn.setAttribute('aria-label', name);
    if (name === 'location') {
      const a = document.createElement('a');
      a.href = 'https://locations.cibc.com/';
      a.className = `brand-icon brand-icon-${name}`;
      a.setAttribute('aria-label', 'Locations');
      actions.append(a);
      return;
    }
    actions.append(btn);
  });

  const signOn = document.createElement('a');
  signOn.href = 'https://www.cibconline.cibc.com/ebm-resources/'
    + 'public/signon/cibc/kaas/signon.html';
  signOn.className = 'brand-signon';
  signOn.textContent = 'Sign On';
  actions.append(signOn);

  const register = document.createElement('a');
  register.href = '/en/personal-banking/ways-to-bank/'
    + 'how-to/register-for-mobile-and-online-banking.html';
  register.className = 'brand-register';
  register.textContent = 'Register for Online and Mobile Banking';
  actions.append(register);

  const toggle = document.createElement('button');
  toggle.className = 'brand-icon brand-icon-toggle';
  toggle.setAttribute('aria-label', 'Menu');
  toggle.addEventListener('click', () => {
    const header = document.body.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
  actions.append(toggle);

  section.querySelector('.default-content').append(actions);
}

function decorateCibcNavSection(section) {
  section.classList.add('cibc-nav-section');
}

async function decorateCibcHeader(fragment) {
  fragment.classList.add('cibc-header-content');
  const sections = fragment.querySelectorAll(':scope > .section');
  if (sections[0]) decorateCibcUtilityBar(sections[0]);
  if (sections[1]) decorateCibcBrandBar(sections[1]);
  if (sections[2]) decorateCibcNavSection(sections[2]);
}

async function decorateHeader(fragment) {
  if (isCibcHeader(fragment)) {
    await decorateCibcHeader(fragment);
    return;
  }

  const sections = fragment.querySelectorAll(':scope > .section');
  if (sections[0]) decorateBrandSection(sections[0]);
  if (sections[1]) decorateNavSection(sections[1]);
  if (sections[2]) decorateActionSection(sections[2]);

  for (const pattern of HEADER_ACTIONS) {
    decorateAction(fragment, pattern);
  }
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  let fragment;
  try {
    fragment = await loadFragment(`${locale.prefix}${path}`);
  } catch {
    // Fallback: try with /content prefix (local dev server)
    fragment = await loadFragment(`/content${locale.prefix}${path}`);
  }
  fragment.classList.add('header-content');
  await decorateHeader(fragment);
  el.append(fragment);
}
