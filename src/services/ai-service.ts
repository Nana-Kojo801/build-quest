/**
 * OpenRouter AI service — thin fetch wrapper over the OpenAI-compatible API.
 * API key is stored locally in Dexie settings and never sent to Convex.
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface OpenRouterConfig {
  apiKey: string
  model: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ─── Error types ──────────────────────────────────────────────────────────────

export type AIErrorCode = 'AUTH' | 'RATE_LIMIT' | 'NETWORK' | 'PARSE' | 'UNKNOWN'

export class AIServiceError extends Error {
  readonly code: AIErrorCode
  readonly retryable: boolean

  constructor(message: string, code: AIErrorCode, retryable = false) {
    super(message)
    this.name = 'AIServiceError'
    this.code = code
    this.retryable = retryable
  }
}

// ─── Core request ─────────────────────────────────────────────────────────────

export async function callOpenRouter(
  config: OpenRouterConfig,
  messages: ChatMessage[],
): Promise<string> {
  let response: Response

  try {
    response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://buildquest.app',
        'X-Title': 'BuildQuest',
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 1.1,
        max_tokens: 4096,
      }),
    })
  } catch {
    throw new AIServiceError(
      'Network request failed — check your connection',
      'NETWORK',
      true,
    )
  }

  if (response.status === 401 || response.status === 403) {
    throw new AIServiceError(
      'Invalid or expired API key — check your OpenRouter key in Settings',
      'AUTH',
      false,
    )
  }
  if (response.status === 429) {
    throw new AIServiceError(
      'Rate limit hit — wait a moment and try again',
      'RATE_LIMIT',
      true,
    )
  }
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.error?.message ?? ''
    } catch { /* ignore */ }
    throw new AIServiceError(
      `OpenRouter error ${response.status}${detail ? `: ${detail}` : ''}`,
      'UNKNOWN',
      response.status >= 500,
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new AIServiceError('Failed to parse API response', 'PARSE', false)
  }

  const content = (data as { choices?: Array<{ message?: { content?: string } }> })
    ?.choices?.[0]?.message?.content

  if (!content) {
    throw new AIServiceError('Empty response from AI model', 'PARSE', false)
  }

  return content
}

// ─── Connection test ──────────────────────────────────────────────────────────

export async function testOpenRouterConnection(config: OpenRouterConfig): Promise<{
  ok: boolean
  error?: string
}> {
  try {
    await callOpenRouter(config, [
      { role: 'user', content: 'Respond with exactly: {"ok":true}' },
    ])
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof AIServiceError ? err.message : 'Unknown error',
    }
  }
}

// ─── Model catalogue ──────────────────────────────────────────────────────────

export const OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    description: 'Fast & cheap — great default',
  },
  {
    id: 'google/gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Reliable Google model',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Reliable OpenAI model',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Anthropic — creative & structured',
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B',
    description: 'Open source, often free tier',
  },
] as const

export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.0-flash-001'
