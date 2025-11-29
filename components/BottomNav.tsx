import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapIcon, MissionsIcon, VaultIcon, ProfileIcon, LeaderboardIcon } from './icons';

const navItems = [
  { path: '/map', label: 'Map', icon: MapIcon },
  { path: '/missions', label: 'Missions', icon: MissionsIcon },
  { path: '/vault', label: 'Vault', icon: VaultIcon },
  { path: '/leaderboard', label: 'Leaders', icon: LeaderboardIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];

const BottomNav = () => {
  const activeLinkClass = 'text-v3-primary';
  const inactiveLinkClass = 'text-v3-text-secondary hover:text-v3-text-primary';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-v3-surface border-t border-v3-border shadow-lg z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;