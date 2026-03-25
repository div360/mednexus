import path from 'node:path';

const workspaceRoot = path.resolve(import.meta.dirname, '..', '..');

const reactEntry = path.join(workspaceRoot, 'node_modules/react');
const reactJsxRuntimeEntry = path.join(workspaceRoot, 'node_modules/react/jsx-runtime.js');
const reactJsxDevRuntimeEntry = path.join(workspaceRoot, 'node_modules/react/jsx-dev-runtime.js');
const reactDomEntry = path.join(workspaceRoot, 'node_modules/react-dom');
const reactDomClientEntry = path.join(workspaceRoot, 'node_modules/react-dom/client.js');

export const federationSharedModules = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom',
  'react-dom/client',
  'react-router-dom',
  'zustand',
  'use-sync-external-store',
  'recharts',
] as const;

export const federationShared = Object.fromEntries(
  federationSharedModules.map((moduleName) => [
    moduleName,
    {
      import: true,
    },
  ])
);

export const federationHostSharedModules = [
  'react',
  'react-dom',
  'react-router-dom',
  'zustand',
  'use-sync-external-store',
] as const;

export const federationHostShared = Object.fromEntries(
  federationHostSharedModules.map((moduleName) => [
    moduleName,
    {
      import: true,
    },
  ])
);

export const federationReactAliases = [
  { find: 'react/jsx-runtime', replacement: reactJsxRuntimeEntry },
  { find: 'react/jsx-dev-runtime', replacement: reactJsxDevRuntimeEntry },
  { find: 'react-dom/client', replacement: reactDomClientEntry },
  { find: 'react-dom', replacement: reactDomEntry },
  { find: 'react', replacement: reactEntry },
];
