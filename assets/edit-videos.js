import {moduleNames, readCatalog, validVideo} from './video-catalog.js';

const form = document.querySelector('#video-editor');
const choice = document.querySelector('#video-choice');
const status = document.querySelector('#video-status');
const remove = document.querySelector('#video-remove');
const moduleFields = document.querySelector('#video-modules');
let videos;

for (const [id, name] of moduleNames) {
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'module';
  checkbox.value = id;
  label.append(checkbox, ' ' + name);
  moduleFields.append(label);
}

function showSelection() {
  const video = videos[choice.value];
  const fields = form.elements;
  fields.file.value = video?.file ?? '';
  fields.poster.value = video?.poster ?? '';
  fields.portrait.checked = Boolean(video?.portrait);
  fields.frTitle.value = video?.fr.title ?? '';
  fields.frDescription.value = video?.fr.description ?? '';
  fields.enTitle.value = video?.en.title ?? '';
  fields.enDescription.value = video?.en.description ?? '';
  for (const checkbox of moduleFields.querySelectorAll('input')) {
    checkbox.checked = Boolean(video?.modules.includes(checkbox.value));
  }
  remove.disabled = !video;
}

function showList(index = '') {
  choice.replaceChildren(new Option('Ajouter une vidéo', ''));
  videos.forEach((video, i) => choice.add(new Option(video.fr.title, i)));
  choice.value = index;
  showSelection();
}

async function loadEditor() {
  try {
    videos = await readCatalog();
    showList();
    form.hidden = false;
    status.textContent = '';
  } catch {
    status.textContent = 'Le catalogue est inaccessible. Rechargez la page avant de réessayer.';
  }
}
loadEditor();

choice.addEventListener('change', showSelection);
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const video = {
    file: fields.get('file').trim(),
    poster: fields.get('poster').trim() || undefined,
    portrait: fields.has('portrait'),
    modules: fields.getAll('module'),
    fr: {title: fields.get('frTitle').trim(), description: fields.get('frDescription').trim()},
    en: {title: fields.get('enTitle').trim(), description: fields.get('enDescription').trim()}
  };
  if (!validVideo(video)) {
    status.textContent = 'Choisissez un module, saisissez les deux titres et utilisez des noms MP4 et WebP sans espaces ni accents.';
    return;
  }
  const index = choice.value === '' ? videos.length : Number(choice.value);
  videos[index] = video;
  showList(index);
  status.textContent = 'Brouillon enregistré. Téléchargez videos.json pour publier la modification sur GitHub.';
});
remove.addEventListener('click', () => {
  videos.splice(Number(choice.value), 1);
  showList();
  status.textContent = 'Vidéo retirée du brouillon. Téléchargez videos.json pour appliquer la modification.';
});
document.querySelector('#video-export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(videos, null, 2) + '\n'], {type: 'application/json'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'videos.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Fichier prêt. Déposez-le dans assets/videos sur GitHub pour mettre le site à jour.';
});
