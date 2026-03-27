import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './nav-bar'
import { ToastRegion } from './toast-region'
import { OfflineBanner } from './offline-banner'
import { GeneratingOverlay } from './generating-overlay'
import { useProjectStore } from '@/stores/project-store'

/** Initializes settings and progress from Convex on mount. */
function GlobalInit() {
  const { loadSettings, loadProgress } = useProjectStore()
  useEffect(() => {
    Promise.all([loadSettings(), loadProgress()]).catch(console.error)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export function AppShell() {
  return (
    <div className="relative min-h-screen bg-background grid-bg">
      <GlobalInit />
      <OfflineBanner />
      {/*
        Mobile: bottom nav → padding-bottom 5.5rem
        Desktop (lg+): top nav → padding-top 3.5rem (h-14), no bottom padding
      */}
      <main className="pb-[5.5rem] lg:pb-0 lg:pt-14 min-h-screen">
        <Outlet />
      </main>
      <NavBar />
      <ToastRegion />
      <GeneratingOverlay />
    </div>
  )
}
