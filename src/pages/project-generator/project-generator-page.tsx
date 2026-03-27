import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, WifiOff, KeyRound, AlertTriangle, RefreshCw } from 'lucide-react'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import { generateIdeasWithAI } from '@/services/idea-ai-generator'
import { AIServiceError, DEFAULT_OPENROUTER_MODEL } from '@/services/ai-service'
import { GeneratorControls, CATEGORY_TECH_DEFAULTS } from './components/generator-controls'
import { IdeaCard } from './components/idea-card'
import { IdeaDetailSheet } from './components/idea-detail-sheet'
import { GenerationEmpty } from './components/generation-empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { ProjectIdea, Difficulty } from '@/lib/types'

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function GeneratingSkeletons({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3 px-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <Skeleton className="h-44 w-full rounded-2xl skeleton-shimmer" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Status banner ────────────────────────────────────────────────────────────

function StatusBanner({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="mx-4 mb-2 flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground"
    >
      {icon}
      <span>{message}</span>
    </motion.div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────

function GenerationError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-8 text-center"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-destructive/40 bg-destructive/20">
        <AlertTriangle size={18} className="text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">Generation failed</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-1.5 border-border/60"
      >
        <RefreshCw size={13} />
        Try again
      </Button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectGeneratorPage() {
  const navigate = useNavigate()

  const { ideas, settings, saveIdea, startProject, loadProjects } = useProjectStore()
  const { addToast, isGenerating, setGenerating, isOnline } = useUIStore()

  // Controls
  const [count, setCount] = useState(3)
  const [category, setCategory] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [techStack, setTechStack] = useState<string[]>([])

  function handleCategoryChange(cat: string | null) {
    setCategory(cat)
    setTechStack(cat ? (CATEGORY_TECH_DEFAULTS[cat] ?? []) : [])
  }

  // Results
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  // Track all titles generated this page session to avoid repeats
  const [seenTitles, setSeenTitles] = useState<string[]>([])

  // Sheet
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSavingId, setIsSavingId] = useState<string | null>(null)

  // Session saves tracking
  const [savedThisSession, setSavedThisSession] = useState<Set<string>>(new Set())

  const savedIdeaTitles = new Set(
    ideas.filter((i) => i.status === 'saved' || i.status === 'active').map((i) => i.title),
  )

  function isSaved(idea: ProjectIdea): boolean {
    return savedThisSession.has(idea.id) || savedIdeaTitles.has(idea.title)
  }

  const apiKey = (import.meta.env.VITE_OPEN_ROUTER_API_KEY as string | undefined) || settings?.openRouterApiKey
  const model = settings?.openRouterModel ?? DEFAULT_OPENROUTER_MODEL
  const canGenerate = !!(apiKey && isOnline)

  const disabledReason = !isOnline
    ? 'Internet connection required for AI generation'
    : !apiKey
      ? 'Add an OpenRouter API key in Settings to generate'
      : undefined

  // ─── Generate ───────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!canGenerate) return

    setGenerating(true, 'AI is crafting ideas…')
    setHasGenerated(false)
    setGeneratedIdeas([])
    setSelectedIdea(null)
    setSavedThisSession(new Set())
    setGenerationError(null)

    try {
      const results = await generateIdeasWithAI(
        count,
        { apiKey: apiKey!, model },
        {
          category,
          difficulty,
          techStack: techStack.length > 0 ? techStack : undefined,
          previousTitles: seenTitles.length > 0 ? seenTitles : undefined,
        },
      )
      setGeneratedIdeas(results)
      setSeenTitles((prev) => [...prev, ...results.map((r) => r.title)])
      setHasGenerated(true)
      // Auto-open the first idea so the user can review immediately
      if (results.length > 0) setSelectedIdea(results[0])
    } catch (err) {
      let message = 'Something went wrong. Please try again.'
      if (err instanceof AIServiceError) {
        message = err.message
      }
      setGenerationError(message)
    } finally {
      setGenerating(false)
    }
  }

  // ─── Save / start ────────────────────────────────────────────────────────────

  async function handleSaveIdea(idea: ProjectIdea) {
    if (isSaved(idea)) return
    setIsSavingId(idea.id)
    try {
      await saveIdea({ ...idea, status: 'saved' })
      setSavedThisSession((prev) => new Set(prev).add(idea.id))
      addToast({
        title: 'Idea saved!',
        description: `"${idea.title}" added to your library`,
        variant: 'success',
      })
    } catch (err) {
      const isQuota = err instanceof Error &&
        (err.name === 'QuotaExceededError' || err.message.includes('QuotaExceeded') ||
         (err as { inner?: Error }).inner?.name === 'QuotaExceededError')
      addToast({
        title: isQuota ? 'Storage full' : 'Save failed',
        description: isQuota
          ? 'Browser storage is full. Try clearing site data in DevTools → Application → Storage.'
          : 'Something went wrong saving this idea. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingId(null)
    }
  }

  async function handleStartProject(idea: ProjectIdea) {
    setIsStarting(true)
    try {
      if (!isSaved(idea)) {
        await saveIdea({ ...idea, status: 'saved' })
        setSavedThisSession((prev) => new Set(prev).add(idea.id))
      }
      const projectId = await startProject({ ...idea, status: 'saved' })
      await loadProjects()
      addToast({
        title: 'Project started!',
        description: `"${idea.title}" is now active. Time to build!`,
        variant: 'xp',
        xpAmount: 100,
      })
      setSelectedIdea(null)
      navigate(`/projects/${projectId}`)
    } catch {
      addToast({
        title: 'Error starting project',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsStarting(false)
    }
  }

  const selectedIndex = selectedIdea
    ? generatedIdeas.findIndex((i) => i.id === selectedIdea.id)
    : -1

  function handleDismissIdea(id: string) {
    const idx = generatedIdeas.findIndex((i) => i.id === id)
    const next = generatedIdeas.find((i, j) => i.id !== id && j > idx)
      ?? generatedIdeas.find((i, j) => i.id !== id && j < idx)
      ?? null
    setGeneratedIdeas((prev) => prev.filter((i) => i.id !== id))
    setSelectedIdea(next)
  }

  function handleNavPrev() {
    if (selectedIndex > 0) setSelectedIdea(generatedIdeas[selectedIndex - 1])
  }

  function handleNavNext() {
    if (selectedIndex < generatedIdeas.length - 1) setSelectedIdea(generatedIdeas[selectedIndex + 1])
  }

  function handleRegenerate() {
    setSelectedIdea(null)
    handleGenerate()
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Sparkles size={14} className="text-primary" />
          </div>
          <h1 className="text-lg font-black text-foreground tracking-tight">Project Generator</h1>
        </div>
        <p className="text-[13px] text-muted-foreground ml-9">
          AI-powered idea generation
        </p>
        <div className="flex items-center gap-1.5 mt-2 ml-9">
          <Zap size={10} className="text-primary" />
          <span className="text-[10px] text-muted-foreground">
            Complete projects to earn XP and level up
          </span>
        </div>
      </div>

      {/* Status banners */}
      <div className="mt-3">
        <AnimatePresence>
          {!isOnline && (
            <StatusBanner
              key="offline"
              icon={<WifiOff size={13} className="shrink-0 text-amber-400" />}
              message="Offline — internet required for AI generation"
            />
          )}
          {isOnline && !apiKey && (
            <StatusBanner
              key="no-key"
              icon={<KeyRound size={13} className="shrink-0 text-muted-foreground/60" />}
              message="Add an OpenRouter key in Settings to generate ideas"
            />
          )}
          {canGenerate && hasGenerated && !generationError && (
            <StatusBanner
              key="ai-used"
              icon={<Sparkles size={13} className="shrink-0 text-primary" />}
              message="Generated by AI · unique to this session"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <GeneratorControls
        count={count}
        onCountChange={setCount}
        category={category}
        onCategoryChange={handleCategoryChange}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        techStack={techStack}
        onTechStackChange={setTechStack}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        disabledReason={disabledReason}
      />

      {/* Results */}
      <div className="flex-1 mt-5 pb-8">
        {isGenerating ? (
          <GeneratingSkeletons count={count} />
        ) : generationError ? (
          <GenerationError message={generationError} onRetry={handleGenerate} />
        ) : !hasGenerated ? (
          <GenerationEmpty />
        ) : generatedIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <p className="text-sm font-medium text-foreground mb-1">No ideas returned</p>
            <p className="text-xs text-muted-foreground">Try adjusting filters or generating again.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3 px-4">
            <AnimatePresence mode="popLayout">
              {generatedIdeas.map((idea, i) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onClick={() => setSelectedIdea(idea)}
                  onAccept={() => handleSaveIdea(idea)}
                  onDeny={() => handleDismissIdea(idea.id)}
                  isSaved={isSaved(idea)}
                  isSaving={isSavingId === idea.id}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail sheet */}
      <IdeaDetailSheet
        idea={selectedIdea}
        isSaved={selectedIdea ? isSaved(selectedIdea) : false}
        isSaving={selectedIdea ? isSavingId === selectedIdea.id : false}
        isStarting={isStarting}
        total={generatedIdeas.length}
        currentIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        onClose={() => setSelectedIdea(null)}
        onSave={() => selectedIdea && handleSaveIdea(selectedIdea)}
        onStart={() => selectedIdea && handleStartProject(selectedIdea)}
        onDismiss={selectedIdea ? () => handleDismissIdea(selectedIdea.id) : undefined}
        onPrev={handleNavPrev}
        onNext={handleNavNext}
        onRegenerate={handleRegenerate}
      />
    </div>
  )
}
