import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'IPL', path: '/ipl' },
    { label: 'BBL', path: '/bbl' },
    { label: 'International', path: '/international' },
    { label: 'Domestic', path: '/domestic' },
  ];

  const displayName =
    userProfile?.name ||
    (identity
      ? identity.getPrincipal().toString().slice(0, 8) + '...'
      : 'Player');

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
          >
            <img
              src="/assets/generated/cricket-ball-icon.dim_128x128.png"
              alt="Cricket"
              className="w-7 h-7"
            />
            <span className="hidden sm:inline text-lg">Cricket Game</span>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* User / Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted/60 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {displayName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
