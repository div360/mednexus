import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import * as ReactDOM from 'react-dom/client';
import { useAuthStore } from '@mednexus/auth/data-access';
import App from './app/app';

/** Federated remotes bundle their own auth store; point them at the host singleton. */
(
  window as unknown as { __MEDNEXUS_AUTH_STORE__?: typeof useAuthStore }
).__MEDNEXUS_AUTH_STORE__ = useAuthStore;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
