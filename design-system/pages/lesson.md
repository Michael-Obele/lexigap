# LexiGap — Lesson Page Design

## Page Purpose

Individual learning module content. Presents grammar explanations, examples, interactive exercises, and a completion checkpoint. The reading experience should feel editorial and premium.

---

## Route

`/lesson/[id]`

## Layout

App layout with sidebar. Content area is a single-column reading experience (max-width for readability).

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] ┌─────────────────────────────────────────────────┐ │
│           │ [AppHeader]  Lesson: Past Tense | [Back] [Menu]   │ │
│           ├─────────────────────────────────────────────────┤ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────────┐ │ │
│           │  │  [Breadcrumb]  Path > Verbs > Lesson 2      │ │ │
│           │  │                                             │ │ │
│           │  │  Mastering the Past Tense                   │ │ │
│           │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │
│           │  │                                             │ │ │
│           │  │  [Editorial content area]                   │ │ │
│           │  │  ┌─────────────────────────────────────────┐ │ │
│           │  │  │                                         │ │ │
│           │  │  │  ## Understanding Past Tense            │ │ │
│           │  │  │                                         │ │ │
│           │  │  │  The past tense describes actions...    │ │ │
│           │  │  │                                         │ │ │
│           │  │  │  ### Examples                            │ │ │
│           │  │  │                                         │ │ │
│           │  │  │  > "She walked to the store."          │ │ │
│           │  │  │  > "They played soccer yesterday."     │ │ │
│           │  │  │                                         │ │ │
│           │  │  │  [Interactive Exercise]                  │ │ │
│           │  │  │  ┌─────────────────────────────────────┐│ │ │
│           │  │  │  │  Fill in the blank:                   ││ │ │
│           │  │  │  │  "He ______ to the party last night." ││ │ │
│           │  │  │  │  [go] [went] [gone] [going]          ││ │ │
│           │  │  │  └─────────────────────────────────────┘│ │ │
│           │  │  │                                         │ │ │
│           │  │  │  [Continue →]                           │ │ │
│           │  │  │                                         │ │ │
│           │  │  └─────────────────────────────────────────┘ │ │
│           │  │                                             │ │ │
│           │  │  [Previous]    Progress: 3/5    [Next]    │ │ │
│           │  │                                             │ │ │
│           │  └─────────────────────────────────────────────┘ │ │
│           │                                                 │ │
│           └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Lesson Header

### Structure

```
┌─────────────────────────────────────────────────────┐
│  [Breadcrumb]  Path > Verbs > Lesson 2              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Mastering the Past Tense                            │
│  Lesson 2 of 5 in the Verbs module                   │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Breadcrumb**: `breadcrumb` component
  - Items: "Learning Path" > "Verbs" > "Lesson 2"
  - `body-sm`, `--muted-foreground`
  - Hover: `--foreground`
- **Title**: `h1`, Outfit 700, `--foreground`
- **Subtitle**: `body-sm`, `--muted-foreground`
  - Format: "Lesson X of Y in the [Module] module"
  - Module name: `--primary`, bold

---

## Section 2: Content Area

### Container

- Max-width: `720px` (optimal reading width, ~65-75 characters per line)
- Centered in content area
- Padding: `space-8` top/bottom
- Background: `--background` (slight contrast from app background)
- Border radius: `radius-lg` (for the content card)

### Typography (Editorial Content)

- **Font**: `font-serif` (Merriweather)
- **Body text**: `body` (16px), line-height 1.75
- **Headings**: `font-sans` (Outfit), switch to sans for structure
- **Blockquotes**: Left border 4px `--primary`, `--muted` background, italic
- **Code/examples**: `font-mono`, `--muted` background, `radius-sm`
- **Emphasis**: `--primary` color for key terms

### Content Blocks

#### 1. Explanation Block

- Standard prose with `font-serif`
- Key grammatical terms: `badge` with `--primary` outline, inline

#### 2. Example Block

```
┌─────────────────────────────────────────────────────┐
│  Example                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  "She walked to the store yesterday."               │
│  │ Walked = past tense of "walk"                    │
│  │ Yesterday = time marker for past tense             │
│  └─────────────────────────────────────────────────  │
│  "They played soccer last weekend."                 │
│  │ Played = past tense of "play"                    │
│  │ Last weekend = time marker for past tense         │
└─────────────────────────────────────────────────────┘
```

- **Container**: `--card` background, `radius-md`, border-left 4px `--chart-2`
- **Label**: `caption`, uppercase, `--muted-foreground`
- **Sentence**: `font-serif`, `body` size, `--foreground`
- **Annotation**: `body-sm`, `--muted-foreground`, with `Info` icon

#### 3. Tip Block

```
┌─────────────────────────────────────────────────────┐
│  [Lightbulb]  Pro Tip                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Most regular verbs form the past tense by adding     │
│  "-ed" to the base form.                             │
└─────────────────────────────────────────────────────┘
```

- **Container**: `--warning` at 5% background, border 1px `--warning` at 20%
- **Icon**: `Lightbulb`, `--warning` color
- **Label**: `body-sm`, Outfit 600, `--warning`
- **Text**: `body-sm`, `--foreground`

#### 4. Warning Block

```
┌─────────────────────────────────────────────────────┐
│  [AlertTriangle]  Common Mistake                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  "I did went" is incorrect. Use "I went" or "I did go"│
└─────────────────────────────────────────────────────┘
```

- **Container**: `--destructive` at 5% background, border 1px `--destructive` at 20%
- **Icon**: `AlertTriangle`, `--destructive` color
- **Label**: `body-sm`, Outfit 600, `--destructive`
- **Text**: `body-sm`, `--foreground`

---

## Section 3: Interactive Exercise

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Interactive Exercise                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  "He ______ to the party last night."                │
│                                                      │
│  [go]      [went]      [gone]      [going]          │
│                                                      │
│  [Check Answer]                                      │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: `--card` background, `radius-lg`, border 2px `--border`
- **Header**: `h3`, Outfit 600, "Interactive Exercise", icon `BrainCircuit`
- **Sentence**: `font-serif`, `text-xl` (22px), centered, line-height 1.8
  - Blank: `____` with dashed underline `--primary`
- **Options**: 2x2 grid (desktop), 1 column (mobile)
  - Same design as quiz `AnswerOption` component
  - But smaller: min-height 48px, padding `space-3`
- **Check button**: `button` variant="default", size="default", "Check Answer"
  - Disabled until selection made
  - On click: reveals correct/incorrect with feedback

### Feedback States

| State           | Visual                                                                                |
| --------------- | ------------------------------------------------------------------------------------- |
| **Correct**     | Green border, green background tint, "Correct!" message with `CheckCircle2`           |
| **Incorrect**   | Red border, shake animation, "Not quite." with `XCircle`, then reveals correct answer |
| **Explanation** | Collapsible block below: "Explanation: 'Went' is the past tense of 'go'."             |

---

## Section 4: Lesson Navigation

### Structure

```
┌─────────────────────────────────────────────────────┐
│  [← Previous Lesson]    ● ● ● ○ ○    [Next Lesson →]│
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: Sticky at bottom of content area, `--card` background, border-top 1px `--border`
- **Previous button**: `button` variant="outline", size="default", icon `ChevronLeft`
  - Disabled on first lesson
