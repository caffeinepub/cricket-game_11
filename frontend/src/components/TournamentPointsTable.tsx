import React from 'react';
import { MatchResult } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TeamStanding {
  name: string;
  played: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
}

interface TournamentPointsTableProps {
  teams: string[];
  results: MatchResult[];
  topN?: number;
}

function computeStandings(teams: string[], results: MatchResult[]): TeamStanding[] {
  const standings: Record<string, TeamStanding> = {};
  teams.forEach(t => {
    standings[t] = { name: t, played: 0, won: 0, lost: 0, nrr: 0, points: 0 };
  });

  results.forEach(r => {
    const winner = r.winner;
    const loser = r.batFirst === winner ? (results.find(x => x.batFirst !== winner)?.batFirst || '') : r.batFirst;

    if (standings[winner]) {
      standings[winner].played++;
      standings[winner].won++;
      standings[winner].points += 2;
      standings[winner].nrr += 0.5;
    }
    if (loser && standings[loser]) {
      standings[loser].played++;
      standings[loser].lost++;
      standings[loser].nrr -= 0.3;
    }
  });

  return Object.values(standings).sort((a, b) => b.points - a.points || b.nrr - a.nrr);
}

export default function TournamentPointsTable({ teams, results, topN }: TournamentPointsTableProps) {
  const standings = computeStandings(teams, results);

  return (
    <div className="card-stadium rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-display text-lg font-bold text-gold tracking-wide">Points Table</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-heading w-8">#</TableHead>
            <TableHead className="text-muted-foreground font-heading">Team</TableHead>
            <TableHead className="text-muted-foreground font-heading text-center">P</TableHead>
            <TableHead className="text-muted-foreground font-heading text-center">W</TableHead>
            <TableHead className="text-muted-foreground font-heading text-center">L</TableHead>
            <TableHead className="text-muted-foreground font-heading text-center">NRR</TableHead>
            <TableHead className="text-muted-foreground font-heading text-center">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team, idx) => (
            <TableRow
              key={team.name}
              className={`border-border hover:bg-secondary/50 ${topN && idx < topN ? 'bg-primary/5' : ''}`}
            >
              <TableCell className="font-heading text-muted-foreground">
                {topN && idx < topN ? (
                  <span className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center text-background text-xs font-bold">
                    {idx + 1}
                  </span>
                ) : (
                  idx + 1
                )}
              </TableCell>
              <TableCell className="font-heading font-semibold text-foreground">
                {team.name}
                {topN && idx < topN && (
                  <Badge variant="outline" className="ml-2 text-xs border-primary text-primary">Q</Badge>
                )}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">{team.played}</TableCell>
              <TableCell className="text-center text-green-400 font-bold">{team.won}</TableCell>
              <TableCell className="text-center text-red-400">{team.lost}</TableCell>
              <TableCell className="text-center text-muted-foreground">
                {team.nrr >= 0 ? '+' : ''}{team.nrr.toFixed(2)}
              </TableCell>
              <TableCell className="text-center font-bold text-gold">{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
