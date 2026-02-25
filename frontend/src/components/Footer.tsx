import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const appId = encodeURIComponent(window.location.hostname || 'cricket-premier');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/assets/generated/cricket-ball-icon.dim_128x128.png" alt="Cricket" className="w-5 h-5" />
          <span className="font-display text-sm text-gold tracking-wider">CRICKET PREMIER</span>
        </div>
        <p className="text-muted-foreground text-xs text-center">
          © {year} Cricket Premier. All rights reserved.
        </p>
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
