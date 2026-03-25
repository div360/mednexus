import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ActivitySquare, LogOut } from 'lucide-react';
import { useAuthStore } from '@mednexus/auth/data-access';

export const Sidebar = () => {
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
    <div className="w-64 bg-[#0f121e] border-r border-slate-800/50 flex flex-col h-full hidden md:flex">
      <div className="p-6 flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 bg-white rounded-full"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">MedNexus</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Clinical Prism</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-rose-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
