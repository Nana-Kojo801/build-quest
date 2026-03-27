import type { ProjectIdea } from '@/lib/types'

export function generateClaudePrompt(idea: ProjectIdea): string {
  const pageList = idea.pages.map((p) => `  - ${p}`).join('\n')
  const featureList = idea.features.map((f) => `  - ${f}`).join('\n')

  return `# ${idea.title} — UI Build Prompt

## Instructions for Claude Code

You are building the **UI layer only** for **${idea.title}**.

Before you do anything:
1. Read ALL files inside the \`.claude/\` directory in this project
2. Follow ALL rules, conventions, and instructions defined there exactly
3. Treat \`.claude/\` as the source of truth for architecture, UI system, and coding standards

---

## Project Overview

**${idea.title}**

${idea.pitch}

**Category:** ${idea.category}
**Difficulty:** ${idea.difficulty}
**Tags:** ${idea.tags.join(', ')}

---

## CRITICAL RULE: UI Only

This project must be implemented as **UI only**.

✅ You MUST implement:
- All pages and screens listed below
- Full page structure, layout, and visual design
- Navigation between all pages (working routes)
- Dialogs, drawers, tabs, accordions, tooltips, and dropdowns (working UI interactions)
- Forms with basic validation and toast feedback (no actual data persistence)
- Mock/placeholder data so every screen feels alive and functional
- Loading states, empty states, and error states for every major screen
- Responsive layout (mobile-first, then tablet, then desktop)
- Hover states, focus states, transitions, and micro-interactions

❌ You must NOT implement:
- Real database operations or backend API calls
- Authentication or authorization logic
- Real file uploads, email sending, or external service calls
- Actual business/domain logic beyond what is needed for UI interaction
- Production-ready backend infrastructure

All state can be local React state or Zustand. All data should be mock/hardcoded or generated in-memory.

---

## Tech Stack

${idea.techDirection}

Additional requirements:
- React + Vite
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui components
- Zustand for UI state where appropriate
- Lucide React for icons

---

## Pages to Implement

${pageList}

Each page must:
- Have its own folder at \`src/pages/<page-name>/\`
- Have a local \`components/\` subfolder for page-specific components
- Use kebab-case for ALL file names

---

## Features to Implement (UI Only)

${featureList}

---

## Visual Direction

- The app should feel polished, modern, and purpose-built — not like a generic template
- Use a dark theme as default
- Cards, panels, and hierarchy should feel intentional
- Use the project's category/domain to inform visual metaphors
- Avoid generic SaaS admin aesthetics
- Every screen should feel alive with mock data — not empty

---

## Architecture Rules

\`\`\`
src/
  pages/
    <page-name>/
      <page-name>-page.tsx      ← main page component
      components/
        <component-name>.tsx    ← page-specific components
  components/
    ui/                         ← shared primitives
    layout/                     ← app shell, nav
  stores/
    <store-name>-store.ts       ← Zustand stores
  lib/
    types.ts                    ← TypeScript types
    utils.ts                    ← utilities
\`\`\`

- All file names: **kebab-case**
- All component files: **kebab-case** (e.g., \`project-card.tsx\`)
- All store files: **kebab-case** (e.g., \`project-store.ts\`)
- Page sections belong in that page's \`components/\` folder
- Only extract to shared components when clearly reused

---

## Why Build This

${idea.whyBuild}

---

## Start Now

1. Read the \`.claude/\` folder
2. Set up routing and app shell
3. Build each page with its components
4. Add mock data throughout
5. Ensure all navigation and UI interactions work

Build the complete UI now. Make it feel real.
`
}

export function generateClaudeConfig(idea: ProjectIdea) {
  return {
    projectName: idea.title,
    description: idea.pitch,
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Zustand', 'React Router', 'Lucide React'],
    pages: idea.pages.map((page) => ({
      name: page,
      route: `/${page.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      description: `${page} screen of ${idea.title}`,
      components: [`${page.toLowerCase().replace(/\s+/g, '-')}-header`, `${page.toLowerCase().replace(/\s+/g, '-')}-content`],
    })),
    components: idea.features.slice(0, 5).map((f) => ({
      name: f.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30),
      description: f,
    })),
    uiStyle: `Modern dark theme for ${idea.category} app. Polished, purposeful, non-generic.`,
    rules: [
      'UI only — no real backend logic',
      'Mobile-first responsive design',
      'All files use kebab-case',
      'Pages own their components in local components/ dir',
      'All screens must have mock data',
      'Working navigation is required',
    ],
  }
}
