import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Đặt SITE_URL khi build/deploy (vd: https://carong.vn) để canonical + sitemap đúng.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://carong.example',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
