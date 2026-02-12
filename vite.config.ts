import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/main.ts']
    })
  ],
  build: {
    lib: {
      name: 'loggisch',
      fileName: 'main',
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'umd'],
    },
    sourcemap: true,
  }
});
