const productHashes = new Set(['features','screens','certificates','pricing','faq','download','contact','module-pid','module-valve','module-quick','module-complete','module-conversion','module-history','module-safety','module-evidence']);
function followLegacyProductLink() {
  if (document.body.dataset.page === 'home' && productHashes.has(location.hash.slice(1))) {
    location.replace(new URL('instrucal-pro/' + location.hash, location.href));
  }
}
followLegacyProductLink();
addEventListener('hashchange', followLegacyProductLink);
const menu = document.querySelector('[aria-controls="nav"]');
const nav = document.querySelector('#nav');
const small = matchMedia('(max-width:970px)');
function collapse() {
  menu.hidden = !small.matches;
  menu.setAttribute('aria-expanded', String(!small.matches));
  nav.classList.toggle('is-collapsed', small.matches);
}
collapse();
small.addEventListener('change', collapse);
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-collapsed', !open);
});
if (document.body.dataset.page === 'home') {
  import('./site-content.js').then(async ({applySiteContent}) => {
    await applySiteContent(new URL('./content/company.json', import.meta.url));
  }).catch(() => {});
}
