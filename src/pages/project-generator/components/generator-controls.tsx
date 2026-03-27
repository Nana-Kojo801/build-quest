import { useState, useRef, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CATEGORIES, DIFFICULTIES } from '@/services/idea-generator'
import type { Difficulty } from '@/lib/types'

interface GeneratorControlsProps {
  count: number
  onCountChange: (n: number) => void
  category: string | null
  onCategoryChange: (c: string | null) => void
  difficulty: Difficulty | null
  onDifficultyChange: (d: Difficulty | null) => void
  techStack: string[]
  onTechStackChange: (stack: string[]) => void
  onGenerate: () => void
  isGenerating: boolean
  canGenerate: boolean
  disabledReason?: string
}

const COUNT_OPTIONS = [1, 2, 3, 4, 5]

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-500/60',
  intermediate: 'border-sky-500/40 bg-sky-500/10 text-sky-400 data-[active=true]:bg-sky-500/20 data-[active=true]:border-sky-500/60',
  advanced: 'border-amber-500/40 bg-amber-500/10 text-amber-400 data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-500/60',
  expert: 'border-rose-500/40 bg-rose-500/10 text-rose-400 data-[active=true]:bg-rose-500/20 data-[active=true]:border-rose-500/60',
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Medium',
  advanced: 'Advanced',
  expert: 'Expert',
}

export const CATEGORY_TECH_DEFAULTS: Record<string, string[]> = {
  'Web App':          ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Prisma'],
  'Mobile App':       ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'Zustand'],
  'CLI Tool':         ['Node.js', 'TypeScript', 'Commander.js', 'Chalk', 'Bun'],
  'API/Backend':      ['Node.js', 'TypeScript', 'Hono', 'PostgreSQL', 'Prisma'],
  'Dev Tool':         ['Node.js', 'TypeScript', 'Vite', 'VS Code API', 'CLI'],
  'Game':             ['TypeScript', 'Phaser.js', 'Canvas API', 'Matter.js'],
  'AI/ML':            ['Python', 'FastAPI', 'OpenAI API', 'LangChain'],
  'Browser Extension':['JavaScript', 'TypeScript', 'Chrome Extension API', 'React', 'Manifest V3'],
  'Desktop App':      ['Tauri', 'React', 'TypeScript', 'SQLite', 'Rust'],
}

export function GeneratorControls({
  count,
  onCountChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  techStack,
  onTechStackChange,
  onGenerate,
  isGenerating,
  canGenerate,
  disabledReason,
}: GeneratorControlsProps) {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [techInput, setTechInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function removeTech(item: string) {
    onTechStackChange(techStack.filter((t) => t !== item))
  }

  function addTech(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed || techStack.includes(trimmed)) return
    onTechStackChange([...techStack, trimmed])
    setTechInput('')
  }

  function handleTechKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTech(techInput)
    } else if (e.key === 'Backspace' && techInput === '' && techStack.length > 0) {
      onTechStackChange(techStack.slice(0, -1))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card/60 border border-border rounded-2xl p-4 mx-4 flex flex-col gap-4"
    >
      {/* Count selector */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
          Number of ideas
        </label>
        <div className="flex gap-2">
          {COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => onCountChange(n)}
              className={cn(
                'flex-1 h-9 rounded-lg border text-sm font-semibold transition-all duration-150',
                count === n
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border/70'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty filter */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
          Difficulty
        </label>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => onDifficultyChange(null)}
            className={cn(
              'px-3 h-8 rounded-lg border text-xs font-medium transition-all duration-150',
              difficulty === null
                ? 'border-primary/50 bg-primary/15 text-primary'
                : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
            )}
          >
            Any
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              data-active={difficulty === d}
              onClick={() => onDifficultyChange(difficulty === d ? null : d)}
              className={cn(
                'px-3 h-8 rounded-lg border text-xs font-medium transition-all duration-150',
                DIFFICULTY_STYLES[d],
                difficulty !== null && difficulty !== d && 'opacity-50'
              )}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
          Category
        </label>
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className={cn(
              'w-full flex items-center justify-between px-3 h-9 rounded-lg border text-sm transition-all duration-150',
              category
                ? 'border-primary/50 bg-primary/10 text-foreground'
                : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border/70'
            )}
          >
            <span>{category ?? 'Any category'}</span>
            <ChevronDown size={14} className={cn('transition-transform duration-150', categoryOpen && 'rotate-180')} />
          </button>

          {categoryOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-xl z-20 overflow-hidden"
            >
              <button
                onClick={() => { onCategoryChange(null); setCategoryOpen(false) }}
                className={cn(
                  'w-full text-left px-3 py-2.5 text-sm transition-colors',
                  !category ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                Any category
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onCategoryChange(cat); setCategoryOpen(false) }}
                  className={cn(
                    'w-full text-left px-3 py-2.5 text-sm border-t border-border/50 transition-colors',
                    category === cat ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                  )}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Tech Stack
          </label>
          {techStack.length > 0 && (
            <button
              onClick={() => onTechStackChange([])}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Chips + inline input */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="min-h-[38px] flex flex-wrap gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-2 cursor-text"
        >
          <AnimatePresence initial={false}>
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-1 bg-primary/10 border border-primary/25 text-primary rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {tech}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeTech(tech) }}
                  className="text-primary/60 hover:text-primary transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <input
            ref={inputRef}
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechKeyDown}
            onBlur={() => { if (techInput.trim()) addTech(techInput) }}
            placeholder={techStack.length === 0 ? 'Add tech (e.g. React, Supabase…)' : ''}
            className="flex-1 min-w-[120px] bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
          />

          {techInput.trim() && (
            <button
              type="button"
              onClick={() => addTech(techInput)}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              <Plus size={13} />
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5">
          Press Enter or comma to add · Backspace to remove last
        </p>
      </div>

      {/* Generate button */}
      <div className="flex flex-col gap-1.5">
        <Button
          variant="quest"
          size="lg"
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate}
          className="w-full relative overflow-hidden"
        >
          {isGenerating ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <Sparkles size={17} />
              </motion.span>
              Generating ideas…
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Generate {count} Idea{count !== 1 ? 's' : ''}
            </>
          )}
        </Button>
        {!canGenerate && disabledReason && (
          <p className="text-center text-[11px] text-muted-foreground">{disabledReason}</p>
        )}
      </div>
    </motion.div>
  )
}
