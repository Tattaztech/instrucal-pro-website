import {readCatalog, sourceUrl} from './video-catalog.js';

const root = document.documentElement;
const menu = document.querySelector('[aria-controls="nav"]');
const nav = document.querySelector('#nav');
const mobile = matchMedia('(max-width:970px)');
function syncMenu() {
  menu.hidden = !mobile.matches;
  menu.setAttribute('aria-expanded', String(!mobile.matches));
  nav.classList.toggle('is-collapsed', mobile.matches);
}
syncMenu();
mobile.addEventListener('change', syncMenu);
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('is-collapsed', !expanded);
});
nav.addEventListener('click', event => {
  if (mobile.matches && event.target.closest('a')) syncMenu();
});

const data = JSON.parse(document.querySelector('#demo-data').textContent);
const labels = data.labels;
const options = [...document.querySelectorAll('[data-module]')];
const shot = document.querySelector('#demo-shot');
const empty = document.querySelector('#demo-empty');
const title = document.querySelector('#demo-title');
const description = document.querySelector('#demo-description');
const counter = document.querySelector('#demo-count');
const prev = document.querySelector('#demo-prev');
const next = document.querySelector('#demo-next');
const zoom = document.querySelector('#demo-zoom');
const dialog = document.querySelector('#demo-dialog');
const large = dialog.querySelector('img');
const controls = document.querySelector('.demo-controls');
const phone = shot.closest('.phone');
const videoList = document.querySelector('#demo-videos');
let videos = [];
controls.hidden = false;
options.forEach(button => {button.hidden = false;});
let selected = data.modules.findIndex(module => module.shots.length);
if (selected < 0) selected = 0;
let frame = 0;

function publish(name, section) {
  const detail = { name, section, language: root.lang, page: location.pathname };
  window.dispatchEvent(new CustomEvent('instrucal:metric', {detail}));
  if (!data.analytics || !document.querySelector('#analytics-opt-in')?.checked) return;
  fetch(data.analytics, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify(detail), credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer'
  }).catch(() => {});
}

const viewed = new Set();
const sections = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting || viewed.has(entry.target.id)) continue;
    viewed.add(entry.target.id);
    publish('section_view', entry.target.id);
  }
});
document.querySelectorAll('main > section[id]').forEach(section => sections.observe(section));

function renderVideos(module) {
  const entries = videos.filter(video => video.modules.includes(module.id));
  videoList.replaceChildren(...entries.map(video => {
    const article = document.createElement('article');
    const heading = document.createElement('h4');
    const player = document.createElement('video');
    const caption = document.createElement('p');
    const copy = video[root.lang];
    heading.textContent = copy.title;
    player.setAttribute('aria-label', copy.title);
    player.controls = true;
    player.playsInline = true;
    player.preload = 'none';
    player.src = sourceUrl(video.file);
    if (video.poster) player.poster = sourceUrl(video.poster);
    if (video.portrait) player.classList.add('portrait');
    caption.textContent = copy.description;
    article.append(heading, player, caption);
    return article;
  }));
  videoList.hidden = entries.length === 0;
  phone.hidden = entries.length > 0 && module.shots.length === 0;
}

function render() {
  const module = data.modules[selected];
  const image = module.shots[frame];
  options.forEach((button, index) => button.setAttribute('aria-pressed', String(index === selected)));
  title.textContent = module.title;
  description.textContent = module.description;
  shot.hidden = !image;
  empty.hidden = Boolean(image);
  if (image) {
    shot.src = image.src;
    shot.alt = image.alt;
  }
  counter.textContent = image ? labels.counter.replace('{current}', frame + 1).replace('{total}', module.shots.length) : '';
  prev.disabled = frame === 0;
  next.disabled = frame + 1 >= module.shots.length;
  zoom.disabled = !image;
  controls.hidden = videoList.childElementCount > 0 && !image;
}
function selectModule(index) {
  selected = index;
  frame = 0;
  renderVideos(data.modules[index]);
  render();
  publish('module_view', data.modules[index].id);
}
options.forEach((button, index) => button.addEventListener('click', () => selectModule(index)));
document.querySelectorAll('[data-demo-link]').forEach(link => link.addEventListener('click', () => {
  selectModule(data.modules.findIndex(module => module.id === link.dataset.demoLink));
}));
prev.addEventListener('click', () => { frame -= 1; render(); });
next.addEventListener('click', () => { frame += 1; render(); });
zoom.addEventListener('click', () => {
  large.src = shot.currentSrc;
  large.alt = shot.alt;
  dialog.showModal();
});
dialog.addEventListener('close', () => zoom.focus());
document.addEventListener('click', event => {
  const element = event.target.closest('[data-event]');
  if (element) publish(element.dataset.event, element.dataset.section);
});
render();
readCatalog().then(entries => {
  videos = entries;
  renderVideos(data.modules[selected]);
  render();
}).catch(() => {});
const optIn = document.querySelector('#analytics-opt-in');
if (optIn) {
  try { optIn.checked = localStorage.getItem('instrucal-consent') === 'yes'; } catch {}
  optIn.addEventListener('change', () => {
    try { localStorage.setItem('instrucal-consent', optIn.checked ? 'yes' : 'no'); } catch {}
    if (optIn.checked) {
      publish('page_view', 'landing');
      viewed.forEach(section => publish('section_view', section));
    }
  });
}
publish('page_view', 'landing');
