import React, { useState, useCallback, useRef } from 'react';
import { MatchFormat } from '../backend';
import { INTERNATIONAL_TEAMS, TeamData, getFormatLabel, getFormatOvers } from '../lib/cricketData';
import {
  createInitialInnings,
  InningsState,
  simulateBall,
  generateCommentary,
  BallEvent,
} from '../lib/matchSimulator';
import { useCreateMatch } from '../hooks/useQueries';
import TeamSelector from '../components/TeamSelector';
import Scorecard from '../components/Scorecard';
import CommentaryFeed from '../components/CommentaryFeed';
import MatchResultSummary from '../components/MatchResultSummary';
import CricketStadium3D, { BallEventInfo } from '../components/CricketStadium3D';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, FastForward, ChevronLeft } from 'lucide-react';

type GamePhase = 'setup' | 'playing' | 'result';

interface LiveMatchState {
  team1: string;
  team2: string;
  team1Players: string[];
  team2Players: string[];
  team1BattingRatings: number[];
  team2BattingRatings: number[];
  team1BowlingRatings: number[];
  team2BowlingRatings: number[];
  team1Color: string;
  team2Color: string;
  format: MatchFormat;
  totalOvers: number;
  innings: number;
  innings1: InningsState;
  innings2: InningsState;
  target: number;
  isComplete: boolean;
  winner: string;
  winMargin: string;
  nextBatsman1: number;
  nextBatsman2: number;
  currentBowlerIdx1: number;
  currentBowlerIdx2: number;
}

