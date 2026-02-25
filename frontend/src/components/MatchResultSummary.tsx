import React from 'react';
import { MatchFormat } from '../backend';
import { InningsState } from '../lib/matchSimulator';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';
import { getFormatLabel } from '../lib/cricketData';

interface MatchResultSummaryProps {
  team1: string;
  team2: string;
  innings1: InningsState;
  innings2: InningsState;
  winner: string;
  winMargin: string;
  format: MatchFormat;
  onPlayAgain: () => void;
  onGoBack: () => void;
}

export default function MatchResultSummary({
  team1, team2, innings1, innings2, winner, winMargin, format, onPlayAgain, onGoBack
}: MatchResultSummaryProps) {
  return (
    <div className="card-stadium rounded-2xl p-6 text-center space-y-6">
      {/* Winner banner */}
      <div className="space-y-2">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center glow-gold">
            <Trophy className="w-10 h-10 text-background" />
          </div>
        </div>
        <h2 className="font-display text-3xl font-bold text-gold tracking-wide">{winner} WIN!</h2>
        <p className="font-heading text-lg text-foreground">{winMargin}</p>
        <p className="text-muted-foreground text-sm">{getFormatLabel(format)} Match</p>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { team: team1, innings: innings1 },
          { team: team2, innings: innings2 },
        ].map(({ team, innings }) => (
          <div key={team} className={`rounded-xl p-4 border ${team === winner ? 'border-gold bg-primary/10' : 'border-border bg-secondary/30'}`}>
            <div className="font-heading font-bold text-foreground text-sm mb-1">{team}</div>
            <div className="font-display text-2xl font-bold text-gold">
              {innings.runs}/{innings.wickets}
            </div>
            <div className="text-muted-foreground text-xs">
              {Math.floor(innings.balls / 6)}.{innings.balls % 6} overs
            </div>
          </div>
        ))}
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="bg-secondary/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground font-heading mb-2 uppercase">Top Scorer</div>
          {(() => {
            const allBatsmen = [
              ...innings1.batsmen.map(b => ({ ...b, team: team1 })),
              ...innings2.batsmen.map(b => ({ ...b, team: team2 })),
            ].sort((a, b) => b.runs - a.runs)[0];
            return allBatsmen ? (
              <div>
                <div className="font-heading font-bold text-foreground text-sm">{allBatsmen.name}</div>
                <div className="text-gold font-bold">{allBatsmen.runs} <span className="text-muted-foreground font-normal text-xs">({allBatsmen.balls})</span></div>
                <div className="text-xs text-muted-foreground">{allBatsmen.team}</div>
              </div>
            ) : null;
          })()}
        </div>
        <div className="bg-secondary/30 rounded-xl p-3">
          <div className="text-xs text-muted-foreground font-heading mb-2 uppercase">Best Bowler</div>
          {(() => {
            const allBowlers = [
              ...innings1.bowlers.map(b => ({ ...b, team: team2 })),
              ...innings2.bowlers.map(b => ({ ...b, team: team1 })),
            ].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)[0];
            return allBowlers ? (
              <div>
                <div className="font-heading font-bold text-foreground text-sm">{allBowlers.name}</div>
                <div className="text-gold font-bold">{allBowlers.wickets}/<span>{allBowlers.runs}</span></div>
                <div className="text-xs text-muted-foreground">{allBowlers.team}</div>
              </div>
            ) : null;
          })()}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onGoBack} variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={onPlayAgain} className="flex-1 gold-gradient text-background border-0 font-heading font-bold hover:opacity-90">
          Play Again
        </Button>
      </div>
    </div>
  );
}
