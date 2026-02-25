import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Player = {
    name : Text;
    battingRating : Int;
    bowlingRating : Int;
  };

  type Team = {
    name : Text;
    countryCode : Text;
    jerseyColor : Text;
    squad : [Player];
  };

  type MatchId = Nat;

  type MatchState = {
    matchId : MatchId;
    format : MatchFormat;
    isOver : Bool;
    totalOvers : Int;
    currentOver : Int;
    runsScored : Int;
    wicketsLost : Int;
    result : ?MatchResult;
  };

  type MatchFormat = {
    #test;
    #odi;
    #t20;
  };

  module MatchFormat {
    public func compare(a : MatchFormat, b : MatchFormat) : Order.Order {
      func toNat(format : MatchFormat) : Nat {
        switch (format) {
          case (#t20) { 0 };
          case (#test) { 1 };
          case (#odi) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type MatchResult = {
    winner : Text;
    runs : Int;
    wickets : Int;
    overs : Int;
    batFirst : Text;
    wonToss : Text;
    remainingBalls : Int;
    ballsPlayed : Int;
  };

  type TournamentType = {
    #ipl;
    #bbl;
    #ranjiTrophy;
    #sheffieldShield;
    #countyChampionship;
  };

  module TournamentType {
    public func compare(a : TournamentType, b : TournamentType) : Order.Order {
      func toNat(tourney : TournamentType) : Nat {
        switch (tourney) {
          case (#ipl) { 0 };
          case (#bbl) { 1 };
          case (#ranjiTrophy) { 2 };
          case (#sheffieldShield) { 3 };
          case (#countyChampionship) { 4 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let teamStore = Map.empty<Text, Team>();
  let matchStore = Map.empty<MatchId, MatchState>();
  let tournamentResultsStore = Map.empty<TournamentType, List.List<MatchResult>>();
  let tournamentTeams = Map.empty<TournamentType, List.List<Team>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextMatchId : Nat = 1;

  // User profile management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Team management - admin only

  public shared ({ caller }) func addTeam(name : Text, code : Text, color : Text, players : [Player]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add teams");
    };
    let team : Team = {
      name;
      countryCode = code;
      jerseyColor = color;
      squad = players;
    };
    teamStore.add(name, team);
  };

  public shared ({ caller }) func clearTeams() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can do that!") };
    teamStore.clear();
  };

  // Read team data - open to all (including guests)

  public query func getTeamByName(name : Text) : async ?Team {
    teamStore.get(name);
  };

  public query func getAllTeams() : async [Team] {
    teamStore.values().toArray();
  };

  // Match management

  public shared ({ caller }) func createMatch(format : MatchFormat, isOver : Bool, totalOvers : Int, currentOver : Int, runsScored : Int, wicketsLost : Int, result : ?MatchResult) : async MatchId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create matches");
    };
    let matchId = nextMatchId;
    let matchState : MatchState = {
      matchId;
      format;
      isOver;
      totalOvers;
      currentOver;
      runsScored;
      wicketsLost;
      result;
    };
    matchStore.add(matchId, matchState);
    nextMatchId += 1;
    matchId;
  };

  public shared ({ caller }) func clearMatches() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) { Runtime.trap("Unauthorized: Only admin can do that!") };
    matchStore.clear();
  };

  // Read matches

  public query func getMatch(matchId : MatchId) : async ?MatchState {
    matchStore.get(matchId);
  };

  public query func getAllMatches() : async [MatchState] {
    matchStore.values().toArray();
  };

  // Tournament result management - admin only

  public shared ({ caller }) func recordTournamentResult(tournamentType : TournamentType, result : MatchResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record tournament results");
    };
    let currentResults = switch (tournamentResultsStore.get(tournamentType)) {
      case (null) { List.empty<MatchResult>() };
      case (?results) { results };
    };
    currentResults.add(result);
    tournamentResultsStore.add(tournamentType, currentResults);
  };

  // Read tournament results - open to all (including guests)

  public query func getTournamentMatches(tournamentType : TournamentType) : async [MatchResult] {
    switch (tournamentResultsStore.get(tournamentType)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  // Tournament (Domestic) team management - admin only

  public shared ({ caller }) func addTournamentTeam(tournamentType : TournamentType, team : Team) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add tournament teams");
    };
    let currentTeams = switch (tournamentTeams.get(tournamentType)) {
      case (null) { List.empty<Team>() };
      case (?teams) { teams };
    };
    currentTeams.add(team);
    tournamentTeams.add(tournamentType, currentTeams);
  };

  // Read tournament (domestic) teams - open to all (including guests)

  public query func getTournamentTeams(tournamentType : TournamentType) : async [Team] {
    switch (tournamentTeams.get(tournamentType)) {
      case (null) { [] };
      case (?teams) { teams.toArray() };
    };
  };
};