export default function InternationalMatch() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [team1, setTeam1] = useState<TeamData | null>(null);
  const [team2, setTeam2] = useState<TeamData | null>(null);
  const [format, setFormat] = useState<MatchFormat>(MatchFormat.t20);
  const [matchState, setMatchState] = useState<LiveMatchState | null>(null);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [lastBallEvent, setLastBallEvent] = useState<BallEventInfo | null>(null);
  const ballEventCounterRef = useRef(0);
  const autoRef = useRef(false);
  const createMatch = useCreateMatch();

  const startMatch = useCallback(() => {
    if (!team1 || !team2) return;
    const totalOvers = getFormatOvers(format);
    const toss = Math.random() < 0.5 ? team1.name : team2.name;
    const batFirst = toss;
    const battingTeam = batFirst === team1.name ? team1 : team2;
    const bowlingTeam = batFirst === team1.name ? team2 : team1;

    const state: LiveMatchState = {
      team1: battingTeam.name,
      team2: bowlingTeam.name,
      team1Players: battingTeam.players.map(p => p.name),
      team2Players: bowlingTeam.players.map(p => p.name),
      team1BattingRatings: battingTeam.players.map(p => p.battingRating),
      team2BattingRatings: bowlingTeam.players.map(p => p.battingRating),
      team1BowlingRatings: battingTeam.players.map(p => p.bowlingRating),
      team2BowlingRatings: bowlingTeam.players.map(p => p.bowlingRating),
      team1Color: battingTeam.color || '#cc2222',
      team2Color: bowlingTeam.color || '#2244cc',
      format,
      totalOvers,
      innings: 1,
      innings1: createInitialInnings(battingTeam.players.map(p => p.name), bowlingTeam.players.map(p => p.name)),
      innings2: createInitialInnings(bowlingTeam.players.map(p => p.name), battingTeam.players.map(p => p.name)),
      target: 0,
      isComplete: false,
      winner: '',
      winMargin: '',
      nextBatsman1: 2,
      nextBatsman2: 2,
      currentBowlerIdx1: 0,
      currentBowlerIdx2: 0,
    };
    setMatchState(state);
    setPhase('playing');
  }, [team1, team2, format]);

  const simulateOneBall = useCallback((state: LiveMatchState): { newState: LiveMatchState; ballResult: { runs: number; isWicket: boolean } | null } => {
    if (state.isComplete) return { newState: state, ballResult: null };

    const isInnings1 = state.innings === 1;
    const currentInnings = isInnings1 ? { ...state.innings1 } : { ...state.innings2 };
    const battingRatings = isInnings1 ? state.team1BattingRatings : state.team2BattingRatings;
    const bowlingRatings = isInnings1 ? state.team2BowlingRatings : state.team1BowlingRatings;
    const battingPlayers = isInnings1 ? state.team1Players : state.team2Players;
    const bowlingPlayers = isInnings1 ? state.team2Players : state.team1Players;
    const maxBalls = state.totalOvers * 6;
    const target = isInnings1 ? null : state.target;

    // Check if innings is over
    if (currentInnings.balls >= maxBalls || currentInnings.wickets >= 10 || (target !== null && currentInnings.runs >= target)) {
      if (isInnings1) {
        const newTarget = currentInnings.runs + 1;
        const newState = { ...state, innings: 2, target: newTarget, innings1: currentInnings };
        return { newState, ballResult: null };
      } else {
        let winner = '';
        let winMargin = '';
        if (currentInnings.runs >= state.target) {
          winner = state.team2;
          const wicketsLeft = 10 - currentInnings.wickets;
          winMargin = `${winner} won by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`;
        } else {
          winner = state.team1;
          const runDiff = state.innings1.runs - currentInnings.runs;
          winMargin = `${winner} won by ${runDiff} run${runDiff !== 1 ? 's' : ''}`;
        }
        return { newState: { ...state, innings2: currentInnings, isComplete: true, winner, winMargin }, ballResult: null };
      }
    }

    const batsmanIdx = currentInnings.currentBatsmen[0];
    const bowlerSlotIdx = isInnings1 ? state.currentBowlerIdx1 : state.currentBowlerIdx2;
    const actualBowlerIdx = 5 + (bowlerSlotIdx % Math.min(5, bowlingPlayers.length - 5));

    const battingRating = battingRatings[batsmanIdx] ?? 65;
    const bowlingRating = bowlingRatings[actualBowlerIdx] ?? 65;
    const oversLeft = (maxBalls - currentInnings.balls) / 6;

    const result = simulateBall(battingRating, bowlingRating, currentInnings.wickets, oversLeft, target, currentInnings.runs);
    const batsman = battingPlayers[batsmanIdx] ?? `Batsman ${batsmanIdx + 1}`;
    const bowler = bowlingPlayers[actualBowlerIdx] ?? `Bowler ${bowlerSlotIdx + 1}`;
    const commentary = generateCommentary(result, batsman, bowler);
    const currentOver = Math.floor(currentInnings.balls / 6);
    const currentBall = currentInnings.balls % 6;

    const newEvent: BallEvent = {
      ball: currentBall + 1,
      over: currentOver,
      runs: result.runs,
      isWicket: result.isWicket,
      isExtra: result.isExtra,
      extraType: result.extraType,
      commentary,
      batsman,
      bowler,
    };

    const updatedInnings = { ...currentInnings };
    updatedInnings.ballEvents = [...currentInnings.ballEvents, newEvent];

    if (!result.isExtra) {
      updatedInnings.balls = currentInnings.balls + 1;
    }
    updatedInnings.runs = currentInnings.runs + result.runs;

    const updatedBatsmen = currentInnings.batsmen.map(b => ({ ...b }));
    if (!result.isExtra) {
      updatedBatsmen[batsmanIdx] = {
        ...updatedBatsmen[batsmanIdx],
        runs: updatedBatsmen[batsmanIdx].runs + result.runs,
        balls: updatedBatsmen[batsmanIdx].balls + 1,
      };
    }

    let nextBatsman = isInnings1 ? state.nextBatsman1 : state.nextBatsman2;
    if (result.isWicket) {
      updatedBatsmen[batsmanIdx] = { ...updatedBatsmen[batsmanIdx], isOut: true };
      updatedInnings.wickets = currentInnings.wickets + 1;
      if (nextBatsman < battingPlayers.length) {
        updatedInnings.currentBatsmen = [nextBatsman, currentInnings.currentBatsmen[1]];
        nextBatsman++;
      }
    }
    updatedInnings.batsmen = updatedBatsmen;

    let currentBatsmen = [...updatedInnings.currentBatsmen] as [number, number];
    if (!result.isExtra && result.runs % 2 === 1) {
      currentBatsmen = [currentBatsmen[1], currentBatsmen[0]];
    }

    let newBowlerIdx = isInnings1 ? state.currentBowlerIdx1 : state.currentBowlerIdx2;
    if (!result.isExtra && updatedInnings.balls % 6 === 0 && updatedInnings.balls > 0) {
      updatedInnings.overs = Math.floor(updatedInnings.balls / 6);
      currentBatsmen = [currentBatsmen[1], currentBatsmen[0]];
      newBowlerIdx = (newBowlerIdx + 1) % Math.min(5, bowlingPlayers.length - 5);
    }
    updatedInnings.currentBatsmen = currentBatsmen;

    const newState = { ...state };
    if (isInnings1) {
      newState.innings1 = updatedInnings;
      newState.nextBatsman1 = nextBatsman;
      newState.currentBowlerIdx1 = newBowlerIdx;
    } else {
      newState.innings2 = updatedInnings;
      newState.nextBatsman2 = nextBatsman;
      newState.currentBowlerIdx2 = newBowlerIdx;
    }
    return { newState, ballResult: { runs: result.runs, isWicket: result.isWicket } };
  }, []);

  const fireBallEvent = useCallback((runs: number, isWicket: boolean) => {
    ballEventCounterRef.current += 1;
    setLastBallEvent({
      runs,
      isWicket,
      isSix: runs === 6,
      isFour: runs === 4,
      id: ballEventCounterRef.current,
    });
  }, []);

  const handleNextBall = useCallback(() => {
    if (!matchState) return;
    const { newState, ballResult } = simulateOneBall(matchState);
    setMatchState(newState);
    if (ballResult) {
      fireBallEvent(ballResult.runs, ballResult.isWicket);
    }
    if (newState.isComplete) {
      saveMatchResult(newState);
    }
  }, [matchState, simulateOneBall]);

  const handleAutoSimulate = useCallback(async () => {
    if (!matchState || isAutoSimulating) return;
    setIsAutoSimulating(true);
    autoRef.current = true;

    let current = matchState;
    const simulate = () => {
      if (!autoRef.current || current.isComplete) {
        setIsAutoSimulating(false);
        autoRef.current = false;
        if (current.isComplete) saveMatchResult(current);
        return;
      }
      const { newState, ballResult } = simulateOneBall(current);
      current = newState;
      setMatchState({ ...current });
      if (ballResult) {
        fireBallEvent(ballResult.runs, ballResult.isWicket);
      }
      setTimeout(simulate, 120);
    };
    simulate();
  }, [matchState, isAutoSimulating, simulateOneBall]);

  const stopAuto = useCallback(() => {
    autoRef.current = false;
    setIsAutoSimulating(false);
  }, []);

  const saveMatchResult = useCallback(async (state: LiveMatchState) => {
    try {
      await createMatch.mutateAsync({
        format: state.format,
        isOver: true,
        totalOvers: BigInt(state.totalOvers),
        currentOver: BigInt(Math.floor(state.innings2.balls / 6)),
        runsScored: BigInt(state.innings2.runs),
        wicketsLost: BigInt(state.innings2.wickets),
        result: {
          winner: state.winner,
          runs: BigInt(state.innings1.runs),
          wickets: BigInt(state.innings1.wickets),
          overs: BigInt(Math.floor(state.innings1.balls / 6)),
          batFirst: state.team1,
          wonToss: state.team1,
          remainingBalls: BigInt(Math.max(0, state.totalOvers * 6 - state.innings2.balls)),
          ballsPlayed: BigInt(state.innings2.balls),
        },
      });
    } catch {
      // silently fail - match result display still works
    }
  }, [createMatch]);

  const handleReset = useCallback(() => {
    autoRef.current = false;
    setIsAutoSimulating(false);
    setMatchState(null);
    setLastBallEvent(null);
    setPhase('setup');
  }, []);

  if (phase === 'result' && matchState) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <MatchResultSummary
          team1={matchState.team1}
          team2={matchState.team2}
          innings1={matchState.innings1}
          innings2={matchState.innings2}
          winner={matchState.winner}
          winMargin={matchState.winMargin}
          format={matchState.format}
          onPlayAgain={handleReset}
          onGoBack={handleReset}
        />
      </div>
    );
  }

  if (phase === 'playing' && matchState) {
    const isInnings1 = matchState.innings === 1;
    const currentInnings = isInnings1 ? matchState.innings1 : matchState.innings2;
    const target = isInnings1 ? undefined : matchState.target;
    const currentOvers = Math.floor(currentInnings.balls / 6);
    const runRate = currentInnings.balls > 0 ? (currentInnings.runs / (currentInnings.balls / 6)) : 0;

    if (matchState.isComplete) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <MatchResultSummary
            team1={matchState.team1}
            team2={matchState.team2}
            innings1={matchState.innings1}
            innings2={matchState.innings2}
            winner={matchState.winner}
            winMargin={matchState.winMargin}
            format={matchState.format}
            onPlayAgain={handleReset}
            onGoBack={handleReset}
          />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={handleReset} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm font-heading">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-gold text-gold font-heading">
              {getFormatLabel(matchState.format)}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground font-heading">
              Innings {matchState.innings}
            </Badge>
          </div>
        </div>

        {/* 3D Stadium View */}
        <div className="relative">
          <CricketStadium3D
            ballEvent={lastBallEvent}
            wickets={currentInnings.wickets}
            overs={currentOvers}
            runRate={runRate}
            format={matchState.format}
            team1Color={matchState.team1Color}
            team2Color={matchState.team2Color}
          />
          {/* Team labels overlay */}
          <div className="absolute top-2 left-3 right-3 flex justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: matchState.team1Color }}
              />
              <span className="text-xs font-heading text-white font-bold">{matchState.team1}</span>
              <span className="text-xs font-heading text-yellow-300 ml-1">
                {currentInnings.runs}/{currentInnings.wickets}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-xs font-heading text-white font-bold">{matchState.team2}</span>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: matchState.team2Color }}
              />
            </div>
          </div>
          {/* Over counter overlay */}
          <div className="absolute bottom-2 right-3 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-xs font-heading text-white/80">
                Over {currentOvers}.{currentInnings.balls % 6} / {matchState.totalOvers}
              </span>
            </div>
          </div>
        </div>

        {/* Scorecard */}
        <Scorecard
          team1={matchState.team1}
          team2={matchState.team2}
          innings={currentInnings}
          inningsNum={matchState.innings}
          totalOvers={matchState.totalOvers}
          target={target}
        />

        {/* Controls */}
        <div className="flex gap-3">
          {isAutoSimulating ? (
            <Button onClick={stopAuto} variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
              Stop Auto
            </Button>
          ) : (
            <>
              <Button onClick={handleNextBall} className="flex-1 gold-gradient text-background border-0 font-heading font-bold hover:opacity-90">
                <Play className="w-4 h-4 mr-2" />
                Next Ball
              </Button>
              <Button onClick={handleAutoSimulate} variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary font-heading">
                <FastForward className="w-4 h-4 mr-2" />
                Auto Simulate
              </Button>
            </>
          )}
        </div>

        {/* Commentary */}
        <CommentaryFeed events={currentInnings.ballEvents} />

        {/* Previous innings score */}
        {matchState.innings === 2 && (
          <div className="card-stadium rounded-xl p-3 flex items-center justify-between">
            <span className="font-heading text-muted-foreground text-sm">{matchState.team1} (1st innings)</span>
            <span className="font-display font-bold text-gold">
              {matchState.innings1.runs}/{matchState.innings1.wickets}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Setup phase
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gold tracking-wide mb-1">International Cricket</h1>
        <p className="text-muted-foreground font-heading">Select two teams and a format to start a match</p>
      </div>

      {/* Format selector */}
      <div>
        <div className="text-sm font-heading text-muted-foreground mb-3 uppercase tracking-wider">Match Format</div>
        <div className="flex gap-3">
          {([MatchFormat.t20, MatchFormat.odi, MatchFormat.test] as MatchFormat[]).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-6 py-3 rounded-xl border font-heading font-bold transition-all ${
                format === f
                  ? 'border-gold gold-gradient text-background glow-gold'
                  : 'border-border bg-secondary/30 text-foreground hover:border-border/80'
              }`}
            >
              {getFormatLabel(f)}
              <div className="text-xs font-normal opacity-70">{getFormatOvers(f)} overs</div>
            </button>
          ))}
        </div>
      </div>

      {/* Team selectors */}
      <div className="space-y-6">
        <TeamSelector
          teams={INTERNATIONAL_TEAMS}
          selectedTeam={team1}
          onSelect={setTeam1}
          label="Team 1 (Batting First)"
          excludeTeam={team2}
        />
        <TeamSelector
          teams={INTERNATIONAL_TEAMS}
          selectedTeam={team2}
          onSelect={setTeam2}
          label="Team 2"
          excludeTeam={team1}
        />
      </div>

      {/* Match preview */}
      {team1 && team2 && (
        <div className="card-stadium rounded-xl p-4 flex items-center justify-between">
          <div className="text-center">
            <div className="text-3xl mb-1">{team1.flag}</div>
            <div className="font-display font-bold text-foreground">{team1.name}</div>
            <div className="text-xs text-muted-foreground">{team1.code}</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-gold">VS</div>
            <div className="text-xs text-muted-foreground mt-1">{getFormatLabel(format)}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">{team2.flag}</div>
            <div className="font-display font-bold text-foreground">{team2.name}</div>
            <div className="text-xs text-muted-foreground">{team2.code}</div>
          </div>
        </div>
      )}

      <Button
        onClick={startMatch}
        disabled={!team1 || !team2 || createMatch.isPending}
        className="w-full h-14 text-lg font-display font-bold gold-gradient text-background border-0 hover:opacity-90 disabled:opacity-50"
      >
        {createMatch.isPending ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Starting...</>
        ) : (
          <><Play className="w-5 h-5 mr-2" /> Start Match</>
        )}
      </Button>
    </div>
  );
}
