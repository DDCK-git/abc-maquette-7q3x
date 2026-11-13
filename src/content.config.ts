import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un article = un fichier Markdown dans src/content/blog
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(''),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    // titre et description pour Google, s'ils diffèrent du titre et du résumé affichés
    // un brouillon n'apparaît pas sur le site
    brouillon: z.boolean().optional().default(false),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    // adresse de l'article sur l'ancien site Wix, conservée pour le référencement
    ancienne_adresse: z.string().optional(),
  }),
});

export const collections = { blog };
