# LexiGap Visual Design System

## Overview

This directory contains the complete visual design specification for **LexiGap**, a premium algorithmic grammar and vocabulary assessment platform built with SvelteKit 5, Tailwind v4, and shadcn-svelte.

**Design Philosophy**: Dark-first, premium minimal, gamified self-improvement. Not a dry academic tool.

---

## Document Structure

| File                     | Purpose                                                                                 | Priority |
| ------------------------ | --------------------------------------------------------------------------------------- | -------- |
| `MASTER.md`              | Global design system: colors, typography, spacing, animation, components, accessibility | Required |
| `pages/landing.md`       | Marketing page — hero, features, how it works, CTA                                      | P1       |
| `pages/auth.md`          | Login and registration pages — Better Auth integration                                  | P1       |
| `pages/quiz.md`          | Core assessment experience — 20-question cloze test                                     | P1       |
| `pages/dashboard.md`     | Post-assessment home — Bento grid grammar profile                                       | P1       |
| `pages/learning-path.md` | Personalized curriculum — subway map timeline                                           | P2       |
| `pages/lesson.md`        | Individual module content — editorial reading + exercises                               | P2       |
| `pages/settings.md`      | Profile, account, preferences                                                           | P3       |

---

## How to Use This System

### For Implementing Models

1. **Always read `MASTER.md` first** — it contains the global tokens, principles, and component architecture.
2. **Read the page-specific file** for the page you are building — page files override or extend Master rules.
3. **Follow the Quality Gate** at the bottom of `MASTER.md` — run `bun check`, `prettier`, and accessibility checks after every page.
4. **Use shadcn-svelte CLI** — never write shadcn components manually. Install via `bun x shadcn-svelte@latest add <component>`.

### Component Installation Order

Install components in this order when scaffolding a new page:

```bash
# Core UI
bun x shadcn-svelte@latest add button card dialog form input label progress tabs badge avatar separator switch sonner skeleton select textarea radio-group checkbox

# Layout & Navigation
bun x shadcn-svelte@latest add sidebar breadcrumb table tooltip scroll-area collapsible

# Charts (Dashboard only)
bun x shadcn-svelte@latest add chart

# Blocks (for rapid scaffolding)
bun x shadcn-svelte@latest add sidebar-07 login-03
```

### Font Installation

```bash
bun add @fontsource-variable/outfit @fontsource-variable/merriweather
```

Update `src/routes/layout.css`:

```css
@import '@fontsource-variable/outfit';
@import '@fontsource-variable/merriweather';
```

Update `@theme inline`:

```css
@theme inline {
	--font-sans: 'Outfit Variable', system-ui, sans-serif;
	--font-serif: 'Merriweather Variable', Georgia, serif;
	--font-mono: 'JetBrains Mono Variable', monospace;
}
```

---

## Key Constraints

| Constraint                  | Source    | Rule                                                                                                             |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| **No Gradients**            | AGENTS.md | All colors must be solid. Use opacity for depth.                                                                 |
| **Dark Mode First**         | design.md | All pages designed for dark mode. Light mode is secondary.                                                       |
| **Svelte 5 Runes Only**     | AGENTS.md | No `export let`, no `$:`, no `on:click`, no `<slot />`. Use `$state`, `$derived`, `$props`, `onclick={handler}`. |
| **shadcn-svelte CLI Only**  | AGENTS.md | Never write shadcn components manually. Always use CLI.                                                          |
| **@lucide/svelte**          | AGENTS.md | Import icons as `import { IconName } from '@lucide/svelte'`.                                                     |
| **Valibot Validation**      | AGENTS.md | Use Valibot for form validation, not Zod.                                                                        |
| **form/query Remotes Only** | AGENTS.md | No `command` remotes. Use `form` for mutations, `query` for data.                                                |
| **Solid Colors Only**       | AGENTS.md | No gradients. No box shadows in dark mode.                                                                       |

---

## Page Routes

| Page          | Route            | Sidebar         | Auth Required |
| ------------- | ---------------- | --------------- | ------------- |
| Landing       | `/`              | No              | No            |
| Login         | `/login`         | No              | No            |
| Register      | `/register`      | No              | No            |
| Assessment    | `/assessment`    | Yes (collapsed) | Yes           |
| Dashboard     | `/dashboard`     | Yes             | Yes           |
| Learning Path | `/learning-path` | Yes             | Yes           |
| Lesson        | `/lesson/[id]`   | Yes             | Yes           |
| Settings      | `/settings`      | Yes             | Yes           |

---

## Color Quick Reference

| Semantic    | Dark Mode Value         | Usage                    |
| ----------- | ----------------------- | ------------------------ |
| Background  | `oklch(0.12 0.008 260)` | Page background          |
| Card        | `oklch(0.18 0.01 265)`  | Card surfaces            |
| Primary     | `oklch(0.55 0.12 165)`  | Actions, progress, teal  |
| Success     | `oklch(0.60 0.18 145)`  | Correct answers, emerald |
| Destructive | `oklch(0.70 0.19 22)`   | Errors, wrong answers    |
| Warning     | `oklch(0.75 0.15 85)`   | Streaks, amber           |
| Muted       | `oklch(0.22 0.008 270)` | Secondary surfaces       |
| Foreground  | `oklch(0.95 0.001 106)` | Primary text             |

---

## Animation Tokens

| Token             | Value                               | Usage                            |
| ----------------- | ----------------------------------- | -------------------------------- |
| `duration-fast`   | 100ms                               | Hover color shifts               |
| `duration-normal` | 200ms                               | Button presses, toggles          |
| `duration-slow`   | 300ms                               | Dialog opens, card transitions   |
| `duration-slower` | 500ms                               | Page transitions, progress fills |
| `ease-default`    | `cubic-bezier(0.4, 0, 0.2, 1)`      | General transitions              |
| `ease-bounce`     | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success states                   |

---

## Custom Component Directory

All custom components go in `src/lib/components/app/`:

```
src/lib/components/app/
  quiz/           # Quiz-specific components
  dashboard/      # Dashboard-specific components
  learning-path/  # Learning path components
  lesson/         # Lesson content components
  auth/           # Auth form components
  settings/       # Settings form components
  layout/         # App layout components (sidebar, header)
  shared/         # Shared app components (animated counter, confetti)
```

---

## Next Steps for Implementation

1. **Update `layout.css`** — Replace JetBrains Mono as default font with Outfit. Add Merriweather for serif.
2. **Install fonts** — `bun add @fontsource-variable/outfit @fontsource-variable/merriweather`
3. **Install shadcn components** — Start with `button`, `card`, `input`, `label`, `dialog`, `form`, `progress`, `tabs`, `badge`, `avatar`, `separator`, `switch`, `skeleton`, `sidebar`, `breadcrumb`, `chart`.
4. **Build pages in priority order**: Landing → Auth → Quiz → Dashboard → Learning Path → Lesson → Settings.
5. **Run quality gate after every page** — `bun check`, `bunx prettier --write <files>`, mobile test, dark mode test.

---

_Design System v1.0 | Created: 2026-06-13 | Framework: SvelteKit 5 + Tailwind v4 + shadcn-svelte_
