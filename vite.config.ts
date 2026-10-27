import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = fileURLToPath(new URL('./public', import.meta.url));
const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  root: publicRoot,
  publicDir: false,
  resolve: {
    alias: {
      '/main.ts': fileURLToPath(new URL('./src/main.ts', import.meta.url)),
      '@': sourceRoot,
      '@domain': fileURLToPath(new URL('./src/domain', import.meta.url)),
      '@application': fileURLToPath(new URL('./src/application', import.meta.url)),
      '@infrastructure': fileURLToPath(new URL('./src/infrastructure', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === '1',
    },
    fs: {
      strict: true,
      allow: [projectRoot],
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    sourcemap: true,
  },
});
