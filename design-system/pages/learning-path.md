# LexiGap — Learning Path Page Design

## Page Purpose

Visualize the user's personalized curriculum as a vertical timeline or "subway map" showing modules from their assessment results. Locked/unlocked states create progression motivation. This is the "gamified" core of the app.

---

## Route

`/learning-path`

## Layout

App layout with sidebar. Full-width content area.

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] ┌─────────────────────────────────────────────────┐ │
│           │ [AppHeader]  Learning Path | [Progress: 45%]      │ │
│           ├─────────────────────────────────────────────────┤ │
│           │                                                 │ │
│           │  Your Personalized Curriculum                    │ │
│           │  Based on your assessment, we identified 5      │ │
│           │  focus areas. Complete them in order.           │ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────────┐ │ │
│           │  │  [Legend]  ● Unlocked  ○ Locked  ✓ Complete │ │ │
│           │  └─────────────────────────────────────────────┘ │ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────────┐ │ │
│           │  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │  [Verbs]  Mastering Past Tense              │ │ │
│           │  │  Unlocked  |  5 lessons  |  [Start →]       │ │ │
│           │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━● │ │ │
│           │  │                                             │ │ │
│           │  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │  [Prepositions]  Common Prepositions       │ │ │
│           │  │  Locked    |  8 lessons  |  [Locked]       │ │ │
│           │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━● │ │ │
│           │  │                                             │ │ │
│           │  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │  [Nouns]  Plural Forms & Articles            │ │ │
│           │  │  Locked    |  6 lessons  |  [Locked]       │ │ │
│           │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━● │ │ │
│           │  │                                             │ │ │
│           │  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │  [Adjectives]  Comparative & Superlative     │ │ │
│           │  │  Locked    |  4 lessons  |  [Locked]       │ │ │
│           │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━● │ │ │
│           │  │                                             │ │ │
│           │  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │  [Adverbs]  Position & Usage                 │ │ │
│           │  │  Locked    |  5 lessons  |  [Locked]       │ │ │
│           │  │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━● │ │ │
│           │  └─────────────────────────────────────────────┘ │ │
│           │                                                 │ │
│           └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Page Header

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Your Personalized Curriculum                        │
│  Based on your assessment, we identified 5 focus     │
│  areas. Complete them in order.                     │
│  [Progress: 45%]  [Retake Assessment]               │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Title**: `h2`, Outfit 600, `--foreground`
- **Subtitle**: `body`, `--muted-foreground`
- **Progress**: `Progress` component, height 8px, width 200px
  - Label: "Path Progress: 45%" — `body-sm`, `--muted-foreground`
  - Fill: `--primary` for completed, `--muted` for remaining
- **CTA**: `button` variant="outline", size="sm", icon `RefreshCw`, "Retake Assessment"
  - Position: right-aligned

---

## Section 2: Legend

### Structure

```
┌─────────────────────────────────────────────────────┐
│  ● Unlocked  ○ Locked  ✓ Complete  🔥 In Progress   │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: Horizontal flex, gap `space-6`, margin-bottom `space-6`
- **Each item**: `body-sm`, Outfit 500, `--muted-foreground`
- **Icon**: 16px circle/dot before each label
  - Unlocked: `Unlock` icon, `--primary` color
  - Locked: `Lock` icon, `--muted-foreground`
  - Complete: `CheckCircle2` icon, `--success` color
  - In Progress: `Flame` icon, `--warning` color

---

## Section 3: Module Timeline (Subway Map)

### Layout

Vertical timeline with connected nodes. Each module is a card connected by a vertical line.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  │  [Module Card]                                    │
│  │                                                    │
│  │  ┌─────────────────────────────────────────────┐  │
│  │  │  [Icon]  Module Title          [Status]     │  │
│  │  │  Description                   [Action]      │  │
│  │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  │  Mini lessons:  ● ● ○ ○ ○                  │  │
│  │  └─────────────────────────────────────────────┘  │
│  │                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●  │
│                                                     │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  │  [Module Card]                                    │
│  ...                                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Timeline Connector

- **Vertical line**: 2px wide, `--border` color
- **Nodes**: 16px circles at each module position
  - Unlocked: `--primary` fill, `--ring` border
  - Locked: `--muted` fill, `--border` border
  - Complete: `--success` fill, `--success` border
  - In Progress: `--warning` fill, pulsing `ring` animation
- **Animation**: Line draws from top to bottom on page load (height 0 → 100%, 800ms ease-out)

### Module Card

#### Container

- Background: `--card`
- Border: 1px solid `--border`
- Border radius: `radius-lg`
- Padding: `space-6`
- Width: 100% of content area minus timeline gutter
- Left margin: `space-8` (to accommodate timeline node)

#### States

| State           | Border             | Background              | Node                    | Action Button                       |
| --------------- | ------------------ | ----------------------- | ----------------------- | ----------------------------------- |
| **Unlocked**    | `--primary` at 30% | `--card`                | `--primary` fill        | `default` variant, "Start Module"   |
| **In Progress** | `--warning` at 30% | `--warning` at 5%       | `--warning` fill, pulse | `outline` variant, "Continue"       |
| **Locked**      | `--border`         | `--card` at 70% opacity | `--muted` fill          | `ghost` variant, disabled, "Locked" |
| **Complete**    | `--success` at 30% | `--success` at 5%       | `--success` fill        | `ghost` variant, "Review"           |

#### Card Content

**Header row:**

- **Icon**: 40px, in a `radius-lg` square, module-specific color background
  - Verbs: `--chart-1` (teal)
  - Prepositions: `--chart-2` (emerald)
  - Nouns: `--chart-3` (amber)
  - Adjectives: `--chart-4` (orange)
  - Adverbs: `--chart-5` (red)
- **Title**: `h3`, Outfit 600, `--foreground`
- **Status badge**: `badge`
  - Unlocked: variant="outline", `--primary`
  - In Progress: variant="default", `--warning`
  - Locked: variant="outline", `--muted-foreground`
  - Complete: variant="outline", `--success`

**Description:**

- `body-sm`, `--muted-foreground`, 2-line max

**Lesson tracker:**

- Horizontal row of dots, each representing a lesson
- Dot size: 10px, `radius-full`
  - Complete: `--success` fill
  - In Progress: `--warning` fill, pulse
  - Locked: `--border` fill
- Gap: `space-2`
- Label: "X of Y lessons complete" — `caption`, `--muted-foreground`

**Action button:**

- Right-aligned at bottom
- Icon: `ArrowRight` or `Lock` or `CheckCircle2`

---

## Section 4: Module Detail (Expanded State)

When a module is clicked (or "Start Module" is pressed):

```
┌─────────────────────────────────────────────────────┐
│  [Module Card — Expanded]                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                     │
│  Lesson 1: Introduction to Past Tense                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ● Complete  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ● Complete  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  ○ In Progress  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ○ Locked     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ○ Locked     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  [← Back to Path]  [Continue Lesson 3 →]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Expanded Content

