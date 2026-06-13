# LexiGap — Dashboard Page Design

## Page Purpose

Post-assessment or returning user home. Visual grammar profile with Bento-grid style cards, progress charts, and quick actions. The dashboard should feel like a personal command center for language improvement.

---

## Route

`/dashboard`

## Layout

App layout with full sidebar (desktop) or icon sidebar (tablet). Default route after login/assessment.

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] ┌─────────────────────────────────────────────────┐ │
│           │ [AppHeader]  Dashboard | [Search] [Notif] [Avatar]│ │
│           ├─────────────────────────────────────────────────┤ │
│           │                                                 │ │
│           │  Welcome back, Alex.      [Start Quiz →]      │ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────┐   │ │
│           │  │  BENTO GRID — Grammar Profile           │   │ │
│           │  │                                         │   │ │
│           │  │  ┌────────────┐  ┌───────────────────┐  │   │ │
│           │  │  │ Overall    │  │ Skill Breakdown   │  │   │ │
│           │  │  │ Score      │  │ (Radar Chart)     │  │   │ │
│           │  │  │ 78%        │  │                   │  │   │ │
│           │  │  │ [trend]    │  │                   │  │   │ │
│           │  │  └────────────┘  └───────────────────┘  │   │ │
│           │  │                                         │   │ │
│           │  │  ┌────────────┐  ┌────────────┐  ┌────┐  │   │ │
│           │  │  │ Verbs      │  │ Prepositions│  │ Streak│  │   │ │
│           │  │  │ 80%        │  │ 60%        │  │ 🔥12 │  │   │ │
│           │  │  └────────────┘  └────────────┘  └────┘  │   │ │
│           │  │                                         │   │ │
│           │  └─────────────────────────────────────────┘   │ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────┐   │ │
│           │  │  Recent Activity                        │   │ │
│           │  │  • Assessment — 78% — 2 days ago      │   │ │
│           │  │  • Lesson: Verbs — Completed — 3d ago │   │ │
│           │  │  • Lesson: Prepositions — In Progress   │   │ │
│           │  └─────────────────────────────────────────┘   │ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────┐   │ │
│           │  │  Quick Actions                          │   │ │
│           │  │  [Start Assessment] [View Path] [Review]│   │ │
│           │  └─────────────────────────────────────────┘   │ │
│           │                                                 │ │
│           └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Welcome Header

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Welcome back, Alex.              [Start Quiz →]   │
│  Here's your grammar profile.                        │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Greeting**: `h2` (30px), Outfit 600, `--foreground`
  - First name extracted from user profile, bold weight
- **Subtitle**: `body`, `--muted-foreground`
- **CTA**: `button` variant="default", size="default", icon `Play`
  - Position: right-aligned, vertically centered
  - If no assessment taken yet: "Take Assessment →"
  - If assessment taken: "Retake Assessment →"

---

## Section 2: Grammar Profile (Bento Grid)

### Layout

CSS Grid:

```css
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: auto auto;
gap: 1.5rem;
```

Responsive:

- Desktop (1024px+): 4 columns
- Tablet (768px-1024px): 2 columns
- Mobile (<768px): 1 column

### Grid Areas

```
┌─────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌─────────────────────────────┐   │
│  │  [Score]   │  │  [Radar Chart]              │   │
│  │  2x1       │  │  2x2                        │   │
│  └────────────┘  │                             │   │
│  ┌────────────┐  │                             │   │
│  │  [Trend]   │  │                             │   │
│  │  2x1       │  │                             │   │
│  └────────────┘  └─────────────────────────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Verbs  │ │ Prepos │ │ Nouns  │ │ Adject │      │
│  │ 1x1    │ │ 1x1    │ │ 1x1    │ │ 1x1    │      │
│  └────────┘ └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────────────────┘
```

### Card Design (All Bento Cards)

