# LexiGap Design System — Master

## Project Identity

**LexiGap** is a premium, modern self-improvement platform for algorithmic grammar and vocabulary assessment. It must NOT feel like a dry academic testing tool. The visual language conveys focus, progress, and intellectual growth.

---

## 1. Design Principles

| Principle              | Application                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Dark First**         | The app lives in dark mode. Light mode is secondary. The deep background reduces eye strain during focused assessment sessions. |
| **Premium Minimal**    | Every element earns its place. No decorative noise. Generous whitespace. Clean lines.                                           |
| **Gamified Feedback**  | Progress is rewarded with subtle animations, color shifts, and satisfying micro-interactions.                                   |
| **Editorial Contrast** | UI text uses clean sans-serif; reading content uses highly legible serif to mimic editorial quality.                            |
| **Solid Colors Only**  | No gradients (per AGENTS.md). All color transitions are achieved via opacity, borders, or subtle background shifts.             |

---

## 2. Color System

### 2.1 Philosophy

- **Backgrounds**: Deep, immersive slate/indigo tones that feel like a focused workspace.
- **Accents**: Teal and emerald for progress, success, and active states. Vibrant but not neon.
- **Text**: High contrast for readability. Muted secondary text for hierarchy.
- **Borders**: Extremely subtle — low opacity white or accent tints.

### 2.2 Palette (OKLCH — Tailwind v4 Compatible)

| Token                          | Light Mode              | Dark Mode               | Usage                        |
| ------------------------------ | ----------------------- | ----------------------- | ---------------------------- |
| `--background`                 | `oklch(0.98 0.001 106)` | `oklch(0.12 0.008 260)` | Page background              |
| `--foreground`                 | `oklch(0.15 0.004 49)`  | `oklch(0.95 0.001 106)` | Primary text                 |
| `--card`                       | `oklch(1 0 0)`          | `oklch(0.18 0.01 265)`  | Card surfaces                |
| `--card-foreground`            | `oklch(0.15 0.004 49)`  | `oklch(0.95 0.001 106)` | Card text                    |
| `--popover`                    | `oklch(1 0 0)`          | `oklch(0.18 0.01 265)`  | Dropdown/popover bg          |
| `--popover-foreground`         | `oklch(0.15 0.004 49)`  | `oklch(0.95 0.001 106)` | Popover text                 |
| `--primary`                    | `oklch(0.55 0.12 165)`  | `oklch(0.55 0.12 165)`  | Primary actions, progress    |
| `--primary-foreground`         | `oklch(0.98 0.02 166)`  | `oklch(0.08 0.02 166)`  | Text on primary              |
| `--secondary`                  | `oklch(0.97 0.001 286)` | `oklch(0.22 0.008 270)` | Secondary surfaces           |
| `--secondary-foreground`       | `oklch(0.21 0.006 286)` | `oklch(0.95 0.001 106)` | Text on secondary            |
| `--muted`                      | `oklch(0.97 0.001 106)` | `oklch(0.22 0.008 270)` | Muted backgrounds            |
| `--muted-foreground`           | `oklch(0.55 0.013 58)`  | `oklch(0.65 0.015 260)` | Secondary text, placeholders |
| `--accent`                     | `oklch(0.55 0.12 165)`  | `oklch(0.55 0.12 165)`  | Highlight, active states     |
| `--accent-foreground`          | `oklch(0.98 0.02 166)`  | `oklch(0.08 0.02 166)`  | Text on accent               |
| `--destructive`                | `oklch(0.58 0.25 27)`   | `oklch(0.70 0.19 22)`   | Errors, wrong answers        |
| `--border`                     | `oklch(0.92 0.003 49)`  | `oklch(1 0 0 / 10%)`    | Borders, dividers            |
| `--input`                      | `oklch(0.92 0.003 49)`  | `oklch(1 0 0 / 15%)`    | Form input borders           |
| `--ring`                       | `oklch(0.71 0.01 56)`   | `oklch(0.55 0.12 165)`  | Focus rings (teal)           |
| `--success`                    | `oklch(0.60 0.18 145)`  | `oklch(0.60 0.18 145)`  | Correct answers, success     |
| `--warning`                    | `oklch(0.75 0.15 85)`   | `oklch(0.75 0.15 85)`   | Warnings, attention          |
| `--sidebar`                    | `oklch(0.98 0.001 106)` | `oklch(0.14 0.008 265)` | Sidebar background           |
| `--sidebar-foreground`         | `oklch(0.15 0.004 49)`  | `oklch(0.95 0.001 106)` | Sidebar text                 |
| `--sidebar-primary`            | `oklch(0.55 0.12 165)`  | `oklch(0.55 0.12 165)`  | Sidebar active item          |
| `--sidebar-primary-foreground` | `oklch(0.98 0.02 166)`  | `oklch(0.08 0.02 166)`  | Sidebar active text          |
| `--sidebar-accent`             | `oklch(0.97 0.001 106)` | `oklch(0.22 0.008 270)` | Sidebar hover                |
| `--sidebar-accent-foreground`  | `oklch(0.21 0.006 286)` | `oklch(0.95 0.001 106)` | Sidebar hover text           |
| `--sidebar-border`             | `oklch(0.92 0.003 49)`  | `oklch(1 0 0 / 10%)`    | Sidebar dividers             |
| `--sidebar-ring`               | `oklch(0.71 0.01 56)`   | `oklch(0.55 0.12 165)`  | Sidebar focus ring           |

