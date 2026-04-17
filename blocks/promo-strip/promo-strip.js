export default async function init(el) {
  const row = el.querySelector(':scope > div');
  if (row) row.classList.add('promo-strip-content');
}
