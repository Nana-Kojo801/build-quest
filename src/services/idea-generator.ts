import { generateId } from '@/lib/utils'
import type { ProjectIdea, Difficulty } from '@/lib/types'

// ─── Project idea templates ───────────────────────────────────────────────────

interface IdeaTemplate {
  title: string
  pitch: string
  category: string
  tags: string[]
  difficulty: Difficulty
  estimatedDays: number
  estimatedHoursPerDay: number
  pages: string[]
  features: string[]
  techDirection: string
  whyBuild: string
}

const IDEA_POOL: IdeaTemplate[] = [
  {
    title: 'DevLog — Coding Journal',
    pitch: 'A personal journal for tracking daily coding progress, learnings, and breakthroughs.',
    category: 'Web App',
    tags: ['productivity', 'journaling', 'developer-tools'],
    difficulty: 'beginner',
    estimatedDays: 7,
    estimatedHoursPerDay: 2,
    pages: ['Dashboard', 'New Entry', 'Entry Detail', 'Timeline View', 'Stats'],
    features: ['Daily log entries', 'Tags and categories', 'Mood/energy tracking', 'Code snippet embeds', 'Weekly review', 'Search and filter'],
    techDirection: 'React + Vite, Dexie for local storage, Tailwind CSS, markdown editor for entries',
    whyBuild: 'Builds habits of reflection. Teaches local-first data modeling. Great portfolio piece showing personal productivity tools.',
  },
  {
    title: 'Snippets — Code Clip Manager',
    pitch: 'Save, organize, and quickly find your most-used code snippets across projects.',
    category: 'Dev Tool',
    tags: ['developer-tools', 'productivity', 'code'],
    difficulty: 'intermediate',
    estimatedDays: 10,
    estimatedHoursPerDay: 2,
    pages: ['Home / Search', 'Snippet Detail', 'Create Snippet', 'Collections', 'Settings'],
    features: ['Syntax highlighting', 'Tag-based organization', 'Full-text search', 'Copy-to-clipboard', 'Collections/folders', 'Import from GitHub Gists'],
    techDirection: 'React + Vite, CodeMirror for editing, Dexie for persistence, Fuse.js for fuzzy search',
    whyBuild: 'Solves a real developer pain point. Teaches code editing UI, search indexing, and collection management patterns.',
  },
  {
    title: 'Habitual — Micro Habit Tracker',
    pitch: 'Track tiny daily habits with streaks, heatmaps, and weekly momentum views.',
    category: 'Web App',
    tags: ['habits', 'productivity', 'tracking'],
    difficulty: 'beginner',
    estimatedDays: 8,
    estimatedHoursPerDay: 2,
    pages: ['Today', 'Habits List', 'Add Habit', 'Habit Stats', 'Calendar Heatmap'],
    features: ['Daily check-ins', 'Streak tracking', 'Heatmap calendar', 'Reminders', 'Habit categories', 'Progress charts'],
    techDirection: 'React + Zustand + Dexie, date-fns for calendar logic, recharts for visualizations',
    whyBuild: 'Teaches date manipulation, streak logic, and calendar rendering. A universally-useful product everyone relates to.',
  },
  {
    title: 'Readwise Clone — Read-It-Later',
    pitch: 'Save articles, highlights, and notes. Review them with spaced repetition.',
    category: 'Web App',
    tags: ['reading', 'learning', 'productivity'],
    difficulty: 'intermediate',
    estimatedDays: 14,
    estimatedHoursPerDay: 2,
    pages: ['Library', 'Article Reader', 'Add Article', 'Highlights', 'Daily Review', 'Stats'],
    features: ['Save URLs', 'Highlight text', 'Add notes', 'Spaced repetition queue', 'Tags and collections', 'Reading progress', 'Export to markdown'],
    techDirection: 'React + Zustand + Dexie, article parsing, custom reader view, spaced repetition algorithm',
    whyBuild: 'Combines web scraping, text processing, and spaced repetition — three powerful concepts. Immediately useful for developers who read a lot.',
  },
  {
    title: 'Interview Prep Tracker',
    pitch: 'Track LeetCode/DSA problems, companies applied to, and interview rounds.',
    category: 'Web App',
    tags: ['career', 'coding-interview', 'tracking'],
    difficulty: 'intermediate',
    estimatedDays: 10,
    estimatedHoursPerDay: 2,
    pages: ['Dashboard', 'Problems List', 'Add Problem', 'Company Tracker', 'Schedule', 'Notes'],
    features: ['Problem log with difficulty', 'Spaced repetition for review', 'Company pipeline tracking', 'Interview round notes', 'Weak topic identification', 'Progress stats'],
    techDirection: 'React + Zustand + Dexie, category-based problem organization, timeline view',
    whyBuild: 'Solves a problem you are likely experiencing right now. Complex data relationships make it a great architecture exercise.',
  },
  {
    title: 'Budget Buddy — Personal Finance',
    pitch: 'Track income, expenses, and savings goals with a minimal, beautiful UI.',
    category: 'Web App',
    tags: ['finance', 'budgeting', 'tracking'],
    difficulty: 'intermediate',
    estimatedDays: 12,
    estimatedHoursPerDay: 2,
    pages: ['Overview', 'Transactions', 'Add Transaction', 'Categories', 'Budget Goals', 'Reports'],
    features: ['Transaction logging', 'Category tagging', 'Monthly budget limits', 'Savings goals with progress', 'Spending charts', 'CSV export', 'Recurring transactions'],
    techDirection: 'React + Zustand + Dexie, recharts for charts, date-fns for period calculations',
    whyBuild: 'Finance apps require strong data modeling and aggregation logic. Great for learning chart libraries and period-based reporting.',
  },
  {
    title: 'Retro Board — Sprint Retrospectives',
    pitch: 'Run async team retrospectives. Collect feedback, vote, and export action items.',
    category: 'Web App',
    tags: ['team', 'agile', 'retrospective'],
    difficulty: 'advanced',
    estimatedDays: 14,
    estimatedHoursPerDay: 2,
    pages: ['Boards List', 'New Board', 'Board View', 'Voting Phase', 'Action Items', 'History'],
    features: ['Create boards by sprint', 'Column-based card system', 'Anonymous card submission', 'Voting on items', 'Group similar items', 'Action item export', 'Timer for phases'],
    techDirection: 'React + Zustand, drag-and-drop with dnd-kit, real-time with Convex, local draft mode',
    whyBuild: 'Combines drag-and-drop, real-time updates, and multi-phase workflows. Very transferable to other collaborative tool patterns.',
  },
  {
    title: 'API Playground — HTTP Client',
    pitch: 'A minimal Postman-like tool for testing APIs with request history and collections.',
    category: 'Dev Tool',
    tags: ['developer-tools', 'api', 'http'],
    difficulty: 'advanced',
    estimatedDays: 16,
    estimatedHoursPerDay: 2,
    pages: ['Workspace', 'Request Builder', 'Response Viewer', 'Collections', 'History', 'Environments'],
    features: ['HTTP method selector', 'Headers and body editors', 'Response formatting', 'Request collections', 'Request history', 'Environment variables', 'Response timing'],
    techDirection: 'React + Zustand + Dexie, CodeMirror for JSON editing, native fetch for requests, response formatting',
    whyBuild: 'One of the most impressive solo dev tools to build. Demonstrates deep understanding of HTTP, JSON, and complex editor UIs.',
  },
  {
    title: 'QuickLinks — Command Palette Launcher',
    pitch: 'A browser extension and web app that lets you create, search, and launch personal quick links via keyboard.',
    category: 'Browser Extension',
    tags: ['productivity', 'browser', 'keyboard-driven'],
    difficulty: 'intermediate',
    estimatedDays: 10,
    estimatedHoursPerDay: 2,
    pages: ['Popup / Command Palette', 'Link Manager', 'Add Link', 'Categories', 'Settings', 'Import/Export'],
    features: ['Fuzzy search links', 'Keyboard navigation', 'Categories and tags', 'Import from bookmarks', 'Custom aliases', 'Sync across devices', 'Recently visited'],
    techDirection: 'React + Vite, Dexie for local storage, Fuse.js for fuzzy search, keyboard event management',
    whyBuild: 'Small enough to finish in a week, complex enough to show real product thinking. Browser APIs and keyboard UX are valuable skills.',
  },
  {
    title: 'Kanflow — Personal Kanban Board',
    pitch: 'A drag-and-drop kanban board for managing personal tasks and projects.',
    category: 'Web App',
    tags: ['productivity', 'kanban', 'task-management'],
    difficulty: 'intermediate',
    estimatedDays: 10,
    estimatedHoursPerDay: 2,
    pages: ['Board View', 'Card Detail', 'Boards List', 'Archive', 'Labels', 'Search'],
    features: ['Drag-and-drop cards', 'Custom columns', 'Card labels and due dates', 'Card detail modal', 'Archive completed cards', 'Keyboard shortcuts', 'Board templates'],
    techDirection: 'React + Zustand + Dexie, dnd-kit for drag-and-drop, date-fns for due date handling',
    whyBuild: 'Drag-and-drop is one of the most commonly requested UI patterns. Building kanban teaches both DX and data modeling well.',
  },
  {
    title: 'Focusly — Pomodoro + Task Timer',
    pitch: 'Focus sessions with Pomodoro timer, distraction blocking intentions, and productivity tracking.',
    category: 'Web App',
    tags: ['productivity', 'focus', 'pomodoro'],
    difficulty: 'beginner',
    estimatedDays: 7,
    estimatedHoursPerDay: 2,
    pages: ['Timer', 'Today\'s Tasks', 'Session History', 'Stats', 'Settings'],
    features: ['Pomodoro / custom timer', 'Task intention for each session', 'Break reminders', 'Session history log', 'Focus streak', 'Distraction tally', 'Weekly stats'],
    techDirection: 'React + Zustand + Dexie, Web Audio API for timer sounds, custom timer hook, notifications API',
    whyBuild: 'Timer-based apps teach state transitions, audio APIs, and notification permissions. Small but surprisingly satisfying to build.',
  },
  {
    title: 'LinkGraph — Visual Bookmark Mind Map',
    pitch: 'Organize bookmarks and notes as a visual node graph instead of folders.',
    category: 'Web App',
    tags: ['productivity', 'bookmarks', 'visualization'],
    difficulty: 'expert',
    estimatedDays: 18,
    estimatedHoursPerDay: 2,
    pages: ['Graph View', 'List View', 'Add Node', 'Node Detail', 'Search', 'Export'],
    features: ['Drag node graph', 'Bidirectional links', 'Node types: URLs, notes, images', 'Cluster by tag', 'Zoom and pan', 'Import from browser', 'Export as JSON/image'],
    techDirection: 'React + Zustand + Dexie, D3.js or React Flow for graph, custom drag interactions, canvas rendering',
    whyBuild: 'Graph visualization is a powerful skill. Building a visual tool for personal use shows strong systems thinking and frontend depth.',
  },
  {
    title: 'MockAPI — Local API Mocker',
    pitch: 'Create fake REST APIs for frontend development without any backend setup.',
    category: 'Dev Tool',
    tags: ['developer-tools', 'mocking', 'api'],
    difficulty: 'advanced',
    estimatedDays: 14,
    estimatedHoursPerDay: 2,
    pages: ['APIs List', 'API Builder', 'Endpoint Editor', 'Response Preview', 'Logs', 'Settings'],
    features: ['Define endpoints visually', 'Dynamic response templates', 'Status code selection', 'Response delay simulation', 'Request logging', 'Export as OpenAPI spec', 'Share mock URLs'],
    techDirection: 'React + Zustand + Dexie, Service Worker for request interception, JSON schema for response templates',
    whyBuild: 'Service Workers + request interception is advanced browser tech. Highly useful tool in any frontend developer\'s toolkit.',
  },
  {
    title: 'TypeSprint — Typing Speed Trainer',
    pitch: 'Practice typing with code snippets, custom texts, and detailed WPM breakdowns.',
    category: 'Web App',
    tags: ['learning', 'typing', 'practice'],
    difficulty: 'beginner',
    estimatedDays: 6,
    estimatedHoursPerDay: 2,
    pages: ['Home', 'Test Screen', 'Results', 'History', 'Leaderboard', 'Settings'],
    features: ['Code-focused typing tests', 'WPM and accuracy tracking', 'Error highlighting', 'Personal records', 'Custom text input', 'Keyboard heatmap', 'Practice mode'],
    techDirection: 'React + Zustand + Dexie, character-by-character comparison logic, keyboard event handling, timer precision',
    whyBuild: 'Keyboard input handling and real-time character comparison is harder than it looks. Great for understanding React event systems deeply.',
  },
  {
    title: 'Portfolio Builder — Dev Portfolio Generator',
    pitch: 'Build and export a personal portfolio site from a form-driven interface.',
    category: 'Dev Tool',
    tags: ['career', 'portfolio', 'generator'],
    difficulty: 'intermediate',
    estimatedDays: 12,
    estimatedHoursPerDay: 2,
    pages: ['Editor', 'Preview', 'Projects', 'Skills', 'Experience', 'Export'],
    features: ['Section-by-section editor', 'Live preview pane', 'Theme selection', 'Project cards with screenshots', 'Skills visualization', 'Export as static HTML/CSS', 'GitHub integration'],
    techDirection: 'React + Zustand + Dexie, react-to-print or html2canvas for export, template system for themes',
    whyBuild: 'Meta: building a tool about your own career. Teaches template engines, print/export flows, and live preview patterns.',
  },
  {
    title: 'GameLog — Video Game Journal',
    pitch: 'Track your gaming backlog, completions, playtime, and personal ratings.',
    category: 'Web App',
    tags: ['gaming', 'tracking', 'journal'],
    difficulty: 'beginner',
    estimatedDays: 7,
    estimatedHoursPerDay: 2,
    pages: ['Dashboard', 'Backlog', 'Currently Playing', 'Completed', 'Wishlist', 'Stats'],
    features: ['Game log with status', 'Playtime tracking', 'Personal ratings and notes', 'Platform filter', 'Backlog priority queue', 'Completion stats', 'IGDB API integration'],
    techDirection: 'React + Zustand + Dexie, IGDB API for game data, cover art display, rating system',
    whyBuild: 'Consume a third-party gaming API. Very approachable domain that makes feature decisions feel natural and fun.',
  },
]

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateProjectIdeas(count = 3, excludeIds: string[] = []): ProjectIdea[] {
  const available = IDEA_POOL.filter(
    (t) => !excludeIds.includes(slugTitle(t.title))
  )

  const shuffled = [...available].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))

  return selected.map((template) => ({
    ...template,
    id: generateId(),
    status: 'idea' as const,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    generatedAt: Date.now(),
  }))
}

export function generateSingleIdea(category?: string): ProjectIdea {
  const pool = category
    ? IDEA_POOL.filter((t) => t.category === category)
    : IDEA_POOL

  const template = pool[Math.floor(Math.random() * pool.length)]
  return {
    ...template,
    id: generateId(),
    status: 'idea' as const,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    generatedAt: Date.now(),
  }
}

function slugTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-')
}

export const CATEGORIES = [...new Set(IDEA_POOL.map((t) => t.category))]
export const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']
