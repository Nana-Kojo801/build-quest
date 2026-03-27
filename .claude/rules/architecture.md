# Architecture Rules

## App structure
- Organize by feature or route, not by file type alone.
- Every route/page owns a local `components/` directory for page-specific UI pieces.
- Shared primitives may live in common UI directories, but page sections stay near the page.
- Keep routing explicit and easy to scan.

## State strategy
- Use Zustand for client UI state, filters, modal state, session flow, and other interactive client concerns.
- Use Dexie for offline-first local persistence, drafts, cached generated projects, schedules, and sync queues.
- Use Convex for synced canonical data once online.
- Do not tightly couple presentational components to backend calls.

## BuildQuest domains
- Project generator
- Generated project detail workspace
- Adaptive schedule / calendar / task planner
- Progress, streaks, XP, achievements, and gamified feedback
- Claude bundle export / download flow

## Routing expectations
- Route structure should reflect major product areas.
- Navigation should be functional even when domain logic is stubbed.
- Route transitions should preserve context where practical.
