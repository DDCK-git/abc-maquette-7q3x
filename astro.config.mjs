import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse finale du site, et sous-dossier éventuel (adresse provisoire GitHub Pages)
const site = process.env.SITE_URL || 'https://www.abcdesreflexes.com';
const base = process.env.BASE_PATH || '/';

// Ajoute le sous-dossier devant les liens et images « /… » écrits dans les articles
function prefixBase() {
  const b = base.replace(/\/$/, '');
  return (tree) => {
    if (!b) return;
    const walk = (n) => {
      if (n.type === 'element' && n.properties) {
        for (const k of ['src', 'href', 'poster']) {
          const v = n.properties[k];
          if (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')) n.properties[k] = b + v;
        }
      }
      if (n.type === 'raw' && typeof n.value === 'string') {
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
  build: { format: 'file' },
  integrations: [sitemap({ filter: (page) => !/\/(about-1|404|politique|mentions-legales)/.test(decodeURI(page)) })],
  markdown: { rehypePlugins: [prefixBase] },
});
