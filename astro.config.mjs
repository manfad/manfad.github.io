// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://manfad.github.io',
  integrations: [vue()],
  vite: {
    build: {
      // roughness@0.2.0 ships a typo'd @property rule that strict lightningcss rejects
      cssMinify: 'esbuild',
    },
  },
});