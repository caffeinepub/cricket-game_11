import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    bowlingRating: bigint;
    name: string;
    battingRating: bigint;
}
export interface MatchResult {
    overs: bigint;
    wonToss: string;
    runs: bigint;
    remainingBalls: bigint;
    winner: string;
    ballsPlayed: bigint;
    wickets: bigint;
    batFirst: string;
}
export interface MatchState {
    result?: MatchResult;
    totalOvers: bigint;
    isOver: boolean;
    wicketsLost: bigint;
    currentOver: bigint;
    matchId: MatchId;
    runsScored: bigint;
    format: MatchFormat;
}
export type MatchId = bigint;
export interface UserProfile {
    name: string;
}
export interface Team {
    name: string;
    countryCode: string;
    jerseyColor: string;
    squad: Array<Player>;
}
export enum MatchFormat {
    odi = "odi",
    t20 = "t20",
    test = "test"
}
export enum TournamentType {
    bbl = "bbl",
    ipl = "ipl",
    ranjiTrophy = "ranjiTrophy",
    countyChampionship = "countyChampionship",
    sheffieldShield = "sheffieldShield"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTeam(name: string, code: string, color: string, players: Array<Player>): Promise<void>;
    addTournamentTeam(tournamentType: TournamentType, team: Team): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMatches(): Promise<void>;
    clearTeams(): Promise<void>;
    createMatch(format: MatchFormat, isOver: boolean, totalOvers: bigint, currentOver: bigint, runsScored: bigint, wicketsLost: bigint, result: MatchResult | null): Promise<MatchId>;
    getAllMatches(): Promise<Array<MatchState>>;
    getAllTeams(): Promise<Array<Team>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatch(matchId: MatchId): Promise<MatchState | null>;
    getTeamByName(name: string): Promise<Team | null>;
    getTournamentMatches(tournamentType: TournamentType): Promise<Array<MatchResult>>;
    getTournamentTeams(tournamentType: TournamentType): Promise<Array<Team>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordTournamentResult(tournamentType: TournamentType, result: MatchResult): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
