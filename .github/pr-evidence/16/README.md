# PR 16 visual evidence

Rendered with the T3 collaborative browser using sample accounts and transfers.

- `base-*` captures use PR base `09f07ced12bcfd7cd2111f67cb49c0bfd5997f5d`.
- `updated-*` captures show the shared payment-flow example and landing-page updates.
- Both versions use the light theme, a completed three-stage flow, and matching viewports: desktop 1280 × 1600 and mobile 390 × 1800.
- The extended screenshot heights show the long flow with its context. Responsive checks also cover widths 320, 390, 768, 1024, and 1280; the mobile scrolling check uses 390 × 844.
- Each pair starts at the same section: hero, motivation, solution, or the article's “How Schedzo works” section.
- Reveal animations were allowed to finish before capture. Transfer timestamps reflect the capture time; amounts and example accounts match.

These files are review evidence, not application assets.

## Motivation layout

- Updated motivation captures show the full-width heading, the experience and
  declined-payment preview together on the left, and the workaround and
  motivation on the right. The guide link follows both columns.
- The story stacks at 960px and below. Reading order remains context, declined payment,
  workaround, motivation, and guide link.
- Captures retain the light theme, matching PR-base image dimensions, and
  desktop 1280 × 1600 / mobile 390 × 1800 viewports. The subsequent payment
  example is set to its completed stage.
- Checks cover widths 320, 390, 768, 960, 961, 1024, 1280, and 1440 in both
  themes with no horizontal overflow. The desktop story columns finish about
  9px apart at both 1280px and 1024px.

## Notification caption update

- `base-landing-notification-*` captures use the same PR base SHA listed above;
  `updated-landing-notification-*` captures show the notification and caption
  opening as one figure with one popup animation.
- Both versions use the light theme and the same £50 sample deposit. Opened
  previews start at 200 CSS pixels from the top on desktop and 400 on mobile.
- Viewports remain desktop 1280 × 1600 and mobile 390 × 1800. Saved PNGs are
  respectively 1280 × 1600 and 780 × 3600, with matching dimensions within each
  before-and-after pair. The browser reported `devicePixelRatio: 2` for both.
- `updated-landing-notification-closed-*` captures show the replay state with
  the caption absent. Opening, closing, Escape, replay, and focus return were
  checked. The popup applies to the figure containing both the card and caption
  and remains disabled under reduced motion.
- Narrow-phone rendering was also checked at 320 × 844 in the dark theme, with
  no horizontal overflow. T3 recording failed, so these screenshots show the
  settled open and closed states.

## Rent explanation scroll reveal

- The landing-page title, numbered explanation, and sample-data note reveal
  together through the existing `ScrollReveal` component. The article's
  `animated={false}` example keeps its static copy and payment flow.
- The additional `updated-rent-explanation-*-desktop.png` captures show this
  branch before entry and after scrolling 300px, at 1280 × 900 in the light
  theme with sample data. These are interaction states on the updated branch;
  the PR-base comparisons above remain the before-and-after design evidence.
- T3 recording failed again, so screenshots show the starting and settled
  states. Browser inspection verified opacity 0 before entry, approximately
  0.49 during the rise animation, and 1 after it settled. Desktop 1280 × 900
  and mobile 390 × 844 were checked with no horizontal overflow. The article
  remains visible without reveal state attributes.
- `pnpm test` passed all 263 tests in 44 files; `pnpm typecheck`, `pnpm build`,
  and `git diff --check` also passed after the component change.
