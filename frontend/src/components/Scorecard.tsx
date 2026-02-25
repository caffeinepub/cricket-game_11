import React from 'react';
import { InningsState } from '../lib/matchSimulator';
import { Badge } from '@/components/ui/badge';

interface ScorecardProps {
  team1: string;
  team2: string;
  innings: InningsState;
  inningsNum: number;
  totalOvers: number;
  target?: number;
}

export default function Scorecard({ team1, team2, innings, inningsNum, totalOvers, target }: ScorecardProps) {
  const battingTeam = inningsNum === 1 ? team1 : team2;
  const bowlingTeam = inningsNum === 1 ? team2 : team1;
  const overs = Math.floor(innings.balls / 6);
  const balls = innings.balls % 6;
  const runRate = innings.balls > 0 ? ((innings.runs / innings.balls) * 6).toFixed(2) : '0.00';

  return (
    <div className="card-stadium rounded-xl p-4 space-y-3">
      {/* Main score */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-lg font-bold text-foreground">{battingTeam}</span>
            <Badge variant="outline" className="text-xs border-gold text-gold">Batting</Badge>
          </div>
          <div className="font-display text-4xl font-bold text-gold">
            {innings.runs}/{innings.wickets}
          </div>
          <div className="text-muted-foreground text-sm font-heading">
            {overs}.{balls} overs • RR: {runRate}
          </div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-sm font-heading">{bowlingTeam}</div>
          <div className="text-muted-foreground text-sm">Bowling</div>
          {target && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Target</div>
              <div className="font-display text-xl font-bold text-foreground">{target}</div>
              <div className="text-xs text-muted-foreground">
                Need {Math.max(0, target - innings.runs)} from {(totalOvers * 6) - innings.balls} balls
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current batsmen */}
      <div className="border-t border-border pt-3">
        <div className="text-xs text-muted-foreground font-heading mb-2 uppercase tracking-wider">Batting</div>
        <div className="space-y-1">
          {innings.currentBatsmen.map((idx, i) => {
            const batsman = innings.batsmen[idx];
            if (!batsman) return null;
            return (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-gold' : 'bg-muted-foreground'}`} />
                  <span className="font-heading text-foreground">{batsman.name}</span>
                  {i === 0 && <span className="text-xs text-gold">*</span>}
                </div>
                <span className="font-heading font-bold text-foreground">
                  {batsman.runs} <span className="text-muted-foreground font-normal">({batsman.balls})</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current bowler */}
      {innings.bowlers[innings.currentBowler] && (
        <div className="border-t border-border pt-3">
          <div className="text-xs text-muted-foreground font-heading mb-2 uppercase tracking-wider">Bowling</div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-heading text-foreground">{innings.bowlers[innings.currentBowler].name}</span>
            <span className="font-heading text-muted-foreground">
              {innings.bowlers[innings.currentBowler].overs}-{innings.bowlers[innings.currentBowler].runs}-{innings.bowlers[innings.currentBowler].wickets}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
