export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    row.classList.add('alert-banner-item');
    const close = document.createElement('button');
    close.className = 'alert-banner-close';
    close.setAttribute('aria-label', 'Dismiss alert');
    close.textContent = '×';
    close.addEventListener('click', () => {
      row.remove();
      if (!el.querySelector('.alert-banner-item')) el.remove();
    });
    row.append(close);
  });
}
