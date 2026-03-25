import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@mednexus/auth/data-access';

export const TopNavbar = () => {
  const { user } = useAuthStore();

  const handleNotificationClick = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('System Alert', {
          body: 'Critical patient update requires your attention.',
          icon: '/favicon.ico'
        });
      });
    } else {
      alert('Service Worker notifications not supported/enabled.');
    }
  };

  return (
    <header className="h-20 bg-[#0a0c14] flex items-center justify-between px-8 border-b border-slate-800/50">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search records, patients, or files..."
            className="w-full bg-[#1e2335] text-sm text-white placeholder-slate-500 rounded-full pl-11 pr-4 py-2.5 border border-slate-700/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={handleNotificationClick}
          className="relative bg-[#1e2335] p-2.5 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors group"
        >
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#1e2335]"></span>
        </button>

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
