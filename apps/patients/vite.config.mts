/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';
import {
  federationReactAliases,
  federationShared,
  federationSharedModules,
} from '../../tools/vite/federation-react-shared.mts';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/patients',
  server: {
    port: 3004,
    host: 'localhost',
  },
  preview: {
    port: 3004,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    federation({
      name: 'patients',
      filename: 'remoteEntry.js',
      exposes: {
        './PatientsPage': './src/app/app.tsx',
      },
      shared: federationShared
    }),
  ],
  resolve: {
    alias: federationReactAliases,
    dedupe: [...federationSharedModules]
  },
  build: {
    target: 'esnext',
    outDir: '../dist/patients',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
