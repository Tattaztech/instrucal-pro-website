// Rebuild with SITE_URL=https://www.tataztech.com/ after domain activation is approved.
export const siteUrl = new URL(process.env.SITE_URL || 'https://tattaztech.github.io/instrucal-pro-website/').href;
export function route(lang, slug = '') {
  return (lang === 'en' ? 'en/' : '') + (slug ? slug + '/' : '');
}
