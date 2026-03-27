import { Clock, Layers, RefreshCw, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { AppSettings } from '@/lib/types'

interface Props {
  settings: AppSettings
  onChange: (key: string, value: unknown) => Promise<void>
}

export function ScheduleSettings({ settings, onChange }: Props) {
  return (
    <Card className="quest-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Schedule & Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hours per day */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-secondary">
              <Clock size={14} className="text-muted-foreground" />
            </div>
            <div>
              <Label className="text-sm font-medium">Hours per day</Label>
              <p className="text-xs text-muted-foreground">Default daily coding time</p>
            </div>
          </div>
          <Select
            value={String(settings.hoursPerDayDefault)}
            onValueChange={(v) => onChange('hoursPerDayDefault', Number(v))}
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8].map((h) => (
                <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Max active projects */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-secondary">
              <Layers size={14} className="text-muted-foreground" />
            </div>
            <div>
              <Label className="text-sm font-medium">Max active projects</Label>
              <p className="text-xs text-muted-foreground">Limit concurrent projects</p>
            </div>
          </div>
          <Select
            value={String(settings.maxActiveProjects)}
            onValueChange={(v) => onChange('maxActiveProjects', Number(v))}
          >
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Auto reschedule */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-secondary">
              <RefreshCw size={14} className="text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="auto-reschedule" className="text-sm font-medium">Auto-reschedule overdue</Label>
              <p className="text-xs text-muted-foreground">Move missed tasks to tomorrow</p>
            </div>
          </div>
          <Switch
            id="auto-reschedule"
            checked={settings.autoReschedule}
            onCheckedChange={(checked) => onChange('autoReschedule', checked)}
          />
        </div>

        <Separator />

        {/* Streak reminder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-secondary">
              <Bell size={14} className="text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="streak-reminder" className="text-sm font-medium">Streak reminders</Label>
              <p className="text-xs text-muted-foreground">Remind to keep streak alive</p>
            </div>
          </div>
          <Switch
            id="streak-reminder"
            checked={settings.showStreakReminder}
            onCheckedChange={(checked) => onChange('showStreakReminder', checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
