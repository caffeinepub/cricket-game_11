import React from 'react';
import { useGetAllMatches } from '../hooks/useQueries';
import DashboardCard from '../components/DashboardCard';
import { MatchFormat } from '../backend';
import { getFormatLabel } from '../lib/cricketData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Globe, Zap, Home } from 'lucide-react';

export default function Dashboard() {
  const { data: matches, isLoading } = useGetAllMatches();

  const recentMatches = matches?.filter(m => m.isOver).slice(-5).reverse() || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/stadium-banner.dim_1200x400.png"
          alt="Stadium"
          className="w-full h-40 md:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent flex items-center">
          <div className="p-6 md:p-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-gold tracking-wide">
              Welcome to Cricket Premier
            </h1>
            <p className="font-heading text-foreground/80 mt-2 text-lg">
              Choose your format and start playing
            </p>
          </div>
        </div>
      </div>

      {/* Mode cards */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4 tracking-wide">Game Modes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="International"
            description="Country vs Country matches in T20, ODI, and Test formats"
            icon={<Globe className="w-7 h-7 text-blue-400" />}
            to="/international"
            badge="12 Teams"
            color="#3b82f6"
          />
          <DashboardCard
            title="IPL"
            description="Indian Premier League with all 10 franchise teams"
            icon={<img src="/assets/generated/ipl-trophy.dim_256x256.png" alt="IPL" className="w-10 h-10 object-contain" />}
            to="/ipl"
            badge="T20"
            color="#f59e0b"
          />
          <DashboardCard
            title="BBL"
            description="Big Bash League with all 8 Australian franchise teams"
            icon={<img src="/assets/generated/bbl-logo.dim_256x256.png" alt="BBL" className="w-10 h-10 object-contain" />}
            to="/bbl"
            badge="T20"
            color="#06b6d4"
          />
          <DashboardCard
            title="Domestic"
            description="Ranji Trophy, Sheffield Shield & County Championship"
            icon={<Home className="w-7 h-7 text-green-400" />}
            to="/domestic"
            badge="3 Leagues"
            color="#22c55e"
          />
        </div>
      </div>

      {/* Recent matches */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4 tracking-wide">Recent Matches</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl bg-secondary" />)}
          </div>
        ) : recentMatches.length === 0 ? (
          <div className="card-stadium rounded-xl p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-heading">No matches played yet. Start a game!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <div key={match.matchId.toString()} className="card-stadium rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-gold text-gold font-heading text-xs">
                    {getFormatLabel(match.format)}
                  </Badge>
                  <div>
                    {match.result ? (
                      <div className="font-heading font-bold text-foreground">
                        {match.result.winner} won
                      </div>
                    ) : (
                      <div className="font-heading text-muted-foreground">Match #{match.matchId.toString()}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {match.runsScored.toString()}/{match.wicketsLost.toString()} • {match.currentOver.toString()} overs
                    </div>
                  </div>
                </div>
                <Badge className={match.isOver ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                  {match.isOver ? 'Completed' : 'Live'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches', value: matches?.length || 0, icon: <Zap className="w-5 h-5 text-gold" /> },
          { label: 'Completed', value: matches?.filter(m => m.isOver).length || 0, icon: <Trophy className="w-5 h-5 text-green-400" /> },
          { label: 'T20 Matches', value: matches?.filter(m => m.format === MatchFormat.t20).length || 0, icon: <Zap className="w-5 h-5 text-blue-400" /> },
          { label: 'Test Matches', value: matches?.filter(m => m.format === MatchFormat.test).length || 0, icon: <Globe className="w-5 h-5 text-purple-400" /> },
        ].map(stat => (
          <div key={stat.label} className="card-stadium rounded-xl p-4 flex items-center gap-3">
            {stat.icon}
            <div>
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-heading">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
