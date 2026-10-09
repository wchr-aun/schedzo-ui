# Instant Access Savings article evidence

Reviewed 10 October 2026 for `/schedule-monzo-savings-pot-withdrawals`.
Scope: Monzo Instant Access Savings Pots, with withdrawals to the associated main
account. Deposit scheduling and the subsequent rent or Direct Debit payment are
separate actions.

Provider documentation establishes product rules. Published source establishes
implementation behaviour at a specific revision. The interactive preview uses
fictional data and demonstrates the interface. None of these independently
establishes a successful withdrawal in the hosted deployment.

## Claim register

This register keeps the implementation references for editorial maintenance.
The article uses the creator's first-person voice and explains Schedzo's behaviour
directly. Creator-success testimonials and source-audit language are omitted from
the article at the owner's request. Readers still get relevant Monzo and IFTTT
links, product restrictions, schedule limits and data-handling information.

| Fact or editorial decision | Evidence | Scope and publication decision |
| --- | --- | --- |
| Monzo offers regular deposits into Instant Access Savings | [Monzo product page](https://monzo.com/savings-isas/instant-access) | Native deposits only; do not infer scheduled withdrawals. |
| The app does not offer scheduled withdrawals or payments from these Pots; manual withdrawals usually arrive instantly | [Monzo product-specific help](https://monzo.com/help/budgeting-overdrafts-savings/instant-access-savings-pots-web) | Use “usually” for arrival. Automation execution is a separate timing question. |
| Added-security Pots cannot be withdrawn from through the API | [Monzo withdrawal API](https://docs.monzo.com/#withdraw-from-a-pot) | Keep the restriction next to automation eligibility guidance. |
| IFTTT offers a Pot withdrawal action taking GBP amounts | [IFTTT action](https://ifttt.com/monzo/actions/pot_withdraw) | The action is generic. £2,273 means `2273`, unlike Schedzo's pence input. |
| IFTTT has time-based Monzo automations | [IFTTT Monzo integration](https://ifttt.com/monzo) | Review the selected Date & Time trigger, time zone and plan requirements. |
| The monthly Date & Time trigger takes a day of the month and time; its listing includes Free polling every hour and Pro/Pro+ every five minutes | [Monthly trigger](https://ifttt.com/date_and_time/triggers/every_month_on_the), [Date & Time service](https://ifttt.com/date_and_time), checked 10 October 2026 | Describe checks rather than guaranteeing execution within that interval. The trigger's Free listing does not independently establish the Monzo action's tier or Instant Access Pot eligibility. |
| The Date & Time service time zone controls execution; the account time zone controls activity-feed display | [IFTTT time zone help](https://help.ifttt.com/hc/en-us/articles/115010326648-How-do-I-update-my-time-zone), checked 10 October 2026 | The walkthrough sets the service time zone for a UK schedule; changing only the account setting is insufficient. The provider handles daylight saving automatically for a zone that observes it. |
| Monzo's current UK savings navigation is Grow → Savings; hidden Pots must be shown before manual withdrawals | [Monzo hidden-Pot help](https://monzo.com/help/budgeting-overdrafts-savings/add-withdraw-hidden-pots), checked 10 October 2026 | The manual walkthrough uses the documented navigation and a generic withdrawal/confirmation step; app labels can vary. Do not apply the generic page's scheduled-payment wording to Instant Access Pots; the product-specific help establishes that restriction. |
| IFTTT Free allows 2 Applets, Pro 20, Pro+ unlimited; paid plans offer monthly or yearly billing | [Plans](https://ifttt.com/plans), [billing FAQ](https://help.ifttt.com/hc/en-us/articles/360052714673-Billing-FAQ) | Account-wide Applets, not run counts. Do not promise that a particular trigger/action is available on Free without checking it. |
| IFTTT offers optional Applet run and failure push alerts in its own app | [IFTTT notification settings](https://help.ifttt.com/hc/en-us/articles/360001219814-Enabling-and-disabling-Applet-run-notifications), checked 10 October 2026 | Requires the IFTTT app, device notification permission and enabled Applet alerts. Do not claim IFTTT has no success or failure notifications; an Applet run alert is not a separate confirmation of funds arriving. |
| Schedzo is free | Project owner's explicit confirmation in the article-planning conversation | Hosted access availability and self-hosting costs are explained separately. No unlimited-schedule claim. |
| Schedzo supports Instant Access Savings withdrawals | Project owner's first-hand confirmation during implementation on 10 October 2026 | Explain the supported feature directly, retaining added-security restrictions. Do not publish a creator-success testimonial. No private account details were requested. |
| Schedzo allows up to 50 active schedules per user | [Schedule service, lines 31 and 133–144](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/schedules.py#L31) | Keep the limit visible in the comparison. The implementation reference belongs in this register. |
| Recurrence supports daily, weekly and monthly UK calendar schedules; short months clamp to their last valid day | [Calendar implementation](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/domain/recurrence.py) | Later months return to the originally requested day. No exact execution-time guarantee, including clock changes. |
| Cancellation deactivates the setup and cancels pending occurrences | [Cancellation service](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/schedules.py#L221) | Does not reverse completed withdrawals. |
| Failed occurrences are recorded; recurrence continues while the setup is active | [Execution/finalisation service](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/transfer_execution.py#L209) | Creating the next future occurrence is not retrying the failed occurrence. Check status and balance before a manual transfer. |
| Schedzo sends transfer success and failure notifications to Monzo | [Result notification service](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/notifications.py), [execution calls](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/transfer_execution.py#L124), project owner confirmation | Notification delivery is best effort and depends on Monzo access and availability. Failure alerts cannot be sent without a usable Monzo access token. Compare the Monzo delivery channel with IFTTT's optional alerts, rather than promising every failure will generate a notification. |
| Monzo tokens are encrypted; disconnect stops future work, allows in-flight work to finish and erases tokens after confirmed revocation; schedules/history remain retained | [Backend documentation, disconnection and storage](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/README.md#L134), [disconnection service](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/disconnection.py), [token encryption](https://github.com/wchr-aun/schedzo/blob/358196614619d197c9c3ab60f75e9bba471d9661/app/services/token_crypto.py) | Source audit, not an independent audit of hosted storage or operations. Disconnect is not data deletion. |
| Frontend session credentials stay in HttpOnly cookies | [Session implementation](../lib/auth/session.server.ts) | Server-managed app-session credentials; no JWT exposed by the article preview. |
| The example uses the console's real form and result components, without backend requests | [Preview wrapper](../components/landing/article-transfer-preview/article-transfer-preview.tsx), [behaviour tests](../components/landing/article-transfer-preview/article-transfer-preview.test.tsx) | Isolated demo client/cache; creation, cancellation, cache isolation and reset covered. Article-only initial values expand a monthly £2,273 withdrawal. The empty history hides its status filter, while custom filters remain available even when their results are empty. Console defaults remain collapsed, deposit and blank amount. Simulated transfers do not execute. |
| The article preview keeps the console's layout and typography | [Preview styles](../components/landing/article-transfer-preview/article-transfer-preview.module.css), [shared form styles](../components/scheduled-transfers/create-scheduled-transfer/create-scheduled-transfer.module.css) | Wrapper restores the console's normal line height and 32px section gap. The shared form responds to available container width so its date field cannot overlap another control in a narrow embed. The existing viewport breakpoint remains in place for the console. |
| The calculator keeps its design, formula and disclaimer; its default savings period follows the rent example | [Existing calculator](../components/landing/savings-interest-calculator/savings-interest-calculator.tsx), [landing example](../components/landing/landing-page/landing-page.tsx) | At the owner's request, payday is 28 September and the savings period is 16 days, ending with a withdrawal on 14 October; rent is due on 15 October. The article and landing share that period. Defaults are £2,273, 2.75% AER and 16 days, giving about £2.70 per monthly payment and £32.46 for 12 repeats. Calculator styling, formula and disclaimer are unchanged. Its static transfer illustration uses 14 October at 09:00 UK and “Rent savings”. The rate and one-day buffer are illustrative; do not claim the 28th is universally the most common payday. |
| Article metadata, authorship and the static rent fixture share editorial constants | [Article data](../lib/content/instant-access-article.ts), [route metadata and JSON-LD](../app/schedule-monzo-savings-pot-withdrawals/page.tsx) | Canonical URL and visible modification date are retained. Article schema describes the visible content; no unknown publication timestamp or FAQ rich-result claim is invented. |
| The article has a 1200 × 630 sharing image and a large Twitter card | [Image generator](../scripts/generate-article-social-image.mjs), [Next.js image-file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [Google Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article) | PNG and alt text are page content assets, not PR screenshot evidence. Regenerate with `pnpm exec node scripts/generate-article-social-image.mjs`; its colors resolve the canonical semantic light-theme tokens in `app/globals.css`. No new dependency or rendering service is required. |

Backend revision reviewed: `358196614619d197c9c3ab60f75e9bba471d9661` in
[`wchr-aun/schedzo`](https://github.com/wchr-aun/schedzo/tree/358196614619d197c9c3ab60f75e9bba471d9661).

## Remaining evidence

- Successful Schedzo Instant Access withdrawals are confirmed by the creator's
  first-hand report. Specific account settings and execution records were not
  independently inspected during implementation.
- Current IFTTT Pot eligibility, the Monzo action's availability on a chosen plan,
  and actual execution timing need configuration-specific confirmation. The
  monthly trigger and its Free-plan polling are now confirmed by provider pages.
- Published backend source has been reviewed; the hosted revision, deployment
  configuration and operational data handling have not been independently audited.

The article keeps the how-to title and explains supported behaviour in the
creator's own voice. Compatibility wording retains the Pot restrictions.
Unresolved points are not presented as missing features. Do not replace these
qualifications with universal guarantees.
No live-money tests were run as part of this update.

## Maintenance and review

Recheck Monzo's product rules and IFTTT's plans when updating the article. Update
the visible review date only after reviewing the content. If the backend changes,
review the affected behaviour and update the pinned source revision and claims.
Keep the preview on the shared console components and the existing calculator.

Capture rendered before-and-after evidence with fictional data, matching desktop
and mobile viewports and themes. Keep screenshots outside the checkout; attach
them directly if a UI pull request is later published. A screenshot proves the
rendered state, not a successful live bank withdrawal.