### 2.3 Chart Colors (for Dashboard Analytics)

| Chart Token | Value                  | Usage                 |
| ----------- | ---------------------- | --------------------- |
| `--chart-1` | `oklch(0.55 0.12 165)` | Primary metric — teal |
| `--chart-2` | `oklch(0.60 0.18 145)` | Secondary — emerald   |
| `--chart-3` | `oklch(0.65 0.15 85)`  | Tertiary — amber      |
| `--chart-4` | `oklch(0.70 0.12 55)`  | Quaternary — orange   |
| `--chart-5` | `oklch(0.75 0.10 30)`  | Quinary — red/pink    |

### 2.4 Semantic Colors

| Semantic        | Light                   | Dark                    | Usage                       |
| --------------- | ----------------------- | ----------------------- | --------------------------- |
| Correct/Success | `#10B981` (emerald-500) | `#34D399` (emerald-400) | Right answer feedback       |
| Incorrect/Error | `#EF4444` (red-500)     | `#F87171` (red-400)     | Wrong answer feedback       |
| In Progress     | `#0EA5E9` (sky-500)     | `#38BDF8` (sky-400)     | Active lesson, current step |
| Locked          | `#9CA3AF` (gray-400)    | `#6B7280` (gray-500)    | Unavailable content         |
| Streak/Hot      | `#F59E0B` (amber-500)   | `#FBBF24` (amber-400)   | Daily streak, achievements  |

---

## 3. Typography

### 3.1 Font Families

| Role               | Font                    | Weights            | Fallback              |
| ------------------ | ----------------------- | ------------------ | --------------------- |
| **UI / Headings**  | Outfit                  | 400, 500, 600, 700 | system-ui, sans-serif |
| **Reading / Body** | Merriweather            | 400, 700           | Georgia, serif        |
| **Mono / Code**    | JetBrains Mono Variable | 400, 700           | monospace             |

### 3.2 Installation

```bash
bun add @fontsource-variable/outfit @fontsource-variable/merriweather @fontsource-variable/jetbrains-mono
```

Import in `src/routes/layout.css`:

```css
@import '@fontsource-variable/outfit';
@import '@fontsource-variable/merriweather';
@import '@fontsource-variable/jetbrains-mono';
```

Update `@theme inline`:

```css
@theme inline {
	--font-sans: 'Outfit Variable', system-ui, sans-serif;
	--font-serif: 'Merriweather Variable', Georgia, serif;
	--font-mono: 'JetBrains Mono Variable', monospace;
}
```

### 3.3 Type Scale

