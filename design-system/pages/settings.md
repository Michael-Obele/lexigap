# LexiGap — Settings Page Design

## Page Purpose

User profile management, preferences, and account settings. Minimal, functional, and unobtrusive. Users should find what they need quickly and leave.

---

## Route

`/settings`

## Layout

App layout with sidebar. Standard content area.

---

## Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar] ┌─────────────────────────────────────────────────┐ │
│           │ [AppHeader]  Settings | [Avatar]                │ │
│           ├─────────────────────────────────────────────────┤ │
│           │                                                 │ │
│           │  ┌─────────────────────────────────────────────┐ │ │
│           │  │  [Tabs]  Profile | Account | Preferences    │ │ │
│           │  ├─────────────────────────────────────────────┤ │ │
│           │  │                                             │ │ │
│           │  │  TAB CONTENT                                │ │ │
│           │  │                                             │ │ │
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
│  Settings                                            │
│  Manage your profile and preferences.                │
└─────────────────────────────────────────────────────┘
```

- **Title**: `h2`, Outfit 600, `--foreground`
- **Subtitle**: `body`, `--muted-foreground`

---

## Section 2: Tabs

### Tab List

```
┌─────────────────────────────────────────────────────┐
│  [Profile]  [Account]  [Preferences]                │
└─────────────────────────────────────────────────────┘
```

- **Component**: `tabs` from shadcn-svelte
- **Style**: `tabs` variant="default", `tabs-list` with `radius-md`
- **Active tab**: `bg-primary text-primary-foreground`
- **Inactive tab**: `text-muted-foreground hover:text-foreground`
- **Icons**: `User` (Profile), `Shield` (Account), `SlidersHorizontal` (Preferences)

---

## Tab 1: Profile

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Profile                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Avatar]  Alex Johnson                     │    │
│  │            alex@example.com                 │    │
│  │            [Change Photo]                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Display Name                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  Alex Johnson                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Email                                              │
│  ┌─────────────────────────────────────────────┐    │
│  │  alex@example.com                           │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Bio                                                │
│  ┌─────────────────────────────────────────────┐    │
│  │  Learning English grammar for professional   │    │
│  │  development.                                │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Save Changes]                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Avatar area**: `card` container, horizontal layout
  - Avatar: `avatar` component, size="lg" (64px)
  - If no photo: Initials in `--primary` background
  - Name: `h3`, Outfit 600
  - Email: `body-sm`, `--muted-foreground`
  - Change button: `button` variant="outline", size="sm", icon `Camera`
- **Form fields**: `field` + `input` + `label` + `field-error`
  - Display name: `input` type="text", required
  - Email: `input` type="email", disabled (managed by Better Auth)
  - Bio: `textarea`, rows=3, maxLength=200
  - Character counter: `caption`, `--muted-foreground`, right-aligned
- **Save button**: `button` variant="default", size="default", full width on mobile
  - Loading state: `Spinner` icon
  - Success state: `CheckCircle2` icon, brief green flash

---

## Tab 2: Account

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Account                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Change Password                              │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  Current Password                             │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  ••••••••••                               │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │  New Password                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  ••••••••••                               │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │  Confirm Password                             │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  ••••••••••                               │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │  [Update Password]                            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Danger Zone                                  │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  Permanently delete your account and all      │    │
│  │  associated data. This action cannot be undone. │    │
│  │  [Delete Account]                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Password section**: Standard `card` with `space-6` padding
- **Fields**: `input` type="password", with show/hide toggle (optional)
- **Password strength**: `progress` bar below new password field
  - Weak: `--destructive`
  - Medium: `--warning`
  - Strong: `--success`
- **Danger Zone**: `card` with border `--destructive` at 30%
  - Background: `--destructive` at 5%
  - Title: `h4`, Outfit 600, `--destructive`
  - Description: `body-sm`, `--muted-foreground`
  - Button: `button` variant="destructive", size="default", "Delete Account"
  - Opens `alert-dialog` with confirmation: "Type 'DELETE' to confirm"

---

## Tab 3: Preferences

### Structure

```
┌─────────────────────────────────────────────────────┐
│  Preferences                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Sun]  Light Mode                            │    │
│  │  [Moon] Dark Mode   ← active                  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Bell]  Notifications                        │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  [☑]  Daily practice reminder                │    │
│  │  [☐]  New lesson available                     │    │
│  │  [☑]  Weekly progress report                   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  [Globe]  Language                            │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  App Language                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  English ▼                                │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │  Content Difficulty                           │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  ●────●────●────●────●                         │    │
│  │  Basic    Intermediate    Advanced            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Visual Specs

- **Theme toggle**: `card` with two options
  - Light: `Sun` icon, `button` variant="outline"
  - Dark: `Moon` icon, `button` variant="default" (active)
  - Active state: `bg-primary text-primary-foreground`
- **Notifications**: `checkbox` group with `label`
  - Each item: `checkbox` + `label` + `body-sm` description
  - Spacing: `space-4` between items
- **Language select**: `select` component
  - Options: English, Spanish, French, German, etc.
- **Difficulty slider**: `slider` component
  - Range: 1-5 (Basic to Advanced)
  - Labels below: "Basic", "Intermediate", "Advanced"
  - Track: `--muted`, Fill: `--primary`, Thumb: `--primary`

---

## Mobile Adaptations

| Element      | Desktop              | Mobile                        |
| ------------ | -------------------- | ----------------------------- |
| Tabs         | Horizontal row       | Horizontal scroll or dropdown |
| Avatar area  | Horizontal           | Vertical stack                |
| Form fields  | Full width           | Full width                    |
| Danger zone  | Same card            | Full width, more padding      |
| Theme toggle | Side-by-side buttons | Stacked buttons               |

---

## shadcn-svelte Components Used

| Component      | Usage                                 |
| -------------- | ------------------------------------- |
| `card`         | Section containers                    |
| `button`       | Actions, save, delete                 |
| `tabs`         | Navigation between settings sections  |
| `input`        | Form fields                           |
| `textarea`     | Bio field                             |
| `label`        | Form labels                           |
| `checkbox`     | Notification toggles                  |
| `select`       | Language dropdown                     |
| `slider`       | Difficulty selector                   |
| `avatar`       | Profile photo                         |
| `switch`       | Alternative to checkbox for toggles   |
| `separator`    | Section dividers                      |
| `alert-dialog` | Delete account confirmation           |
| `dialog`       | Change photo (if implementing upload) |
| `field`        | Form field groups with errors         |

---

## Custom Components Needed

| Component           | File                                               | Description                      |
| ------------------- | -------------------------------------------------- | -------------------------------- |
| `SettingsTabs`      | `components/app/settings/SettingsTabs.svelte`      | Tab wrapper with content         |
| `ProfileForm`       | `components/app/settings/ProfileForm.svelte`       | Profile tab content              |
| `AccountForm`       | `components/app/settings/AccountForm.svelte`       | Account tab content              |
| `PreferencesForm`   | `components/app/settings/PreferencesForm.svelte`   | Preferences tab content          |
| `PasswordStrength`  | `components/app/settings/PasswordStrength.svelte`  | Password strength indicator      |
| `DangerZone`        | `components/app/settings/DangerZone.svelte`        | Delete account section           |
| `ThemeToggle`       | `components/app/settings/ThemeToggle.svelte`       | Light/dark mode selector         |
| `NotificationPrefs` | `components/app/settings/NotificationPrefs.svelte` | Checkbox group for notifications |

---

_Priority: P3 | Estimated sections: 3 tabs | Responsive: yes_
