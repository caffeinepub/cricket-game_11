import React, { useState, useCallback } from 'react';
import { TournamentType, MatchFormat } from '../backend';
import {
  RANJI_TEAMS,
  SHEFFIELD_SHIELD_TEAMS,
  COUNTY_TEAMS,
  TeamData,
  getTournamentLabel,
} from '../lib/cricketData';
import { simulateFullInnings } from '../lib/matchSimulator';
import { useGetTournamentMatches, useRecordTournamentResult } from '../hooks/useQueries';
import TournamentPointsTable from '../components/TournamentPointsTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Play, Loader2, Home } from 'lucide-react';

interface MatchResult {
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  winner: string;
}

interface LeagueConfig {
  type: TournamentType;
  teams: TeamData[];
  format: MatchFormat;
  overs: number;
  flag: string;
  country: string;
  color: string;
}

const LEAGUES: LeagueConfig[] = [
  {
    type: TournamentType.ranjiTrophy,
    teams: RANJI_TEAMS,
    format: MatchFormat.test,
    overs: 90,
    flag: '🇮🇳',
    country: 'India',
    color: '#1a6bb5',
  },
  {
    type: TournamentType.sheffieldShield,
    teams: SHEFFIELD_SHIELD_TEAMS,
    format: MatchFormat.test,
    overs: 90,
    flag: '🇦🇺',
    country: 'Australia',
    color: '#f5a623',
  },
  {
    type: TournamentType.countyChampionship,
    teams: COUNTY_TEAMS,
    format: MatchFormat.odi,
    overs: 50,
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    country: 'England',
    color: '#003087',
  },
];

function simulateMatch(team1: TeamData, team2: TeamData, overs: number): MatchResult {
  const squad1 = team1.players.map(p => p.name);
  const squad2 = team2.players.map(p => p.name);
  const battingRatings1 = team1.players.map(p => p.battingRating);
  const bowlingRatings1 = team1.players.map(p => p.bowlingRating);
  const battingRatings2 = team2.players.map(p => p.battingRating);
  const bowlingRatings2 = team2.players.map(p => p.bowlingRating);

  const innings1 = simulateFullInnings(squad1, squad2, overs, null, battingRatings1, bowlingRatings2);
  const target = innings1.runs + 1;
  const innings2 = simulateFullInnings(squad2, squad1, overs, target, battingRatings2, bowlingRatings1);

  const winner = innings2.runs >= target ? team2.name : team1.name;
  return {
    team1: team1.name,
    team2: team2.name,
    score1: `${innings1.runs}/${innings1.wickets}`,
    score2: `${innings2.runs}/${innings2.wickets}`,
    winner,
  };
}

function generateRoundRobin(teams: TeamData[]): [TeamData, TeamData][] {
  const matches: [TeamData, TeamData][] = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push([teams[i], teams[j]]);
    }
  }
  return matches;
}

