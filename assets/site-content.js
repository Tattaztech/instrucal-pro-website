import {mediaUrl} from './video-catalog.js';

export async function applySiteContent() {
  const response = await fetch(new URL('./content/site.json', import.meta.url), {cache:'no-cache'});
  if (!response.ok) return;
  const content = await response.json();
  const lang = document.documentElement.lang;
  const copy = content[lang];
  if (['navy','teal','slate'].includes(content.theme)) document.documentElement.dataset.theme = content.theme;
  for (const [key, node] of [['title','#home h1'], ['description','#home .lead'], ['galleryTitle','#photo-gallery-title']]) {
    if (typeof copy?.[key] === 'string' && copy[key].trim()) document.querySelector(node).textContent = copy[key];
  }
  const heroPhoto = mediaUrl(content.photo, 'content/photos', /\.(?:jpe?g|png|webp|avif)$/i);
  if (heroPhoto) {
    const image = document.querySelector('#home .phone img');
    image.src = heroPhoto;
    image.alt = copy?.photoAlt ?? '';
    image.closest('figure').classList.add('hero-photo');
  }
  if (!Array.isArray(content.items)) return;
  const gallery = document.querySelector('#photo-gallery');
  const cards = gallery.querySelector('.cards');
  for (const item of content.items) {
    const text = item?.[lang];
    const photo = mediaUrl(item?.photo, 'content/photos', /\.(?:jpe?g|png|webp|avif)$/i);
    if (!photo && !text?.title && !text?.description) continue;
    const article = document.createElement('article');
    article.className = 'card';
    if (photo) {
      const image = document.createElement('img');
      image.src = photo;
      image.alt = text?.photoAlt ?? '';
      image.loading = 'lazy';
      article.append(image);
    }
    if (text?.title) {
      const heading = document.createElement('h3');
      heading.textContent = text.title;
      article.append(heading);
    }
    if (text?.description) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text.description;
      article.append(paragraph);
    }
    cards.append(article);
  }
  gallery.hidden = cards.childElementCount === 0;
}
