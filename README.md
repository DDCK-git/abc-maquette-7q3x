# Site de L'ABC des réflexes

Site statique construit avec [Astro](https://astro.build) : pas de base de données, pas de serveur, rien à mettre à jour côté sécurité. Les parties dynamiques restent chez des services externes (rendez-vous sur Perfactive).

## Ce qu'il y a dans ce dossier

| Dossier ou fichier | Rôle |
|---|---|
| `src/content/blog/` | Les articles du blog, un fichier Markdown par article |
| `src/pages/` | Les pages : accueil, formations, blog, mentions légales, cookies |
| `src/layouts/Base.astro` | En-tête, pied de page, balises pour Google et les assistants |
| `src/styles/global.css` | Toute la mise en forme |
| `public/img/` | Les images (celles des articles sont dans `public/img/blog/`) |
| `public/_redirects` | Redirections des anciennes adresses Wix (lues par Netlify et Cloudflare Pages) |
| `.pages.yml` | Configuration de l'éditeur en ligne du blog |
| `.github/workflows/deploy.yml` | Publication automatique à chaque modification |

## Travailler dessus

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run dev` ouvre le site en local, `npm run build` le compile dans `dist/`.

## Publier un article

**Avec l'éditeur en ligne (pour Sandy)** : voir `GUIDE-BLOG.md`. Mise en route, une seule fois, par le propriétaire du dépôt : aller sur https://app.pagescms.org, se connecter avec GitHub, installer l'application GitHub de Pages CMS sur ce dépôt, ouvrir le dépôt, puis inviter Sandy par e-mail dans la partie « Collaborators ». Sandy n'a pas besoin de compte GitHub. Un article enregistré est en ligne environ une minute plus tard ; un article coché « Brouillon » n'apparaît pas.

**À la main ou avec Claude** : ajouter un fichier dans `src/content/blog/` avec cet en-tête, puis pousser sur `main`.

```markdown
---
title: "Le titre de l'article"
date: 2026-12-01
description: "Deux lignes de résumé."
cover: /img/blog/couvertures/mon-image.jpg
tags:
  - "sommeil enfant"
---

Le texte de l'article…
```

## Référencement : ce qui est déjà en place

- Les 18 articles gardent **exactement la même adresse** que sur Wix (`/post/...`), y compris les accents.
- `/about-1` (ancienne page Formations) et l'ancienne page cookies renvoient vers les nouvelles pages.
- Le flux RSS garde la même adresse (`/blog-feed.xml`).
- Plan du site (`/sitemap-index.xml`), titres et descriptions par page, données structurées (cabinet, articles, questions pratiques, formation).
- `/llms.txt` : résumé du site en texte simple pour les assistants.
- Aucun cookie, aucun traceur, polices hébergées sur le site.

## Passer de l'adresse provisoire à la production

Aujourd'hui le site est publié sur une adresse provisoire GitHub Pages, **non indexée** (balise `noindex` et `robots.txt` fermé).

1. **Choisir l'hébergeur définitif.** GitHub Pages ne sait pas faire de vraies redirections 301. Pour garder tout le référencement, préférer Cloudflare Pages ou Netlify (gratuits), qui lisent `public/_redirects`. Commande de compilation : `npm run build`, dossier publié : `dist`.
2. **Variables de compilation** pour la production : `SITE_URL=https://www.abcdesreflexes.com`, `BASE_PATH=/`, `PREVIEW=0`. Sans `PREVIEW=1`, le site devient indexable.
3. **Domaine** : il est chez Squarespace Domains, la messagerie chez Google. Il suffit de faire pointer `www` (et le domaine nu) vers le nouvel hébergeur. **Ne pas toucher aux enregistrements MX**, sinon les e-mails s'arrêtent.
4. **Après la bascule** : déclarer le plan du site dans Google Search Console et vérifier quelques anciennes adresses.

## Ce qu'il reste à compléter avant la mise en production

- `src/pages/mentions-legales.astro` : statut, numéro SIRET et hébergeur (entre crochets).
- Bloc Marjorie sur l'accueil : sa photo et quelques mots sur son parcours.
- Relecture par Sandy des textes de l'accueil (condensés à partir de son site actuel).

## Outils de migration

Dans le dossier parent `outils/` : `migrer_articles.py` (reprise des articles Wix en Markdown) et `verifier_liens.py` (contrôle des liens du site compilé).
