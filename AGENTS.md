# Repository Guidelines

## Project overview

This is a Next.js App Router frontend for authenticating with Monzo, browsing
accounts and pots, and managing scheduled pot transfers.

- `/` introduces the project with a pot preview, story, features, and open-source links,
  and a link to the console. The preview uses static example data.
- `/console` displays a login link when signed out. When signed in, it shows the user
  ID, accounts, balances, and a logout action.
- `/console/account/[accountId]` displays an account balance and its pots.
- `/console/account/[accountId]/pot/[potId]` displays a pot balance and supports listing,
  filtering, paginating, creating, and cancelling scheduled transfers.
- `/callback` validates OAuth `code` and `state` parameters and calls the
  same-origin callback API.
- Route Handlers under `/api` validate requests and backend responses, then make
  authenticated server-to-server requests using the JWT from the session cookie.

## Package manager

Use pnpm exclusively. Do not create or commit `package-lock.json` or `yarn.lock`.

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

The pnpm version is pinned in `package.json` through the `packageManager` field.

## Environment variables

Required variables are documented in `.env.example`:

- `BASE_URL`: server-only origin of the authentication backend.
- `BFF_API_KEY`: required server-only shared secret sent as `X-BFF-API-Key`.
- `SESSION_COOKIE_NAME`: name of the frontend session cookie.

Never hardcode deployment URLs, JWTs, OAuth credentials, or other secrets in source files. Never commit `.env`, `.env.local`, private keys, package-manager authentication files, or Vercel metadata.

Do not rename `BASE_URL` to a `NEXT_PUBLIC_*` variable. Backend configuration must remain server-only.

## Authentication rules

- Browser code must call same-origin Next.js Route Handlers, not the backend IP directly.
- The login link must use `/api/auth/login` so the server can attach `X-BFF-API-Key`.
- All backend requests must use the shared server-only backend fetch helpers; never expose the service key to browser JavaScript.
- The backend callback response is expected to contain `{ "token": "<jwt>", "expiresIn": <seconds> }`. `expiresIn` is optional.
- JWTs must never be returned to client-side JavaScript, placed in URLs, logged, or stored in local storage.
- Session cookies must remain `HttpOnly`, `Secure` in production, `SameSite=Lax`, and scoped to `/`.
- Validate all backend responses before setting cookies.
- Authenticated backend requests must go through narrow, endpoint-specific Route
  Handlers. Read the JWT from the cookie server-side and forward it as
  `Authorization: Bearer <jwt>`.
- Do not add a generic user-controlled proxy endpoint.

## Code conventions

- Keep the interface intentionally small and dependency-light.
- Use strict TypeScript and validate untrusted JSON at runtime.
- Keep server-only environment access in Server Components or Route Handlers.
- Keep browser APIs and React hooks in Client Components marked with `"use client"`.
- Use the shared SWR cache for authenticated client-side reads so identical requests
  are deduplicated across navigation. Do not persist authenticated data in browser storage.
- Preserve accessible status messaging and reduced-motion behavior.

## Colour system

The canonical brand palette is:

| Token | Colour | Hex | Intended use |
| --- | --- | --- | --- |
| `deep-navy` | Deep Navy | `#082B63` | Primary brand, headings, navigation, key UI |
| `ocean-blue` | Ocean Blue | `#0B6A95` | Interactive elements and informational highlights |
| `mint` | Mint | `#8FDACB` | Success, accents, illustrations, and highlights |
| `coral` | Coral | `#FF5B71` | Alerts and destructive or exceptional emphasis |
| `sunset-orange` | Sunset Orange | `#F9A64B` | Warnings, badges, and highlights |
| `warm-sand` | Warm Sand | `#FFF4EE` | Page backgrounds and warm foreground text |
| `slate-text` | Slate Text | `#24324A` | Body text, labels, and icons |
| `soft-border` | Soft Border | `#E7ECF2` | Borders, dividers, and input fields |

Use the brand primitives and semantic `--color-*` custom properties in
`app/globals.css`; do not hardcode brand colors in component styles. Components
should consume semantic tokens so light and dark themes can choose accessible
variants.

