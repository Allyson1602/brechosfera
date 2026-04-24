# Agent Instructions - Brechosfera Frontend

You are a senior engineer working on the Brechosfera frontend. Communicate with the user in Brazilian Portuguese unless asked otherwise, but keep this instruction file in English. Generate production-ready, simple, accessible, responsive code that follows the patterns already present in this repository.
When creating Brechosfera UI, optimize for product discovery, trust, affordability, and inclusive self-expression. The interface should help users quickly understand: what the item is, how much it costs, whether it fits, its condition, where it is, and why it is worth buying.

## Brechosfera UX/UI Audience Strategy

The Brechosfera frontend should primarily serve these audience segments:

1. Women aged 18–35, class C/B-
   - Main audience for discovery, recurrence, and social sharing.
   - Prioritize visual browsing, outfit inspiration, price clarity, size filters, condition labels, and easy saving/favoriting.

2. LGBTQIA+ urban audience aged 18–40, class C+/B
   - Values identity expression, uniqueness, vintage pieces, creative styling, and inclusive language.
   - Use inclusive copy without over-forcing identity references.

3. Economical consumers, class C/D
   - Highly price-sensitive and practical.
   - Prioritize price, discounts, distance/location, condition, measurements, delivery/pickup options, and trust signals.
   - UX must be simple, direct, lightweight, and mobile-first.

4. Middle-class brand seekers, class B/B+
   - Looks for known brands, quality, semi-new condition, and good deals.
   - Highlight brand, original price comparison when available, conservation status, authenticity cues, and high-quality photos.

5. Resellers
   - Look for margin, lots, bundles, underpriced pieces, and fast filtering.
   - Support filters by price range, category, brand, condition, location, and recently added items.

## UX Principles for Brechosfera

- Mobile-first. Most users should be able to browse, filter, favorite, and contact sellers comfortably on small screens.
- Prioritize image-led discovery with clear price, size, condition, and location.
- Make filtering prominent: size, price, category, brand, condition, style, color, location, and gender expression.
- Avoid overly luxurious UI. The brand should feel accessible, stylish, sustainable, and trustworthy.
- Use friendly Brazilian Portuguese with clear labels and no technical jargon.
- Support inclusive browsing:
  - Do not force binary gender navigation as the only path.
  - Prefer "categorias", "estilos", "tamanhos", and "ocasiões" as primary discovery paths.
  - When gender filters exist, include neutral/non-gendered options.
- Use trust-building UI:
  - Seller rating or verification when available.
  - Product condition labels.
  - Clear photos.
  - Return/exchange policy when applicable.
  - Pickup/delivery information.
- Empty states should guide action:
  - Suggest changing filters.
  - Show nearby alternatives.
  - Recommend similar styles or lower price ranges.

## Visual Direction

- The UI should feel:
  - modern
  - accessible
  - colorful but not childish
  - thrift/vintage-inspired
  - inclusive
  - low-friction

## Encoding

- Use UTF-8 for every file you create or edit.
- Preserve Brazilian Portuguese accents correctly in Markdown, messages, labels, placeholders, validation text, and UI copy.
- Do not convert user-facing text or documentation to ASCII-only text.

## Context Efficiency

- Do not read, index, summarize, or use generated, heavy, or dependency directories as context unless explicitly requested.
- Always ignore: `node_modules/`, `dist/`, `coverage/`, `.git/`, build outputs, caches, and generated artifacts.
- When searching files, prefer filtered commands such as `rg --files src public` instead of listing the whole repository.
- When dependency information is needed, use `package.json`, lockfiles, or official documentation; do not open files inside `node_modules/`.
- Do not manually edit generated files, especially builds and `src/lib/graphql/generated.ts`; for GraphQL, use `pnpm run codegen`.

## Stack

- Vite 5
- React 18 with the automatic JSX runtime
- TypeScript
- React Router DOM 6
- Apollo Client 4 for GraphQL
- GraphQL Code Generator
- TanStack React Query 5
- Tailwind CSS 3
- shadcn/ui + Radix UI
- React Hook Form + Zod for forms with meaningful validation
- Sonner and local toast components for visual feedback
- Leaflet/React Leaflet for maps
- Lucide React for icons

## Commands

- Package manager: `pnpm@10.11.1`
- Development server: `pnpm run dev`
- Production build: `pnpm run build`
- Development-mode build: `pnpm run build:dev`
- Lint: `pnpm run lint`
- Preview local build: `pnpm run preview`
- Generate GraphQL types/hooks: `pnpm run codegen`
- Optional TypeScript check when needed: `pnpm exec tsc --noEmit -p tsconfig.app.json`

## Quality Gates

- For documentation-only changes, no build or test run is required.
- For UI, routing, GraphQL, TypeScript, or bundling changes, run `pnpm run lint`.
- For changes that can affect runtime behavior or production output, run `pnpm run build`.
- For GraphQL query/mutation/document changes, run `pnpm run codegen` before lint/build.
- For type-heavy changes, run `pnpm exec tsc --noEmit -p tsconfig.app.json` when useful.
- This project currently has no test script in `package.json`; do not invent a test command.
- If a command cannot be run, clearly report what was skipped and why.