| Token     | Size            | Weight | Line Height | Letter Spacing | Usage              |
| --------- | --------------- | ------ | ----------- | -------------- | ------------------ |
| `display` | 48px / 3rem     | 700    | 1.1         | -0.02em        | Hero headlines     |
| `h1`      | 36px / 2.25rem  | 600    | 1.2         | -0.01em        | Page titles        |
| `h2`      | 30px / 1.875rem | 600    | 1.25        | -0.01em        | Section headers    |
| `h3`      | 24px / 1.5rem   | 500    | 1.3         | 0              | Card titles        |
| `h4`      | 20px / 1.25rem  | 500    | 1.4         | 0              | Subsection headers |
| `body`    | 16px / 1rem     | 400    | 1.75        | 0              | Paragraph text     |
| `body-sm` | 14px / 0.875rem | 400    | 1.5         | 0              | Secondary text     |
| `caption` | 12px / 0.75rem  | 500    | 1.4         | 0.01em         | Labels, badges     |
| `button`  | 14px / 0.875rem | 500    | 1           | 0.01em         | Button text        |

### 3.4 Reading Content (Quiz Sentences)

When displaying sentences for cloze tests:

- Font: `font-serif` (Merriweather)
- Size: 18px / 1.125rem
- Line height: 1.8
- Color: `--foreground` (high contrast)
- The blank (`____`) is styled with a subtle animated underline in `--primary` color.

---

## 4. Spacing System

Base unit: `4px` (Tailwind default). Key scale:

| Token      | Value | Usage                          |
| ---------- | ----- | ------------------------------ |
| `space-1`  | 4px   | Tight gaps, icon padding       |
| `space-2`  | 8px   | Inline spacing                 |
| `space-3`  | 12px  | Small component gaps           |
| `space-4`  | 16px  | Default padding, card internal |
| `space-6`  | 24px  | Section gaps                   |
| `space-8`  | 32px  | Card external margins          |
| `space-10` | 40px  | Large section separation       |
| `space-12` | 48px  | Page section spacing           |
| `space-16` | 64px  | Hero gaps                      |
| `space-20` | 80px  | Major page divisions           |

---

## 5. Border Radius

| Token         | Value  | Usage                        |
| ------------- | ------ | ---------------------------- |
| `radius-sm`   | 6px    | Buttons, small inputs        |
| `radius-md`   | 10px   | Cards, dialogs               |
| `radius-lg`   | 16px   | Large cards, modals          |
| `radius-xl`   | 24px   | Feature cards, hero elements |
| `radius-full` | 9999px | Pills, avatars, badges       |

---

## 6. Shadows & Elevation

**No box shadows in dark mode.** Elevation is achieved through:

- Border color shifts (`--border` to slightly lighter on hover)
- Background color shifts (`--card` to `--muted` on hover)
- Subtle ring on focus (`--ring`)

In light mode only, minimal shadows:

```css
.shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
.shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## 7. Animation & Motion

### 7.1 Timing Tokens

| Token             | Value | Usage                            |
| ----------------- | ----- | -------------------------------- |
| `duration-fast`   | 100ms | Hover color shifts               |
| `duration-normal` | 200ms | Button presses, toggles          |
| `duration-slow`   | 300ms | Dialog opens, card transitions   |
| `duration-slower` | 500ms | Page transitions, progress fills |

### 7.2 Easing

| Token          | Value                               | Usage                       |
| -------------- | ----------------------------------- | --------------------------- |
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)`      | General transitions         |
| `ease-in`      | `cubic-bezier(0.4, 0, 1, 1)`        | Exits, dismissals           |
| `ease-out`     | `cubic-bezier(0, 0, 0.2, 1)`        | Entrances, reveals          |
| `ease-bounce`  | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Success states, celebratory |

### 7.3 Micro-interactions

