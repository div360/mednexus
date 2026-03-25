import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { DashboardPage } from '@mednexus/dashboard/feature';

/**
 * When loaded in the shell via Module Federation, pass `hostNavigate` from the host's Router.
 * Do not call useNavigate() in that path — the remote can bundle its own react-router-dom in dev,
 * which breaks Router context. Standalone dev uses BrowserRouter in main.tsx + this inner hook.
 */
function DashboardStandalone() {
  const navigate = useNavigate();
  return <DashboardPage navigate={navigate} />;
}

export default function DashboardApp(props?: { hostNavigate?: NavigateFunction }) {
  if (props?.hostNavigate) {
    return <DashboardPage navigate={props.hostNavigate} />;
  }
  return <DashboardStandalone />;
}
