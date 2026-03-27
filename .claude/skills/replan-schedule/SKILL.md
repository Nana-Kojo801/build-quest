---
name: replan-schedule
description: Rework the adaptive build schedule across one or more projects when tasks slip, while keeping the plan realistic and motivating.
disable-model-invocation: true
---

Replan the user's build schedule using the latest project progress.

## Goal
Adjust the upcoming plan when a task is completed late, skipped, or partially finished.

## Rules
- Respect that multiple projects may share the same day.
- Keep daily workload realistic.
- Prefer momentum over perfection.
- Surface carry-over tasks clearly.
- Preserve the gamified feeling of progress even when the plan changes.

## Output format
Return:
1. an updated day-by-day schedule
2. what changed
3. any tasks that were deferred or split
4. a short motivational summary
