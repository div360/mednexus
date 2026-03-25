import { useAuthStore } from './authStore';

/**
 * The shell and federated remotes each bundle `@mednexus/auth/data-access`, so they
 * would otherwise get two separate Zustand stores. The shell assigns the host store
 * to `window.__MEDNEXUS_AUTH_STORE__` in `main.tsx`; remotes use it when present.
 */
export function getAuthStore(): typeof useAuthStore {
  if (typeof window !== 'undefined' && window.__MEDNEXUS_AUTH_STORE__) {
    return window.__MEDNEXUS_AUTH_STORE__;
  }
  return useAuthStore;
}

declare global {
  interface Window {
    /** Set only by `apps/shell/src/main.tsx` before React renders. */
    __MEDNEXUS_AUTH_STORE__?: typeof useAuthStore;
  }
}
