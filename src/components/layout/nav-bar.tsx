import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Sparkles,
  BookOpen,
  Layers,
  CalendarDays,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/stores/project-store'
import { calcLevel, calcXPProgress, calcXPInLevel, calcXPToNextLevel } from '@/lib/utils'

// ─── Nav item list ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/',         icon: Home,         label: 'Hub'      },
  { to: '/generate', icon: Sparkles,     label: 'Generate' },
  { to: '/ideas',    icon: BookOpen,     label: 'Ideas'    },
  { to: '/projects', icon: Layers,       label: 'Projects' },
  { to: '/quests',   icon: CalendarDays, label: 'Quests'   },
  { to: '/settings', icon: Settings,     label: 'Settings' },
]

function isActive(to: string, pathname: string): boolean {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

// ─── Desktop: XP chip (top-right) ────────────────────────────────────────────

function XPChip() {
  const navigate = useNavigate()
  const { progress } = useProjectStore()
  const totalXP   = progress?.totalXP ?? 0
  const level     = calcLevel(totalXP)
  const xpInLevel = calcXPInLevel(totalXP)
  const xpToNext  = calcXPToNextLevel(totalXP)
  const pct       = calcXPProgress(totalXP)

  return (
    <button
      onClick={() => navigate('/')}
      className={cn(
        'hidden lg:flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-md',
        'border border-border/60 hover:border-border hover:bg-secondary/40',
        'transition-all duration-150 cursor-pointer group'
      )}
    >
      {/* Level box — inspired by reference "47 / Level" box */}
      <div className="flex flex-col items-center justify-center w-8 h-8 rounded-sm
                      bg-primary/10 border border-primary/25 shrink-0 group-hover:border-primary/40
                      transition-colors">
        <span className="text-[13px] font-black leading-none text-primary">{level}</span>
        <span className="text-[6px] font-bold uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
          LVL
        </span>
      </div>
      {/* XP bar + numbers */}
      <div className="flex flex-col gap-1 min-w-[76px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Zap size={9} className="text-primary" />
            <span className="text-[11px] font-semibold text-foreground tabular-nums">
              {xpInLevel.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            /{xpToNext.toLocaleString()}
          </span>
        </div>
        <div className="xp-bar h-1">
          <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </button>
  )
}

// ─── Desktop top nav ──────────────────────────────────────────────────────────

export function DesktopNav() {
  const location = useLocation()

  return (
    <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-40 h-14 items-center
                    border-b border-border bg-background/97 backdrop-blur-md px-6 gap-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-8 shrink-0">
        <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center shadow-[0_0_12px_hsl(73_96%_46%/0.4)]">
          <span className="text-[10px] font-black text-primary-foreground tracking-tight select-none">BQ</span>
        </div>
        <span className="text-[13px] font-bold text-foreground tracking-[0.06em] uppercase">
          BuildQuest
        </span>
      </div>

      {/* Center nav items */}
      <div className="flex items-center gap-0.5 flex-1">
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label }) => {
          const active = isActive(to, location.pathname)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn('nav-item-top', active && 'active')}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 1.75} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>

      {/* Right side: XP chip + settings */}
      <div className="flex items-center gap-2 shrink-0">
        <XPChip />
        <NavLink
          to="/settings"
          className={cn('nav-item-top', isActive('/settings', location.pathname) && 'active')}
        >
          <Settings size={14} strokeWidth={isActive('/settings', location.pathname) ? 2.5 : 1.75} />
        </NavLink>
      </div>
    </nav>
  )
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                    border-t border-border bg-background/97 backdrop-blur-md"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = isActive(to, location.pathname)
          return (
            <NavLink
              key={to}
              to={to}
              className={cn('nav-item flex-1', active && 'active')}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 1.75} />
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Combined export used in app-shell ───────────────────────────────────────

export function NavBar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
