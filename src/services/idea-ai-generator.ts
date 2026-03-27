/**
 * AI-powered project idea generator.
 * Sends a structured prompt to OpenRouter and parses the JSON response
 * into fully typed ProjectIdea objects.
 */

import { callOpenRouter, AIServiceError, type OpenRouterConfig } from './ai-service'
import { generateId } from '@/lib/utils'
import type { ProjectIdea, Difficulty } from '@/lib/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'Web App', 'Mobile App', 'CLI Tool', 'API/Backend',
  'Dev Tool', 'Game', 'AI/ML', 'Browser Extension', 'Desktop App',
]

const VALID_DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert']
const VALID_SUITABILITIES = ['MVP', 'Portfolio', 'Monetization', 'Learning']

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildGenerationPrompt(
  count: number,
  category?: string | null,
  difficulty?: string | null,
  techStack?: string[],
  previousTitles?: string[],
): string {
  const categoryLine = category
    ? `All ideas must use category: "${category}"`
    : `Use a variety of categories from: ${VALID_CATEGORIES.map((c) => `"${c}"`).join(', ')}`

  const difficultyLine = difficulty
    ? `All ideas must use difficulty: "${difficulty}"`
    : 'Mix difficulty levels appropriately'

  const techLine = techStack && techStack.length > 0
    ? `Preferred tech stack: ${techStack.join(', ')} — use these as the foundation in techDirection, you may add complementary tools`
    : 'Choose appropriate technologies for each idea'

  const avoidLine = previousTitles && previousTitles.length > 0
    ? `Do NOT generate ideas with titles or concepts similar to any of these (already seen this session): ${previousTitles.join(', ')}`
    : 'All ideas should be fresh and varied'

  const seed = `${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`

  return `You are an expert project idea generator for solo developers. (session: ${seed})

Generate exactly ${count} unique, practical, and interesting project ideas.

Rules:
- ${categoryLine}
- ${difficultyLine}
- ${techLine}
- ${avoidLine}
- Each idea must be realistically buildable by ONE developer in the estimated time
- Avoid plain CRUD apps — every idea needs an interesting angle or clever constraint
- Ideas should be genuinely useful: portfolio-worthy, learnable, or potentially monetizable
- Be specific with titles — "DevLog" not "Productivity App"
- Vary the domain and problem space across ideas — don't cluster around similar topics

Respond ONLY with a valid JSON object in this exact shape (no markdown, no explanation):

{
  "ideas": [
    {
      "title": "CoolProject",
      "pitch": "One compelling sentence describing what it does (max 120 chars)",
      "description": "2-3 sentences: what it does, what makes it interesting or unique",
      "category": "Web App",
      "tags": ["tag1", "tag2", "tag3"],
      "difficulty": "intermediate",
      "estimatedDays": 10,
      "estimatedHoursPerDay": 2,
      "pages": ["Dashboard", "Settings", "Profile"],
      "features": ["Feature one", "Feature two", "Feature three", "Feature four", "Feature five"],
      "techDirection": "React + Vite, Tailwind CSS, SQLite via Drizzle for local data",
      "whyBuild": "2-3 sentences on why a solo dev should build this — skills gained, portfolio value, potential revenue",
      "roadmap": "1. Scaffold + routing. 2. Core data model + local persistence. 3. Main UI flows. 4. Polish + deploy.",
      "suitability": "Portfolio"
    }
  ]
}

Validation rules (violating these will cause errors):
- category: EXACTLY one of ${VALID_CATEGORIES.map((c) => `"${c}"`).join(', ')}
- difficulty: EXACTLY one of "beginner", "intermediate", "advanced", "expert"
- suitability: EXACTLY one of "MVP", "Portfolio", "Monetization", "Learning"
- estimatedDays: integer between 3 and 30
- estimatedHoursPerDay: integer between 1 and 4
- pages: array of 3–8 strings
- features: array of 5–8 strings
- tags: array of 3–5 strings`
}

