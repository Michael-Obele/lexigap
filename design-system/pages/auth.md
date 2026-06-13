# LexiGap — Authentication Pages Design

## Page Purpose

Login and registration flows for Better Auth. Must be minimal, trustworthy, and frictionless. The dark aesthetic should feel premium and secure.

---

## Routes

- `/login`
- `/register`

## Layout

Full-screen centered layout. No sidebar. No app header. Minimal chrome.

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │   [BookOpen]  LexiGap                               │   │
│   │                                                     │   │
│   │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│   │                                                     │   │
│   │   Welcome back                      Create account  │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │  [Apple icon]  Continue with Apple          │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │  [Google icon]  Continue with Google        │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │   ━━━━━━━━━━━━━━━  or continue with  ━━━━━━━━━━━━━  │   │
│   │                                                     │   │
│   │   Email                                             │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │  alex@example.com                             │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │   Password                                          │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │  ••••••••••                                  │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │   [Remember me]  Forgot password?                 │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │              Log in                         │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │   Don't have an account?  Sign up                 │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   © LexiGap | Terms | Privacy                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 1: Auth Card

### Visual Specs

- **Container**: Centered both horizontally and vertically
- **Card**: `--card` background, `radius-lg`, padding `space-8` (32px)
- **Max width**: 420px
- **Min height**: 600px (to prevent layout shift during form toggle)
- **Border**: 1px solid `--border`
- **Mobile**: Full width with `space-4` padding, no card border (flush with screen)

### Logo Area

- **Icon**: `BookOpen` (32px), inside a `radius-lg` square (48px), `--primary` background
- **Text**: "LexiGap" — `h3`, Outfit 600, `--foreground`
- **Alignment**: Centered, margin-bottom `space-8`

---

## Section 2: Social Auth Buttons

### Structure

Two full-width buttons stacked vertically.

### Apple Button

- **Variant**: `outline`
- **Size**: `lg` (full width)
- **Icon**: Apple SVG icon (16px), left-aligned
- **Text**: "Continue with Apple" — `body`, Outfit 500
- **Hover**: `background: --muted`, `border: --foreground`

### Google Button

- **Variant**: `outline`
- **Size**: `lg` (full width)
- **Icon**: Google SVG icon (16px), left-aligned
- **Text**: "Continue with Google" — `body`, Outfit 500
- **Hover**: Same as Apple

### Divider

- `separator` with `FieldSeparator` pattern from login-03 block
- Text: "or continue with" — `caption`, `--muted-foreground`

---

## Section 3: Email/Password Form

### Form Fields

#### Email Field

- **Label**: "Email" — `label` component, `body-sm`, Outfit 500
- **Input**: `input` component
  - Type: `email`
  - Placeholder: "alex@example.com"
  - Size: `default`
  - Full width
  - Border radius: `radius-md`
  - Focus: `ring-2 ring-primary ring-offset-2`
- **Error**: `FieldError` component, `--destructive`, `caption` size

#### Password Field

- **Label**: "Password" — `label` component
  - With "Forgot password?" link aligned right
  - Link: `body-sm`, `--primary`, underline on hover
- **Input**: `input` component
  - Type: `password`
  - Placeholder: "••••••••••"
  - Same styling as email
- **Error**: Same as email

### Submit Button

- **Variant**: `default`
- **Size**: `lg` (full width)
- **Text**: "Log in" (login) / "Create account" (register)
- **Loading state**: `Spinner` icon replaces text, disabled
- **Success state**: `CheckCircle2` icon, brief green flash
- **Error state**: `AlertCircle` icon, shake animation

---

## Section 4: Form Footer

### Login Page

- **Remember me**: `checkbox` + "Remember me" label, `body-sm`
- **Forgot password**: Right-aligned link, `body-sm`, `--primary`
- **Switch prompt**: "Don't have an account?" + "Sign up" link, `body-sm`, `--primary`

### Register Page

- **Terms**: "By creating an account, you agree to our Terms and Privacy Policy" — `caption`, `--muted-foreground`
- **Switch prompt**: "Already have an account?" + "Log in" link, `body-sm`, `--primary`

---

## Section 5: Page Footer

- **Position**: Absolute bottom, centered
- **Content**: "© LexiGap | Terms | Privacy" — `caption`, `--muted-foreground`
- **Links**: Hover to `--foreground`

---

## State: Loading

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Logo]                                    │
│                                             │
│   ┌─────────────────────────────────────────┐ │
│   │  [Spinner]  Signing you in...         │ │
│   │                                         │ │
│   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │ │
│   │                                         │ │
│   └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

- Centered `skeleton` card or `Spinner` component
- Text: "Signing you in..." — `body`, `--muted-foreground`
- Progress: `Progress` component, indeterminate animation

---

## State: Error

```
┌─────────────────────────────────────────────┐
│                                             │
│   ┌─────────────────────────────────────────┐ │
│   │  [AlertTriangle]  Invalid credentials   │ │
│   │                                         │ │
│   │  Please check your email and password   │ │
│   │  and try again.                         │ │
│   └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

- `alert` component, variant="destructive"
- Icon: `AlertTriangle`
- Dismissible: `X` icon on right
- Auto-dismiss after 5 seconds (optional)

---

## Mobile Adaptations

| Element        | Desktop          | Mobile                        |
| -------------- | ---------------- | ----------------------------- |
| Card width     | 420px, centered  | 100% width, `space-4` padding |
| Card border    | 1px `--border`   | None (flush)                  |
| Social buttons | Full width       | Full width                    |
| Logo           | 48px icon + text | 40px icon + text              |
| Footer         | Absolute bottom  | Static bottom                 |

---

## shadcn-svelte Components Used

| Component   | Usage                      |
| ----------- | -------------------------- |
| `card`      | Auth container             |
| `button`    | Social auth, submit, links |
| `input`     | Email, password fields     |
| `label`     | Form labels                |
| `checkbox`  | Remember me                |
| `separator` | Divider                    |
| `alert`     | Error messages             |
| `spinner`   | Loading states             |
| `progress`  | Indeterminate loading      |
| `form`      | Form validation wrapper    |
| `field`     | Field group with errors    |

---

## Custom Components Needed

| Component      | File                                      | Description                         |
| -------------- | ----------------------------------------- | ----------------------------------- |
| `AuthCard`     | `components/app/auth/AuthCard.svelte`     | Card wrapper with logo              |
| `SocialButton` | `components/app/auth/SocialButton.svelte` | Apple/Google auth buttons           |
| `AuthForm`     | `components/app/auth/AuthForm.svelte`     | Email/password form with validation |
| `AuthSwitch`   | `components/app/auth/AuthSwitch.svelte`   | "Don't have an account?" toggle     |
| `AuthError`    | `components/app/auth/AuthError.svelte`    | Error alert with dismiss            |
| `AuthLoading`  | `components/app/auth/AuthLoading.svelte`  | Loading overlay                     |

---

## Assets Needed

| Asset       | Type | Notes                    |
| ----------- | ---- | ------------------------ |
| Apple icon  | SVG  | Inline SVG, currentColor |
| Google icon | SVG  | Inline SVG, currentColor |

---

## Notes

- Form validation uses Valibot (per AGENTS.md)
- Submission uses SvelteKit `form` remote (not manual async)
- Better Auth handles OAuth redirects
- Password fields should have show/hide toggle (optional enhancement)

---

_Priority: P1 | Estimated sections: 5 | Responsive: yes_
