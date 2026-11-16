const catalogUrl = new URL('./videos/videos.json', import.meta.url);
export const moduleNames = new Map([
  ['valve', 'Contrôle de vanne et de positionneur'],
  ['pid', 'Simulation de vanne P, PI et PID']
]);

export function mediaUrl(value, folder, extension) {
  if (typeof value !== 'string') return '';
  const prefix = '/assets/' + folder + '/';
  const name = value.startsWith(prefix) ? value.slice(prefix.length) : value;
  if (!/^[a-z0-9][a-z0-9_.-]*$/i.test(name) || !extension.test(name)) return '';
  return new URL('./' + folder + '/' + name, import.meta.url).href;
}

export function validVideo(video) {
  return video && mediaUrl(video.file, 'videos', /\.mp4$/i) &&
    (!video.poster || mediaUrl(video.poster, 'videos', /\.webp$/i)) &&
    Array.isArray(video.modules) && video.modules.length > 0 &&
    video.modules.every(id => moduleNames.has(id)) &&
    ['fr', 'en'].every(lang => typeof video[lang]?.title === 'string' &&
      video[lang].title.trim() && (video[lang].description == null || typeof video[lang].description === 'string'));
}

export async function readCatalog() {
  const response = await fetch(catalogUrl, {cache: 'no-cache'});
  if (!response.ok) throw new Error('Video catalog unavailable');
  const {videos = []} = await response.json();
  if (!Array.isArray(videos)) throw new Error('Invalid video catalog');
  return videos.filter(validVideo);
}

export function sourceUrl(file) {
  return mediaUrl(file, 'videos', /\.(?:mp4|webp)$/i);
}