// ─── Response validator / normaliser ─────────────────────────────────────────

interface RawIdeaObject {
  title?: unknown
  pitch?: unknown
  description?: unknown
  category?: unknown
  tags?: unknown
  difficulty?: unknown
  estimatedDays?: unknown
  estimatedHoursPerDay?: unknown
  pages?: unknown
  features?: unknown
  techDirection?: unknown
  whyBuild?: unknown
  roadmap?: unknown
  suitability?: unknown
}

function normalizeIdea(raw: RawIdeaObject): ProjectIdea {
  const now = Date.now()

  const category = VALID_CATEGORIES.includes(String(raw.category ?? ''))
    ? String(raw.category)
    : 'Web App'

  const difficulty: Difficulty = VALID_DIFFICULTIES.includes(raw.difficulty as Difficulty)
    ? (raw.difficulty as Difficulty)
    : 'intermediate'

  const suitability = VALID_SUITABILITIES.includes(String(raw.suitability ?? ''))
    ? String(raw.suitability)
    : 'Portfolio'

  const clampedDays = typeof raw.estimatedDays === 'number'
    ? Math.min(30, Math.max(3, Math.round(raw.estimatedDays)))
    : 7

  const clampedHours = typeof raw.estimatedHoursPerDay === 'number'
    ? Math.min(4, Math.max(1, Math.round(raw.estimatedHoursPerDay)))
    : 2

  const toStringArray = (val: unknown): string[] =>
    Array.isArray(val) ? (val as unknown[]).map(String) : []

  return {
    id: generateId(),
    title: String(raw.title ?? 'Untitled Project').trim(),
    pitch: String(raw.pitch ?? '').slice(0, 200),
    description: raw.description ? String(raw.description).trim() : undefined,
    category,
    tags: toStringArray(raw.tags).slice(0, 5),
    difficulty,
    estimatedDays: clampedDays,
    estimatedHoursPerDay: clampedHours,
    pages: toStringArray(raw.pages).slice(0, 8),
    features: toStringArray(raw.features).slice(0, 8),
    techDirection: String(raw.techDirection ?? '').trim(),
    whyBuild: String(raw.whyBuild ?? '').trim(),
    roadmap: raw.roadmap ? String(raw.roadmap).trim() : undefined,
    suitability,
    source: 'ai',
    status: 'idea',
    createdAt: now,
    updatedAt: now,
    generatedAt: now,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GenerateIdeasOptions {
  category?: string | null
  difficulty?: string | null
  techStack?: string[]
  previousTitles?: string[]
}

/**
 * Generate project ideas using the AI.
 * Throws AIServiceError on API failures.
 * Throws Error on parsing failures.
 */
export async function generateIdeasWithAI(
  count: number,
  config: OpenRouterConfig,
  options: GenerateIdeasOptions = {},
): Promise<ProjectIdea[]> {
  const prompt = buildGenerationPrompt(count, options.category, options.difficulty, options.techStack, options.previousTitles)

  const content = await callOpenRouter(config, [
    {
      role: 'system',
      content:
        'You are a helpful assistant that generates project ideas. Always respond with valid JSON only.',
    },
    { role: 'user', content: prompt },
  ])

  // Parse outer JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    // Model sometimes wraps JSON in markdown fences — strip and retry
    const stripped = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    try {
      parsed = JSON.parse(stripped)
    } catch {
      throw new AIServiceError(
        'AI returned malformed JSON — try again or switch models',
        'PARSE',
        true,
      )
    }
  }

  // Extract ideas array from wrapper object
  const rawIdeas = (parsed as { ideas?: unknown })?.ideas
  if (!Array.isArray(rawIdeas) || rawIdeas.length === 0) {
    throw new AIServiceError(
      'AI response did not contain a valid ideas array — try again',
      'PARSE',
      true,
    )
  }

  return (rawIdeas as RawIdeaObject[]).slice(0, count).map(normalizeIdea)
}
