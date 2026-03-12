// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cybertrip.co.jp',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