- **Next button**: `button` variant="default", size="default", icon `ChevronRight`
  - On last lesson: "Complete Module" with `CheckCircle2` icon
- **Progress dots**: Centered between buttons
  - 5 dots for 5 lessons
  - Complete: `--success` fill
  - Current: `--primary` fill, larger (12px)
  - Locked: `--border` fill
  - Gap: `space-2`
- **Label**: "Lesson X of Y" — `caption`, `--muted-foreground`

---

## Section 5: Completion State

When lesson is completed:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────────┐                 │
│              │  ✓                  │                 │
│              │  Lesson Complete!   │                 │
│              │                     │                 │
│              │  +15 XP             │                 │
│              │  Accuracy: 80%      │                 │
│              │                     │                 │
│              │  [Next Lesson →]    │                 │
│              │  [Back to Path]     │                 │
│              └─────────────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- **Overlay**: Modal or inline card with `radius-xl`
- **Icon**: `CheckCircle2` (64px), `--success`, scales in with bounce
- **Title**: `h2`, Outfit 700, `--success`
- **Stats**: `body`, `--foreground`
  - XP gain: `--primary` color
  - Accuracy: Percentage with `TrendingUp`/`TrendingDown` icon
- **Buttons**: Stacked vertically, gap `space-4`
  - Primary: "Next Lesson" — `default` variant
  - Secondary: "Back to Path" — `outline` variant
- **Confetti**: Optional subtle burst

---

## Section 6: Reading Progress Bar

Optional enhancement at top of content:

- Thin progress bar (4px) at top of content area
- Fills based on scroll position
- Color: `--primary`
- Disappears when at top

---

## Mobile Adaptations

| Element        | Desktop           | Mobile                        |
| -------------- | ----------------- | ----------------------------- |
| Content width  | 720px max         | 100% width, `space-4` padding |
| Exercise grid  | 2 columns         | 1 column                      |
| Navigation     | Sticky bottom bar | Sticky bottom bar, full width |
| Breadcrumb     | Full text         | Collapsed to "← Back to Path" |
| Font size      | 16px body         | 16px body (no reduction)      |
| Example blocks | Inline            | Full width                    |

---

## shadcn-svelte Components Used

| Component     | Usage                                               |
| ------------- | --------------------------------------------------- |
| `card`        | Content container, exercise block, completion modal |
| `button`      | Navigation, check answer, CTAs                      |
| `badge`       | Key terms, inline labels                            |
| `breadcrumb`  | Lesson navigation path                              |
| `progress`    | Reading progress bar                                |
| `separator`   | Section dividers                                    |
| `collapsible` | Exercise explanation                                |
| `radio-group` | Exercise options (optional)                         |
| `alert`       | Feedback messages                                   |
| `dialog`      | Completion modal                                    |
| `tooltip`     | Key term definitions                                |

---

## Custom Components Needed

| Component         | File                                           | Description                       |
| ----------------- | ---------------------------------------------- | --------------------------------- |
| `LessonContent`   | `components/app/lesson/LessonContent.svelte`   | Main content renderer with blocks |
| `ExampleBlock`    | `components/app/lesson/ExampleBlock.svelte`    | Annotated example container       |
| `TipBlock`        | `components/app/lesson/TipBlock.svelte`        | Pro tip callout                   |
| `WarningBlock`    | `components/app/lesson/WarningBlock.svelte`    | Common mistake callout            |
| `ExerciseBlock`   | `components/app/lesson/ExerciseBlock.svelte`   | Interactive exercise wrapper      |
| `LessonNav`       | `components/app/lesson/LessonNav.svelte`       | Sticky bottom navigation          |
| `CompletionModal` | `components/app/lesson/CompletionModal.svelte` | Lesson completion overlay         |
| `ReadingProgress` | `components/app/lesson/ReadingProgress.svelte` | Scroll-based progress bar         |

---

_Priority: P2 | Estimated sections: 6 | Responsive: yes_
