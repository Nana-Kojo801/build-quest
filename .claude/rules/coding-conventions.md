# Coding Conventions

## File naming
- Use kebab-case for components, stores, hooks, and utility files.
- Prefer descriptive names that reflect responsibility.

## Component breakdown
- Each page must be broken into smaller local components placed in that page's `components/` folder.
- Shared components should only be extracted when they are reused or clearly generic.
- Keep components focused and readable.

## UI-only implementation rule
- Implement visual flows and basic UI interactions only.
- Do not ship real business logic unless explicitly requested.
- Stub actions with mock handlers where needed.
- It is acceptable for forms to validate basic UI behavior, open confirmation states, or show toasts without persisting data.

## Quality bar
- No obvious collisions, overflow bugs, or broken spacing at common screen sizes.
- Loading, empty, and error states should be intentionally designed.
- Maintain route-level consistency in spacing, typography, and visual language.
