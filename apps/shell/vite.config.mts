/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';
import {
  federationHostShared,
  federationHostSharedModules,
} from '../../tools/vite/federation-react-shared.mts';

function remoteEntryUrl(envName: string, fallback: string): string {
  const baseUrl = process.env[envName] ?? fallback;
  return `${baseUrl.replace(/\/$/, '')}/assets/remoteEntry.js`;
}

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/shell',
  server: {
    port: 3000,
    host: 'localhost',
  },
  preview: {
    port: 3000,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    federation({
      name: 'shell',
      remotes: {
        auth: remoteEntryUrl('VITE_REMOTE_AUTH', 'http://localhost:3001'),
        dashboard: remoteEntryUrl('VITE_REMOTE_DASHBOARD', 'http://localhost:3002'),
        analytics: remoteEntryUrl('VITE_REMOTE_ANALYTICS', 'http://localhost:3003'),
        patients: remoteEntryUrl('VITE_REMOTE_PATIENTS', 'http://localhost:3004'),
      },
      shared: federationHostShared,
    }),
  ],
  resolve: {
    dedupe: [...federationHostSharedModules],
  },
  build: {
    target: 'esnext',
    outDir: '../dist/shell',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
