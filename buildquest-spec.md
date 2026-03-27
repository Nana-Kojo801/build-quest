# BuildQuest — Product Spec

## Project Overview
**BuildQuest** is an offline-first, gamified personal project-planning PWA for solo developers.

The app helps the user:
- generate random app ideas worth building
- generate UI-only build prompts and downloadable `.claude` starter files for each generated project
- turn a chosen project into a realistic development plan
- split work across multiple active projects
- adapt the timetable automatically when tasks are completed late, skipped, or finished early
- stay motivated through a game-like interface that makes shipping projects feel rewarding

BuildQuest is designed for a single user only. There is **no authentication** and no collaboration. It should feel like a personal productivity game for shipping portfolio-ready apps.

---

## Core Product Goal
The main goal of BuildQuest is to remove startup friction.

Instead of spending time deciding what to build, planning pages, writing prompts, and structuring a timeline, the user should be able to:
1. generate a project idea
2. review the generated concept
3. start the project
4. receive a UI-only project blueprint and `.claude` package
5. follow an adaptive, game-like build plan day by day

---

## Product Positioning
BuildQuest is a mix of:
- project idea generator
- AI prompt pack generator
- UI build planner
- adaptive coding timetable
- personal developer quest tracker

It is **not** a code editor, full project management suite, or backend generator.

---

## Tech Stack
- **Frontend:** React + Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **State Management:** Zustand
- **Local Offline Storage:** Dexie
- **Backend / Sync Layer:** Convex
- **App Type:** Offline-first PWA

---

## Primary Product Principles

### 1. Offline first
The app must remain useful without internet access.
- project ideas already generated should still be available offline
- active project plans should be fully accessible offline
- daily schedule and quest progress must work offline
- local actions should feel instant
- sync with Convex should happen when online again

### 2. UI-first workflow
The generated project assets are focused on **UI only**.
The user will implement actual business logic themselves.

That means generated project prompts and `.claude` files should:
- describe the app thoroughly
- instruct AI to build the full UI structure
- include routing and page navigation
- include dialogs, drawers, tabs, dropdowns, accordions, and visual interactions
- use mock data where needed
- exclude real backend logic and business functionality
- exclude database logic and production workflows

### 3. Gamified experience
The BuildQuest app itself should feel motivating, playful, and rewarding.
It should not look like a boring admin dashboard.

### 4. Multi-project realism
The planner should distribute work across multiple active projects in a way that feels reasonable and sustainable.
A single day may contain tasks from more than one project.

---

## Target User
The product is designed for one specific user profile:
- solo developer
- limited daily time
- wants to build more projects consistently
- prefers AI to generate UI scaffolding
- wants to focus on logic and implementation
- needs structure, momentum, and motivation

---

## Main User Flow

### Flow A: Generate a project
1. User opens the generator.
2. User chooses generation style:
   - fully random
   - category-based
   - difficulty-based
   - time-based
   - stack-based
3. App generates a project concept.
4. App shows:
   - project name
   - summary
   - target users
   - core features
   - recommended pages
   - design direction
   - estimated complexity
   - suggested timeline
5. User can:
   - regenerate
   - save to idea vault
   - start project
   - download `.claude` zip

### Flow B: Start a project
1. User selects a generated project.
2. App converts it into an active quest.
3. App creates:
   - UI build prompt
   - page breakdown
   - component plan
   - suggested milestones
   - day-by-day task plan
4. Project appears in the active quests area.

### Flow C: Follow daily plan
1. User opens today’s quest board.
2. App shows today’s tasks across all active projects.
3. User marks tasks as complete, partial, skipped, or blocked.
4. The schedule adapts automatically.
5. Progress, streaks, and completion stats update.

### Flow D: Download project assets
For any generated or started project, the user can download a zip containing:
- `.claude/`
- UI build instructions
- project prompt
- page structure prompt
- implementation rules for the generated app

---

## Key Features

## 1. Project Generator
The generator should create project ideas that feel practical, portfolio-worthy, and interesting.

### Generator inputs
- project category
- difficulty level
- target build duration
- app type
- preferred vibe/theme
- preferred stack notes
- platform type (web app, mobile-style web app, internal tool, SaaS UI, gamified app, social app, etc.)

### Generator outputs
- project title
- one-paragraph concept
- short pitch
- problem solved
- target audience
- key features
- page list
- UI direction
- complexity score
- estimated time commitment
- recommended breakdown into milestones

### Generation modes
- random quest
- weekend build
- portfolio project
- startup-style MVP
- gamified app
- SaaS dashboard
- mobile-first app
- AI-assisted app idea

---

## 2. Idea Vault
A place to store generated ideas before starting them.

### Capabilities
- save generated ideas
- favorite ideas
- archive ideas
- filter by category, complexity, or status
- re-open old ideas
- regenerate from an old idea basis

