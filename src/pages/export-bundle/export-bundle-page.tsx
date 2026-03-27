import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import { generateClaudePrompt } from '@/services/prompt-generator'
import { exportClaudeBundle } from '@/services/bundle-exporter'
import { BundlePreviewHeader } from './components/bundle-preview-header'
import { PromptPreview } from './components/prompt-preview'
import { BundleContents } from './components/bundle-contents'
import { ExportSuccessState } from './components/export-success-state'

export default function ExportBundlePage() {
  const { ideaId } = useParams<{ ideaId: string }>()
  const navigate = useNavigate()

  const { ideas, loadIdeas } = useProjectStore()
  const { addToast } = useUIStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const idea = ideas.find((i) => i.id === ideaId)
  const prompt = useMemo(() => (idea ? generateClaudePrompt(idea) : ''), [idea?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      if (ideas.length === 0) {
        await loadIdeas()
      }
      setIsLoading(false)
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async () => {
    if (!idea) return
    setIsDownloading(true)
    try {
      await exportClaudeBundle(idea)
      setDownloaded(true)
      addToast({
        variant: 'xp',
        title: 'Bundle downloaded!',
        description: `${idea.title} is ready for Claude Code.`,
        xpAmount: 100,
      })
    } catch {
      addToast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Something went wrong packaging the bundle. Try again.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadAgain = async () => {
    setDownloaded(false)
    await handleDownload()
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 pb-8">
        {/* Back button */}
        <div className="px-4 pt-4">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="mx-4 rounded-2xl border border-border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="mx-4 rounded-xl border border-border bg-card h-48" />
        <div className="mx-4 rounded-xl border border-border bg-card h-64" />
      </div>
    )
  }

  // 404 state
  if (!isLoading && !idea) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertTriangle size={24} className="text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Project idea not found</h2>
          <p className="text-sm text-muted-foreground">
            This idea doesn't exist or may have been deleted.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft size={15} />
          Go back
        </Button>
      </motion.div>
    )
  }

  if (!idea) return null

  return (
    <div className="pb-8">
      {/* Back nav */}
      <div className="px-4 pt-4 mb-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1 h-8"
        >
          <ArrowLeft size={15} />
          Back
        </Button>
      </div>

      {/* Success state */}
      {downloaded ? (
        <ExportSuccessState
          projectTitle={idea.title}
          onDownloadAgain={handleDownloadAgain}
          onBack={() => navigate(-1)}
        />
      ) : (
        <div className="space-y-6">
          <BundlePreviewHeader
            idea={idea}
            isDownloading={isDownloading}
            onDownload={handleDownload}
          />

          <div className="mx-4 h-px bg-border" />

          <PromptPreview prompt={prompt} />

          <div className="mx-4 h-px bg-border" />

          <BundleContents idea={idea} />
        </div>
      )}
    </div>
  )
}