- Background: `--card`
- Border: 1px solid `--border`
- Border radius: `radius-lg` (16px)
- Padding: `space-6` (24px)
- Hover: `border-color` shifts to `--ring` at 50% opacity, 200ms transition
- No shadow in dark mode

### Card 1: Overall Score (Large)

- **Size**: 2 columns wide, 1 row tall
- **Content**:
  - Label: "Overall Score" — `caption`, uppercase, `--muted-foreground`, letter-spacing wide
  - Score: `display` (48px), Outfit 700, `--primary`
  - Change indicator: `badge` with arrow icon
    - Up: `TrendingUp` icon, `--success` color, "+5%"
    - Down: `TrendingDown` icon, `--destructive` color, "-2%"
  - Mini progress bar: `Progress` component, full width, 6px height
- **Accent**: Top border 2px `--primary`

### Card 2: Skill Breakdown (Radar Chart)

- **Size**: 2 columns wide, 2 rows tall
- **Content**:
  - Label: "Skill Breakdown" — `h3`, Outfit 600
  - Subtitle: "Performance across parts of speech" — `body-sm`, `--muted-foreground`
  - Radar/Spider chart: `chart` component from shadcn
    - Axes: Verbs, Nouns, Prepositions, Adjectives, Adverbs, Conjunctions, Articles, Pronouns
    - Colors: `--chart-1` through `--chart-5` for different metrics
    - Background: transparent, grid lines `--border` at 30% opacity
  - Legend: Small color dots + labels below chart
- **Accent**: Top border 2px `--chart-2`

### Card 3: Score Trend (Mini)

- **Size**: 2 columns wide, 1 row tall
- **Content**:
  - Label: "Score Trend" — `caption`, uppercase
  - Mini line chart: `chart-area-interactive` or simple sparkline
    - X-axis: Last 7 assessments
    - Y-axis: Score percentage
    - Line color: `--primary`
    - Fill: `--primary` at 10% opacity
    - No grid lines, minimal
  - Average: "Avg: 74%" — `h3`, `--foreground`
- **Accent**: Top border 2px `--chart-3`

### Card 4–7: Individual Skill Cards (1x1 each)

| Skill        | Icon         | Color       | Example Score |
| ------------ | ------------ | ----------- | ------------- |
| Verbs        | `Zap`        | `--chart-1` | 80%           |
| Prepositions | `ArrowRight` | `--chart-2` | 60%           |
| Nouns        | `Box`        | `--chart-3` | 90%           |
| Adjectives   | `Palette`    | `--chart-4` | 75%           |

**Each skill card:**

- Label: Skill name — `body-sm`, uppercase, `--muted-foreground`
- Icon: 24px, colored with the skill's accent color
- Score: `h2` (30px), Outfit 700, `--foreground`
- Mini bar: `Progress` component, height 4px, colored with skill accent
- Status badge:
  - ≥80%: `badge` "Strong" — `--success` variant
  - 60-79%: `badge` "Developing" — `--warning` variant
  - <60%: `badge` "Focus Area" — `--destructive` variant
- Hover: Slight `translateY(-2px)` lift, 200ms

### Card 8: Streak Counter

- **Size**: 1 column, 1 row
- **Content**:
  - Icon: `Flame` (32px), `--warning` color, animated (subtle pulse)
  - Number: `h2` (30px), Outfit 700, `--warning`
  - Label: "Day Streak" — `body-sm`, `--muted-foreground`
  - Subtext: "Keep it up!" — `caption`, `--success`
- **Accent**: Top border 2px `--warning`

---

