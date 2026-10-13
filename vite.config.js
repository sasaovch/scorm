import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SCORM запускается из LMS или напрямую из файла, поэтому:
//  - base: './' — все ссылки на ассеты относительные;
//  - viteSingleFile — инлайнит JS/CSS в один index.html (SCORM-пакет = 1 SCO-файл + манифест).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000, // инлайнить всё в один файл
    chunkSizeWarningLimit: 100000,
  },
});
