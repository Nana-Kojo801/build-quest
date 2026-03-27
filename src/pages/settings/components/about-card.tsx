import { Sword } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AboutCard() {
  return (
    <Card className="quest-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sword size={16} className="text-primary" />
          About BuildQuest
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Sword size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">BuildQuest v1.0</p>
            <p className="text-xs text-muted-foreground">Gamified project planner for solo devs</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            BuildQuest helps you generate project ideas, create adaptive coding schedules,
            and export Claude Code bundles to kickstart development.
          </p>
          <p>
            Built with React, Vite, Tailwind CSS, shadcn/ui, Zustand, and Dexie.
            Offline-first — your data lives on your device.
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <p className="text-xs text-muted-foreground">Stack</p>
            <p className="text-xs font-medium mt-0.5">React + Vite</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5 text-center">
            <p className="text-xs text-muted-foreground">Storage</p>
            <p className="text-xs font-medium mt-0.5">Dexie (local-first)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
