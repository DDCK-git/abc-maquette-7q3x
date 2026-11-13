import { getCollection, type CollectionEntry } from 'astro:content';

export const RDV = 'https://perfactive.fr/l-abc-des-reflexes/info';
export const INSTA = 'https://www.instagram.com/sandy_abcdesreflexes/';
export const FACEBOOK = 'https://www.facebook.com/abcdesreflexes/';
export const LINKEDIN = 'https://www.linkedin.com/in/sandy-stevens-65b006189/';
export const TEL = '+33769358485';
export const TEL_AFFICHE = '07 69 35 84 85';
export const EMAIL = 'sandy@abcdesreflexes.com';
export const SITE_NAME = "L'ABC des réflexes";
export const PROD_URL = 'https://www.abcdesreflexes.com';
// Programme du soir : lien de paiement de la prévente (vide tant qu'il n'est pas créé) et prix
export const PREVENTE_URL = '';
export const PREVENTE_PRIX = 29;

// Version de prévisualisation : pas d'indexation par les moteurs de recherche
export const PREVIEW = process.env.PREVIEW === '1';

const B = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Lien interne, avec le sous-dossier de l'adresse provisoire si besoin */
export const url = (p = '/') => B + (p.startsWith('/') ? p : '/' + p);

import images from '../data/images.json';
/** Image allégée avec ses dimensions, à étaler dans une balise <img {...pic('/img/x.jpg')}> */
export function pic(path: string) {
  const hit = (images as Record<string, { src: string; width: number; height: number }>)[path.normalize('NFC')];
  return hit ? { src: url(hit.src), width: hit.width, height: hit.height } : { src: url(path) };
}

export type Post = CollectionEntry<'blog'>;
export const postSlug = (p: Post) => p.data.ancienne_adresse || p.id;
export const postPath = (p: Post) => '/post/' + postSlug(p);

export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => !p.data.brouillon);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const dateFr = (d: Date) => fmt.format(d);

export function excerpt(t: string, n = 150) {
  t = (t || '').replace(/->/g, '').replace('(//hypersensibilité)', '').replace(/\s+/g, ' ').trim();
  if (t.length <= n) return t;
  return t.slice(0, n).replace(/\s+\S*$/, '').replace(/[ ,;:]+$/, '') + '…';
}

export function readingMinutes(body: string | undefined) {
  const words = (body || '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
