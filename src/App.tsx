import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/stores/ui-store'

const QuestHubPage = lazy(() => import('@/pages/quest-hub/quest-hub-page'))
const ProjectGeneratorPage = lazy(() => import('@/pages/project-generator/project-generator-page'))
const IdeasLibraryPage = lazy(() => import('@/pages/ideas-library/ideas-library-page'))
const ActiveProjectsPage = lazy(() => import('@/pages/active-projects/active-projects-page'))
const ProjectDetailPage = lazy(() => import('@/pages/project-detail/project-detail-page'))
const QuestLogPage = lazy(() => import('@/pages/quest-log/quest-log-page'))
const SchedulePage = lazy(() => import('@/pages/schedule/schedule-page'))
const ExportBundlePage = lazy(() => import('@/pages/export-bundle/export-bundle-page'))
const SettingsPage = lazy(() => import('@/pages/settings/settings-page'))

function PageFallback() {
  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  )
}

function OnlineWatcher() {
  const setOnline = useUIStore((s) => s.setOnline)
  const addToast = useUIStore((s) => s.addToast)

  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      addToast({ title: 'Back online', description: 'Changes will sync', variant: 'success' })
    }
    const onOffline = () => {
      setOnline(false)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [setOnline, addToast])

  return null
}

type LazyPage = React.LazyExoticComponent<() => React.JSX.Element | null>
function S(Page: LazyPage) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <OnlineWatcher />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={S(QuestHubPage)} />
          <Route path="generate" element={S(ProjectGeneratorPage)} />
          <Route path="ideas" element={S(IdeasLibraryPage)} />
          <Route path="projects" element={S(ActiveProjectsPage)} />
          <Route path="projects/:id" element={S(ProjectDetailPage)} />
          <Route path="quests" element={S(QuestLogPage)} />
          <Route path="schedule" element={S(SchedulePage)} />
          <Route path="export/:ideaId" element={S(ExportBundlePage)} />
          <Route path="settings" element={S(SettingsPage)} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
