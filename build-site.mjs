import { mkdirSync, writeFileSync } from "node:fs";
import { modules, documents, faq, settings } from "./site-content.mjs";
const shotData = {
  conversion: [["converters","Sélecteur de convertisseurs","Converter selection"]],
  quick: [["quick-form","Paramètres de l’étalonnage rapide","Quick calibration settings"],["quick-readings","Tableau de mesures rapides","Quick calibration readings"]],
  complete: [["complete-form","Formulaire du certificat complet","Full certificate form"],["complete-readings","Tableau de mesures et étalon de référence","Readings and reference standard"]],
  history: [["history-search","Recherche dans l’historique local","Local history search"],["history-export","Certificats enregistrés et actions PDF","Saved certificates and PDF actions"]],
  evidence: [["signature","Zone de signature et section Photos","Signature pad and Photos section"],["history-export","Actions de consultation et de partage PDF","PDF viewing and sharing actions"]]
};
const title = ["InstruCal Pro | Application d’étalonnage, conversion 4–20 mA et PID","InstruCal Pro | Instrument calibration, 4–20 mA conversion and PID"];
const meta = ["Application Android d’instrumentation pour conversions 4–20 mA, certificats d’étalonnage PDF, contrôle de vannes et soupapes et simulation PID.","Android instrumentation app for 4–20 mA conversion, PDF calibration certificates, industrial valve testing and PID simulation."];
const ids = ["home","features","screens","certificates","pricing","faq","download"];
const icons = ["↔","±","▤","◇","∿","↑","↶","⌗"];
const langs = ["fr","en"];
const urls = [settings.site, settings.site+"en/"];
const safe = value => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const playUrl = section => `${settings.play}&referrer=${encodeURIComponent(`utm_source=instrucal_website&utm_medium=web&utm_campaign=product_site&utm_content=${section}`)}`;

function page(lang, loc) {
  const t = (fr,en) => loc ? en : fr;
  const base = loc ? "../" : "./";
  const asset = name => `${base}assets/${name}`;
  const labels = ["Accueil","Fonctionnalités","Démonstration","Certificats PDF","Tarification","FAQ","Télécharger"];
  const labelsEn = ["Home","Features","Demo","PDF certificates","Pricing","FAQ","Download"];
  const downloadLabel = t("Télécharger sur Google Play","Download on Google Play");
  const play = (section, label = downloadLabel, type = "button primary") =>
    `<a class="${type}" href="${safe(playUrl(section))}" data-event="play_click" data-section="${section}">${label}</a>`;
  const screenshot = (name, alt, lazy = true) =>
    `<img src="${asset(`screenshots/${name}.webp`)}" alt="${safe(alt)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" width="700" height="1428">`;
  const thumbnail = (key, alt) =>
    `<img class="doc-thumb" src="${asset(`sample-certificates/${key}-${lang}.webp`)}" alt="${safe(alt)}" loading="lazy" width="480" height="679">`;
  const data = modules.map(m => ({id:m.id,title:m.name[loc],description:m.desc[loc],
    shots:(shotData[m.id] ?? []).map(([name,fr,en]) => ({src:asset(`screenshots/${name}.webp`),alt:t(fr,en)}))}));
  const first = data[0].shots[0];
  const alternates = langs.map((l,i) => `<link rel="alternate" hreflang="${l}" href="${urls[i]}">`).join("\n  ");
  const price = settings.prices[lang];
  const priceLabel = price ? safe(`${price.amount} ${price.currency} / ${t("mois","month")}`) : t("Tarif affiché dans l’application","Pricing shown in the app");
  const schema = {"@context":"https://schema.org","@type":"SoftwareApplication","name":"InstruCal Pro",
    "applicationCategory":"UtilitiesApplication","operatingSystem":"Android 7.0+","softwareVersion":settings.version,
    "url":urls[loc],"installUrl":settings.play,"description":meta[loc],
    "publisher":{"@type":"Organization","name":"TATAZ TECH LLC"}};
  const demoConfig = JSON.stringify({modules:data,analytics:settings.analytics,labels:{counter:t("Écran {current} sur {total}","Screen {current} of {total}")}}).replaceAll("<","\\u003c");
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safe(title[loc])}</title>
  <meta name="description" content="${safe(meta[loc])}">
  <meta name="theme-color" content="#081a30">
  <link rel="canonical" href="${urls[loc]}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${urls[0]}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t("fr_FR","en_US")}">
  <meta property="og:locale:alternate" content="${t("en_US","fr_FR")}">
  <meta property="og:title" content="${safe(title[loc])}">
  <meta property="og:description" content="${safe(meta[loc])}">
  <meta property="og:url" content="${urls[loc]}">
  <meta property="og:image" content="${settings.site}assets/sample-certificates/complete-${lang}.webp">
  <meta property="og:image:alt" content="${t("Exemple fictif de certificat d’étalonnage","Fictional calibration certificate sample")}">
  <link rel="icon" href="${asset("mark.svg")}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset("site.css")}">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <script type="module" src="${asset("site.js")}"></script>
