import { useState } from 'react'
import { Bot, Eye, EyeOff, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { OPENROUTER_MODELS, DEFAULT_OPENROUTER_MODEL, testOpenRouterConnection } from '@/services/ai-service'
import type { AppSettings } from '@/lib/types'

interface Props {
  settings: AppSettings
  onChange: (key: string, value: unknown) => Promise<void>
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail'

export function AISettings({ settings, onChange }: Props) {
  const [showKey, setShowKey] = useState(false)
  const [draftKey, setDraftKey] = useState(settings.openRouterApiKey ?? '')
  const [testState, setTestState] = useState<TestState>('idle')
  const [testError, setTestError] = useState('')

  const currentModel = settings.openRouterModel ?? DEFAULT_OPENROUTER_MODEL
  const hasKey = draftKey.trim().length > 0

  async function handleSaveKey() {
    await onChange('openRouterApiKey', draftKey.trim() || undefined)
    setTestState('idle')
  }

  async function handleTest() {
    const key = draftKey.trim()
    if (!key) return
    setTestState('testing')
    setTestError('')
    const result = await testOpenRouterConnection({ apiKey: key, model: currentModel })
    if (result.ok) {
      setTestState('ok')
    } else {
      setTestState('fail')
      setTestError(result.error ?? 'Connection failed')
    }
  }

  const keyChanged = draftKey.trim() !== (settings.openRouterApiKey ?? '')

  return (
    <Card className="quest-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot size={16} className="text-primary" />
          AI Generation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Explainer */}
        <div className="rounded-md border border-border bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
          BuildQuest uses{' '}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-0.5"
          >
            OpenRouter <ExternalLink size={10} />
          </a>{' '}
          to generate real project ideas with AI. Your API key is stored locally and never
          sent to any server other than OpenRouter.
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="api-key" className="text-sm font-medium">
            OpenRouter API Key
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={draftKey}
                onChange={(e) => {
                  setDraftKey(e.target.value)
                  setTestState('idle')
                }}
                placeholder="sk-or-v1-…"
                className="pr-9 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {keyChanged ? (
              <Button size="sm" onClick={handleSaveKey} className="shrink-0">
                Save
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleTest}
                disabled={!hasKey || testState === 'testing'}
                className="shrink-0 gap-1.5"
              >
                {testState === 'testing' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : testState === 'ok' ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : testState === 'fail' ? (
                  <XCircle size={13} className="text-rose-400" />
                ) : null}
                Test
              </Button>
            )}
          </div>

          {/* Status feedback */}
          {testState === 'ok' && (
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} /> Connected successfully
            </p>
          )}
          {testState === 'fail' && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <XCircle size={11} /> {testError || 'Connection failed — check your key'}
            </p>
          )}
          {!hasKey && (
            <p className="text-[11px] text-muted-foreground/70">
              Get a free key at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-primary/80 hover:text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          )}
        </div>

        <Separator />

        {/* Model selector */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-sm font-medium">Model</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Model used for idea generation
            </p>
          </div>
          <Select
            value={currentModel}
            onValueChange={(v) => onChange('openRouterModel', v)}
          >
            <SelectTrigger className="w-[190px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPENROUTER_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">{m.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status summary */}
        <div className="rounded-md border border-border bg-secondary/20 px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">AI generation status</span>
          {settings.openRouterApiKey ? (
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} /> Ready
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
              <XCircle size={11} /> No key — using example ideas
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
