# LexiGap

**Algorithmic Grammar Assessment — Master Grammar, One Gap at a Time.**

LexiGap generates personalized cloze-test quizzes using deterministic NLP algorithms — no expensive LLMs needed. Take a 20-question assessment, get a detailed grammar profile, and follow a custom learning path tailored to your weak spots.

Built with [SvelteKit 5](https://svelte.dev/), [shadcn-svelte](https://shadcn-svelte.com/), [Better Auth](https://better-auth.com/), and [Prisma](https://www.prisma.io/).

## Developing

```sh
bun dev
```

## Building

```sh
bun run build
```

## Powered By

LexiGap stands on the shoulders of these incredible open-source tools and APIs:

| Resource                                               | Purpose                                                                                                                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Datamuse API](https://api.datamuse.com/)**          | Word-finding API powering synonym, antonym, association, homophone, and distractor generation, plus pronunciation, syllable count, and word frequency metadata. |
| **[compromise](https://compromise.cool/)**             | Lightweight NLP library for POS tagging and sentence parsing — runs entirely in the browser with zero dependencies.                                             |
| **[textlens](https://github.com/nicklasxyz/textlens)** | Readability scoring and text analysis for calibrated difficulty levels.                                                                                         |
| **[Lucide](https://lucide.dev/)**                      | Beautiful, consistent icons used throughout the UI.                                                                                                             |
| **[shadcn-svelte](https://shadcn-svelte.com/)**        | Component library built on [Bits UI](https://bits-ui.com/) — the UI foundation.                                                                                 |
| **[Better Auth](https://better-auth.com/)**            | Authentication and session management.                                                                                                                          |

## Project Setup

This project was scaffolded with:

```sh
bun x sv@0.16.1 create --template minimal --types ts --add prettier tailwindcss="plugins:typography,forms" experimental="versions:kit+features:async,remoteFunctions,explicitEnvironmentVariables,handleRenderingErrors" sveltekit-adapter="adapter:netlify" --install bun lexigap
```