| Interaction     | Effect                                      | Duration |
| --------------- | ------------------------------------------- | -------- |
| Button hover    | `background-color` lightens 10%             | 100ms    |
| Button active   | `scale(0.97)`                               | 100ms    |
| Card hover      | `border-color` brightens; no scale          | 200ms    |
| Answer select   | `border` + `background` tint; `scale(1.02)` | 150ms    |
| Correct answer  | Green flash + checkmark scale-in            | 300ms    |
| Wrong answer    | Red shake (translate-x: -4px, 4px, 0)       | 400ms    |
| Progress bar    | Width transition with `ease-out`            | 500ms    |
| Streak counter  | Number flip with `ease-bounce`              | 400ms    |
| Sidebar toggle  | Width collapse with `ease-default`          | 300ms    |
| Page transition | Fade + slight translate-y                   | 250ms    |

### 7.4 prefers-reduced-motion

All motion must respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
```

---

## 8. Iconography

- **Library**: `@lucide/svelte` (per AGENTS.md)
- **Style**: Outlined, 1.5px stroke width, consistent 24px default size
- **Color**: Inherit from parent text color (`currentColor`)
- **Never use emojis** as icons (per AGENTS.md)

### 8.1 Icon Mapping

| Concept           | Icon              | Size |
| ----------------- | ----------------- | ---- |
| Logo / Brand      | `BookOpen`        | 24px |
| Dashboard         | `LayoutDashboard` | 18px |
| Assessment / Quiz | `BrainCircuit`    | 18px |
| Learning Path     | `Route`           | 18px |
| Lessons           | `GraduationCap`   | 18px |
| Progress          | `TrendingUp`      | 18px |
| Streak            | `Flame`           | 18px |
| Settings          | `Settings`        | 18px |
| Profile           | `User`            | 18px |
| Logout            | `LogOut`          | 18px |
| Correct           | `CheckCircle2`    | 20px |
| Incorrect         | `XCircle`         | 20px |
| Lock              | `Lock`            | 16px |
| Unlock            | `Unlock`          | 16px |
| Chevron           | `ChevronRight`    | 16px |
| Menu              | `Menu`            | 20px |
| Close             | `X`               | 18px |
| Info              | `Info`            | 16px |
| Warning           | `AlertTriangle`   | 16px |
| Report            | `Flag`            | 16px |

---

## 9. Component Architecture

### 9.1 shadcn-svelte Components to Install

**Core UI:**

```bash
bun x shadcn-svelte@latest add button card dialog form input label progress tabs badge avatar separator switch sonner skeleton select textarea radio-group checkbox
```

**Layout & Navigation:**

```bash
bun x shadcn-svelte@latest add sidebar breadcrumb table tooltip scroll-area collapsible
```

**Charts (Dashboard):**

```bash
bun x shadcn-svelte@latest add chart
```

**Blocks (for rapid scaffolding):**

```bash
bun x shadcn-svelte@latest add sidebar-07 login-03
```

### 9.2 Custom Component Patterns

All custom components must follow AGENTS.md rules:

- Svelte 5 runes only (`$state`, `$derived`, `$props`, `$effect`)
- No `export let`, no `$:`, no `on:click`, no `<slot />`, no `createEventDispatcher`
- Use `onclick={handler}` not `on:click={handler}`
- Spread props: `{...props}` instead of individual props where possible

### 9.3 Component File Organization

```
src/lib/components/
  ui/                    # shadcn-svelte components (auto-generated)
  app/                   # Application-specific components
    quiz/
      QuizCard.svelte
      AnswerOption.svelte
      ProgressHeader.svelte
      QuestionCounter.svelte
    dashboard/
      StatCard.svelte
      GrammarChart.svelte
      SkillBreakdown.svelte
      StreakBadge.svelte
    learning-path/
      PathNode.svelte
      PathConnector.svelte
      LessonCard.svelte
    layout/
      AppSidebar.svelte
      AppHeader.svelte
      PageContainer.svelte
    shared/
      AnimatedCounter.svelte
      ConfettiEffect.svelte
      ReportButton.svelte
```

---

## 10. Layout Structure

### 10.1 Global Layout (`src/routes/+layout.svelte`)

```
┌─────────────────────────────────────────────────────┐
│  [SvelteKit <svelte:head> for fonts, meta]          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │           {@render children()}               │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- No persistent sidebar on landing page.
- Dark mode class applied at `<html>` level.
- `<svelte:boundary>` wraps async content for error/loading states.

