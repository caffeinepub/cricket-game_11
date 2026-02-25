import React, { useEffect, useRef } from 'react';
import { BallEvent } from '../lib/matchSimulator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CommentaryFeedProps {
  events: BallEvent[];
}

export default function CommentaryFeed({ events }: CommentaryFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  const recentEvents = [...events].reverse().slice(0, 20);

  return (
    <div className="card-stadium rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-display text-lg font-bold text-gold tracking-wide">Commentary</h3>
      </div>
      <ScrollArea className="h-64">
        <div className="p-3 space-y-2">
          {recentEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Match hasn't started yet...</p>
          ) : (
            recentEvents.map((event, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2 rounded-lg text-sm animate-slide-in ${
                  event.isWicket ? 'bg-destructive/10 border border-destructive/30' :
                  event.runs === 6 ? 'bg-primary/10 border border-primary/30' :
                  event.runs === 4 ? 'bg-green-500/10 border border-green-500/30' :
                  'bg-secondary/50'
                }`}
              >
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs font-mono ${
                    event.isWicket ? 'border-destructive text-destructive' :
                    event.runs === 6 ? 'border-primary text-primary' :
                    event.runs === 4 ? 'border-green-400 text-green-400' :
                    'border-border text-muted-foreground'
                  }`}
                >
                  {event.over}.{event.ball}
                </Badge>
                <span className={`font-heading ${
                  event.isWicket ? 'text-destructive font-bold' :
                  event.runs >= 4 ? 'text-foreground font-semibold' :
                  'text-muted-foreground'
                }`}>
                  {event.commentary}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
