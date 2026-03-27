import { Pause, Play, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import type { ActiveProject } from '@/lib/types'

interface PauseResumeDialogProps {
  project: ActiveProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (project: ActiveProject) => void
}

export function PauseResumeDialog({
  project,
  open,
  onOpenChange,
  onConfirm,
}: PauseResumeDialogProps) {
  if (!project) return null

  const isPausing = project.status === 'active'

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-xl
                ${isPausing
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-emerald-500/10 border border-emerald-500/30'
                }
              `}
            >
              {isPausing ? (
                <Pause className="h-5 w-5 text-amber-400" />
              ) : (
                <Play className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <AlertDialogTitle className="text-base">
              {isPausing ? 'Pause this quest?' : 'Resume this quest?'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {isPausing ? (
              <>
                <span className="font-medium text-foreground">{project.title}</span> will be
                paused. Your progress is saved and you can resume any time.
                {' '}
                <span className="text-amber-400/80">
                  <AlertTriangle className="inline h-3.5 w-3.5 mr-0.5 -mt-0.5" />
                  Scheduled tasks won't carry over while paused.
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">{project.title}</span> will be
                moved back to active. New tasks will be scheduled from today.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              isPausing
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
            }
            onClick={() => onConfirm(project)}
          >
            {isPausing ? (
              <>
                <Pause className="h-3.5 w-3.5 mr-1.5" />
                Pause Quest
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Resume Quest
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
