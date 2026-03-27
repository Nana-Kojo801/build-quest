import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Lightbulb, Sparkles, BookMarked, Zap, Archive } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectStore } from '@/stores/project-store'
import { useUIStore } from '@/stores/ui-store'
import type { ProjectIdea } from '@/lib/types'
import { IdeasFilterBar, type IdeaStatusFilter } from './components/ideas-filter-bar'
import { IdeaListCard } from './components/idea-list-card'
import { IdeaDetailDialog } from './components/idea-detail-dialog'
import { IdeasEmptyState } from './components/ideas-empty-state'

type TabId = 'all' | 'saved' | 'active' | 'archived'

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Lightbulb },
  { id: 'saved', label: 'Saved', icon: BookMarked },
  { id: 'active', label: 'Active', icon: Zap },
  { id: 'archived', label: 'Archived', icon: Archive },
]

export default function IdeasLibraryPage() {
  const navigate = useNavigate()
  const { ideas, loadIdeas, updateIdeaStatus, startProject, deleteIdea } = useProjectStore()
  const { addToast } = useUIStore()

  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<IdeaStatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [detailIdea, setDetailIdea] = useState<ProjectIdea | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    loadIdeas().finally(() => setIsLoading(false))
  }, [loadIdeas])

  // Ideas filtered by tab
  const tabFiltered = useMemo(() => {
    if (activeTab === 'all') return ideas
    if (activeTab === 'saved') return ideas.filter((i) => i.status === 'saved')
    if (activeTab === 'active') return ideas.filter((i) => i.status === 'active')
    if (activeTab === 'archived') return ideas.filter((i) => i.status === 'archived')
    return ideas
  }, [ideas, activeTab])

  // Tab counts
  const tabCounts = useMemo(
    () => ({
      all: ideas.length,
      saved: ideas.filter((i) => i.status === 'saved').length,
      active: ideas.filter((i) => i.status === 'active').length,
      archived: ideas.filter((i) => i.status === 'archived').length,
    }),
    [ideas],
  )

  // Apply search + filter bar filters
  const filtered = useMemo(() => {
    let list = tabFiltered

    // Status filter bar takes precedence within the tab view
    if (statusFilter !== 'all') {
      list = list.filter((i) => i.status === statusFilter)
    }

    if (categoryFilter !== 'All Categories') {
      list = list.filter((i) => i.category === categoryFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.pitch.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return list
  }, [tabFiltered, statusFilter, categoryFilter, search])

  const hasFilters =
    search.length > 0 || statusFilter !== 'all' || categoryFilter !== 'All Categories'

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('All Categories')
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleViewDetails(idea: ProjectIdea) {
    setDetailIdea(idea)
    setDetailOpen(true)
  }

  async function handleSave(idea: ProjectIdea) {
    const nextStatus = idea.status === 'saved' ? 'idea' : 'saved'
    await updateIdeaStatus(idea.id, nextStatus)
    addToast({
      title: nextStatus === 'saved' ? 'Idea saved' : 'Idea unsaved',
      description: idea.title,
      variant: 'success',
    })
  }

  async function handleStartProject(idea: ProjectIdea) {
    const projectId = await startProject(idea)
    addToast({
      title: 'Quest started!',
      description: `${idea.title} is now active.`,
      variant: 'xp',
      xpAmount: 50,
    })
    navigate('/projects')
    void projectId
  }

  async function handleArchive(idea: ProjectIdea) {
    await updateIdeaStatus(idea.id, 'archived')
    addToast({
      title: 'Idea archived',
      description: idea.title,
      variant: 'default',
    })
  }

  async function handleDelete(idea: ProjectIdea) {
    await deleteIdea(idea.id)
    addToast({
      title: 'Idea deleted',
      variant: 'destructive',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">Ideas Library</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Your quest board of generated and saved project ideas.
              </p>
            </div>
            <Button
              variant="quest"
              size="sm"
              onClick={() => navigate('/generate')}
              className="shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-secondary/50">
            {TABS.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex items-center gap-1.5 text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span
                  className={`
                    ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full
                    px-1 text-[10px] font-semibold tabular-nums
                    ${activeTab === id
                      ? 'bg-primary/15 text-primary'
                      : 'bg-secondary text-muted-foreground'
                    }
                  `}
                >
                  {tabCounts[id]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ id }) => (
            <TabsContent key={id} value={id} className="space-y-4 mt-0">
              {/* Filter bar */}
              <IdeasFilterBar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                resultCount={filtered.length}
              />

              {/* Idea list */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <Skeleton key={n} className="h-28 w-full rounded-xl" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <IdeasEmptyState
                  hasFilters={hasFilters || tabCounts[id] > 0}
                  onClearFilters={clearFilters}
                />
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {filtered.map((idea) => (
                      <IdeaListCard
                        key={idea.id}
                        idea={idea}
                        onViewDetails={handleViewDetails}
                        onSave={handleSave}
                        onStartProject={handleStartProject}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detail dialog */}
      <IdeaDetailDialog
        idea={detailIdea}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSave={handleSave}
        onStartProject={handleStartProject}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  )
}