| Semantic role | Light mode | Dark mode |
| --- | --- | --- |
| Page background | Warm Sand `#FFF4EE` | Derived navy `#051C40` |
| Navigation | Deep Navy `#082B63` | Derived navy `#04152F` |
| Card, form, and input surface | White `#FFFFFF` | Deep Navy `#082B63` |
| Heading | Deep Navy `#082B63` | Warm Sand `#FFF4EE` |
| Body text | Slate Text `#24324A` | Warm Sand `#FFF4EE` |
| Muted text | Derived slate `#55627A` | Derived slate `#CBD5E1` |
| Primary/completed/success | Derived Mint `#246E62` | Mint `#8FDACB` |
| Secondary/pending/info | Derived Ocean `#0B5B80` | Derived Ocean `#A7DFF2` |
| Danger/error | Derived Coral `#C7354D` | Derived Coral `#FF9AAA` |
| Cancelled/warning | Derived Orange `#76500B` | Sunset Orange `#F9A64B` |
| General border | Soft Border `#E7ECF2` | Derived blue `#557AA2` |
| Focus indicator | Ocean Blue `#0B6A95` | Mint `#8FDACB` |

- Primary actions must use the same family as completed/success states.
- Secondary actions and general interactive controls must use the same family as
  pending/info states.
- Coral is not the primary action color; reserve it for danger/error emphasis.
- Pair light Mint, Coral, and Sunset Orange fills with Deep Navy text. Do not use
  white text on Coral for normal-size text because it does not meet AA contrast.
- Keep both explicit dark-theme declarations in `app/globals.css` synchronized:
  `:root[data-theme="dark"]` and the system-preference fallback.

## Application architecture

- Keep `app/` focused on Next.js entry points: pages, layouts, Route Handlers,
  global CSS, and other framework file conventions. Route pages should primarily
  compose imported components.
- Put React UI under `components/`, grouped by responsibility or domain:
  - `components/ui/` for domain-independent controls and presentation primitives.
  - `components/layout/` for shared page structure.
  - `components/providers/` for client context providers.
  - `components/landing/` for the project landing page and its previews.
  - `components/ui/icons/` for shared SVG icons.
  - Domain folders such as `components/accounts/`, `components/pots/`,
    `components/auth/`, and `components/scheduled-transfers/` for feature-specific UI.
- Put non-React application logic under `lib/`, grouped by domain. Types,
  runtime validation, request clients, SWR keys, formatting, and date handling
  belong here rather than in component or route files.
- Use the `@/*` path alias for imports that cross directory or domain boundaries.
  Relative imports are appropriate for files colocated in the same component folder.
- Keep server-only logic in explicitly named `*.server.ts` modules and import
  `server-only` when it prevents accidental client use.
- Keep `app/globals.css` limited to design tokens, resets, and document-wide
  rules. Put component and feature styling in colocated `*.module.css` files.
- Colocate behavior-focused tests with the component or library module they test.
- Reuse existing components and domain helpers before introducing new ones.
  Extract shared code when it removes meaningful duplication.
- Add new folders and abstractions only when they contain meaningful code; do not
  create architectural placeholders for hypothetical features.

### Component file layout

- Keep a single-file component directly in its domain folder, or in
  `components/ui/icons/` for an icon.
- When a component has more than one related file (for example, an implementation
  plus a CSS module or test), place those files in a kebab-case subfolder named
  after the component. Adding a second file to an existing standalone component
  should include moving its implementation into that subfolder.
- Preserve explicit filenames inside the folder: `pot-details.tsx`,
  `pot-details.module.css`, and `pot-details.test.tsx`. Add styles and tests only
  when needed; a folder does not require all three files.
- Import the implementation directly, for example
  `@/components/pots/pot-details/pot-details`. Do not add `index.ts` barrel files
  just to shorten imports. Use relative imports for files in the same component
  folder, such as `./pot-details.module.css` or `./pot-details` in a test.
- Keep pot UI in `components/pots/`, account UI in `components/accounts/`, and
  shared controls in `components/ui/`. Keep `lib/` grouped by domain without
  applying the component folder pattern to every helper.
- When moving or deleting files, update imports, test mocks, and paths in Markdown
  documentation. Remove abandoned files and unused CSS from the old location.

## Verification

After meaningful changes, run:

```bash
pnpm test
pnpm typecheck
pnpm build
```

Keep tests lean and behavior-focused. Prioritize important happy paths, empty
responses, and graceful handling of backend failures. Do not test incidental DOM
hierarchy, styling details, or framework behavior.

For authentication changes, also test:

- Missing `code` or `state` returns an error without calling the backend.
- Backend failures do not set a session cookie.
- Successful callbacks set the cookie without exposing the JWT in the response body.
- The console page recognizes the configured session cookie.

## Visual evidence for UI/UX changes

- Every pull request that changes UI or UX must include screenshots or a video
  showing the resulting changes in its description.
- For updates to existing UI, include a clearly labelled before-and-after
  comparison using the PR base and updated branch, with matching viewport sizes,
  themes, and representative data.
- Include desktop and mobile views when responsive layout is affected. Use video
  when an interaction or animation is better explained through motion.
