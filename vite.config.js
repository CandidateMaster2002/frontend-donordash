import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import'; // Import postcss-import

export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0',
    port: 5173, // or any port you're using
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(), // Add postcss-import first
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
});