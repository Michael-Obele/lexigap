# LexiGap — Assessment (Quiz) Page Design

## Page Purpose

The core interaction: a rapid-fire, 20-question multiple-choice cloze test that feels gamified and engaging. Users must maintain momentum. The UI must feel like a premium interactive experience, not a boring test.

---

## Route

`/assessment`

## Layout

App layout with sidebar collapsed (or hidden on mobile). Full focus mode. No distractions.

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [AppHeader — Minimal: Logo | "Grammar Assessment" | Quit]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Question 12 of 20                    [Timer: 4:32]   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░  │   │
│  │                                                     │   │
│  │  "The committee _______ the proposal yesterday."    │   │
│  │                                                     │   │
│  │  A) approve          B) approved                    │   │
│  │  C) approves         D) approving                   │   │
│  │                                                     │   │
│  │                                                     │   │
│  │  [← Previous]        [Skip]        [Next →]        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Report Question]  [Streak: 🔥 5]  [Accuracy: 78%] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Progress Header

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Question 12 of 20                    [Timer: 4:32]  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: `--card` background, `radius-md`, padding `space-4`, margin-bottom `space-6`
- **Question counter**: `body-sm`, Outfit 500, `--muted-foreground`
  - Format: "Question **12** of 20" (current number bold, `--foreground`)
- **Timer**: `body-sm`, monospace font, `--muted-foreground`
  - Icon: `Clock` (16px) before time
  - Color shifts to `--warning` at < 1 minute, `--destructive` at < 30 seconds
- **Progress bar**: `Progress` component (shadcn)
  - Height: 8px
  - Fill: `--primary` (teal)
  - Track: `--muted`
  - Border radius: `radius-full`
  - Animated width transition on question change (500ms ease-out)

---

## Section 2: Question Card

### Structure

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  "The committee _______ the proposal yesterday."     │
│                                                     │
│  A) approve          B) approved                    │
│  C) approves         D) approving                   │
│                                                     │
│                                                     │
│  [← Previous]        [Skip]        [Next →]        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

#### Sentence Display

- **Font**: `font-serif` (Merriweather) — editorial feel
- **Size**: 22px / `text-xl`
- **Line height**: 1.8
- **Color**: `--foreground`
- **Alignment**: Center
- **The blank**: Rendered as a `span` with:
  - Bottom border: 2px dashed `--primary`
  - Min-width: 80px
  - Height: 1.2em
  - Animated: subtle pulse when unanswered (border opacity 0.5 → 1.0, 1.5s loop)
  - When answered: border becomes solid, color matches answer state

#### Answer Options

- **Layout**: 2-column grid on desktop, 1-column on mobile
- **Gap**: `space-4`
- **Option card**:
  - Background: `--card`
  - Border: 1px solid `--border`
  - Border radius: `radius-md`
  - Padding: `space-4` vertical, `space-6` horizontal
  - Min-height: 56px (touch target)
  - Cursor: `pointer`
  - Letter prefix: "A)", "B)", etc. — Outfit 600, `--muted-foreground`
  - Answer text: Outfit 400, `--foreground`

#### Answer States

| State         | Visual                                                                | Transition |
| ------------- | --------------------------------------------------------------------- | ---------- |
| **Default**   | `--card` bg, `--border` border                                        | —          |
| **Hover**     | `background: --muted`, `border: --ring`                               | 150ms      |
| **Selected**  | `border: --primary`, `background: --primary/10`                       | 150ms      |
| **Correct**   | `border: --success`, `background: --success/10`, green checkmark icon | 300ms      |
| **Incorrect** | `border: --destructive`, `background: --destructive/10`, red X icon   | 300ms      |
| **Disabled**  | `opacity: 0.5`, `cursor: not-allowed`                                 | —          |

#### Answer Feedback Animation

- **Correct**:
  - Card border flashes `--success` (brightness 1.2 for 200ms)
  - `CheckCircle2` icon scales in from 0.5 → 1.0 (300ms ease-bounce)
  - Confetti particles optional (subtle, 10-15 particles)
- **Incorrect**:
  - Card shake: `translate-x` oscillates -4px, 4px, -2px, 2px, 0 (400ms)
  - `XCircle` icon fades in
  - Correct answer card simultaneously reveals green border

#### Navigation Buttons

| Button   | Variant                   | Icon           | Position |
| -------- | ------------------------- | -------------- | -------- |
| Previous | `outline`, size="default" | `ChevronLeft`  | Left     |
| Skip     | `ghost`, size="default"   | `SkipForward`  | Center   |
| Next     | `default`, size="default" | `ChevronRight` | Right    |

- Next is disabled until an answer is selected
- On last question, Next becomes "Finish" with `CheckCircle2` icon
- All buttons: min-height 44px

---

