import React, { useState, useCallback } from 'react';
import { TournamentType, MatchFormat } from '../backend';
import { IPL_TEAMS, TeamData } from '../lib/cricketData';
import { simulateFullInnings } from '../lib/matchSimulator';
import { useGetTournamentMatches, useRecordTournamentResult } from '../hooks/useQueries';
import TournamentPointsTable from '../components/TournamentPointsTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Play, Loader2, ChevronRight } from 'lucide-react';

interface MatchResult {
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  winner: string;
}

function simulateT20Match(team1: TeamData, team2: TeamData): MatchResult {
  const squad1 = team1.players.map(p => p.name);
  const squad2 = team2.players.map(p => p.name);
  const battingRatings1 = team1.players.map(p => p.battingRating);
  const bowlingRatings1 = team1.players.map(p => p.bowlingRating);
  const battingRatings2 = team2.players.map(p => p.battingRating);
  const bowlingRatings2 = team2.players.map(p => p.bowlingRating);

  const innings1 = simulateFullInnings(squad1, squad2, 20, null, battingRatings1, bowlingRatings2);
  const target = innings1.runs + 1;
  const innings2 = simulateFullInnings(squad2, squad1, 20, target, battingRatings2, bowlingRatings1);

  let winner: string;
  if (innings2.runs >= target) {
    winner = team2.name;
  } else {
    winner = team1.name;
  }

  return {
    team1: team1.name,
    team2: team2.name,
    score1: `${innings1.runs}/${innings1.wickets} (${Math.floor(innings1.balls / 6)}.${innings1.balls % 6})`,
    score2: `${innings2.runs}/${innings2.wickets} (${Math.floor(innings2.balls / 6)}.${innings2.balls % 6})`,
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

export default function IPLTournament() {
  const { data: savedResults, isLoading } = useGetTournamentMatches(TournamentType.ipl);
  const recordResult = useRecordTournamentResult();
  const [localResults, setLocalResults] = useState<MatchResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [phase, setPhase] = useState<'group' | 'knockout'>('group');
  const [knockoutResults, setKnockoutResults] = useState<{ round: string; result: MatchResult }[]>([]);
  const [champion, setChampion] = useState<string>('');

  const teamNames = IPL_TEAMS.map(t => t.name);

  const handleSimulateGroupStage = useCallback(async () => {
    setIsSimulating(true);
    const matches = generateRoundRobin(IPL_TEAMS);
    const results: MatchResult[] = [];

    for (const [t1, t2] of matches) {
      const result = simulateT20Match(t1, t2);
      results.push(result);
      try {
        await recordResult.mutateAsync({
          tournamentType: TournamentType.ipl,
          result: {
            winner: result.winner,
            runs: BigInt(0),
            wickets: BigInt(0),
            overs: BigInt(20),
            batFirst: result.team1,
            wonToss: result.team1,
            remainingBalls: BigInt(0),
            ballsPlayed: BigInt(120),
          },
        });
      } catch {
        // continue
      }
    }

    setLocalResults(results);
    setIsSimulating(false);
  }, [recordResult]);

  const getTopTeams = useCallback((n: number): TeamData[] => {
    const allResults = [...localResults];
    const wins: Record<string, number> = {};
    IPL_TEAMS.forEach(t => { wins[t.name] = 0; });
    allResults.forEach(r => { if (wins[r.winner] !== undefined) wins[r.winner]++; });
    return [...IPL_TEAMS].sort((a, b) => (wins[b.name] || 0) - (wins[a.name] || 0)).slice(0, n);
  }, [localResults]);

  const handleSimulateKnockout = useCallback(() => {
    const top4 = getTopTeams(4);
    const kResults: { round: string; result: MatchResult }[] = [];

    const q1 = simulateT20Match(top4[0], top4[1]);
    kResults.push({ round: 'Qualifier 1', result: q1 });

    const elim = simulateT20Match(top4[2], top4[3]);
    kResults.push({ round: 'Eliminator', result: elim });

    const q1Loser = q1.winner === top4[0].name ? top4[1] : top4[0];
    const elimWinner = IPL_TEAMS.find(t => t.name === elim.winner)!;
    const q2 = simulateT20Match(q1Loser, elimWinner);
    kResults.push({ round: 'Qualifier 2', result: q2 });

    const finalist1 = IPL_TEAMS.find(t => t.name === q1.winner)!;
    const finalist2 = IPL_TEAMS.find(t => t.name === q2.winner)!;
    const final = simulateT20Match(finalist1, finalist2);
    kResults.push({ round: 'Final', result: final });

    setKnockoutResults(kResults);
    setChampion(final.winner);
    setPhase('knockout');
  }, [getTopTeams]);

  const allResults = [...(savedResults || []), ...localResults.map(r => ({
    winner: r.winner,
    runs: BigInt(0),
    wickets: BigInt(0),
    overs: BigInt(20),
    batFirst: r.team1,
    wonToss: r.team1,
    remainingBalls: BigInt(0),
    ballsPlayed: BigInt(120),
  }))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img src="/assets/generated/ipl-trophy.dim_256x256.png" alt="IPL" className="w-16 h-16 object-contain" />
        <div>
          <h1 className="font-display text-3xl font-bold text-gold tracking-wide">Indian Premier League</h1>
          <p className="text-muted-foreground font-heading">T20 Tournament • 10 Teams</p>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2">
        {(['group', 'knockout'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`px-4 py-2 rounded-lg font-heading font-semibold text-sm transition-all ${
              phase === p ? 'gold-gradient text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {p === 'group' ? 'Group Stage' : 'Knockout'}
          </button>
        ))}
      </div>

      {phase === 'group' && (
        <div className="space-y-6">
          {/* Teams grid */}
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Teams</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {IPL_TEAMS.map(team => (
                <div key={team.name} className="card-stadium rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{team.flag}</div>
                  <div className="font-heading font-bold text-foreground text-xs leading-tight">{team.name}</div>
                  <div className="text-xs text-muted-foreground">{team.code}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulate button */}
          {localResults.length === 0 && (
            <Button
              onClick={handleSimulateGroupStage}
              disabled={isSimulating}
              className="w-full h-12 gold-gradient text-background border-0 font-heading font-bold hover:opacity-90"
            >
              {isSimulating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating Group Stage...</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Simulate Group Stage</>
              )}
            </Button>
          )}

          {/* Points table */}
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl bg-secondary" />
          ) : (
            <TournamentPointsTable teams={teamNames} results={allResults} topN={4} />
          )}

          {/* Recent results */}
          {localResults.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Match Results</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                {localResults.slice(-10).reverse().map((r, i) => (
                  <div key={i} className="card-stadium rounded-lg p-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-foreground">{r.team1}</span>
                      <span className="text-muted-foreground text-xs">{r.score1}</span>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline" className="border-gold text-gold text-xs">{r.winner} won</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-muted-foreground text-xs">{r.score2}</span>
                      <span className="font-heading text-foreground">{r.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proceed to knockout */}
          {localResults.length > 0 && knockoutResults.length === 0 && (
            <Button
              onClick={handleSimulateKnockout}
              className="w-full h-12 bg-secondary border border-gold text-gold font-heading font-bold hover:bg-secondary/80"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Simulate Knockout Rounds
            </Button>
          )}
        </div>
      )}

      {phase === 'knockout' && (
        <div className="space-y-6">
          {knockoutResults.length === 0 ? (
            <div className="card-stadium rounded-xl p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-heading">Complete the group stage first to unlock knockout rounds.</p>
              <Button onClick={() => setPhase('group')} variant="outline" className="mt-4 border-border text-foreground">
                Go to Group Stage
              </Button>
            </div>
          ) : (
            <>
              {champion && (
                <div className="card-stadium rounded-2xl p-6 text-center border-gold glow-gold">
                  <Trophy className="w-12 h-12 text-gold mx-auto mb-2" />
                  <h2 className="font-display text-3xl font-bold text-gold">🏆 IPL Champions</h2>
                  <p className="font-display text-2xl text-foreground mt-1">{champion}</p>
                </div>
              )}
              <div className="space-y-3">
                {knockoutResults.map(({ round, result }) => (
                  <div key={round} className="card-stadium rounded-xl p-4">
                    <div className="text-xs text-muted-foreground font-heading uppercase tracking-wider mb-2">{round}</div>
                    <div className="flex items-center justify-between">
                      <div className={`font-heading font-bold ${result.winner === result.team1 ? 'text-gold' : 'text-muted-foreground'}`}>
                        {result.team1}
                        <div className="text-xs font-normal text-muted-foreground">{result.score1}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">vs</div>
                        <Badge variant="outline" className="border-gold text-gold text-xs mt-1">{result.winner} won</Badge>
                      </div>
                      <div className={`font-heading font-bold text-right ${result.winner === result.team2 ? 'text-gold' : 'text-muted-foreground'}`}>
                        {result.team2}
                        <div className="text-xs font-normal text-muted-foreground">{result.score2}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
