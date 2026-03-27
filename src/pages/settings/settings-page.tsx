import { useEffect, useState } from 'react'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import { SettingsHeader } from './components/settings-header'
import { ScheduleSettings } from './components/schedule-settings'
import { DataManagement } from './components/data-management'
import { ProgressCard } from './components/progress-card'
import { AboutCard } from './components/about-card'

export default function SettingsPage() {
  const { settings, progress, loadSettings, loadProgress, updateSettings } = useProjectStore()
  const { addToast } = useUIStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const done = () => setLoading(false)
    const timeout = setTimeout(done, 2000)
    Promise.all([loadSettings(), loadProgress()])
      .finally(() => { clearTimeout(timeout); done() })
    return () => clearTimeout(timeout)
  }, [loadSettings, loadProgress])

  const handleSettingChange = async (key: string, value: unknown) => {
    await updateSettings({ [key]: value })
    addToast({ title: 'Settings saved', variant: 'success' })
  }

  return (
    <div className="min-h-screen pb-8">
      <SettingsHeader />
      <div className="px-4 space-y-4 max-w-2xl mx-auto">
        {progress && <ProgressCard progress={progress} />}
        {loading ? (
          <div className="h-32 rounded-xl bg-card/60 border border-border animate-pulse" />
        ) : (
          settings && <ScheduleSettings settings={settings} onChange={handleSettingChange} />
        )}
        <DataManagement />
        <AboutCard />
      </div>
    </div>
  )
}
