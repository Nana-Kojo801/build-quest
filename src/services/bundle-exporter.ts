import JSZip from 'jszip'
import { generateClaudePrompt, generateClaudeConfig } from './prompt-generator'
import type { ProjectIdea } from '@/lib/types'

export async function exportClaudeBundle(idea: ProjectIdea): Promise<void> {
  const zip = new JSZip()
  const projectSlug = idea.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const rootFolder = zip.folder(projectSlug)!
  const claudeFolder = rootFolder.folder('.claude')!

  // ── CLAUDE.md (project memory) ────────────────────────────────────────────
  claudeFolder.file('CLAUDE.md', generateProjectClaude(idea))

  // ── rules/ ─────────────────────────────────────────────────────────────────
  const rulesFolder = claudeFolder.folder('rules')!
  rulesFolder.file('architecture.md', generateArchitectureRules(idea))
  rulesFolder.file('ui-system.md', generateUISystemRules(idea))
  rulesFolder.file('coding-conventions.md', CODING_CONVENTIONS)

  // ── PROMPT.md (the main Claude Code prompt) ────────────────────────────────
  rootFolder.file('PROMPT.md', generateClaudePrompt(idea))

  // ── claude.json (config) ───────────────────────────────────────────────────
  const config = generateClaudeConfig(idea)
  claudeFolder.file('config.json', JSON.stringify(config, null, 2))

  // ── README.md ──────────────────────────────────────────────────────────────
  rootFolder.file('README.md', generateReadme(idea))

  // ── Generate and download ─────────────────────────────────────────────────
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `${projectSlug}-claude-bundle.zip`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateProjectClaude(idea: ProjectIdea): string {
  return `# ${idea.title} — Project Memory

## What this project is
${idea.pitch}

**Category:** ${idea.category}
**Tags:** ${idea.tags.join(', ')}
**Difficulty:** ${idea.difficulty}
**Estimated Duration:** ${idea.estimatedDays} days

## Why Build This
${idea.whyBuild}

## Core Tech Direction
${idea.techDirection}

## Non-negotiables
- This is a UI-only implementation
- All data should use mock/in-memory values
- Navigation must work between all pages
- Every screen must have meaningful placeholder content
- Mobile-first, then desktop

## Pages
${idea.pages.map((p) => `- ${p}`).join('\n')}

## Features (UI-only)
${idea.features.map((f) => `- ${f}`).join('\n')}

## Working Style
- Build one page at a time, fully
- Each page owns a local components/ folder
- Use kebab-case for all file names
- Prioritize visual quality and interaction feel
`
}

function generateArchitectureRules(idea: ProjectIdea): string {
  return `# Architecture Rules

## App Structure
- Organize by route/page
- Each page owns a local \`components/\` directory
- Keep routing explicit and scannable

## Route Map
${idea.pages.map((p) => `- /${p.toLowerCase().replace(/\s+/g, '-')}`).join('\n')}

## State Strategy
- Use Zustand for UI state, filters, and interactive client concerns
- Use in-memory mock data for all data display
- Do not implement real backend calls or database operations

## Implementation Scope
- This is a UI-only project
- All actions (save, delete, submit) should use mock handlers
- Forms may show toasts and update local state without persisting
- Buttons should navigate, open modals, or trigger visible UI changes
`
}

function generateUISystemRules(idea: ProjectIdea): string {
  return `# UI System Rules

## Visual Direction
- ${idea.category} app — build the visual language to match this domain
- Modern, polished, purposeful design
- Dark theme by default
- Non-generic — avoid default shadcn/SaaS dashboard look

## Experience Principles
- Mobile first
- Rich empty states, loading skeletons, and error states
- Use transitions and subtle motion for quality feel
- Cards, panels, and strong visual hierarchy

## Interaction Requirements
- All dialogs, drawers, tabs, and accordions must work
- Forms should validate and show feedback
- Toasts for success/error actions
- Hover states on all interactive elements

## Mock Data
- Every screen must have realistic placeholder content
- Do not leave screens empty
- Use domain-relevant mock content (not lorem ipsum)
`
}

const CODING_CONVENTIONS = `# Coding Conventions

## File Naming
- Use kebab-case for all components, stores, hooks, and utility files
- Example: \`project-card.tsx\`, \`use-project-store.ts\`

## Component Structure
- Each page in \`src/pages/<page-name>/\`
- Page-specific components in \`src/pages/<page-name>/components/\`
- Shared components only when clearly reused

## UI-Only Rule
- No real backend logic
- Stub all actions with mock handlers
- Forms may validate but should not persist
- Buttons should trigger visible UI changes

## Quality Bar
- No layout bugs at mobile, tablet, or desktop
- Loading, empty, and error states designed intentionally
- Consistent spacing, typography, and visual language
`

function generateReadme(idea: ProjectIdea): string {
  return `# ${idea.title}

${idea.pitch}

## Getting Started

1. Copy this bundle into a new project directory
2. Open Claude Code in that directory
3. Run: \`cat PROMPT.md | claude\` or paste the contents of \`PROMPT.md\` as your first message to Claude Code
4. Claude Code will read the \`.claude/\` folder and build the UI

## What's Included

- \`PROMPT.md\` — The main Claude Code prompt to start building
- \`.claude/CLAUDE.md\` — Project context and non-negotiables for Claude
- \`.claude/rules/\` — Architecture, UI, and coding convention rules
- \`.claude/config.json\` — Structured project configuration

## Pages to Be Built

${idea.pages.map((p) => `- ${p}`).join('\n')}

## Key Features

${idea.features.map((f) => `- ${f}`).join('\n')}

---

*Generated by BuildQuest — a gamified coding project planner.*
`
}
