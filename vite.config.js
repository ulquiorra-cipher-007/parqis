import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-vercel';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      alias: {
        '$lib': path.resolve('./src/lib'),
        '$lib/*': path.resolve('./src/lib/*')
      }
    })
  ]
});