## Section 3: Recent Activity

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Recent Activity                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • [BrainCircuit] Assessment — 78% — 2 days ago      │
│  • [GraduationCap] Lesson: Verbs — Completed — 3d ago│
│  • [BookOpen] Lesson: Prepositions — In Progress     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [View All Activity →]                              │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: `--card`, `radius-lg`, padding `space-6`
- **Header**: `h3`, Outfit 600, "Recent Activity"
- **Activity list**: Vertical stack, gap `space-4`
- **Each item**:
  - Icon: 20px, in a `radius-full` circle with `--muted` background
  - Title: `body-sm`, Outfit 500, `--foreground`
  - Meta: `caption`, `--muted-foreground` (score + date)
  - Status badge: `badge` variant="outline", size="sm"
    - Completed: `--success`
    - In Progress: `--primary`
    - Not Started: `--muted-foreground`
- **Divider**: `separator` between items
- **Footer link**: `button` variant="ghost", size="sm", "View All", `ChevronRight` icon

---

## Section 4: Quick Actions

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Quick Actions                                       │
│  ┌─────────────────────────────────────────────────┐│
│  │  [Start New Assessment] [View Learning Path] [Review Mistakes]││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: `--card`, `radius-lg`, padding `space-6`
- **Header**: `h3`, Outfit 600, "Quick Actions"
- **Button group**: Horizontal flex, gap `space-4`
  - Mobile: Stack vertically
- **Buttons**:
  1. "Start New Assessment" — `button` variant="default", icon `Play`
  2. "View Learning Path" — `button` variant="outline", icon `Route`
  3. "Review Mistakes" — `button` variant="outline", icon `BookOpen`
- All buttons: min-height 48px, `radius-md`

---

## Section 5: Empty State (First Visit)

If user has no assessment data:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────────┐                 │
│              │   [BrainCircuit]    │                 │
│              │        64px         │                 │
│              │                     │                 │
│              │   No data yet       │                 │
│              │                     │                 │
│              │   Take your first   │                 │
│              │   assessment to     │                 │
│              │   generate your     │                 │
│              │   grammar profile.  │                 │
│              │                     │                 │
│              │   [Start Assessment]│                 │
│              │                     │                 │
│              └─────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Container**: Centered, max-width 480px
- **Icon**: `BrainCircuit` (64px), `--muted-foreground`
- **Title**: `h2`, Outfit 600, `--foreground`
- **Description**: `body`, `--muted-foreground`, centered
- **CTA**: `button` variant="default", size="lg", icon `Play`

---

## shadcn-svelte Components Used

| Component   | Usage                                         |
| ----------- | --------------------------------------------- |
| `card`      | All bento cards, activity list, quick actions |
| `button`    | CTAs, navigation, actions                     |
| `badge`     | Score indicators, status labels, skill levels |
| `progress`  | Mini skill bars, overall score bar            |
| `chart`     | Radar chart, trend line                       |
| `separator` | Activity list dividers                        |
| `avatar`    | User profile in header                        |
| `tooltip`   | Chart data points                             |
| `skeleton`  | Loading states for cards                      |

---

## Custom Components Needed

| Component        | File                                             | Description                                           |
| ---------------- | ------------------------------------------------ | ----------------------------------------------------- |
| `StatCard`       | `components/app/dashboard/StatCard.svelte`       | Reusable bento card with icon, label, value, progress |
| `GrammarChart`   | `components/app/dashboard/GrammarChart.svelte`   | Radar chart wrapper with legend                       |
| `ScoreTrend`     | `components/app/dashboard/ScoreTrend.svelte`     | Sparkline chart for score history                     |
| `SkillBreakdown` | `components/app/dashboard/SkillBreakdown.svelte` | Grid of skill stat cards                              |
| `StreakBadge`    | `components/app/dashboard/StreakBadge.svelte`    | Animated flame + streak counter                       |
| `ActivityList`   | `components/app/dashboard/ActivityList.svelte`   | Recent activity feed                                  |
| `QuickActions`   | `components/app/dashboard/QuickActions.svelte`   | Action button group                                   |
| `EmptyState`     | `components/app/dashboard/EmptyState.svelte`     | No-data placeholder                                   |

---

_Priority: P1 | Estimated sections: 5 | Responsive: yes_
