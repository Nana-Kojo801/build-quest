# BuildQuest — Project Memory

## What this project is
BuildQuest is an offline-first PWA for solo developers. It generates project ideas, produces UI-only Claude Code bundles for those generated projects, and creates adaptive day-by-day build schedules across multiple projects.

## Primary product goals
- Make starting projects feel game-like, motivating, and low-friction.
- Let AI generate the UI layer for generated projects while the user implements real business logic.
- Support multiple concurrent projects with adaptive rescheduling when tasks slip.
- Work offline first, then sync app data when online.

## Core stack
- React + Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Zustand
- Dexie for offline/local-first persistence
- Convex for cloud sync and backend state

## Non-negotiables
- This app must feel gamified, not like a generic admin dashboard.
- Prioritize mobile-first layouts, then scale cleanly to tablet and desktop.
- Default to UI-first implementation. Real backend or domain logic can be stubbed until wired up.
- Navigation and basic UI behaviors should work: tabs, drawers, sheets, dialogs, toasts, hover states, progress states, keyboard shortcuts where relevant.
- Avoid fake functionality masquerading as completed logic.

## Generated project bundle rules
When BuildQuest generates a Claude bundle for a new project, that bundle must focus on UI only.
- Include page structure, visual design direction, component breakdown, routes, mock data, and interaction states.
- Do not implement real business logic, database logic, API logic, auth logic, or production workflows unless explicitly requested.
- Buttons may open modals, expand accordions, change tabs, and navigate between pages, but underlying domain actions should remain stubbed.
- Each page should be split into local components under that page's `components/` folder.
- Component and store filenames must use kebab-case.

## Working style
- Prefer small, reviewable changes.
- Preserve design consistency across the whole app.
- When adding new screens, update routes, navigation, and empty/loading/error states as part of the same UI pass.
