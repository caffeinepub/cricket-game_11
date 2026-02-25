import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, Trophy, Zap } from 'lucide-react';

export default function LoginScreen() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, oklch(0.82 0.18 85) 0, oklch(0.82 0.18 85) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Stadium banner */}
      <div className="w-full max-w-4xl mb-8 rounded-xl overflow-hidden shadow-stadium relative">
        <img
          src="/assets/generated/stadium-banner.dim_1200x400.png"
          alt="Cricket Stadium"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gold tracking-widest uppercase">
            Cricket Premier
          </h1>
          <p className="font-heading text-lg text-foreground/80 mt-1 tracking-wide">
            The Ultimate Cricket Simulation Experience
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl w-full px-4">
        {[
          { icon: <Trophy className="w-6 h-6 text-gold" />, label: 'IPL & BBL', desc: 'Franchise Leagues' },
          { icon: <Zap className="w-6 h-6 text-gold" />, label: 'T20 · ODI · Test', desc: '3 Formats' },
          { icon: <Shield className="w-6 h-6 text-gold" />, label: '12+ Nations', desc: 'International Teams' },
        ].map((f) => (
          <div key={f.label} className="card-stadium rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">{f.icon}</div>
            <div className="font-heading font-bold text-foreground text-sm">{f.label}</div>
            <div className="text-muted-foreground text-xs">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Login card */}
      <div className="card-stadium rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <img src="/assets/generated/cricket-ball-icon.dim_128x128.png" alt="Cricket Ball" className="w-16 h-16" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome to the Crease</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in securely to access all cricket formats, tournaments, and match simulations.
        </p>

        <Button
          onClick={handleAuth}
          disabled={isLoggingIn}
          className="w-full h-12 text-base font-heading font-bold tracking-wide gold-gradient text-background hover:opacity-90 transition-opacity border-0"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Login with Internet Identity
            </>
          )}
        </Button>

        <p className="text-muted-foreground text-xs mt-4">
          Secured by Internet Computer's decentralized identity system
        </p>
      </div>
    </div>
  );
}