export default function DomesticTournament() {
  const [selectedLeague, setSelectedLeague] = useState<LeagueConfig>(LEAGUES[0]);
  const { data: savedResults, isLoading } = useGetTournamentMatches(selectedLeague.type);
  const recordResult = useRecordTournamentResult();
  const [localResults, setLocalResults] = useState<Record<string, MatchResult[]>>({});
  const [isSimulating, setIsSimulating] = useState(false);

  const currentResults = localResults[selectedLeague.type] || [];
  const teamNames = selectedLeague.teams.map(t => t.name);

  const handleSimulate = useCallback(async () => {
    setIsSimulating(true);
    const matches = generateRoundRobin(selectedLeague.teams);
    const results: MatchResult[] = [];

    for (const [t1, t2] of matches) {
      const result = simulateMatch(t1, t2, selectedLeague.overs);
      results.push(result);
      try {
        await recordResult.mutateAsync({
          tournamentType: selectedLeague.type,
          result: {
            winner: result.winner,
            runs: BigInt(0),
            wickets: BigInt(0),
            overs: BigInt(selectedLeague.overs),
            batFirst: result.team1,
            wonToss: result.team1,
            remainingBalls: BigInt(0),
            ballsPlayed: BigInt(selectedLeague.overs * 6),
          },
        });
      } catch {
        // continue
      }
    }

    setLocalResults(prev => ({ ...prev, [selectedLeague.type]: results }));
    setIsSimulating(false);
  }, [selectedLeague, recordResult]);

  const allResults = [...(savedResults || []), ...currentResults.map(r => ({
    winner: r.winner,
    runs: BigInt(0),
    wickets: BigInt(0),
    overs: BigInt(selectedLeague.overs),
    batFirst: r.team1,
    wonToss: r.team1,
    remainingBalls: BigInt(0),
    ballsPlayed: BigInt(selectedLeague.overs * 6),
  }))];

  const getChampion = (): string => {
    if (currentResults.length === 0) return '';
    const wins: Record<string, number> = {};
    selectedLeague.teams.forEach(t => { wins[t.name] = 0; });
    currentResults.forEach(r => { if (wins[r.winner] !== undefined) wins[r.winner]++; });
    return Object.entries(wins).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  };

  const champion = currentResults.length > 0 ? getChampion() : '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
          <Home className="w-8 h-8 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-gold tracking-wide">Domestic Cricket</h1>
          <p className="text-muted-foreground font-heading">3 Major Domestic Leagues</p>
        </div>
      </div>

      {/* League selector */}
      <div>
        <div className="text-sm font-heading text-muted-foreground mb-3 uppercase tracking-wider">Select League</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LEAGUES.map(league => (
            <button
              key={league.type}
              onClick={() => setSelectedLeague(league)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedLeague.type === league.type
                  ? 'border-gold bg-primary/10 glow-gold'
                  : 'border-border bg-secondary/30 hover:border-border/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{league.flag}</span>
                <div>
                  <div className="font-heading font-bold text-foreground text-sm">
                    {getTournamentLabel(league.type)}
                  </div>
                  <div className="text-xs text-muted-foreground">{league.country}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {league.format === MatchFormat.test ? 'Multi-Day' : `${league.overs} Overs`}
                </Badge>
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  {league.teams.length} Teams
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected league content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            {selectedLeague.flag} {getTournamentLabel(selectedLeague.type)}
          </h2>
          <Badge variant="outline" className="border-gold text-gold font-heading">
            {selectedLeague.format === MatchFormat.test ? 'Test Format' : `${selectedLeague.overs}-Over Format`}
          </Badge>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {selectedLeague.teams.map(team => (
            <div key={team.name} className="card-stadium rounded-lg p-2 text-center">
              <div className="text-lg mb-0.5">{team.flag}</div>
              <div className="font-heading font-bold text-foreground text-xs">{team.name}</div>
              <div className="text-xs text-muted-foreground">{team.code}</div>
            </div>
          ))}
        </div>

        {/* Simulate button */}
        {currentResults.length === 0 && (
          <Button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full h-12 gold-gradient text-background border-0 font-heading font-bold hover:opacity-90"
          >
            {isSimulating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating Season...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Simulate Season</>
            )}
          </Button>
        )}

        {/* Champion */}
        {champion && (
          <div className="card-stadium rounded-2xl p-5 text-center border-gold glow-gold">
            <Trophy className="w-10 h-10 text-gold mx-auto mb-2" />
            <h3 className="font-display text-2xl font-bold text-gold">
              🏆 {getTournamentLabel(selectedLeague.type)} Champions
            </h3>
            <p className="font-display text-xl text-foreground mt-1">{champion}</p>
          </div>
        )}

        {/* Points table */}
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl bg-secondary" />
        ) : (
          <TournamentPointsTable teams={teamNames} results={allResults} topN={2} />
        )}

        {/* Results */}
        {currentResults.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Match Results</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
              {currentResults.slice(-10).reverse().map((r, i) => (
                <div key={i} className="card-stadium rounded-lg p-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-heading text-foreground">{r.team1}</span>
                    <span className="text-muted-foreground text-xs ml-2">{r.score1}</span>
                  </div>
                  <Badge variant="outline" className="border-gold text-gold text-xs">{r.winner} won</Badge>
                  <div className="text-right">
                    <span className="text-muted-foreground text-xs mr-2">{r.score2}</span>
                    <span className="font-heading text-foreground">{r.team2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
