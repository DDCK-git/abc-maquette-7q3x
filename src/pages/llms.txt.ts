import type { APIRoute } from 'astro';
import { allPosts, postPath, PROD_URL, RDV, TEL_AFFICHE, EMAIL } from '../lib/site';

// Résumé du site en texte simple, pour les assistants et les agents de recherche
export const GET: APIRoute = async () => {
  const posts = await allPosts();
  const body = `# L'ABC des réflexes

> Cabinet spécialisé dans l'intégration des réflexes archaïques à Obernai (Alsace), pour les enfants, les adolescents et les adultes. Sandy Stevens, praticienne et formatrice Arc-en-Flex®, et sa collègue Marjorie Ebel, praticienne certifiée Arc-en-Flex®.

## En pratique
- Adresse : 1, place des Fines Herbes, 67210 Obernai (1er étage avec ascenseur, parking au pied de l'immeuble), à 25 minutes de Strasbourg et 40 minutes de Colmar
- Téléphone : ${TEL_AFFICHE} · E-mail : ${EMAIL}
- Prise de rendez-vous en ligne : ${RDV}
- Bilan réflexes (enfant, ado, adulte) : 90 minutes, 95 €
- Consultation de suivi : 45 minutes, 65 €, toutes les 3 à 4 semaines
- Jours de présence : Sandy le lundi, le mercredi et le vendredi ; Marjorie le mardi et le samedi
- Le cabinet n'établit pas de diagnostic médical ; les séances complètent les suivis existants

## Pages
- [Accueil : consultations, déroulé d'un suivi, questions pratiques](${PROD_URL}/)
- [Formations : parcours certifiant Arc-en-Flex® en Alsace et en Belgique](${PROD_URL}/formations)
- [Blog](${PROD_URL}/blog)

## Articles du blog
${posts.map((p) => `- [${p.data.title}](${PROD_URL + encodeURI(postPath(p))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
