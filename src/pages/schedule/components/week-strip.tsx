import { useRef, useEffect } from 'react'
import { ScheduleDayCard } from './schedule-day-card'
import type { DaySchedule, ActiveProject } from '@/lib/types'

interface WeekStripProps {
  days: DaySchedule[]
  projects: ActiveProject[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function WeekStrip({ days, projects, selectedDate, onSelectDate }: WeekStripProps) {
  const todayRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to today on mount
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [])

  return (
    <div className="px-4 py-2">
      <div className="overflow-x-auto scrollbar-hide" ref={scrollRef}>
        <div className="flex gap-2 pb-2 min-w-max">
          {days.map((schedule) => (
            <div
              key={schedule.date}
              ref={schedule.isToday ? todayRef : undefined}
            >
              <ScheduleDayCard
                schedule={schedule}
                projects={projects}
                isSelected={schedule.date === selectedDate}
                onClick={() => onSelectDate(schedule.date)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
