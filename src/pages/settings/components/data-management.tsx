import { useState } from 'react'
import { Trash2, Download, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { convexClient } from '@/lib/convex-client'
import { api } from '../../../../convex/_generated/api'
import { useUIStore } from '@/stores/ui-store'
import { useProjectStore } from '@/stores/project-store'
import { useTaskStore } from '@/stores/task-store'

export function DataManagement() {
  const { addToast } = useUIStore()
  const { loadIdeas, loadProjects, loadProgress } = useProjectStore()
  const { loadTasks } = useTaskStore()
  const [isExporting, setIsExporting] = useState(false)

  const handleClearAll = async () => {
    await convexClient.mutation(api.ideas.clearAll, {})
    await convexClient.mutation(api.projects.clearAll, {})
    await convexClient.mutation(api.tasks.clearAll, {})
    await convexClient.mutation(api.progress.reset, {})
    await loadIdeas()
    await loadProjects()
    await loadTasks()
    await loadProgress()
    addToast({ title: 'All data cleared', description: 'Starting fresh.', variant: 'default' })
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const [ideas, projects, tasks, progressDoc] = await Promise.all([
        convexClient.query(api.ideas.list, {}),
        convexClient.query(api.projects.list, {}),
        convexClient.query(api.tasks.list, {}),
        convexClient.query(api.progress.get, {}),
      ])
      const data = {
        ideas: ideas.map(({ _id, _creationTime, ...rest }) => rest),
        projects: projects.map(({ _id, _creationTime, ...rest }) => rest),
        tasks: tasks.map(({ _id, _creationTime, ...rest }) => rest),
        progress: progressDoc ? (({ _id, _creationTime, ...rest }) => rest)(progressDoc) : null,
        exportedAt: Date.now(),
        version: 2,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `buildquest-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      addToast({ title: 'Data exported', variant: 'success' })
    } catch {
      addToast({ title: 'Export failed', variant: 'destructive' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="quest-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Database size={16} className="text-primary" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
          <div>
            <p className="text-sm font-medium">Export your data</p>
            <p className="text-xs text-muted-foreground">Download a JSON backup</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? 'Exporting…' : 'Export'}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
          <div>
            <p className="text-sm font-medium text-destructive">Clear all data</p>
            <p className="text-xs text-muted-foreground">Remove all ideas, projects, and tasks</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 size={14} />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your ideas, projects, tasks, and progress. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, clear everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-xs text-muted-foreground px-1">
          Data is stored in Convex cloud. Export regularly to keep a backup.
        </p>
      </CardContent>
    </Card>
  )
}
