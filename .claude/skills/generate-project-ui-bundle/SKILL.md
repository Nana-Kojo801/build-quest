---
name: generate-project-ui-bundle
description: Create a UI-only Claude Code bundle for a generated app idea, including project instructions, scoped rules, and export-ready files.
disable-model-invocation: true
---

Generate a Claude Code bundle for a newly generated project idea.

## Goal
Produce an export-ready `.claude/` bundle for the generated project that focuses on the UI layer only.

## Output requirements
Create or update files that follow the official Claude Code project structure:
- `.claude/CLAUDE.md`
- `.claude/rules/*.md`
- optional `.claude/skills/<skill-name>/SKILL.md` if a task-specific reusable workflow is valuable
- optional `.claude/settings.json` only when project-level settings are clearly needed

## Bundle content rules
- The bundle must describe the generated app clearly.
- It must instruct Claude Code to build UI, routes, layout, mock data, and interface interactions only.
- It must explicitly avoid implementing real backend, domain, auth, payment, database, or business logic unless separately requested.
- It should include page architecture guidance, design language, route expectations, and component/file naming standards.
- Each page must be broken into components inside the page directory's `components/` folder.
- All component and store filenames must use kebab-case.

## Suggested file set
Use the template files in `templates/` as a starting point, then tailor them to the generated project.

## Final check
Before finishing, verify that the bundle uses Claude Code's official conventions instead of ad-hoc folders like `.claude/prompts/`.