- **Lesson list**: Vertical stack, each item is a `button` variant="ghost"
- **Each lesson row**:
  - Status icon: 16px (left)
  - Title: `body`, Outfit 500, `--foreground`
  - Duration: `caption`, `--muted-foreground` (e.g., "5 min")
  - Action: `ChevronRight` or `Play` icon (right)
- **Active lesson**: `background: --muted`, `border-left: 3px solid --primary`
- **Animations**: Expand height with `ease-out`, 300ms

---

## Section 5: Completion Celebration

When all modules are complete:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────────┐                 │
│              │  🎉 (animated)      │                 │
│              │                     │                 │
│              │  Curriculum Complete!│                 │
│              │                     │                 │
│              │  You've mastered all │                 │
│              │  5 focus areas.      │                 │
│              │                     │                 │
│              │  [Retake Assessment]  │                 │
│              │                     │                 │
│              └─────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Confetti effect**: Optional, subtle particle burst from center
- **Title**: `display`, Outfit 700, `--success`
- **Message**: `body`, `--muted-foreground`
- **CTA**: `button` variant="default", size="lg", "Retake Assessment"

---

## Mobile Adaptations

| Element          | Desktop                    | Mobile                       |
| ---------------- | -------------------------- | ---------------------------- |
| Timeline         | Left-aligned vertical line | Hidden, cards stack with gap |
| Module cards     | Left margin for timeline   | Full width, no margin        |
| Node dots        | 16px circles on line       | Small status badge on card   |
| Connector line   | 2px vertical               | Hidden                       |
| Card padding     | 24px                       | 16px                         |
| Expanded lessons | Inline expand              | Full-screen sheet            |

---

## shadcn-svelte Components Used

| Component     | Usage                  |
| ------------- | ---------------------- |
| `card`        | Module cards           |
| `button`      | Actions, lesson items  |
| `badge`       | Status indicators      |
| `progress`    | Overall path progress  |
| `separator`   | Dividers               |
| `collapsible` | Module expand/collapse |
| `scroll-area` | Lesson list overflow   |
| `sheet`       | Mobile lesson detail   |
| `tooltip`     | Module descriptions    |

---

## Custom Components Needed

| Component               | File                                                        | Description                         |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `PathTimeline`          | `components/app/learning-path/PathTimeline.svelte`          | Vertical line with animated nodes   |
| `PathNode`              | `components/app/learning-path/PathNode.svelte`              | Status node (circle with animation) |
| `ModuleCard`            | `components/app/learning-path/ModuleCard.svelte`            | Module card with expand/collapse    |
| `LessonList`            | `components/app/learning-path/LessonList.svelte`            | Lessons within a module             |
| `LessonRow`             | `components/app/learning-path/LessonRow.svelte`             | Individual lesson item              |
| `PathLegend`            | `components/app/learning-path/PathLegend.svelte`            | Status legend bar                   |
| `PathProgress`          | `components/app/learning-path/PathProgress.svelte`          | Overall progress indicator          |
| `CompletionCelebration` | `components/app/learning-path/CompletionCelebration.svelte` | All-complete state                  |

---

_Priority: P2 | Estimated sections: 5 | Responsive: yes_
