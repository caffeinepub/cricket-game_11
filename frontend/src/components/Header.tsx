import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { LogOut, User, Trophy, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/assets/generated/cricket-ball-icon.dim_128x128.png" alt="Cricket" className="w-8 h-8" />
          <span className="font-display text-xl font-bold text-gold tracking-wider group-hover:opacity-80 transition-opacity">
            CRICKET PREMIER
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { to: '/international', label: 'International' },
            { to: '/ipl', label: 'IPL' },
            { to: '/bbl', label: 'BBL' },
            { to: '/domestic', label: 'Domestic' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-1.5 rounded-md text-sm font-heading font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
              activeProps={{ className: 'text-gold bg-secondary' }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        {identity && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-secondary">
                <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                  <User className="w-4 h-4 text-background" />
                </div>
                <span className="hidden md:block font-heading text-sm text-foreground">
                  {userProfile?.name || 'Player'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <div className="px-3 py-2">
                <p className="font-heading font-bold text-foreground">{userProfile?.name || 'Player'}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {identity.getPrincipal().toString().slice(0, 20)}...
                </p>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild>
                <Link to="/ipl" className="flex items-center gap-2 cursor-pointer">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span>Tournaments</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
