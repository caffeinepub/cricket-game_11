import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  badge?: string;
  color?: string;
}

export default function DashboardCard({ title, description, icon, to, badge, color }: DashboardCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to })}
      className="card-stadium rounded-2xl p-6 text-left hover:border-gold/50 hover:glow-gold transition-all duration-200 group w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: color ? `${color}20` : undefined, border: `1px solid ${color || 'oklch(0.30 0.06 145)'}` }}
        >
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-heading font-bold px-2 py-1 rounded-full gold-gradient text-background">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex items-center text-gold text-sm font-heading font-semibold">
        Play Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
