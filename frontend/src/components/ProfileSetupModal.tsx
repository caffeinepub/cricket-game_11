import React, { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile({ name: name.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏏</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Welcome, Cricketer!
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Set up your player profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              autoFocus
              maxLength={50}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Start Playing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
