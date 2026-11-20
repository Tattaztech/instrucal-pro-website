import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {siteUrl, route} from './platform.mjs';
import {settings} from './site-content.mjs';

const company = JSON.parse(readFileSync(new URL('./assets/content/company.json',import.meta.url),'utf8'));
const slugs = company.applications.map(app => app.slug);
if (slugs.some(slug => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) || new Set(slugs).size !== slugs.length) {
  throw new Error('Product slugs must be unique lowercase URL identifiers.');
}
if (slugs.some(slug => ['en','applications','company','contact','privacy','terms','legal'].includes(slug))) {
  throw new Error('Product slug conflicts with a company page.');
}
if (company.professionalEmail?.trim()) company.contactEmail = company.professionalEmail.trim();
const e = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pages = new Set();
const status = (app,lang) => app.status === 'available'
  ? (lang === 'fr' ? 'Disponible sur Google Play' : 'Available on Google Play')
  : app.status === 'maintenance'
    ? (lang === 'fr' ? 'En maintenance · Bientôt disponible' : 'Under maintenance · Coming soon')
    : (lang === 'fr' ? 'Bientôt disponible' : 'Coming soon');

function output(lang,slug,title,description,body,options={}) {
  const path = route(lang,slug);
  const depth = path.split('/').filter(Boolean).length;
  const base = '../'.repeat(depth) || './';
  const url = siteUrl + path;
  const t = (fr,en) => lang === 'fr' ? fr : en;
  const link = target => base + route(lang,target);
  const alternate = other => base + route(other,slug);
  const nav = [
    ['',t('Accueil','Home')],['applications',t('Nos applications','Our apps')],
    ['company',t('Entreprise','Company')],['contact',t('Contact','Contact')]
  ];
  const schema = {'@context':'https://schema.org','@type':options.catalogue?'CollectionPage':'WebPage',name:title,url,
    publisher:{'@type':'Organization',name:'TATAZ TECH LLC',url:siteUrl}};
  const page = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="#081a30">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="fr" href="${siteUrl+route('fr',slug)}">
  <link rel="alternate" hreflang="en" href="${siteUrl+route('en',slug)}">
  <link rel="alternate" hreflang="x-default" href="${siteUrl+route('fr',slug)}">
  <meta property="og:title" content="${e(title)}">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="${t('fr_FR','en_US')}">
  <meta property="og:image" content="${siteUrl}assets/mark.svg">
  <meta property="og:image:alt" content="TATAZ TECH LLC">
  <link rel="icon" href="${base}assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${base}assets/site.css">
  <link rel="stylesheet" href="${base}assets/company.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script type="module" src="${base}assets/company.js"></script>
</head>
<body data-page="${options.home?'home':'page'}">
<a class="skip" href="#content">${t('Aller au contenu','Skip to content')}</a>
<header><div class="wrap header company-header">
  <a class="brand" href="${link('')}"><img src="${base}assets/mark.svg" width="30" height="30" alt="">TATAZ TECH LLC</a>
  <div class="lang" aria-label="${t('Langue','Language')}">${lang==='fr'?'<span aria-current="page">FR</span> / <a aria-label="English" lang="en" hreflang="en" href="'+alternate('en')+'">EN</a>':'<a aria-label="Français" lang="fr" hreflang="fr" href="'+alternate('fr')+'">FR</a> / <span aria-current="page">EN</span>'}</div>
  <button class="button secondary menu" type="button" aria-controls="nav" aria-expanded="true" hidden>Menu</button>
  <nav id="nav" aria-label="${t('Navigation principale','Main navigation')}">${nav.map(([s,name])=>`<a href="${link(s)}"${s===slug?' aria-current="page"':''}>${name}</a>`).join('')}</nav>
</div></header>
<main id="content">${body({base,link,t})}</main>
<footer><div class="wrap footer-grid">
  <div><strong>TATAZ TECH LLC</strong><p>${t('Logiciels et applications mobiles pour les professionnels et les entreprises.','Software and mobile applications for professionals and businesses.')}</p></div>
  <div class="footer-links"><a href="${link('contact')}">${t('Contact et démonstrations','Contact and demos')}</a><a href="${link('privacy')}">${t('Confidentialité','Privacy')}</a><a href="${link('terms')}">${t('Conditions','Terms')}</a><a href="${link('legal')}">${t('Informations légales','Legal information')}</a></div>
</div></footer>
</body>
</html>`;
  const dir = new URL('./'+path,import.meta.url);
  mkdirSync(dir,{recursive:true});
  writeFileSync(new URL('index.html',dir),page.replace(/[ \t]+$/gm,''));
  pages.add(url);
}

function cards(lang,base,link) {
  const t=(fr,en)=>lang==='fr'?fr:en;
  return `<div class="catalogue">${company.applications.map(app=>`<article class="card app-card">
    <span class="app-status ${app.status==='available'?'available':''}">${status(app,lang)}</span>
    <h3>${e(app.name)}</h3><p class="category">${e(app[lang].category)}</p><p>${e(app[lang].description)}</p>
    ${app.slug==='instrucal-pro'?`<a href="${link(app.slug)}"><img src="${base}assets/screenshots/converters.webp" width="700" height="1428" loading="lazy" alt="${t('Menu des conversions InstruCal Pro','InstruCal Pro conversion menu')}"></a>`:''}
    <div class="actions"><a class="button ${app.status==='available'?'primary':'outline'}" href="${link(app.slug)}">${t('Découvrir le produit','Explore product')}</a></div>
  </article>`).join('')}</div>`;
}

for(const lang of ['fr','en']) {
  const t=(fr,en)=>lang==='fr'?fr:en;
  output(lang,'', 'TATAZ TECH LLC | '+t('Logiciels et applications pour les professionnels','Software and apps for professionals'), company[lang].description,({base,link})=>`
<section class="company-hero dark" id="home"><div class="wrap hero-grid">
  <div><p class="eyebrow">${t('Éditeur de logiciels et applications mobiles','Software and mobile app publisher')}</p>
  <h1>${e(company[lang].title)}</h1><p class="lead">${e(company[lang].description)}</p>
  <div class="actions"><a class="button primary" href="${link('applications')}">${t('Découvrir nos applications','Explore our apps')}</a><a class="button secondary" href="${link('contact')}">${t('Parler de votre besoin','Discuss your needs')}</a></div></div>
  <article class="company-feature"><div class="split">
    <figure class="phone"><img src="${base}assets/screenshots/converters.webp" alt="${t('Capture réelle du menu InstruCal Pro','Actual InstruCal Pro conversion menu')}" width="700" height="1428" fetchpriority="high"></figure>
    <div><p class="eyebrow">${t('Disponible sur Android','Available on Android')}</p><h2>InstruCal Pro</h2><p class="lead">${t('Conversions industrielles, étalonnage et certificats PDF dans une application de terrain.','Industrial conversions, calibration and PDF certificates in one field application.')}</p><div class="actions"><a class="button outline" href="${link('instrucal-pro')}">${t('Voir InstruCal Pro','Explore InstruCal Pro')}</a></div></div>
  </div></article>
</div></section>
<section class="section wash" id="photo-gallery" hidden><div class="wrap"><div class="intro"><h2 id="photo-gallery-title">${e(company[lang].galleryTitle)}</h2></div><div class="cards"></div></div></section>
<section class="section" id="applications"><div class="wrap"><div class="intro"><h2>${t('Nos applications','Our apps')}</h2><p class="lead">${t('Découvrez le produit disponible et les projets en préparation.','Explore the available product and projects in preparation.')}</p></div>${cards(lang,base,link)}</div></section>
<section class="section wash"><div class="wrap"><h2>${t('Des outils pour vos activités professionnelles','Tools for your professional workflows')}</h2><div class="actions"><a class="button outline" href="${link('company')}">${t('Découvrir TATAZ TECH LLC','About TATAZ TECH LLC')}</a></div></div></section>`,{home:true,catalogue:true});

  output(lang,'applications',t('Nos applications','Our apps')+' | TATAZ TECH LLC',
    t('Catalogue TATAZ TECH LLC. InstruCal Pro pour l’instrumentation et l’étalonnage, et applications en préparation.','TATAZ TECH LLC software catalogue. InstruCal Pro for instrumentation and calibration, and planned applications.'),
    ({base,link})=>`<section class="section"><div class="wrap"><div class="intro"><h1>${t('Nos applications','Our apps')}</h1><p class="lead">${t('Choisissez un produit pour consulter sa présentation et son statut.','Select a product to see its presentation and current status.')}</p></div>${cards(lang,base,link)}</div></section>`,{catalogue:true});

  for(const app of company.applications.filter(app=>app.slug!=='instrucal-pro')) {
    output(lang,app.slug,app.name+' | '+t('Bientôt disponible','Coming soon')+' | TATAZ TECH LLC',app[lang].description,
      ({base,link})=>{
        const features = Array.isArray(app[lang].features) ? app[lang].features : [];
        const screenshots = Array.isArray(app.screenshots) ? app.screenshots : [];
        const images = screenshots.filter(image => /^\/assets\/content\/photos\/[a-z0-9_.-]+\.(?:png|jpe?g|webp|avif)$/i.test(image.file));
        const store = app.status === 'available' && /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[a-zA-Z0-9_.]+$/.test(app.googlePlay || '') ? app.googlePlay : '';
        return `<section class="section wash"><div class="wrap prelaunch"><span class="app-status">${status(app,lang)}</span><h1>${e(app.name)}</h1><p class="lead">${e(app[lang].description)}</p><p class="lead">${t('Les fonctionnalités, captures et conditions commerciales seront présentées lors de l’annonce de disponibilité.','Features, screenshots and commercial terms will be presented when availability is announced.')}</p>
        ${features.length ? `<h2>${t('Fonctionnalités','Features')}</h2><ul>${features.map(item=>`<li>${e(item)}</li>`).join('')}</ul>` : ''}
        ${images.length ? `<div class="gallery">${images.map(image=>`<figure><img src="${base+image.file.slice(1)}" loading="lazy" alt="${e(image[lang] || '')}"></figure>`).join('')}</div>` : ''}
        ${app.status === 'available' && app[lang].pricing ? `<h2>${t('Tarification','Pricing')}</h2><p>${e(app[lang].pricing)}</p>` : ''}
        <div class="actions">${store ? `<a class="button primary" href="${e(store)}">Google Play</a>` : ''}<a class="button primary" href="${link('contact')}?product=${e(app.slug)}">${t('Demander des informations','Request information')}</a><a class="button outline" href="${link('applications')}">${t('Toutes les applications','All apps')}</a></div></div></section>`;
      });
  }

  output(lang,'company',t('Entreprise','Company')+' | TATAZ TECH LLC',
    t('TATAZ TECH LLC développe des logiciels et applications mobiles pour les professionnels et les entreprises.','TATAZ TECH LLC develops software and mobile applications for professionals and businesses.'),
    ({link})=>`<section class="section"><div class="wrap company-about"><p class="eyebrow">TATAZ TECH LLC</p><h1>${t('Des applications au service du travail professionnel','Applications for professional work')}</h1><p class="lead">${t('TATAZ TECH LLC est un éditeur de logiciels et d’applications mobiles destinés aux professionnels et aux entreprises.','TATAZ TECH LLC publishes software and mobile applications for professionals and businesses.')}</p><p class="lead">${t('InstruCal Pro réunit des outils d’instrumentation, d’étalonnage et de documentation des contrôles. Il constitue le premier produit mis en avant dans notre catalogue.','InstruCal Pro brings together instrumentation, calibration and test documentation tools. It is the first featured product in our catalogue.')}</p><p class="lead">${t('Nos projets portent également sur les interventions de maintenance, la métrologie multidomaine et le suivi de projets. Chaque fiche précise le statut de disponibilité du produit.','Our projects also cover maintenance interventions, multidomain metrology and project tracking. Each product page states its availability.')}</p><div class="actions"><a class="button primary" href="${link('applications')}">${t('Consulter le catalogue','Browse the catalogue')}</a><a class="button outline" href="${link('contact')}">${t('Échanger avec nous','Talk to us')}</a></div></div></section>`);

  output(lang,'contact',t('Contact commercial et démonstrations','Sales enquiries and demos')+' | TATAZ TECH LLC',
    t('Contactez TATAZ TECH LLC pour une démonstration InstruCal Pro, une demande commerciale ou un partenariat.','Contact TATAZ TECH LLC for an InstruCal Pro demo, a sales enquiry or a partnership.'),
    ()=>`<section class="section"><div class="wrap"><div class="intro"><h1>${t('Parlons de votre besoin','Tell us about your needs')}</h1><p class="lead">${t('Précisez le produit, votre activité et le besoin que vous souhaitez examiner.','Include the product, your business activity and the needs you want to discuss.')}</p><p class="lead"><a href="mailto:${company.contactEmail}">${e(company.contactEmail)}</a></p></div><div class="cards contact-cards">${[
      [t('Démonstration','Demonstration'),t('Découvrez InstruCal Pro à travers un cas d’utilisation professionnel.','Explore InstruCal Pro through a professional use case.')],
      [t('Demande commerciale','Sales enquiry'),t('Présentez le contexte de votre entreprise et le produit qui vous intéresse.','Tell us about your business and the product you are interested in.')],
      [t('Partenariat','Partnership'),t('Contactez-nous pour discuter de votre proposition de partenariat.','Contact us to discuss your partnership proposal.')]
    ].map(([name,copy])=>`<article class="card"><h2 style="font-size:1.4rem">${name}</h2><p>${copy}</p><div class="actions"><a class="button outline" href="mailto:${company.contactEmail}?subject=${encodeURIComponent(name+' · TATAZ TECH LLC')}">${t('Écrire par e-mail','Send an email')}</a></div></article>`).join('')}</div></div></section>`);

  const legalPages = {
    privacy: {
      title:t('Confidentialité','Privacy'),
      paragraphs: [
        t('Ce site présente les applications de TATAZ TECH LLC. Ses pages et ses médias sont hébergés sur GitHub Pages.','This website presents TATAZ TECH LLC applications. Its pages and media are hosted on GitHub Pages.'),
        t('Les liens de contact ouvrent votre messagerie. Lorsque vous nous écrivez, votre adresse et le contenu du message servent à traiter votre demande.','Contact links open your email application. When you write to us, your address and message are used to handle your enquiry.'),
        t('La mesure d’audience du site est actuellement désactivée. Les liens Google Play incluent un identifiant de campagne. Les services externes appliquent leurs propres règles de confidentialité.','Website audience measurement is currently disabled. Google Play links include a campaign identifier. External services apply their own privacy policies.'),
        t('Les pratiques de chaque application sont décrites dans sa politique de confidentialité et, pour InstruCal Pro, dans la fiche Sécurité des données de Google Play.','Each application describes its data practices in its privacy policy and, for InstruCal Pro, in the Google Play Data safety listing.'),
        t('Pour toute question ou demande concernant vos données, écrivez à notre contact ci-dessous.','For questions or requests about your data, use the contact below.')
      ]
    },
    terms:{
      title:t('Conditions d’utilisation du site','Website terms of use'),
      paragraphs:[
        t('Ce site fournit des informations sur les produits TATAZ TECH LLC. Les projets en préparation sont identifiés sur leurs fiches.','This website provides information about TATAZ TECH LLC products. Projects in preparation are identified on their pages.'),
        t('InstruCal Pro se télécharge depuis Google Play. Le prix et les conditions de Pro sont présentés dans l’application avant confirmation par Google Play.','InstruCal Pro is downloaded from Google Play. Pro pricing and terms are shown in the app before confirmation through Google Play.'),
        t('Les exports PDF anonymisés montrent le rendu de l’application. Les rapports de démonstration sont identifiés comme tels. L’utilisateur reste responsable des données saisies et de la validation de ses contrôles.','Anonymised PDF exports show the app output. Demonstration reports are labelled accordingly. Users are responsible for the data they enter and for validating their tests.'),
        t('Les conditions d’utilisation d’InstruCal Pro restent consultables depuis sa page produit.','InstruCal Pro terms of use remain accessible from its product page.')
      ]
    },
    legal:{
      title:t('Informations légales et contact','Legal information and contact'),
      paragraphs:[
        t('Éditeur du site et des logiciels présentés — TATAZ TECH LLC.','Website and software publisher — TATAZ TECH LLC.'),
        t('Hébergement — GitHub Pages, service de GitHub.','Hosting — GitHub Pages, a GitHub service.'),
        t('Le dossier de mise en ligne prévoit la confirmation de la juridiction d’immatriculation, du numéro d’enregistrement, de l’adresse légale de l’entreprise et du contact professionnel sur le domaine tataztech.com.','The publication checklist includes confirmation of the jurisdiction of incorporation, company registration number, registered business address and professional contact on the tataztech.com domain.')
      ]
    }
  };
  for(const [slug,legal] of Object.entries(legalPages)) {
    output(lang,slug,legal.title+' | TATAZ TECH LLC',legal.paragraphs[0],
      ({link})=>`<section class="section"><div class="wrap legal-content"><h1>${legal.title}</h1><p class="lead">${legal.paragraphs.map(e).join('</p><p>')}</p><p><a href="mailto:${company.contactEmail}">${e(company.contactEmail)}</a></p>${slug==='privacy'?`<p><a href="${settings.privacy}">${t('Politique de confidentialité InstruCal Pro','InstruCal Pro privacy policy')}</a></p>`:''}<div class="actions"><a href="${link('contact')}">${t('Contact','Contact')}</a></div></div></section>`);
  }
}
for (const lang of ['fr','en']) pages.add(siteUrl+route(lang,'instrucal-pro'));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages].map(url=>`  <url><loc>${e(url)}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('./sitemap.xml',import.meta.url),sitemap);
writeFileSync(new URL('./robots.txt',import.meta.url),`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);

// Keep older legal URLs reachable when visitors arrive from saved links.
for(const lang of ['fr','en']) {
  for(const name of ['privacy','terms']) {
    const target = './'+name+'/';
    const filename = lang==='en'?'en/'+name+'.html':name+'.html';
    writeFileSync(new URL('./'+filename,import.meta.url),`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>TATAZ TECH LLC</title></head><body><a href="${target}">${name}</a></body></html>`);
  }
}
