# Specification

## Summary
**Goal:** Add an immersive 3D cricket stadium view to the International Match simulation screen using React Three Fiber.

**Planned changes:**
- Create a `CricketStadium3D` component (React Three Fiber + @react-three/drei) rendering a 3D cricket ground with pitch strip, outfield, boundary rope, stadium stands, and floodlit lighting from a broadcast-style elevated camera angle
- Animate a cricket ball (small sphere) traveling along a parabolic arc from bowler end to batsman end for each delivery; wicket events trigger a stumps-scatter effect, six events show the ball continuing over the boundary
- Display 11 fielder markers (colored cylinders) on the ground that dynamically reposition between attacking and defensive configurations based on match state (wickets fallen, overs, run rate); wicketkeeper is always behind the stumps
- Add atmosphere effects: semi-transparent floodlight cone shafts from four corner towers and a crowd wave particle effect on the stands triggered by six and wicket events
- Integrate `CricketStadium3D` into `InternationalMatch.tsx` occupying the upper 50–60% of the screen above the existing scorecard and commentary feed; collapsible/reduced on mobile; receives current ball event and match state as props to sync animations with "Next Ball" and "Auto-Simulate"
- All existing match simulation logic, scorecard, commentary, and tournament modes remain unaffected

**User-visible outcome:** On the International Match screen, users see a live 3D stadium view with animated ball deliveries, dynamic fielder positions, and floodlight/crowd atmosphere effects playing in sync with each ball of the match simulation.
