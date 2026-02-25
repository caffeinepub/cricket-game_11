import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    setError(null);
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message === 'User is already authenticated') {
        // Already authenticated — clear cache and retry
        queryClient.clear();
        setTimeout(() => login(), 400);
      } else {
        setError(
          err?.message ||
            'Login failed. Please try again or use a different browser.'
        );
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero / Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/stadium-banner.dim_1200x400.png"
          alt="Cricket Stadium"
          className="w-full h-48 sm:h-64 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="/assets/generated/cricket-ball-icon.dim_128x128.png"
                alt="Cricket Ball"
                className="w-10 h-10"
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight drop-shadow-lg">
                Cricket Game
              </h1>
              <img
                src="/assets/generated/cricket-bat-icon.dim_128x128.png"
                alt="Cricket Bat"
                className="w-10 h-10"
              />
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              The ultimate cricket simulation experience
            </p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <img
                src="/assets/generated/cricket-ball-icon.dim_128x128.png"
                alt="Cricket"
                className="w-12 h-12"
              />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Cricket Game
            </h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Sign in to play IPL, BBL, International, and Domestic cricket
              tournaments. Your progress is saved securely on the blockchain.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                <p className="mb-2">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-xs underline hover:no-underline font-medium"
                >
                  Reload &amp; Retry
                </button>
              </div>
            )}

            {/* Login Button — always enabled, never blocked by initialization */}
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-md hover:shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  Login with Internet Identity
                </>
              )}
            </button>

            {/* Reload button shown when there's an error */}
            {error && !isLoggingIn && (
              <button
                onClick={handleRetry}
                className="mt-3 w-full py-2 px-6 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-all duration-200 text-sm border border-border"
              >
                🔄 Reload Page
              </button>
            )}

            {/* Info */}
            <p className="mt-6 text-xs text-muted-foreground">
              Internet Identity is a secure, privacy-preserving authentication
              system on the Internet Computer. No passwords required.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-3 text-left">
              {[
                { icon: '🏏', label: 'IPL Tournament' },
                { icon: '🦘', label: 'BBL Tournament' },
                { icon: '🌍', label: 'International' },
                { icon: '🏆', label: 'Domestic Leagues' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2"
                >
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-xs font-medium text-foreground">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>
          Built with{' '}
          <span className="text-destructive">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cricket-game')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
