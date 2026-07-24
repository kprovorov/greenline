# @greenline/ui

Shared shadcn/ui component library, built on Tailwind CSS v4 and Radix UI.
Consumed by apps in this monorepo (currently `apps/web`) via workspace
imports — no build step, apps compile the source directly.

## Structure

```
packages/ui
├── components.json        # shadcn config for this package
├── src
│   ├── components/         # shadcn components (Button, Card, ...)
│   ├── hooks/               # shared hooks
│   ├── lib/utils.ts        # `cn` helper (clsx + tailwind-merge)
│   └── styles/globals.css  # design tokens (light/dark) + Tailwind import
```

## Adding a new shadcn component

Run the shadcn CLI from this package's directory so it picks up
`packages/ui/components.json`:

```
cd packages/ui
npx shadcn@latest add <component>
```

This writes the generated file(s) to `src/components/` and wires imports
to `@greenline/ui/lib/utils` automatically. Add any new dependency the
component needs (e.g. another `radix-ui` primitive) to this package's
`package.json`, then run `pnpm install` from the repo root.

Consuming apps import components via subpath exports:

```ts
import { Button } from "@greenline/ui/components/button";
```

## Theme

`src/styles/globals.css` defines the light/dark CSS variable tokens
(`--background`, `--primary`, `--radius`, etc.) and imports Tailwind.
Apps pull it in once via:

```css
@import "@greenline/ui/globals.css";
```

The `@source` directive in that file tells Tailwind to scan this
package's `src` for utility classes — apps consume it through a
symlinked `node_modules` path, which Tailwind's automatic content
detection otherwise skips. If you add new source directories here
(e.g. a new top-level folder alongside `components`/`lib`/`hooks`),
make sure they fall under `src` so the existing `@source "../**/*"`
glob still picks them up.

To toggle dark mode, add the `dark` class to `<html>` (or any
ancestor) — tokens are defined for both `:root` and `.dark`.
