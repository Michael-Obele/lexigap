# GitHub Copilot Instructions — LexiGap

## Must-Get-Right

- **Package manager**: Use `bun add` / `bunx`, never `npm` or `pnpm`.
- **Framework**: SvelteKit 5 with runes only — no `export let`, no `$:`, no `on:click`, no `<slot />`, no `createEventDispatcher`.
- **Events**: Use `onclick={handler}`, not `on:click={handler}`.
- **Stores**: Use `$app/state` (e.g. `import { page } from '$app/state'`), not `$app/stores`.
- **Database**: Prisma v6 (NOT v7). Use `bunx prisma db push` for prototyping, `bunx prisma migrate dev` for stable.
- **Auth**: Better Auth.
- **Validation**: Valibot (Standard Schema), not Zod.
- **Icons**: `@lucide/svelte` (NOT `lucide-svelte`). Import as `import { IconName } from '@lucide/svelte'`.
- **Components**: shadcn-svelte + Bits UI. Never write shadcn components manually — always use CLI from MCP docs.
- **Styling**: Tailwind v4, no gradients, solid colors only.
- **NLP pipeline**: `compromise` for POS tagging, Datamuse API for distractors, `textlens` for readability scoring.

## Remote Functions (Mandatory)

- **Only `query` and `form` flavors — no `command` functions.**
- Mutations go through `<form>` with progressive enhancement, never manual `async handleSubmit`.
- Spread the form object: `<form {...createPost}>`.
- Bind fields with `{...form.fields.name.as('text')}`.
- Validation errors via `form.fields.name.issues()`.
- Place remotes in `src/lib/remote/` with `.remote.ts` extension. Barrel-export from `src/lib/remote/index.ts` (individual exports, not `export *`).

## Quality Gate

1. `bun check` after every edit — errors must be fixed, warnings may be ignored.
2. `bunx prettier --write <edited_file>` then `bunx prettier --check <edited_file>`.
3. Use `<svelte:boundary>` for async error/loading states.
