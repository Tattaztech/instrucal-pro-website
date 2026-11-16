const catalogUrl = new URL('./videos/videos.json', import.meta.url);
export const moduleNames = new Map([
  ['valve', 'Contrôle de vanne et de positionneur'],
  ['pid', 'Simulation de vanne P, PI et PID']
]);

export function validVideo(video) {
  return video && typeof video.file === 'string' &&
    /^[a-z0-9][a-z0-9_-]*\.mp4$/i.test(video.file) &&
    (video.poster === undefined || (typeof video.poster === 'string' &&
      /^[a-z0-9][a-z0-9_-]*\.webp$/i.test(video.poster))) &&
    Array.isArray(video.modules) && video.modules.length > 0 &&
    video.modules.every(id => moduleNames.has(id)) &&
    ['fr', 'en'].every(lang => typeof video[lang]?.title === 'string' &&
      video[lang].title.trim() && typeof video[lang].description === 'string');
}

export async function readCatalog() {
  const response = await fetch(catalogUrl, {cache: 'no-cache'});
  if (!response.ok) throw new Error('Video catalog unavailable');
  const videos = await response.json();
  if (!Array.isArray(videos) || !videos.every(validVideo)) throw new Error('Invalid video catalog');
  return videos;
}

export function sourceUrl(file) {
  return new URL(file, catalogUrl).href;
}