</head>
<body>
<a class="skip" href="#content">${t("Aller au contenu","Skip to content")}</a>
<header><div class="wrap header">
  <a class="brand" href="#home"><img src="${asset("mark.svg")}" width="30" height="30" alt=""><span>InstruCal Pro</span></a>
  <div class="lang" aria-label="${t("Langue","Language")}">${t('<span aria-current="page">FR</span> / <a href="./en/" hreflang="en" lang="en" aria-label="English">EN</a>','<a href="../" hreflang="fr" lang="fr" aria-label="Français">FR</a> / <span aria-current="page">EN</span>')}</div>
  ${play("header","Google Play")}
  <button class="button secondary menu" type="button" aria-controls="nav" aria-expanded="true" hidden>Menu</button>
  <nav id="nav" aria-label="${t("Navigation principale","Main navigation")}">${ids.map((id,i)=>`<a href="#${id}">${(loc ? labelsEn : labels)[i]}</a>`).join("")}</nav>
</div></header>
<main id="content">
<section class="hero dark" id="home"><div class="wrap hero-grid">
  <div>
    <p class="eyebrow">${t("Instrumentation industrielle · Android","Industrial instrumentation · Android")}</p>
    <h1>${t("L’instrumentation et l’étalonnage dans votre poche","Instrumentation and calibration in your pocket")}</h1>
    <p class="lead">${t("Convertissez des signaux, documentez vos contrôles et partagez vos certificats PDF avec une application Android conçue pour les professionnels de terrain.","Convert signals, document field tests and share PDF calibration certificates with an Android app built for industrial professionals.")}</p>
    <div class="actions">${play("hero")}<a class="button secondary" href="#features">${t("Découvrir les fonctionnalités","Explore features")}</a></div>
    <p class="meta">${t("Gratuit à installer · Achat Pro dans l’application","Free to install · Pro purchase in the app")}</p>
  </div>
  <div class="hero-visual">
    <figure class="phone">${screenshot("converters",t("Capture Google Play du menu de conversions","Google Play screenshot of the conversion menu"),false)}</figure>
    <a class="hero-proof" href="${asset(`sample-certificates/complete-${lang}.pdf`)}" data-event="pdf_view" data-section="hero-complete">${thumbnail("complete","")}${t("Exemple de certificat PDF","Sample PDF certificate")}</a>
  </div>
</div></section>
<section class="section wash"><div class="wrap">
  <div class="intro"><h2>${t("Du signal au rapport d’intervention","From signal to field report")}</h2></div>
  <div class="cards">
    <article class="card"><h3>${t("Vérifiez la mesure","Check the reading")}</h3><p>${t("Passez du 4–20 mA à la valeur process et comparez vos relevés à la référence.","Convert 4–20 mA to a process value and compare field readings against a reference.")}</p></article>
    <article class="card"><h3>${t("Documentez le contrôle","Document the test")}</h3><p>${t("Rassemblez mesures, photos et signature dans le dossier de l’intervention.","Keep readings, photos and a signature with the intervention record.")}</p></article>
    <article class="card"><h3>${t("Retrouvez le résultat","Retrieve the result")}</h3><p>${t("Recherchez un certificat dans l’historique local et partagez le PDF avec le client ou le service qualité.","Find a certificate in local history and share its PDF with the customer or quality team.")}</p></article>
  </div>
