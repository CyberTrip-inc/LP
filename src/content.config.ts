import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    date: z.string(),
    badge: z.string().optional(),
    badge_en: z.string().optional(),
    link: z.string().optional(),
    link_text: z.string().optional(),
    link_text_en: z.string().optional(),
    pinned: z.boolean().optional(),
    category: z.enum(['news', 'notice']).default('news'),
  }),
});

export const collections = { news };
