# InstruCal Pro · site commercial

Site statique sur GitHub Pages. La production actuelle provient de `main`, dossier `/`. La refonte est préparée sur une branche de révision. Ne fusionner qu’après validation.

## Modifier la page

- `site-content.mjs` contient les modules, les documents, la FAQ et la configuration des deux langues. Les tarifs restent sur `null` tant que le montant et la devise n’ont pas été validés par marché.
- `build-site.mjs` contient le gabarit bilingue, la table `shotData` pour les captures et la génération de `index.html`, `en/index.html`, `robots.txt` et `sitemap.xml`.
- Exécuter `node build-site.mjs` après modification, puis versionner les pages générées. GitHub Pages sert les fichiers statiques directement. Aucun runtime Node n'est nécessaire en production.
- Ajouter les captures réelles dans `assets/screenshots/`. Les huit fichiers actuels proviennent de la fiche publique Google Play. Les images datent de la publication de cette fiche. Pour compléter la galerie, obtenir de vraies captures de contrôle de vanne, de simulation P/PI/PID et de contrôle de soupape. Ajouter leur nom et leurs libellés FR/EN dans `shotData`.
- Les deux exports anonymisés de l’application sont en français et utilisés dans les deux langues. Les rapports illustratifs de vanne et de soupape sont disponibles en français et en anglais. Tous ces fichiers et leurs vignettes sont dans `assets/sample-certificates/`. Le script `build-assets.py` génère uniquement les rapports illustratifs et les visuels Google Play. Il nécessite Pillow, ReportLab et Poppler. Son argument est le dossier d’images sources contenant les huit captures numérotées de 1 à 8 avec l’extension `.img` et les badges `fr.png` et `en.png`. Les fichiers WebP et PDF sont versionnés.

## Prévisualiser et déployer

1. Prévisualiser les deux langues avec un serveur HTTP statique. Tester aussi sous un répertoire `/instrucal-pro-website/`.
2. Après validation commerciale, fusionner la branche de révision dans `main`. Conserver GitHub Pages sur `Deploy from a branch → main → /(root)`.
3. Vérifier le workflow « pages build and deployment ». Une fois vert, ouvrir la racine et `/en/`, recharger un lien direct, essayer les PDF et suivre un bouton Google Play.
4. Dans Google Search Console, vérifier la propriété de préfixe `https://tattaztech.github.io/instrucal-pro-website/`, puis soumettre `https://tattaztech.github.io/instrucal-pro-website/sitemap.xml`. Cette étape nécessite un accès propriétaire. Les robots consultent `/robots.txt` à la racine du domaine. Le fichier livré dans le sous-répertoire du projet ne remplace pas ce fichier de racine.

## Mesure d’audience

- Sans collecteur configuré, le site ne transmet aucun événement. Le script émet les événements navigateur `instrucal:metric` avec le nom, la section, la langue et le chemin. Événements disponibles : `page_view`, `section_view`, `module_view`, `play_click`, `pdf_view`, `pdf_download`.
- Les liens Google Play distinguent les emplacements avec le paramètre `referrer` contenant `utm_content`. Ces paramètres ne prouvent aucune installation. Pour compter les installations, consulter les rapports Google Play disponibles et vérifier que la campagne y remonte. Une attribution plus fine peut nécessiter Play Install Referrer côté application, hors de cette refonte.
- Pour activer la collecte, choisir un collecteur autorisé, publier la notice du site en conséquence, puis renseigner un endpoint HTTPS dans `settings.analytics` et regénérer. L’endpoint doit accepter les POST JSON et la configuration CORS du site. Le navigateur ne transmet les événements qu’après opt-in, révocable depuis le pied de page. Les visites uniques et le pays agrégé nécessitent la configuration du collecteur et des règles de conservation adaptées. Le script n’ajoute aucun identifiant de visiteur.