</div></section>
<section class="section" id="features"><div class="wrap">
  <div class="intro"><h2>${t("Fonctionnalités pour les interventions de terrain","Features for field interventions")}</h2><p class="lead">${t("Pour les techniciens instrumentation, prestataires de métrologie, laboratoires et équipes de maintenance.","For instrumentation technicians, metrology service providers, laboratories and maintenance teams.")}</p></div>
  <div class="cards modules">${modules.map((m,i)=>{
    const screen=shotData[m.id]?.[0];
    return `<article class="card" id="module-${m.id}"><span class="module-marker" aria-hidden="true">${icons[i]}</span><h3>${m.name[loc]}</h3><p>${m.desc[loc]}</p>${screen ? `<a href="#screens" data-demo-link="${m.id}" aria-label="${safe(t("Voir la démonstration de ","See the demo for ")+m.name[loc])}">${screenshot(screen[0],screen[loc+1]).replace("<img ","<img class=\"module-shot\" ")}</a>` : ""}<p class="action">${m.actions[loc]}</p><p class="plan">${m.plan[loc]}</p>${play(`module-${m.id}`,t("Découvrir sur Google Play","Explore on Google Play"),"module-link")}</article>`;
  }).join("")}</div>
</div></section>
<section class="section wash" id="screens"><div class="wrap">
  <div class="intro"><h2>${t("Explorez l’application","Explore the app")}</h2><p class="lead">${t("Les captures proviennent de la fiche Google Play. Certains écrans peuvent différer de la version installée.","Screenshots come from the Google Play listing. Some screens may differ from the installed version.")}</p></div>
  <div class="demo">
    <div>
      <div class="module-select" role="group" aria-label="${t("Choisir un module","Select a module")}">${data.map(m=>`<button type="button" data-module="${m.id}" aria-pressed="false" hidden>${m.title}</button>`).join("")}</div>
      <div class="demo-description" aria-live="polite"><h3 id="demo-title">${data[0].title}</h3><p id="demo-description">${data[0].description}</p></div>
      <div class="actions">${play("demo")}</div>
    </div>
    <div class="demo-stage">
      <div class="phone"><img id="demo-shot" src="${first.src}" alt="${safe(first.alt)}" width="700" height="1428" loading="lazy"><p id="demo-empty" class="screen-empty" hidden>${t("Capture officielle à ajouter pour ce module.","An official screenshot is still needed for this module.")}</p></div>
      <div class="demo-controls" hidden><button class="control" id="demo-prev" type="button">${t("Précédent","Previous")}</button><span id="demo-count" aria-live="polite"></span><button class="control" id="demo-next" type="button">${t("Suivant","Next")}</button><button class="control" id="demo-zoom" type="button">${t("Plein écran","Full screen")}</button></div>
    </div>
  </div>
  <dialog id="demo-dialog" aria-label="${t("Capture agrandie","Enlarged screenshot")}"><form method="dialog"><button class="control" autofocus>${t("Fermer","Close")}</button></form><img alt=""></dialog>
</div></section>
<section class="section" id="certificates"><div class="wrap">
  <div class="intro"><h2>${t("Découvrez les documents générés avec InstruCal Pro","Explore the documents InstruCal Pro can generate")}</h2><p class="lead">${t("Exemples éditoriaux à données fictives. Chaque PDF porte la mention « Document de démonstration ».","Illustrative examples with fictional data. Each PDF is marked “Demonstration document”.")}</p></div>
  <div class="cards docs">${documents.map(d=>{
    const pdf=asset(`sample-certificates/${d.id}-${lang}.pdf`);
    return `<article class="card">${thumbnail(d.id,d.title[loc])}<h3>${d.title[loc]}</h3><p>${d.desc[loc]}</p><div class="doc-actions"><a class="button outline" href="${pdf}" data-event="pdf_view" data-section="${d.id}">${t("Voir le PDF","View PDF")}</a><a href="${pdf}" download data-event="pdf_download" data-section="${d.id}">${t("Télécharger l’exemple","Download sample")}</a></div></article>`;
  }).join("")}</div>