### Status types
- generated
- saved
- active
- paused
- completed
- archived

---

## 3. Active Project Quests
Each started project becomes a quest.

### Each quest should contain
- project overview
- project prompt
- UI direction
- page checklist
- milestone breakdown
- current status
- due rhythm / estimated finish pace
- completion percentage
- download `.claude` zip action

### Quest states
- not started
- active
- paused
- blocked
- completed

---

## 4. Adaptive Timetable Engine
This is one of the most important features.

The app should generate a day-by-day schedule based on:
- estimated project scope
- task complexity
- available days
- number of active projects
- unfinished tasks rolling forward
- reasonable workload balancing

### Scheduling behavior
- a day can include tasks from multiple projects
- the app should avoid unrealistic overload
- overdue tasks should be rescheduled automatically
- high-priority tasks should remain visible
- blocked tasks can push dependent tasks forward
- completed tasks should free up future schedule space

### Task statuses
- not started
- in progress
- completed
- skipped
- blocked
- moved

### Rescheduling rules
- unfinished tasks roll into the next best available day
- if several projects are active, the app should rebalance instead of stacking everything onto the very next day
- if a task is marked blocked, dependent tasks should be visually flagged
- if the user completes faster than expected, the app can pull forward future tasks

---

## 5. Daily Quest Board
The home experience should revolve around what the user should do today.

### Daily board should show
- today’s tasks
- grouped by project
- estimated effort per task
- urgency level
- streak info
- progress toward day completion
- quick mark actions
- carry-over tasks from previous days

### Supporting views
- today
- upcoming
- overdue
- week view
- project-based view

---

## 6. `.claude` Pack Generator
For every project, BuildQuest should generate downloadable `.claude` files.

### Zip contents should include
- `.claude/CLAUDE.md`
- `.claude/prompts/project-overview.md`
- `.claude/prompts/ui-build-prompt.md`
- `.claude/prompts/page-architecture.md`
- `.claude/prompts/component-rules.md`
- `.claude/prompts/design-direction.md`
- `.claude/prompts/navigation-and-interactions.md`

### Requirements for generated `.claude` content
The generated files must:
- be about the **project being generated**, not BuildQuest itself
- focus only on UI and UI interactions
- include app pages and reusable components
- include working navigation and view switching
- include dialog open/close behavior and similar UI interactions
- use mock data for display
- avoid real backend or app logic
- avoid implementing business functionality

---

## 7. Prompt Export
For each generated project, the user should also be able to access a copyable “master build prompt” that can be pasted directly into Claude Code.

### The exported prompt should contain
- project context
- goals
- stack expectations for the generated project
- UI-only rules
- page breakdown instructions
- component folder organization
- kebab-case naming requirement
- mock data instruction
- interaction expectations
- non-functional scope boundaries

---

## 8. Gamification Layer
The BuildQuest app should use motivation systems without becoming childish.

### Gamified mechanics
- quests and subquests
- build streaks
- project XP
- completion rings
- level progress
- visual unlock feeling
- badges/achievements
- milestone celebrations
- momentum indicators

### Tone
- playful but professional
- motivating, not silly
- premium game interface, not cartoonish

---

## 9. PWA Experience
The app should behave like an installable, resilient product.

### PWA requirements
- installable on desktop and mobile
- offline fallback support
- cached shell and core UI
- background sync where appropriate
- persistent local quest data
- smooth cold-start experience

---

## Information Architecture

## Main app sections
1. **Dashboard / Quest Board**
2. **Generate Project**
3. **Idea Vault**
4. **Active Quests**
5. **Timeline / Calendar**
6. **Project Detail**
7. **Downloads / Prompt Export**
8. **Stats / Progress**
9. **Settings**

---

## Page Breakdown

## 1. Dashboard / Quest Board
### Purpose
The motivational home screen.

### Content
- welcome banner
- current streak
- total active quests
- today’s tasks
- overdue items
- quick start actions
- progress snapshot
- active project cards
- recent completions

### UI notes
This should feel like a mission control screen for a game-like productivity app.

---

## 2. Generate Project Page
### Purpose
Where the user generates a new app idea.

### Content
- generator controls
- filters and preferences
- randomize button
- generated result card
- regenerate button
- save idea button
- start project button
- download `.claude` zip button
- preview prompt section

---

## 3. Idea Vault Page
### Purpose
Store generated ideas that are not yet active.

### Content
- searchable idea list
- filters
- cards with concept summaries
- favorite action
- archive action
- convert to quest action

---

## 4. Active Quests Page
### Purpose
Overview of all projects currently being worked on.

### Content
- quest cards
- progress bars
- milestone status
- current task summary
- paused/blocked labels
- quick resume button
- project detail entry point

---

## 5. Timeline / Calendar Page
### Purpose
Visualize the adaptive work plan.

### Content
- daily timeline
- weekly calendar
- task chips
- cross-project distribution
- overdue rollovers
- reschedule preview