- Capture rendered UI and attach the evidence to GitHub so reviewers can view it
  directly in the PR. Keep screenshots and recordings out of application assets.
- Use example data and keep private account information, credentials, and secrets
  out of visual evidence.

### T3 screenshots when the laptop lid is closed

Use the T3 collaborative browser's page snapshots instead of an OS desktop
screenshot. This workflow succeeded during a closed-laptop session while T3
automation remained available. A closed lid or an initial snapshot failure alone
does not establish that browser capture is unavailable.

1. Call `preview_status` first. If no automation-capable preview is attached,
   call `preview_open` with the local application URL before declaring it
   unavailable. Read the returned `tabId`; do not reuse a tab ID from an earlier
   session.
2. Open the preview pane with `preview_open({tabId, open: true})`, including when
   the tab is automation-capable but reports `visible: false`. Keep this tab open
   during capture. Pass the same `tabId` to subsequent browser calls.
3. Use `preview_resize` with an explicit freeform viewport, then
   `preview_navigate` to the required route. Set matching themes, example data,
   and interaction states for each before-and-after pair. Read `innerWidth`,
   `innerHeight`, and `devicePixelRatio` through `preview_evaluate` to record the
   actual viewport.
4. Let hydration and reveal animations finish. On the landing page, scroll to
   the bottom first to trigger the existing reveal behavior, then return to the
   target section. Select the completed payment-flow stage through its replay
   control when capturing that state. Wait about one second after the final
   scroll or interaction, and inspect the relevant element positions. Do not
   remove animations, force hidden elements visible, or alter source code just
   to obtain a screenshot.
5. Call `preview_snapshot({tabId, includeImage: false, save: true})`. This saves
   the rendered PNG and returns `screenshotPath` without sending image data in
   the tool output. Read the actual returned path rather than inventing one.
6. Inspect the saved file with `view_image`. Confirm the intended content is
   visible and the image is not blank, cropped, or captured mid-animation.
   Check image dimensions as well as the reported browser viewport.

In this session, snapshots initially returned `PreviewAutomationExecutionError`
even though navigation and DOM inspection worked. Capture later recovered after
retrying; opening the preview pane also recovered the requested image height
after a saved image was cropped. For this failure pattern, check status, reopen
the same tab with `open: true`, reapply the viewport, navigate, allow rendering
to settle, and retry the saved snapshot. Inspect the resulting file before
calling recovery successful. Do not assume a lid, permissions, or display issue
without evidence, or switch browser systems just because the first call fails.

PNG dimensions may be larger than the viewport because screenshots use physical
pixels. For example, a 390 × 1800 CSS-pixel viewport produced a 780 × 3600 PNG.
Compare the width and height scale factors and ensure before-and-after images
use matching dimensions; do not reject a valid image solely for having twice
the CSS-pixel dimensions. See
[MDN's devicePixelRatio reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).

### Capturing the PR base without changing the working branch

- Read the PR's base SHA, for example with
  `gh api repos/<owner>/<repo>/pulls/<number> --jq '.base.sha'`, and create an
  isolated temporary worktree at that SHA. Record it with the evidence.
- Run the base application on a separate port, such as 3001, and keep the updated
  application on its existing port. Capture both through the same T3 tab with
  matching viewport, theme, section position, and representative data.
- A symlinked `node_modules` caused `pnpm dev` inside the temporary worktree to
  fail with `workspace hoist directory is not a real directory`. The successful
  workaround was to link the primary workspace's existing dependencies into
  the base worktree, then run the following **from the primary workspace**:

  ```bash
  pnpm exec next dev /absolute/path/to/base-worktree --webpack --port 3001
  ```

  Provide any required local environment securely. Never print or commit copied
  environment files. Stop the temporary server and remove the agent-owned
  worktree when capture is complete; preserve preexisting checkouts and servers.
- For long sections, this session used desktop 1280 × 1600 and mobile 390 × 1800
  captures to include the flow and its context. Label extended capture heights
  explicitly, and separately check scrolling at a normal phone viewport, such
  as 390 × 844.
- Keep clearly named evidence outside application assets. This PR used
  `.github/pr-evidence/<number>/base-<section>-<device>.png` and
  `updated-<section>-<device>.png`, with a README recording capture conditions.
  When publishing is authorized, embed the GitHub-hosted images in the PR body
  using URLs pinned to the pushed commit SHA. Refresh the image URLs when later
  commits replace screenshots, and verify the files are accessible on GitHub.
  Capturing evidence does not itself authorize a commit or push.

## Scope and safety

- Preserve unrelated user changes.
- Do not commit generated build directories such as `.next` or `out`.
- Do not deploy, push, or modify external services unless explicitly requested.