</div></section>
<section class="section wash" id="pricing"><div class="wrap">
  <div class="intro"><h2>${t("Free et Pro","Free and Pro")}</h2><p class="lead">${t("Commencez gratuitement. Consultez l’offre Pro dans l’écran « Mon plan » de l’application.","Get started for free. Check the Pro offer under “My Plan” in the app.")}</p></div>
  <div class="plans">
    <article class="card plan-card"><h3>Free</h3><p>${t("Gratuit à installer","Free to install")}</p>
      <ul><li>${t("Convertisseurs et étalonnages rapides locaux illimités","Unlimited converters and local quick calibrations")}</li><li>${t("5 PDF rapides","5 quick PDFs")}</li><li>${t("1 certificat complet","1 full calibration certificate")}</li><li>${t("1 étalonnage de vanne","1 valve calibration")}</li><li>${t("1 tarage de soupape","1 safety valve test")}</li></ul>
      ${play("pricing-free",t("Commencer gratuitement","Get started free"))}
    </article>
    <article class="card plan-card pro"><h3>Pro</h3><p>${priceLabel}</p>
      <ul><li>${t("PDF rapides et certificats complets illimités","Unlimited quick PDFs and full certificates")}</li><li>${t("Contrôles de vannes et tarages de soupapes illimités","Unlimited valve and safety valve tests")}</li><li>${t("Logo d’entreprise sur le certificat complet","Company logo on full certificates")}</li><li>${t("Simulation P, PI et PID","P, PI and PID simulation")}</li></ul>
      <p>${t("L’achat Pro s’effectue dans l’application Android via Google Play. La fiche Google Play annonce un essai de 7 jours. Vérifiez l’offre et l’éligibilité affichées dans l’application avant de souscrire.","Pro is purchased in the Android app through Google Play. The Google Play listing announces a 7-day trial. Check the offer and eligibility shown in the app before subscribing.")}</p>
      ${play("pricing-pro",t("Voir l’application sur Google Play","View the app on Google Play"),"button outline")}
    </article>
  </div>
</div></section>
<section class="section" id="faq"><div class="wrap">
  <div class="intro"><h2>${t("Questions fréquentes","Frequently asked questions")}</h2></div>
  ${faq.map(([q,a])=>`<details><summary>${q[loc]}</summary><p>${a[loc]}</p></details>`).join("")}
</div></section>
<section class="section dark download" id="download"><div class="wrap split">
  <div><h2>${t("Téléchargez InstruCal Pro","Download InstruCal Pro")}</h2>
    <p class="lead">${t("Disponible sur Android. Démarrez avec Free et consultez Pro dans l’application.","Available on Android. Start with Free and check Pro in the app.")}</p>
    <p class="meta">Android ${settings.android}+ · ${t("Version publique","Public version")} ${settings.version}</p>
    <div class="actions">${play("download",t("Télécharger gratuitement","Download for free"))}${play("badge",`<img src="${asset(`play-${lang}.png`)}" width="180" alt="${downloadLabel}">`,"badge")}</div>
  </div>
  <div class="download-art"><figure class="phone">${screenshot("quick-form",t("Écran d’étalonnage rapide","Quick calibration screen"))}</figure><figure class="qr"><img src="${asset("play-qr.svg")}" width="154" height="154" loading="lazy" alt="${t("QR code vers la fiche Google Play","QR code linking to the Google Play listing")}"><figcaption>${t("Scanner avec votre téléphone","Scan with your phone")}</figcaption></figure></div>
</div></section>
</main>
<footer><div class="wrap footer-grid">
  <div><strong>TATAZ TECH LLC</strong><p>${t("Éditeur d’InstruCal Pro, application Android pour les interventions d’instrumentation et de métrologie.","Publisher of InstruCal Pro, an Android app for instrumentation and metrology fieldwork.")}</p></div>
  <div class="footer-links">
    <a href="mailto:${settings.support}?subject=${encodeURIComponent(t("Demande de démonstration InstruCal Pro","InstruCal Pro demo request"))}">${t("Demander une démo","Request a demo")}</a>
    <a href="mailto:${settings.support}">${t("Contacter l’assistance","Contact support")}</a>
    <a href="${settings.privacy}">${t("Confidentialité de l’application","App privacy policy")}</a>
    <a href="terms.html">${t("Conditions d’utilisation","Terms of use")}</a>
    <a href="https://play.google.com/store/apps/datasafety?id=com.instrucalpro.app">${t("Sécurité des données sur Google Play","Data safety on Google Play")}</a>
${settings.analytics ? `    <label><input id="analytics-opt-in" type="checkbox"> ${t("Autoriser la mesure d’audience","Allow audience measurement")}</label>` : ""}
  </div>
</div></footer>
<script type="application/json" id="demo-data">${demoConfig}</script>
</body>
</html>
`;
}

for (const [i, lang] of langs.entries()) {
  if (i) mkdirSync(new URL("./en/", import.meta.url), {recursive:true});
  writeFileSync(new URL(i ? "./en/index.html" : "./index.html", import.meta.url), page(lang,i));
}
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(new URL("./sitemap.xml",import.meta.url),xml);
writeFileSync(new URL("./robots.txt",import.meta.url),`User-agent: *\nAllow: /\nSitemap: ${settings.site}sitemap.xml\n`);