### 10.2 App Layout (Dashboard, Quiz, Learning Path)

Uses `sidebar-07` block pattern — collapsible icon sidebar.

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────┐ ┌─────────────────────────────────────────────────┐ │
│ │     │ │ [AppHeader]  Logo | Breadcrumb | Avatar         │ │
│ │ S   │ ├─────────────────────────────────────────────────┤ │
│ │ i   │ │                                                 │ │
│ │ d   │ │           [Page Content Area]                   │ │
│ │ e   │ │                                                 │ │
│ │ b   │ │                                                 │ │
│ │ a   │ │                                                 │ │
│ │ r   │ │                                                 │ │
│ │     │ │                                                 │ │
│ └─────┘ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- Sidebar width: `16rem` expanded, `3rem` collapsed (icon only).
- Header height: `3rem` (48px).
- Content area: `flex-1`, scrollable, padding `1.5rem`.

### 10.3 Responsive Breakpoints

| Breakpoint | Width           | Layout Change                                                     |
| ---------- | --------------- | ----------------------------------------------------------------- |
| `mobile`   | < 640px         | Stack all. Sidebar becomes bottom nav or sheet. Quiz full-screen. |
| `tablet`   | 640px – 1024px  | Sidebar collapses to icons. 2-column grids.                       |
| `desktop`  | 1024px – 1440px | Full sidebar. 3-column grids.                                     |
| `wide`     | > 1440px        | Centered max-width (`1280px`). Generous margins.                  |

---

## 11. Accessibility Requirements

- **Color Contrast**: Minimum 4.5:1 for all text (WCAG AA). Use OKLCH values to ensure this.
- **Focus States**: All interactive elements must have visible `ring-2 ring-primary ring-offset-2` focus.
- **Touch Targets**: Minimum 44x44px for all tappable elements (especially quiz answer options).
- **Keyboard Navigation**: Full tab order support. `Enter` / `Space` to activate. Arrow keys for quiz navigation.
- **Screen Readers**: `aria-label` on icon-only buttons. `aria-live="polite"` for score updates. `role="progressbar"` for progress indicators.
- **Motion**: Respect `prefers-reduced-motion` (see §7.4).

---

## 12. Z-Index Scale

| Layer    | Z-Index | Usage                  |
| -------- | ------- | ---------------------- |
| Base     | 0       | Page content           |
| Sticky   | 10      | Sticky headers         |
| Dropdown | 20      | Select menus, popovers |
| Sidebar  | 30      | Collapsible sidebar    |
| Modal    | 40      | Dialogs, sheets        |
| Toast    | 50      | Sonner notifications   |
| Overlay  | 9999    | Full-screen loaders    |

---

## 13. Quality Gate (for Implementing Model)

Before any page is considered complete:

1. **`bun check`** — 0 TypeScript errors.
2. **`bunx prettier --write <file>`** then `bunx prettier --check <file>`.
3. **`bunx svelte-check`** — 0 Svelte errors.
4. **Dark mode test** — All pages must render correctly in dark mode.
5. **Mobile test** — All pages must be usable at 375px width.
6. **Accessibility audit** — All interactive elements have focus states, all images have alt text.

---

## 14. Page Index

| Page              | Route            | Priority | Design File              |
| ----------------- | ---------------- | -------- | ------------------------ |
| Landing Page      | `/`              | P1       | `pages/landing.md`       |
| Auth — Login      | `/login`         | P1       | `pages/auth.md`          |
| Auth — Register   | `/register`      | P1       | `pages/auth.md`          |
| Assessment (Quiz) | `/assessment`    | P1       | `pages/quiz.md`          |
| Dashboard         | `/dashboard`     | P1       | `pages/dashboard.md`     |
| Learning Path     | `/learning-path` | P2       | `pages/learning-path.md` |
| Lesson            | `/lesson/[id]`   | P2       | `pages/lesson.md`        |
| Settings          | `/settings`      | P3       | `pages/settings.md`      |

---

_Document version: 1.0 | Created: 2026-06-13 | Next review: after first page implementation_
