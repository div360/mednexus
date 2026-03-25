import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ActivitySquare, LogOut, X } from 'lucide-react';
import { useAuthStore } from '@mednexus/auth/data-access';

export const Sidebar = ({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: ActivitySquare },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`flex h-full w-64 flex-col border-r border-slate-800/50 bg-[#0f121e] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'fixed inset-y-0 left-0 z-50 -translate-x-full md:relative'}`}
      >
        <div className="mb-8 flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7673C1]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25173B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" fill="#25173B" />
                <circle cx="5" cy="5" r="2" fill="#25173B" />
                <circle cx="19" cy="5" r="2" fill="#25173B" />
                <circle cx="5" cy="19" r="2" fill="#25173B" />
                <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M12 9V5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-teal-400">
                MedNexus
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                Clinical Prism
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-white md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/50 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-rose-400"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
