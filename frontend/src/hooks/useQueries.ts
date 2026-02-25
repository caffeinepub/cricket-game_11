import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Team, MatchResult } from '../backend';
import { TournamentType, MatchFormat } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export function useGetAllTeams() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['allTeams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeams();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTeamByName(name: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Team | null>({
    queryKey: ['team', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTeamByName(name);
    },
    enabled: !!actor && !actorFetching && !!name,
  });
}

// ─── Tournament Teams ─────────────────────────────────────────────────────────

export function useGetTournamentTeams(tournamentType: TournamentType) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['tournamentTeams', tournamentType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournamentTeams(tournamentType);
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Tournament Matches ───────────────────────────────────────────────────────

export function useGetTournamentMatches(tournamentType: TournamentType) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MatchResult[]>({
    queryKey: ['tournamentMatches', tournamentType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournamentMatches(tournamentType);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRecordTournamentResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tournamentType: TournamentType;
      result: MatchResult;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordTournamentResult(params.tournamentType, params.result);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tournamentMatches', variables.tournamentType],
      });
    },
  });
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export function useCreateMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      format: MatchFormat;
      isOver: boolean;
      totalOvers: bigint;
      currentOver: bigint;
      runsScored: bigint;
      wicketsLost: bigint;
      result: MatchResult | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMatch(
        params.format,
        params.isOver,
        params.totalOvers,
        params.currentOver,
        params.runsScored,
        params.wicketsLost,
        params.result
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMatches'] });
    },
  });
}

export function useGetAllMatches() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['allMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !actorFetching,
  });
}
