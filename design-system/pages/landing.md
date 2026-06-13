# LexiGap — Landing Page Design

## Page Purpose

Convert visitors into registered users. Communicate the value proposition: algorithmic grammar assessment that generates personalized learning paths.

---

## Route

`/`

## Layout

Full-width, no sidebar. No auth required. Dark mode only for this page.

---

## Section 1: Hero

### Structure

```
┌─────────────────────────────────────────────────────────┐
│  [Nav: Logo | Features | How it works | Login | CTA]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌─────────────────────────┐                 │
│              │   [Logo Icon] LexiGap   │                 │
│              │                         │                 │
│              │   Master Grammar.       │                 │
│              │   One Gap at a Time.    │                 │
│              │                         │                 │
│              │   Algorithmic cloze     │                 │
│              │   tests generate a      │                 │
│              │   personalized learning │                 │
│              │   path in under 5 min.  │                 │
│              │                         │                 │
│              │   [Start Assessment →]  │                 │
│              │                         │                 │
│              │   No signup required    │                 │
│              └─────────────────────────┘                 │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │   [Animated Bento Grid Preview — 3 cards]      │  │
│   │   • Grammar Profile | • Learning Path | • Progress│  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Visual Specs

- **Background**: `--background` (deep slate)
- **Headline**: `display` size (48px), Outfit 700, `--foreground`
- **Subheadline**: `h4` size (20px), Outfit 400, `--muted-foreground`
- **CTA Button**: `button` variant="default" (primary teal), size="lg", rounded-full
  - Icon: `ArrowRight` on right side
  - Hover: `scale(1.02)` + `brightness(1.1)`
  - Active: `scale(0.98)`
- **Secondary text**: `caption` size, `--muted-foreground`
- **Bento preview**: 3 cards in a row (1fr 1fr 1fr), gap `space-6`
  - Each card: `radius-lg`, `--card` background, subtle `--border` border
  - Hover: `border-color` shifts to `--primary` at 30% opacity
  - Content: Icon (48px, `--primary`), title (`h4`), description (`body-sm`)

### Animations

- Hero text: Staggered fade-in from `translate-y: 20px` (duration: 600ms, ease-out)
- Bento cards: Staggered entrance with 150ms delay between each
- CTA button: Subtle pulse glow on idle (ring animation, 2s loop)

---

## Section 2: Features (Bento Grid)

### Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ┌─────────────────────────┬─────────────────────────┐ │
│   │                         │                         │ │
│   │   [Large Card]          │  [Card]                 │ │
│   │   Dynamic Generation    │  Grammar Analysis       │ │
│   │   ┌─────────────────┐   │  ┌─────────────────┐    │ │
│   │   │   Code snippet  │   │  │  Radar chart    │    │ │
│   │   │   visualization │   │  │  preview        │    │ │
│   │   └─────────────────┘   │  └─────────────────┘    │ │
│   │                         │                         │ │
│   ├─────────────────────────┼─────────────────────────┤ │
│   │  [Card]                 │  [Card]                 │ │
│   │  Personalized Path      │  Progress Tracking      │ │
│   │                         │                         │ │
│   └─────────────────────────┴─────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Bento Grid Layout

CSS Grid:

```css
display: grid;
grid-template-columns: 2fr 1fr;
grid-template-rows: auto auto;
gap: 1.5rem;
```

On mobile: Single column, all cards equal width.

### Card Design

- Background: `--card`
- Border: 1px solid `--border`
- Border radius: `radius-lg` (16px)
- Padding: `space-6` (24px)
- No shadow (dark mode elevation via border)
- Hover: Border brightens to `--ring` color, transition 200ms

### Feature Cards

| Card             | Icon        | Title              | Description                                                               | Accent      |
| ---------------- | ----------- | ------------------ | ------------------------------------------------------------------------- | ----------- |
| Large (top-left) | `Zap`       | Dynamic Generation | NLP-powered cloze tests created algorithmically from curated text corpora | `--primary` |
| Top-right        | `BarChart3` | Grammar Analysis   | Identify weaknesses across 8+ parts of speech with visual breakdown       | `--chart-2` |
| Bottom-left      | `Route`     | Personalized Path  | A curriculum tailored to your specific gaps, not generic lessons          | `--chart-3` |
| Bottom-right     | `Target`    | Progress Tracking  | Daily streaks, accuracy trends, and skill mastery over time               | `--chart-4` |

---

## Section 3: How It Works

### Structure

Horizontal 3-step layout:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │   01     │───→│   02     │───→│   03     │         │
│   │  Assess  │    │  Analyze │    │  Learn   │         │
│   │          │    │          │    │          │         │
│   │  [Quiz   │    │  [Radar  │    │  [Path   │         │
│   │   Icon]  │    │   Chart] │    │   Icon]  │         │
│   └──────────┘    └──────────┘    └──────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step Cards

- Number: `display` size, Outfit 700, `--primary` at 20% opacity
- Title: `h3` size, Outfit 600
- Description: `body-sm`, `--muted-foreground`
- Connector: `ChevronRight` icon between steps, `--muted-foreground`
- Icon: 48px, contained in a `radius-full` circle with `--muted` background

---

## Section 4: CTA Footer

### Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         Ready to find your grammar gaps?                │
│                                                         │
│         [Start Free Assessment →]                       │
│                                                         │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   © LexiGap | Privacy | Terms | GitHub                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Visual Specs

- Background: Slightly lighter than base (`--muted` at 50% opacity)
- Divider: 1px `--border`
- Links: `body-sm`, `--muted-foreground`, hover: `--foreground`

---

## Navigation (Sticky)

```
┌─────────────────────────────────────────────────────────┐
│ [BookOpen] LexiGap    Features  How it works    [Login] [Get Started]│
└─────────────────────────────────────────────────────────┘
```

- Height: 64px
- Background: `--background` with `backdrop-blur-md` when scrolled
- Border-bottom: 1px `--border` (appears after scroll)
- Logo: `BookOpen` icon + "LexiGap" text, `h4` weight
- Links: `body-sm`, `--muted-foreground`, hover: `--foreground`
- Login: `button` variant="ghost"
- CTA: `button` variant="default", size="sm"

---

## shadcn-svelte Components Used

| Component   | Usage                     |
| ----------- | ------------------------- |
| `button`    | CTA, nav buttons          |
| `card`      | Feature cards, step cards |
| `badge`     | "No signup required" tag  |
| `separator` | Section dividers          |

---

## Assets Needed

| Asset              | Type     | Notes                                                 |
| ------------------ | -------- | ----------------------------------------------------- |
| Hero illustration  | SVG      | Abstract linguistic/grammar visual — minimal line art |
| Feature icons      | Lucide   | See mapping above                                     |
| Background texture | Optional | Very subtle dot grid or noise pattern at 2% opacity   |

---

_Priority: P1 | Estimated sections: 4 | Responsive: yes_
