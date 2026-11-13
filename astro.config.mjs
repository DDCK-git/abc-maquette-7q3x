import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync } from 'node:fs';

// Adresse finale du site, et sous-dossier éventuel (adresse provisoire GitHub Pages)
const site = process.env.SITE_URL || 'https://www.abcdesreflexes.com';
const base = process.env.BASE_PATH || '/';

// Images allégées et leurs dimensions (fichier produit par scripts/images.mjs)
const images = existsSync('src/data/images.json') ? JSON.parse(readFileSync('src/data/images.json', 'utf-8')) : {};

// Dans les articles : image allégée, dimensions, chargement différé, puis sous-dossier devant les liens « /… »
function prefixBase() {
  const b = base.replace(/\/$/, '');
  return (tree) => {
    let first = true;
    const walk = (n) => {
      if (n.type === 'element' && n.tagName === 'img' && n.properties && typeof n.properties.src === 'string') {
        const hit = images[decodeURI(n.properties.src).normalize('NFC')];
        if (hit) Object.assign(n.properties, { src: hit.src, width: hit.width, height: hit.height, className: [hit.width >= hit.height * 1.2 ? 'paysage' : 'portrait'] });
        Object.assign(n.properties, first ? { fetchpriority: 'high' } : { loading: 'lazy' }, { decoding: 'async' });
        first = false;
      }
      if (b && n.type === 'element' && n.properties) {
        for (const k of ['src', 'href', 'poster']) {
          const v = n.properties[k];
          if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')) n.properties[k] = b + v;
        }
      }
      if (b && n.type === 'raw' && typeof n.value === 'string') {
        n.value = n.value.replace(/\b(src|href|poster)="\/(?!\/)/g, `$1="${b}/`);
      }
      (n.children || []).forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !/\/(about-1|404|politique|mentions-legales)/.test(decodeURI(page)) })],
  markdown: { rehypePlugins: [prefixBase] },
});
