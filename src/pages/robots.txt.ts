import type { APIRoute } from 'astro';
import { PREVIEW, PROD_URL } from '../lib/site';

// En prévisualisation : rien n'est indexé. En production : tout est ouvert, y compris aux assistants.
export const GET: APIRoute = () => {
  const body = PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${PROD_URL}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
