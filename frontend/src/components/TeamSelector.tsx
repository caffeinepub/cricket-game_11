import React from 'react';
import { TeamData } from '../lib/cricketData';

interface TeamSelectorProps {
  teams: TeamData[];
  selectedTeam: TeamData | null;
  onSelect: (team: TeamData) => void;
  label?: string;
  excludeTeam?: TeamData | null;
}

export default function TeamSelector({ teams, selectedTeam, onSelect, label, excludeTeam }: TeamSelectorProps) {
  const available = excludeTeam ? teams.filter(t => t.name !== excludeTeam.name) : teams;

  return (
    <div>
      {label && <div className="text-sm font-heading text-muted-foreground mb-2 uppercase tracking-wider">{label}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {available.map((team) => (
          <button
            key={team.name}
            onClick={() => onSelect(team)}
            className={`p-3 rounded-xl border text-left transition-all duration-150 ${
              selectedTeam?.name === team.name
                ? 'border-gold bg-primary/10 glow-gold'
                : 'border-border bg-secondary/30 hover:border-border/80 hover:bg-secondary/50'
            }`}
          >
            <div className="text-xl mb-1">{team.flag}</div>
            <div className="font-heading font-bold text-foreground text-sm leading-tight">{team.name}</div>
            <div className="text-xs text-muted-foreground">{team.code}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
