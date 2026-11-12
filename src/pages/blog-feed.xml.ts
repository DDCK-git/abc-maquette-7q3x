import type { APIRoute } from 'astro';
import { allPosts, postPath, PROD_URL } from '../lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Flux RSS, à la même adresse que sur l'ancien site
export const GET: APIRoute = async () => {
  const posts = await allPosts();
  const items = posts.map((p) => {
    const link = PROD_URL + encodeURI(postPath(p));
    return `<item><title>${esc(p.data.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description)}</description>${p.data.cover ? `<enclosure url="${PROD_URL + p.data.cover}" type="image/jpeg" length="0"/>` : ''}</item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>L'ABC des réflexes · Le blog</title><link>${PROD_URL}/blog</link><description>Les comportements du quotidien décodés avec l'éclairage des réflexes archaïques.</description><language>fr</language>\n${items}\n</channel></rss>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
