# TATAZ TECH LLC — préparation et validation

## Architecture retenue

Le dépôt existant reste un site statique GitHub Pages. Les fichiers HTML sont générés par Node.js, sans installation de dépendances. L’accueil devient celui de l’éditeur. Le produit conserve son gabarit et tous ses médias.

| Route FR | Route EN | Contenu |
| --- | --- | --- |
| / | /en/ | Accueil TATAZ TECH LLC |
| /applications/ | /en/applications/ | Catalogue |
| /instrucal-pro/ | /en/instrucal-pro/ | Page complète InstruCal Pro |
| /sav-manager-pro/ | /en/sav-manager-pro/ | Bientôt disponible |
| /calmetrologie/ | /en/calmetrologie/ | En maintenance, bientôt disponible |
| /projecttrack-pro/ | /en/projecttrack-pro/ | En maintenance, bientôt disponible |
| /company/ | /en/company/ | Entreprise |
| /contact/ | /en/contact/ | Démonstrations, commercial, partenariat |
| /privacy/, /terms/, /legal/ | /en/privacy/, /en/terms/, /en/legal/ | Confidentialité, conditions, informations légales |

Les anciens liens d’ancre depuis la racine, dont `#features`, `#screens`, `#certificates` et les repères des modules, rejoignent la nouvelle page produit grâce au script de navigation. Les anciens médias restent à leurs chemins d’origine. Les conditions originales de l’application sont conservées dans `instrucal-terms.html` et `en/instrucal-terms.html`.

## Contenu et nouveaux produits

- `assets/content/company.json` centralise l’accueil, le contact, le thème et le catalogue TATAZ TECH LLC. `assets/content/site.json` conserve le contenu personnalisable d’InstruCal Pro.
- `build-company.mjs` crée les pages entreprise et les futurs produits. `build-site.mjs` crée la page InstruCal Pro puis appelle ce générateur.
- Ajouter une entrée avec un identifiant `slug` unique, un nom, un statut et les objets `fr` et `en` avec `category` et `description`. Utiliser `soon` ou `maintenance` tant que la disponibilité est à confirmer.
- Pour enrichir une future fiche, le générateur accepte `fr.features` et `en.features` comme listes de textes, `screenshots` comme liste d’objets avec `file`, `fr` et `en`, et `fr.pricing` / `en.pricing` comme textes validés. Les captures doivent être dans `assets/content/photos/`. Les tarifs et le lien `googlePlay` sont rendus quand le statut est `available`. Confirmer la disponibilité, le lien officiel et les prix avant de changer le statut.
- Exécuter `node build-site.mjs` dans le dépôt après toute modification de catalogue, de coordonnées ou de métadonnées, puis inclure les pages générées dans le commit.
- Pages CMS distingue **TATAZ TECH LLC — accueil et catalogue**, **InstruCal Pro — accueil et thème** et **Vidéos**. Les textes et photos d’accueil restent modifiables par le mécanisme JSON existant. Les changements structurels du catalogue nécessitent une régénération.
- Les champs d’e-mail professionnel sur le domaine sont vides. Le contact public déjà utilisé, `oami.familly@gmail.com`, est conservé pour les démonstrations et l’assistance.

## Nom de domaine et DNS à appliquer après validation

1. Vérifier la propriété de `tataztech.com` dans les paramètres Pages du compte GitHub avec le TXT fourni par GitHub.
2. Dans le dépôt, configurer **Settings → Pages → Custom domain** avec `www.tataztech.com`. GitHub crée le fichier racine `CNAME` pour une publication depuis une branche. Le fichier `deployment/CNAME.example` fournit la valeur attendue.
3. Dans Namecheap, sous **Domain List → Manage → Advanced DNS**, ajouter le CNAME `www` vers `tattaztech.github.io`. La valeur est le nom d’hôte GitHub, sans nom de dépôt.
4. Pour faire aussi fonctionner `tataztech.com`, configurer les quatre enregistrements A de l’hôte `@` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153` et `185.199.111.153`. Vérifier les entrées conflictuelles avant leur remplacement. Préserver les enregistrements de messagerie.
5. Après validation DNS et disponibilité du certificat, activer **Enforce HTTPS**. Le domaine canonique retenu est `https://www.tataztech.com/`.
6. Régénérer les pages avec `SITE_URL=https://www.tataztech.com/` dans l’environnement puis `node build-site.mjs`. Le même dépôt fonctionne alors à la racine du domaine et les métadonnées utilisent la bonne origine.
7. Tester la racine, les deux langues, la page InstruCal Pro et ses vidéos/PDF, puis soumettre `https://www.tataztech.com/sitemap.xml` dans Google Search Console. L’accès propriétaire est nécessaire.
8. Le domaine n’a pas été raccordé pendant la préparation. Le fichier `CNAME` actif n’a pas été ajouté.

Références officielles [GitHub Pages et domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) et [configuration Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/).

## Référencement et annuaires

Chaque page possède son titre, sa description, son URL canonique, les liens alternatifs FR/EN et les métadonnées Open Graph. Le sitemap contient les pages des deux langues. InstruCal Pro conserve ses données structurées SoftwareApplication. Les autres fiches indiquent leur statut.

Pour Capterra, G2, Appvizer et SourceForge, utiliser la page propre à InstruCal Pro, sa catégorie instrumentation/étalonnage, le lien officiel Google Play et les médias réellement issus du produit. Confirmer les tarifs et les conditions d’essai avant toute saisie d’annonce. Les projets non publiés restent annoncés comme projets en préparation. Sur LinkedIn, utiliser l’accueil TATAZ TECH LLC pour l’éditeur et la page produit pour une campagne InstruCal Pro. La création ou l’envoi de fiches sur ces services reste à effectuer par le titulaire des comptes.

## Informations à compléter

- Juridiction, numéro d’immatriculation, adresse légale et responsable de publication de TATAZ TECH LLC.
- Adresse professionnelle sur tataztech.com et validation de la réception.
- Durée de conservation et organisation du traitement des demandes envoyées par e-mail, pour finaliser la notice de confidentialité.
- Les textes légaux fournis sont des projets à relire en fonction de la juridiction de l’entreprise.
- La compatibilité matérielle des applications futures, leurs captures, fonctions, prix et liens officiels au moment de leur publication.

## Contrôles

La recette vérifie les liens internes, ancres, traductions, sitemap, métadonnées et statuts des 22 pages. Elle compare les 32 fichiers image, PDF et vidéo avec la version publiée de référence et confirme leur conservation à l’identique. Le même contrôle passe après génération pour `https://www.tataztech.com/` et pour le sous-chemin GitHub Pages. Les tests Chromium couvrent le menu mobile, le catalogue anglais, les liens d’ancre historiques, la bascule de langue du produit et son lecteur vidéo. L’accueil a été inspecté de 320 à 1440 px. Les essais sur appareils physiques et les Core Web Vitals réels sont à effectuer après validation du domaine.

## Mise en ligne à valider

La branche de travail est `codex/tataztech-platform`. Prévisualiser et relire le diff avant de fusionner vers `main`. GitHub Pages reste configuré sur **main / root**. Le premier déploiement peut conserver l’URL GitHub Pages. Le passage au domaine s’effectue ensuite avec les étapes ci-dessus.

GitHub décrit Pages comme un service de présentation de projets et limite les usages principalement transactionnels et SaaS. Vérifier l’adéquation du site d’éditeur prévu à ces conditions avant sa mise en production. [Conditions GitHub Pages](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages)
