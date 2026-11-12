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
    // adresse de l'article sur l'ancien site Wix, conservée pour le référencement
    ancienne_adresse: z.string().optional(),
  }),
});

export const collections = { blog };
