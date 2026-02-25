import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { MatchFormat, MatchResult, MatchState, Team, TournamentType, UserProfile } from '../backend';

// User Profile
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

// Teams
export function useGetAllTeams() {
  const { actor, isFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['allTeams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeams();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, code, color, players }: { name: string; code: string; color: string; players: Array<{ name: string; battingRating: bigint; bowlingRating: bigint }> }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTeam(name, code, color, players);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTeams'] });
    },
  });
}

// Tournament Teams
export function useGetTournamentTeams(tournamentType: TournamentType) {
  const { actor, isFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['tournamentTeams', tournamentType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournamentTeams(tournamentType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTournamentTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentType, team }: { tournamentType: TournamentType; team: Team }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTournamentTeam(tournamentType, team);
    },
    onSuccess: (_, { tournamentType }) => {
      queryClient.invalidateQueries({ queryKey: ['tournamentTeams', tournamentType] });
    },
  });
}

// Matches
export function useGetAllMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<MatchState[]>({
    queryKey: ['allMatches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMatch(matchId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MatchState | null>({
    queryKey: ['match', matchId?.toString()],
    queryFn: async () => {
      if (!actor || matchId === null) return null;
      return actor.getMatch(matchId);
    },
    enabled: !!actor && !isFetching && matchId !== null,
  });
}

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

// Tournament Results
export function useGetTournamentMatches(tournamentType: TournamentType) {
  const { actor, isFetching } = useActor();

  return useQuery<MatchResult[]>({
    queryKey: ['tournamentMatches', tournamentType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournamentMatches(tournamentType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordTournamentResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tournamentType, result }: { tournamentType: TournamentType; result: MatchResult }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordTournamentResult(tournamentType, result);
    },
    onSuccess: (_, { tournamentType }) => {
      queryClient.invalidateQueries({ queryKey: ['tournamentMatches', tournamentType] });
    },
  });
}

// Admin check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
