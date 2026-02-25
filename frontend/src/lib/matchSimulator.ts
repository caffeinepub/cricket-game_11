import { MatchFormat } from '../backend';

export interface BallEvent {
  ball: number;
  over: number;
  runs: number;
  isWicket: boolean;
  isExtra: boolean;
  extraType?: 'wide' | 'noball';
  commentary: string;
  batsman: string;
  bowler: string;
}

export interface InningsState {
  runs: number;
  wickets: number;
  balls: number;
  overs: number;
  ballEvents: BallEvent[];
  batsmen: { name: string; runs: number; balls: number; isOut: boolean }[];
  bowlers: { name: string; overs: number; runs: number; wickets: number }[];
  currentBatsmen: [number, number];
  currentBowler: number;
}

const SHOT_TYPES = ['cover drive', 'pull shot', 'sweep', 'cut shot', 'straight drive', 'flick', 'hook shot', 'glance'];
const WICKET_TYPES = ['Caught at mid-on', 'Bowled', 'LBW', 'Caught behind', 'Caught at slip', 'Run out', 'Stumped', 'Caught at cover'];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

export function simulateBall(
  battingRating: number,
  bowlingRating: number,
  wickets: number,
  oversLeft: number,
  target: number | null,
  currentRuns: number
): { runs: number; isWicket: boolean; isExtra: boolean; extraType?: 'wide' | 'noball' } {
  const pressure = target ? Math.max(0, (target - currentRuns) / Math.max(1, oversLeft * 6)) : 1;
  const aggression = Math.min(2, pressure);

  if (Math.random() < 0.04) {
    return { runs: 1, isWicket: false, isExtra: true, extraType: Math.random() < 0.5 ? 'wide' : 'noball' };
  }

  const wicketProb = (bowlingRating / 100) * 0.12 * (1 - battingRating / 200) * (1 + wickets * 0.05);
  if (Math.random() < wicketProb) {
    return { runs: 0, isWicket: true, isExtra: false };
  }

  const baseWeights = [35, 25, 15, 8, 2, 8, 7];
  const aggressionBonus = aggression * 3;
  const weights = [
    Math.max(5, baseWeights[0] - aggressionBonus),
    baseWeights[1],
    baseWeights[2],
    baseWeights[3],
    baseWeights[4] + aggressionBonus,
    baseWeights[5],
    baseWeights[6] + aggressionBonus,
  ];

  const runValues = [0, 1, 2, 3, 4, 5, 6];
  const idx = weightedRandom(weights);
  return { runs: runValues[idx], isWicket: false, isExtra: false };
}

export function generateCommentary(
  ball: { runs: number; isWicket: boolean; isExtra: boolean; extraType?: string },
  batsman: string,
  bowler: string
): string {
  if (ball.isWicket) {
    const wicketType = WICKET_TYPES[rand(0, WICKET_TYPES.length - 1)];
    return `OUT! ${batsman} - ${wicketType} off ${bowler}!`;
  }
  if (ball.isExtra) {
    return `${ball.extraType === 'wide' ? 'Wide ball' : 'No ball'} - 1 extra run`;
  }
  if (ball.runs === 6) {
    return `SIX! ${batsman} launches it over the boundary off ${bowler}!`;
  }
  if (ball.runs === 4) {
    const shot = SHOT_TYPES[rand(0, SHOT_TYPES.length - 1)];
    return `FOUR! Beautiful ${shot} by ${batsman}!`;
  }
  if (ball.runs === 0) {
    return `Dot ball. ${bowler} beats ${batsman} outside off stump.`;
  }
  return `${ball.runs} run${ball.runs > 1 ? 's' : ''}. ${batsman} works it to ${rand(0, 1) ? 'mid-wicket' : 'square leg'}.`;
}

export function createInitialInnings(battingSquad: string[], bowlingSquad: string[]): InningsState {
  return {
    runs: 0,
    wickets: 0,
    balls: 0,
    overs: 0,
    ballEvents: [],
    batsmen: battingSquad.map(name => ({ name, runs: 0, balls: 0, isOut: false })),
    bowlers: bowlingSquad.slice(5).map(name => ({ name, overs: 0, runs: 0, wickets: 0 })),
    currentBatsmen: [0, 1],
    currentBowler: 0,
  };
}

export function simulateFullInnings(
  squad1: string[],
  squad2: string[],
  totalOvers: number,
  target: number | null,
  battingRatings: number[],
  bowlingRatings: number[]
): InningsState {
  const innings = createInitialInnings(squad1, squad2);
  const maxBalls = totalOvers * 6;
  let nextBatsman = 2;

  while (innings.balls < maxBalls && innings.wickets < 10) {
    if (target && innings.runs >= target) break;

    const batsmanIdx = innings.currentBatsmen[0];
    const bowlerSlot = innings.currentBowler % Math.min(5, Math.max(1, squad2.length - 5));
    const actualBowlerIdx = 5 + bowlerSlot;

    const battingRating = battingRatings[batsmanIdx] ?? 65;
    const bowlingRating = bowlingRatings[actualBowlerIdx] ?? 65;
    const oversLeft = (maxBalls - innings.balls) / 6;

    const result = simulateBall(battingRating, bowlingRating, innings.wickets, oversLeft, target, innings.runs);
    const batsman = squad1[batsmanIdx] ?? `Batsman ${batsmanIdx + 1}`;
    const bowler = squad2[actualBowlerIdx] ?? `Bowler ${bowlerSlot + 1}`;

    const commentary = generateCommentary(result, batsman, bowler);
    const currentOver = Math.floor(innings.balls / 6);
    const currentBall = innings.balls % 6;

    innings.ballEvents.push({
      ball: currentBall + 1,
      over: currentOver,
      runs: result.runs,
      isWicket: result.isWicket,
      isExtra: result.isExtra,
      extraType: result.extraType as 'wide' | 'noball' | undefined,
      commentary,
      batsman,
      bowler,
    });

    if (!result.isExtra) {
      innings.balls++;
    }
    innings.runs += result.runs;

    if (!result.isExtra) {
      innings.batsmen[batsmanIdx].runs += result.runs;
      innings.batsmen[batsmanIdx].balls++;
    }

    if (result.isWicket) {
      innings.batsmen[batsmanIdx].isOut = true;
      innings.wickets++;
      if (nextBatsman < squad1.length) {
        innings.currentBatsmen[0] = nextBatsman++;
      }
    }

    if (!result.isExtra && result.runs % 2 === 1) {
      innings.currentBatsmen = [innings.currentBatsmen[1], innings.currentBatsmen[0]];
    }

    if (!result.isExtra && innings.balls % 6 === 0 && innings.balls > 0) {
      innings.overs++;
      innings.currentBatsmen = [innings.currentBatsmen[1], innings.currentBatsmen[0]];
      innings.currentBowler = (innings.currentBowler + 1) % Math.min(5, Math.max(1, squad2.length - 5));
    }
  }

  innings.overs = Math.floor(innings.balls / 6);
  return innings;
}

// Keep MatchFormat import used for type reference
export type { MatchFormat };
