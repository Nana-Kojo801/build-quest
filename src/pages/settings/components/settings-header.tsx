import { Settings } from 'lucide-react'

export function SettingsHeader() {
  return (
    <div className="px-4 pt-10 pb-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-xl bg-secondary">
          <Settings size={20} className="text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      <p className="text-sm text-muted-foreground ml-12">Customize your BuildQuest experience</p>
    </div>
  )
}