## Section 3: Quiz Footer

### Structure

```
┌─────────────────────────────────────────────────────┐
│  [Flag] Report      🔥 Streak: 5      🎯 Accuracy: 78%│
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Container**: `--card` background, `radius-md`, padding `space-4`
- **Report button**: `button` variant="ghost", size="sm", icon `Flag`
  - Opens `Dialog` with "Report Question" form
  - Options: "Distractor is also correct", "Sentence is unclear", "Other"
- **Streak**: `badge` variant="outline", icon `Flame`, color `--warning`
  - Number: Outfit 700
  - On streak increase: number scales up 1.2x with bounce, then settles
- **Accuracy**: `badge` variant="outline", icon `Target`, color `--primary`
  - Percentage: Outfit 600
  - Updates live after each answer

---

## Section 4: Completion State

When all 20 questions are answered:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              ┌─────────────────────┐                 │
│              │                     │                 │
│              │   Assessment        │                 │
│              │   Complete!         │                 │
│              │                     │                 │
│              │   Score: 78%        │                 │
│              │   🎯 16 / 20        │                 │
│              │                     │                 │
│              │   [View Dashboard →]│                 │
│              │                     │                 │
│              └─────────────────────┘                 │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  Quick Breakdown:                           │   │
│   │  • Verbs: 4/5        • Prepositions: 3/5   │   │
│   │  • Nouns: 5/5        • Adjectives: 4/5      │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Score card**: Large `card` with `radius-xl`, centered, max-width 480px
- **Score**: `display` size (48px), Outfit 700, `--primary`
- **Breakdown**: 2-column grid of mini stat cards
  - Each: `card` with `radius-md`, icon + category + score
  - Perfect scores: `--success` icon
  - Below 60%: `--destructive` icon
  - Otherwise: `--primary` icon
- **CTA**: `button` variant="default", size="lg", `ArrowRight` icon
  - Links to `/dashboard`

---

## Section 5: Question Types

### Type A: Cloze Test (Gap-Fill)

The default. Sentence with one word blanked out. 4 multiple-choice options.

### Type B: Synonym Matching

Occasional alternative (e.g., question 5, 10, 15, 20):

```
"Select the synonym for 'ubiquitous':"

A) rare          B) omnipresent
C) hidden        D) specific
```

- Same visual treatment as cloze tests
- Title: "Synonym Matching" badge above sentence
- Badge: `badge` variant="secondary", size="sm"

---

## Mobile Adaptations

| Element               | Desktop          | Mobile                               |
| --------------------- | ---------------- | ------------------------------------ |
| Answer grid           | 2 columns        | 1 column                             |
| Sentence size         | 22px             | 18px                                 |
| Navigation            | 3 buttons in row | Previous/Next on sides, Skip as icon |
| Progress bar          | Full width       | Full width, thinner (4px)            |
| Footer stats          | Horizontal row   | Vertical stack                       |
| Question card padding | 40px             | 20px                                 |

---

## shadcn-svelte Components Used

| Component     | Usage                                      |
| ------------- | ------------------------------------------ |
| `card`        | Question container, score card, stat cards |
| `button`      | Navigation, report, CTA                    |
| `progress`    | Question progress bar                      |
| `badge`       | Question type labels, streak, accuracy     |
| `dialog`      | Report question modal                      |
| `radio-group` | Answer selection (optional)                |
| `separator`   | Visual dividers                            |

---

## Custom Components Needed

| Component          | File                                          | Description                    |
| ------------------ | --------------------------------------------- | ------------------------------ |
| `QuizCard`         | `components/app/quiz/QuizCard.svelte`         | Main question container        |
| `AnswerOption`     | `components/app/quiz/AnswerOption.svelte`     | Single answer card with states |
| `ProgressHeader`   | `components/app/quiz/ProgressHeader.svelte`   | Timer + progress bar           |
| `QuestionCounter`  | `components/app/quiz/QuestionCounter.svelte`  | "X of Y" display               |
| `QuizFooter`       | `components/app/quiz/QuizFooter.svelte`       | Streak + accuracy + report     |
| `ReportDialog`     | `components/app/quiz/ReportDialog.svelte`     | Report question form           |
| `CompletionScreen` | `components/app/quiz/CompletionScreen.svelte` | End-of-quiz summary            |
| `ScoreBreakdown`   | `components/app/quiz/ScoreBreakdown.svelte`   | POS-specific results           |

---

## Assets Needed

| Asset            | Type   | Notes                                   |
| ---------------- | ------ | --------------------------------------- |
| Confetti effect  | CSS/JS | Subtle particle burst on correct answer |
| Streak animation | CSS    | Number bounce with `ease-bounce`        |

---

_Priority: P1 | Estimated sections: 5 | Responsive: yes_
