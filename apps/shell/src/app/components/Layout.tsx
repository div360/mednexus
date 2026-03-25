import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { NotificationCoordinator } from './NotificationCoordinator';
import { NotificationToasts } from './NotificationToasts';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#0a0c14] overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30">
      <NotificationCoordinator />
      <NotificationToasts onShowAll={() => setNotificationPanelOpen(true)} />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <TopNavbar
          onMenuClick={() => setMobileMenuOpen(true)}
          notificationPanelOpen={notificationPanelOpen}
          onNotificationPanelOpenChange={setNotificationPanelOpen}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
