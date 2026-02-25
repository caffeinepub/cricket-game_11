# Specification

## Summary
**Goal:** Build a full-featured cricket simulation game called "Cricket Premier" with Internet Identity authentication, multiple tournament modes (IPL, BBL, Domestic), international matches, three match formats (T20, ODI, Test), and a cricket-themed UI.

**Planned changes:**
- Implement Internet Identity authentication; unauthenticated users see a login screen, authenticated users see their principal ID and a logout option
- Seed backend with 12+ international country teams (India, Australia, England, Pakistan, South Africa, New Zealand, West Indies, Sri Lanka, Bangladesh, Afghanistan, Zimbabwe, Ireland, etc.), each with name, country code, jersey color, and a squad of players with batting/bowling ratings
- Implement three match formats: T20 (20 overs), ODI (50 overs), and Test (2 innings, multi-day); match engine simulates ball-by-ball outcomes (runs, wickets, extras) and computes match results
- Create IPL tournament mode with all 10 IPL franchise teams, round-robin group stage, points table (wins/losses/NRR), and knockout rounds (Qualifier 1, Eliminator, Qualifier 2, Final)
- Create BBL tournament mode with all 8 BBL franchise teams, round-robin group stage, points table, and a finals series
- Create Domestic tournament mode with at least 3 competitions (Ranji Trophy, Sheffield Shield, County Championship), each with their own teams and appropriate format (multi-day or limited-overs)
- Build a main dashboard with four sections (International, IPL, BBL, Domestic) showing ongoing and completed tournaments/matches for the logged-in user
- Build a match simulation screen displaying a live-style scorecard: current batsmen, bowler, score, overs, fall of wickets, ball-by-ball commentary, and "Next Ball" / "Auto-Simulate" controls; show innings summary and match result at end
- Apply a dark green + gold + white cricket-themed visual design consistently across all screens (stadium-atmosphere cards, bold typography, cricket iconography)
- Persist all game state, tournament progress, and match results in a single Motoko backend actor

**User-visible outcome:** Users log in with Internet Identity, then access a cricket dashboard where they can play international matches in T20/ODI/Test formats, run full IPL or BBL T20 franchise tournaments, and participate in domestic league competitions — all with ball-by-ball match simulation, live scorecards, and persistent standings.
