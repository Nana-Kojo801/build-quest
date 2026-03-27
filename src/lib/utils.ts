import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isYesterday, parseISO, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEE, MMM d')
}

export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  const diff = differenceInDays(date, new Date())
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 0) return `In ${diff} days`
  return `${Math.abs(diff)} days ago`
}

export function addDays(dateStr: string, days: number): string {
  const date = parseISO(dateStr)
  date.setDate(date.getDate() + days)
  return format(date, 'yyyy-MM-dd')
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < todayStr()
}

export function formatTimestamp(ts: number): string {
  return format(new Date(ts), 'MMM d, yyyy')
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── XP / Level helpers ───────────────────────────────────────────────────────

const XP_PER_LEVEL_VALUE = 1000

export function calcLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL_VALUE) + 1
}

export function calcXPInLevel(totalXP: number): number {
  return totalXP % XP_PER_LEVEL_VALUE
}

export function calcXPToNextLevel(_totalXP: number): number {
  return XP_PER_LEVEL_VALUE
}

export function calcXPProgress(totalXP: number): number {
  return (calcXPInLevel(totalXP) / XP_PER_LEVEL_VALUE) * 100
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Progress helpers ─────────────────────────────────────────────────────────

export function calcProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

// ─── Category colors ──────────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  'Web App': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'Mobile App': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'CLI Tool': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'API / Backend': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Dev Tool': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Game': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'AI / ML': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  'Browser Extension': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Desktop App': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  'default': 'bg-secondary text-muted-foreground border-border',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default
}
