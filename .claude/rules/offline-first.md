# Offline-First Rules

## Product expectation
BuildQuest must remain useful with unreliable or no internet.

## Implementation expectations
- Assume local-first reads for core workflows.
- Store generated projects, schedules, and progress locally first.
- Clearly communicate sync status when online behavior exists.
- Design for conflict-tolerant, resilient user flows.

## UI expectations
- Show offline badges, sync queues, stale data indicators, and recovery states when relevant.
- Do not block the main experience on network availability.