### UI behavior
- clicking a task opens a task detail drawer/dialog
- tasks should be filterable by project and status

---

## 6. Project Detail Page
### Purpose
The central workspace for an individual project.

### Content
- project overview
- prompt preview
- page list
- component breakdown
- milestone tracker
- task list
- schedule section
- download panel
- notes section

---

## 7. Downloads / Prompt Export Page
### Purpose
Access all generated assets.

### Content
- generated prompt preview
- `.claude` file list
- download zip button
- copy prompt button
- per-project asset history

---

## 8. Stats / Progress Page
### Purpose
Track consistency and output.

### Content
- projects started
- projects completed
- streak length
- tasks completed
- schedule adherence
- active days heatmap feel
- momentum indicators

---

## 9. Settings Page
### Purpose
Configure local behavior.

### Content
- theme preferences
- workload preferences
- default generation settings
- offline sync status
- storage controls
- export/import local data

---

## Data Model (Conceptual)

## ProjectIdea
- id
- title
- summary
- category
- complexity
- targetDuration
- features
- pages
- designDirection
- status
- createdAt
- updatedAt

## ActiveProject
- id
- ideaId
- title
- summary
- currentStatus
- progress
- milestones
- tasks
- downloadedAssets
- createdAt
- updatedAt

## ProjectTask
- id
- projectId
- title
- description
- status
- effortEstimate
- scheduledDate
- dependsOn
- priority
- createdAt
- updatedAt

## ScheduleEntry
- id
- date
- taskId
- projectId
- status
- carryOver
- estimatedMinutes

## GeneratedAssetPack
- id
- projectId
- version
- zipPath
- promptText
- createdAt

---

## Local-First Data Strategy

### Dexie should handle
- generated ideas cache
- active project cache
- schedule cache
- UI state persistence
- download history metadata
- offline actions queue

### Convex should handle
- canonical synced project data
- synced asset metadata
- future extensibility if cloud backups are needed

### State layers
- **Zustand** for UI state and app session state
- **Dexie** for persistent offline data
- **Convex** for network-backed sync and future backup support

---

## Design Direction

## Overall visual style
The app should feel like:
- a premium game launcher for your coding life
- a modern quest tracker
- a sleek developer productivity RPG

### Visual keywords
- gamified
- immersive
- glowing accents used carefully
- layered panels
- rewarding motion
- premium dark-first aesthetic
- mobile-friendly
- visually rich but still clean

### Avoid
- generic SaaS dashboard look
- flat boring admin screens
- childish cartoon game visuals
- overly cluttered neon overload

---

## UX Guidelines
- fast entry into today’s tasks
- minimal friction to generate a project
- simple actions for task status updates
- clear visual distinction between projects
- schedule changes should feel understandable
- reward feedback should be immediate
- all core flows should work well on mobile first

---

## Component / Code Organization Rules
These rules apply to the BuildQuest app itself.

### General rules
- each page must be broken into smaller sections/components
- each page should have its own `components` folder within that page directory
- component and store filenames must use **kebab-case**
- shared UI should be extracted into reusable components where appropriate
- pages should remain clean and compositional

### Example structure
```txt
src/
  pages/
    dashboard/
      dashboard-page.tsx
      components/
        daily-quest-board.tsx
        streak-card.tsx
        active-quest-list.tsx
    generate-project/
      generate-project-page.tsx
      components/
        generator-form.tsx
        generated-project-card.tsx
        prompt-preview-panel.tsx
```

---

## Functionality Scope Boundaries

## BuildQuest app should implement
- UI
- routing
- offline-ready structure
- local persistence patterns
- gamified task flows
- schedule visualization
- local interactions
- asset export flows

## Generated project packs should implement
- UI only
- page layout and navigation
- UI interactions only
- mock data

## Generated project packs should NOT implement
- real backend logic
- actual database integration
- actual product functionality
- business rules
- production API flows

---

## MVP Scope

### Must-have for MVP
- project generator
- idea vault
- active quests
- adaptive timetable
- daily quest board
- `.claude` pack export
- prompt export
- offline-first local persistence
- installable PWA shell

### Nice-to-have after MVP
- richer achievements
- theme customization
- multiple generation templates
- statistics visualizations
- backup/restore flows
- smarter rescheduling insights

---

## Success Criteria
BuildQuest is successful if:
- the user can generate a project in under a minute
- the user can start a project and receive a believable plan instantly
- the schedule remains useful across multiple simultaneous projects
- the user feels motivated to return daily
- exported `.claude` packs are directly usable for UI generation
- the app works smoothly even when offline

---

## One-Sentence Summary
**BuildQuest is an offline-first gamified PWA that helps a solo developer generate project ideas, export UI-only AI build packs, and follow an adaptive multi-project coding schedule that makes shipping apps feel like completing quests.**
