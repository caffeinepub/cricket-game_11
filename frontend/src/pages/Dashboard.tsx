import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';

const gameModes = [
  {
    id: 'ipl',
    path: '/ipl',
    title: 'IPL',
    subtitle: 'Indian Premier League',
    description: 'Play the T20 extravaganza with all 10 IPL franchises',
    emoji: '🏏',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    badge: 'T20',
    badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'bbl',
    path: '/bbl',
    title: 'BBL',
    subtitle: 'Big Bash League',
    description: 'Experience Australian T20 cricket with all 8 BBL teams',
    emoji: '🦘',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    badge: 'T20',
    badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'international',
    path: '/international',
    title: 'International',
    subtitle: 'Country vs Country',
    description: 'Play T20, ODI, or Test matches between 12 nations',
    emoji: '🌍',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    badge: 'T20 / ODI / Test',
    badgeColor: 'bg-green-500/20 text-green-700 dark:text-green-300',
  },
  {
    id: 'domestic',
    path: '/domestic',
    title: 'Domestic',
    subtitle: 'Ranji · Sheffield · County',
    description:
      'Compete in Ranji Trophy, Sheffield Shield, or County Championship',
    emoji: '🏆',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    badge: 'Multi-format',
    badgeColor: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  const greeting = userProfile?.name ? `Welcome back, ${userProfile.name}!` : 'Welcome to Cricket Game!';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <img
          src="/assets/generated/stadium-banner.dim_1200x400.png"
          alt="Stadium"
          className="w-full h-40 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent flex items-center px-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              {greeting}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Choose a game mode to start playing
            </p>
          </div>
        </div>
      </div>

      {/* Game Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => navigate({ to: mode.path })}
            className={`group relative bg-gradient-to-br ${mode.color} border ${mode.border} rounded-2xl p-6 text-left hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer`}
          >
            <div className="text-4xl mb-3">{mode.emoji}</div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {mode.title}
                </h3>
                <p className="text-xs text-muted-foreground">{mode.subtitle}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mode.badgeColor}`}
              >
                {mode.badge}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mode.description}
            </p>
            <div className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
              Play Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* How to Play */}
      <div className="mt-12 bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <span>📖</span> How to Play
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: 'Choose Mode',
              desc: 'Pick IPL, BBL, International, or Domestic',
            },
            {
              step: '2',
              title: 'Select Teams',
              desc: 'Choose the teams you want to play with',
            },
            {
              step: '3',
              title: 'Simulate',
              desc: 'Use Next Ball or Auto-Simulate to play',
            },
            {
              step: '4',
              title: 'View Results',
              desc: 'Check the scorecard and match summary',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">
                  {item.step}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
