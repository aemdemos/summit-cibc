export default async function init(el) {
  const row = el.querySelector(':scope > div');
  if (row) row.classList.add('trust-badge-content');
}