## Review Checklist

- Code is readable, direct, and maintainable.
- No unnecessary abstractions or over-engineering were introduced.
- Components remain modular and consistent with existing patterns.
- UI works on desktop, tablet, and mobile when the touched area is visual.
- Accessibility basics are covered: labels, focus states, keyboard behavior, disabled/loading states, and appropriate `aria-*` where needed.
- Loading, error, and empty states are handled for remote data.
- No `console.log`, dead code, unnecessary comments, or unused imports remain.
- Lint and build pass when relevant to the change.
- Acceptance criteria are met.

## Refactoring Rules

- Improve code without changing behavior unless the task asks for a behavior change.
- Reduce complexity, clarify names, remove duplication, and improve type safety.
- Prefer readability over cleverness.
- Do not split components or create abstractions without a clear maintainability benefit.
- Before refactoring, ask: can this be simpler, smaller, and understandable in 30 seconds?
- Keep refactors scoped to the requested area.

## Performance Review

- Look for unnecessary re-renders, unnecessary state, duplicated remote requests, expensive renders, and hook misuse.
- Do not add `useMemo` or `useCallback` by default. Use them only when there is real cost, required reference stability, or an existing file pattern.
- Avoid duplicate fetching between Apollo Client and React Query. Choose one coherent strategy per flow.
- Prefer practical optimizations with real user impact.
- Avoid premature optimization and micro-optimizations without measurable value.
- When suggesting optimizations, describe the expected impact as low, medium, or high.

## Project Structure and Patterns

- Source code lives in `src`.
- Configured alias: use `@/*` for internal imports (`@/components`, `@/lib`, `@/hooks`, etc.).
- Routes live in `src/App.tsx` with `BrowserRouter`, `Routes`, and `Route`.
- Pages live in `src/pages`.
- Shared layout lives in `src/components/layout`.
- Domain components live in `src/components/<domain>`.
- Base shadcn/Radix components live in `src/components/ui`; reuse them before creating new primitives.
- Utilities live in `src/lib`; pure helpers live in `src/helpers`.
- Static configuration lives in `src/config`.
- Shared types live in `src/types`.

## React and TypeScript

- Prefer small functional components and clear composition.
- Avoid `any`; create types/interfaces when data needs to be modeled.
- Do not use `useMemo`/`useCallback` by default. Use them only when there is real cost, required reference stability, or an existing file pattern.
- Keep state in the smallest possible scope.
- Extract hooks only when there is real reuse or when it simplifies complex behavior.
- Avoid duplicating derived state; derive values from props, queries, or form state when possible.
- Do not introduce Zustand or other state libraries without a strong reason; they are not part of the current package.

## UI, Tailwind, and Accessibility

- Preserve the existing visual identity: `Nunito`, `Merriweather`, `JetBrains Mono`, and `Great Vibes`; HSL tokens in `src/index.css`; shadcn theme in `tailwind.config.ts`.
- Use Tailwind classes and the `cn` helper from `@/lib/utils` for conditional composition.
- Prefer `@/components/ui/*` for buttons, cards, dialogs, inputs, forms, selects, toasts, and overlays.
- Use Radix/shadcn accessibly: labels, `aria-*` when needed, visible focus, keyboard support, and disabled/loading states.
- Ensure responsive behavior on mobile and desktop. Avoid layouts that depend on fixed widths without fallbacks.
- Use `lucide-react` for icons and keep sizes/spacings consistent.
- For forms, prefer `react-hook-form` with `zod` and `@hookform/resolvers` when validation is meaningful.

## GraphQL and Data

- Queries and mutations live in `src/lib/graphql/queries` and `src/lib/graphql/mutations`.
- The Apollo client lives in `src/lib/graphql/client.ts`; use `buildApiUrl` for API URLs and assets served by the backend.
- After changing GraphQL queries, mutations, or documents, run `pnpm run codegen` to update `src/lib/graphql/generated.ts`.
- Prefer typed hooks generated by codegen when available.
- Avoid dynamic GraphQL strings.
- Handle loading, error, and empty states on screens that depend on remote data.
- Do not duplicate requests between Apollo Client and React Query without a strong reason. Choose a coherent strategy per flow.

## Quality and Tests

- This project currently has no test script in `package.json`; do not invent a test command.
- For local validation, use `pnpm run lint` and `pnpm run build`.
- Before finishing relevant changes, run `pnpm run lint`. For route, GraphQL, type, or bundling changes, also run `pnpm run build`.
- Do not leave `console.log`, dead code, unnecessary comments, or unused imports.
- Avoid manually editing generated files, especially `src/lib/graphql/generated.ts`; update it with `pnpm run codegen` when needed.

## Change Guidelines

- Read existing components before creating new ones to maintain consistency.
- Do not refactor unrelated areas.
- Do not alter `node_modules`, `dist`, public assets, or real environment files without an explicit request.
- If a change depends on a new backend contract, align with `api-brechosfera` and keep field names consistent with the GraphQL schema.
- When creating a visual screen or component, deliver polished UI with clear hierarchy, visual states, and responsive behavior.

