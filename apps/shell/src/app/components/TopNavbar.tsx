import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNotificationStore } from '@mednexus/shared/data-access';
import { useAuthStore } from '@mednexus/auth/data-access';
import {
  requestNotificationPermission,
  showLocalNotification,
  supportsNotifications,
} from '../notifications/browserNotifications';
import { NotificationPanel } from './NotificationPanel';

export const TopNavbar = ({
  onMenuClick,
  notificationPanelOpen,
  onNotificationPanelOpenChange,
}: {
  onMenuClick?: () => void;
  notificationPanelOpen: boolean;
  onNotificationPanelOpenChange: (open: boolean) => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleNotificationClick = async () => {
    onNotificationPanelOpenChange(!notificationPanelOpen);

    if (!supportsNotifications()) {
      return;
    }

    const previousPermission = Notification.permission;
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return;
    }

    if (previousPermission !== 'granted') {
      await showLocalNotification({
        title: 'Notifications enabled',
        body: 'MedNexus will alert you locally when a patient check is due.',
        tag: 'notifications-enabled',
        data: { url: '/patients' },
      });
    }
  };

  return (
    <header className="h-20 bg-[#0a0c14] flex items-center justify-between px-4 sm:px-8 border-b border-slate-800/50">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative bg-[#1e2335] p-2.5 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors group"
          >
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#1e2335]"></span>
            )}
          </button>
          <NotificationPanel
            open={notificationPanelOpen}
            onClose={() => onNotificationPanelOpenChange(false)}
          />
        </div>

        <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{user?.displayName || 'Dr. Julian Vance'}</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">CHIEF OF SURGERY</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-bold text-orange-800 border-2 border-[#0a0c14] ring-2 ring-emerald-400 relative overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.email || 'J V').charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
