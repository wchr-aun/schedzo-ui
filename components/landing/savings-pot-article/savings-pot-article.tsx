import Image from "next/image";
import { Footer } from "@/components/layout/footer/footer";
import { ExternalLink } from "@/components/ui/external-link/external-link";
import { CopyableContent } from "@/components/ui/copyable-content/copyable-content";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { ArrowIcon } from "@/components/ui/icons/arrow-icon";
import { EmailIcon } from "@/components/ui/icons/email-icon";
import { ArticleTransferPreview } from "@/components/landing/article-transfer-preview/article-transfer-preview";
import { PaymentFlowExample } from "@/components/landing/payment-flow-example/payment-flow-example";
import { SavingsInterestCalculator } from "@/components/landing/savings-interest-calculator/savings-interest-calculator";
import { WithdrawalComparisonTable } from "@/components/landing/withdrawal-comparison-table/withdrawal-comparison-table";
import { instantAccessArticle, rentExample, rentExampleTransfer } from "@/lib/content/instant-access-article";
import styles from "./savings-pot-article.module.css";

const monzoSavings = "https://monzo.com/savings-isas/instant-access";
const monzoHelp = "https://monzo.com/help/budgeting-overdrafts-savings/instant-access-savings-pots-web";

const contents = [
  ["why-heading", "Instant Access features"],
  ["manual-heading", "Compare your options"],
  ["ifttt-heading", "The IFTTT option"],
  ["schedzo-heading", "The Schedzo walkthrough"],
  ["rent-heading", "Rent and interest example"],
  ["flow-heading", "From savings to payment"],
  ["safety-heading", "Permissions & your data"],
  ["faq-heading", "Common questions"],
  ["sources-heading", "Useful links & about me"],
  ["join", "Join Schedzo"],
] as const;

export function SavingsPotArticle() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Main navigation">
          <a className={styles.brand} href="/" aria-label="Schedzo home">
            <Image className={styles.lightLogo} src="/logo.png" alt="" width={48} height={48} priority />
            <Image className={styles.darkLogo} src="/logo-dark-mode.png" alt="" width={48} height={48} priority />
            <span>Schedzo<span className={styles.caption}>On schedule.</span></span>
          </a>
          <div className={styles.navActions}>
            <ExternalLink href="/demo" aria-label="Try the demo (opens in a new tab)">Try the demo</ExternalLink>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <article aria-labelledby="article-heading">
          <header className={styles.hero}>
            <a className={styles.backLink} href="/"><ArrowIcon direction="left" /> Back to Schedzo</a>
            <p className={styles.eyebrow}>Instant Access Savings · A practical guide</p>
            <h1 id="article-heading">How to schedule withdrawals from <span>Monzo Instant Access Savings Pots</span></h1>
            <p className={styles.lead}>
              I built Schedzo to keep my rent money in savings without remembering the withdrawal every month. Here&apos;s how to set that up, and how it compares with manual withdrawals and IFTTT.
            </p>
            <p className={styles.byline}>
              By <ExternalLink href={instantAccessArticle.author.url}>{instantAccessArticle.author.name}</ExternalLink>
              <span aria-hidden="true"> · </span>
              Updated <time dateTime={instantAccessArticle.modifiedDate}>10 October 2026</time>
            </p>
          </header>

          <div className={styles.articleLayout}>
            <aside className={styles.answer} aria-label="The short answer">
              <p className={styles.eyebrow}>The short answer</p>
              <p><strong>Monzo&apos;s app supports scheduled deposits, but not scheduled withdrawals from Instant Access Savings Pots.</strong> Schedzo can automate withdrawals. IFTTT is another option if your Pot is available.</p>
              <p>Withdrawals fund your main balance; rent and Direct Debits stay arranged separately.</p>
              <p className={styles.sourceNote}>See <ExternalLink href={monzoSavings}>Monzo&apos;s deposit options</ExternalLink> and <ExternalLink href={monzoHelp}>withdrawal rules</ExternalLink>.</p>
            </aside>
            <nav className={styles.contents} aria-label="On this page">
              <p className={styles.contentsLabel}>In this guide</p>
              <ol>
                {contents.map(([id, label], index) => (
                  <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>
                ))}
              </ol>
              <a className={styles.backToTop} href="#article-heading">Back to top <ArrowIcon direction="up" /></a>
            </nav>
            <div className={styles.content}>
              <section className={styles.section} aria-labelledby="why-heading">
                <h2 id="why-heading">What can you do with Instant Access Savings?</h2>
                <p>This guide covers Instant Access Savings Pots. Here&apos;s what Monzo offers in the app:</p>
                <div className={styles.tableScroll}>
                  <table className={styles.featureTable}>
                    <caption>Instant Access Savings features in Monzo&apos;s app</caption>
                    <thead><tr><th scope="col">Action</th><th scope="col">Available?</th><th scope="col">What it means</th></tr></thead>
                    <tbody>
                      <tr><th scope="row">Scheduled deposits</th><td>Yes</td><td>Regular transfers into your Pot.</td></tr>
                      <tr><th scope="row">Manual withdrawals</th><td>Yes</td><td>Move money to your main balance when needed.</td></tr>
                      <tr><th scope="row">Scheduled withdrawals</th><td>No</td><td>The Monzo app does not offer this feature for these Pots.</td></tr>
                      <tr><th scope="row">Payments from the Pot</th><td>No</td><td>Fund your main balance for a separately arranged payment.</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className={styles.note}>Pots protected with added security need withdrawals to be made in the Monzo app. Third-party tools cannot withdraw from them. See <ExternalLink href="https://docs.monzo.com/#withdraw-from-a-pot">Monzo&apos;s withdrawal restrictions</ExternalLink>.</p>
              </section>

              <section className={styles.section} aria-labelledby="manual-heading">
                <h2 id="manual-heading">Compare manual withdrawals, IFTTT and Schedzo</h2>
                <p>These are the differences I&apos;d look at before choosing how to withdraw.</p>
                <WithdrawalComparisonTable />
                <p className={styles.sourceNote}>IFTTT&apos;s <ExternalLink href="https://ifttt.com/plans">Applet limits</ExternalLink> apply across your account, not to the number of runs. Its <ExternalLink href="https://ifttt.com/date_and_time">Date &amp; Time service</ExternalLink> lists polling intervals; these are checks, not guaranteed withdrawal times. Schedzo notification delivery depends on Monzo access and availability.</p>
                <h3>Which would I choose?</h3>
                <ul className={styles.recommendations}>
                  <li><strong>Manual:</strong> for occasional withdrawals, when a reminder is enough.</li>
                  <li><strong>IFTTT:</strong> if you already use it, have a spare Applet and your Pot is available.</li>
                  <li><strong>Schedzo:</strong> for recurring withdrawals with transfer history and updates in Monzo. That&apos;s the monthly task I built it for.</li>
                </ul>
                <h3>Make a manual withdrawal</h3>
                <ol className={styles.steps}>
                  <li>In Monzo, go to <strong>Grow → Savings</strong> and open your Instant Access Savings Pot.</li>
                  <li>Choose the withdrawal option, enter the amount and follow the confirmation steps.</li>
                  <li>Check your main balance; withdrawals usually arrive instantly.</li>
                </ol>
                <p className={styles.sourceNote}>If your Pot is hidden, <ExternalLink href="https://monzo.com/help/budgeting-overdrafts-savings/add-withdraw-hidden-pots">show it first</ExternalLink>. Monzo&apos;s layout can vary by app version.</p>
              </section>

              <section className={styles.section} aria-labelledby="ifttt-heading">
                <h2 id="ifttt-heading">The IFTTT option</h2>
                <p>For a monthly withdrawal, connect a Date &amp; Time trigger to Monzo&apos;s withdrawal action:</p>
                <ol className={styles.steps}>
                  <li>Create an Applet. For <strong>If This</strong>, choose Date &amp; Time&apos;s <ExternalLink href="https://ifttt.com/date_and_time/triggers/every_month_on_the">Every month on the</ExternalLink> trigger. Set <strong>Day of the month</strong> to 14 and your preferred time.</li>
                  <li>In the Date &amp; Time service, open <strong>Settings → Update time zone</strong> and choose the UK time zone for a UK schedule. This controls when it runs; your account time zone only changes the activity feed display.</li>
                  <li>For <strong>Then That</strong>, connect Monzo and choose <ExternalLink href="https://ifttt.com/monzo/actions/pot_withdraw">Move money out of a pot</ExternalLink>. Select your Instant Access Pot, if it appears.</li>
                  <li>Enter <code>2273</code> in <strong>Amount</strong> for £2,273. IFTTT uses pounds, without the £ symbol.</li>
                  <li>Review and save the Applet. For alerts, install the IFTTT app, allow phone notifications and enable the Applet&apos;s run and failure alerts.</li>
                </ol>
                <p className={styles.sourceNote}>Free includes two Applets and monthly-trigger polling. Check the Monzo action is available on your plan and your Instant Access Pot appears before relying on the schedule. See IFTTT&apos;s <ExternalLink href="https://help.ifttt.com/hc/en-us/articles/115010326648-How-do-I-update-my-time-zone">time zone instructions</ExternalLink> and <ExternalLink href="https://help.ifttt.com/hc/en-us/articles/360001219814-Enabling-and-disabling-Applet-run-notifications">notification settings</ExternalLink>.</p>
              </section>

              <section className={styles.section} aria-labelledby="schedzo-heading">
                <h2 id="schedzo-heading">Create a recurring withdrawal with Schedzo</h2>
                <h3>Get access and connect Monzo</h3>
                <p>If you&apos;re new, <a href="#join">request free hosted access below</a>. You can also self-host; see <a href="#limits-heading">access options</a> below.</p>
                <p>Once you have access, <a href="/console">open the console</a>, select <strong>Login with Monzo</strong> and follow Monzo&apos;s approval steps. Then select your account and Instant Access Savings Pot.</p>
                <h3>Set up the withdrawal</h3>
                <ol className={styles.steps}>
                  <li>Select <strong>Schedule a transfer</strong>. Set a future <strong>UK date and time</strong> and check the local-time preview.</li>
                  <li>Choose <strong>Monthly</strong> for <strong>Interval</strong> and change <strong>Transfer type</strong> to <strong>Withdraw from pot</strong>.</li>
                  <li>Enter <code>227300</code> in <strong>Amount (pence)</strong> for £2,273, and check the pounds preview.</li>
                  <li>Select <strong>Create scheduled transfer</strong>. Review the pending transfer; expand its details to find <strong>Cancel transfer</strong>.</li>
                </ol>
                <div className={styles.transferPreview} role="region" aria-labelledby="preview-heading">
                  <p className={styles.eyebrow}>Sample data · No real money moves</p>
                  <h3 id="preview-heading">Try a sample withdrawal</h3>
                  <p className={styles.sourceNote}>The console&apos;s form, prefilled for a monthly £2,273 withdrawal. Choose a future UK date and time, create it, then try cancelling. Sample history resets on refresh.</p>
                  <ArticleTransferPreview />
                </div>
                <p className={styles.note}>I&apos;d leave a buffer before the bill and check the money has reached the main balance. Transfers can be delayed.</p>
                <p className={styles.actions}><ExternalLink className={styles.button} href="/demo" aria-label="Explore the full demo (opens in a new tab)">Explore the full demo</ExternalLink></p>
              </section>

              <section className={styles.section} aria-labelledby="rent-heading">
                <h2 id="rent-heading">Example: keep rent money in Instant Access Savings</h2>
                <p>For this example, set aside £2,273 on payday, 28 September, withdraw it on 14 October at 09:00 UK time, and pay rent on 15 October. That&apos;s <strong>{rentExample.days} days in savings</strong>. The one-day buffer is illustrative; choose a gap that works for your payment.</p>
                <ol className={styles.timeline} aria-label="Illustrative rent timeline">
                  <li><time dateTime={rentExample.setAsideDate}>28 September</time><strong>Money set aside</strong><span>£2,273 in “{rentExample.potName}”.</span></li>
                  <li><time dateTime={rentExample.withdrawalDate}>14 October · 09:00 UK</time><strong>Planned withdrawal</strong><span>Return it to the main balance.</span></li>
                  <li><time dateTime={rentExample.paymentDate}>15 October</time><strong>Rent payment due</strong><span>Your arranged payment leaves.</span></li>
                </ol>
                <p>The calculator starts with this amount and {rentExample.days} days. Replace the illustrative <strong>2.75% AER</strong> with your own rate. Its yearly estimate repeats the same monthly savings period 12 times.</p>
                <div className={styles.rentCalculator}><SavingsInterestCalculator /></div>
              </section>

              <section className={styles.section} aria-labelledby="flow-heading">
                <h2 id="flow-heading">From savings to your rent payment</h2>
                <p>Here&apos;s how that same £2,273 withdrawal and rent payment fit together:</p>
                <div className={styles.flowExample}>
                  <PaymentFlowExample
                    transfer={rentExampleTransfer}
                    potName={rentExample.potName}
                    heading={<>From saved.<br /> To paid.</>}
                    animated={false}
                    presentation="compact"
                    explanation={{
                      steps: [
                        { title: "14 October: withdraw from savings.", description: "£2,273 returns from Rent savings to your account." },
                        { title: "Check your main balance.", description: "Make sure the withdrawal has arrived." },
                        { title: "15 October: rent payment.", description: "Your separately arranged payment goes out." },
                      ],
                      note: "An illustration of the dated example, using sample data.",
                    }}
                  />
                </div>
              </section>

              <section className={styles.section} aria-labelledby="safety-heading">
                <h2 id="safety-heading">Permissions and your data</h2>
                <h3>Connecting Monzo</h3>
                <p>You approve access through Monzo; I don&apos;t ask for your Monzo password. Schedzo reads authorised account and Pot information and requests transfers between them.</p>
                <h3>Disconnecting and deleting your data</h3>
                <p>Schedzo stores the account and Pot identifiers, schedules and transfer history it needs to run your transfers. The credentials that keep it connected to Monzo are stored encrypted.</p>
                <p>Disconnecting stops your recurring schedules and cancels pending transfers. A transfer already in progress can finish. If Monzo is temporarily unavailable, confirmation that access has been revoked may be delayed. The stored Monzo credentials are deleted once that confirmation arrives.</p>
                <p>Disconnecting keeps your schedules and history. If you&apos;d like your data deleted or have another privacy request, <a href="mailto:privacy@schedzo.app">email me</a> at <CopyableContent value="privacy@schedzo.app">privacy@schedzo.app</CopyableContent>.</p>
                <h3 id="limits-heading">Free hosted access and self-hosting</h3>
                <p>I keep hosted Schedzo free, subject to availability and Monzo&apos;s developer access limits. Self-hosting needs your own Monzo developer setup and infrastructure, with your own running costs. The <ExternalLink href="https://github.com/wchr-aun/schedzo">project README</ExternalLink> covers that setup.</p>
              </section>

              <section className={styles.section} aria-labelledby="faq-heading">
                <h2 id="faq-heading">Instant Access Savings: common questions</h2>
                <details className={styles.faqItem}><summary><h3>How do monthly schedules handle shorter months?<span aria-hidden="true" /></h3></summary><p>Schedzo uses the last day of the month when your chosen date does not exist. For example, a schedule for the 31st runs on the last day of February, then returns to the 31st in March. Schedules use UK local time.</p></details>
                <details className={styles.faqItem}><summary><h3>Does cancelling stop the recurring schedule?<span aria-hidden="true" /></h3></summary><p>Yes. Cancelling stops future transfers in that schedule and cancels any pending ones. It does not reverse a withdrawal that has already completed.</p></details>
                <details className={styles.faqItem}><summary><h3>What happens if a scheduled withdrawal fails?<span aria-hidden="true" /></h3></summary><p>The transfer is marked failed. Later scheduled transfers continue unless you cancel the schedule, but they do not make up the missed withdrawal. Check your main balance and transfer status before moving money manually to avoid a duplicate transfer.</p></details>
              </section>

              <section className={styles.section} aria-labelledby="sources-heading">
                <h2 id="sources-heading">Useful links</h2>
                <p>These are the Monzo and IFTTT pages I used while putting this guide together.</p>
                <ul className={styles.sourceList}>
                  <li><ExternalLink href={monzoSavings}>Monzo Instant Access Savings: regular deposits</ExternalLink></li>
                  <li><ExternalLink href={monzoHelp}>Monzo Instant Access withdrawal and payment rules</ExternalLink></li>
                  <li><ExternalLink href="https://docs.monzo.com/#withdraw-from-a-pot">Monzo API withdrawal action and added security</ExternalLink></li>
                  <li><ExternalLink href="https://ifttt.com/monzo/actions/pot_withdraw">IFTTT withdrawal action and GBP input</ExternalLink></li>
                  <li><ExternalLink href="https://ifttt.com/date_and_time/triggers/every_month_on_the">IFTTT monthly trigger</ExternalLink></li>
                  <li><ExternalLink href="https://help.ifttt.com/hc/en-us/articles/115010326648-How-do-I-update-my-time-zone">IFTTT time zone settings</ExternalLink></li>
                  <li><ExternalLink href="https://ifttt.com/plans">IFTTT plans and Applet allowances</ExternalLink></li>
                  <li><ExternalLink href="https://help.ifttt.com/hc/en-us/articles/360052714673-Billing-FAQ">IFTTT billing FAQ</ExternalLink></li>
                  <li><ExternalLink href="https://help.ifttt.com/hc/en-us/articles/360001219814-Enabling-and-disabling-Applet-run-notifications">IFTTT run and failure notification settings</ExternalLink></li>
                </ul>
                <div className={styles.author}>
                  <h3>About me</h3>
                  <p>I&apos;m <ExternalLink href={instantAccessArticle.author.url}>Aun</ExternalLink>, and I build Schedzo. If you have a question about it, <a href="#join">get in touch below</a>.</p>
                </div>
              </section>

              <section id="join" className={styles.closing} aria-labelledby="join-heading" tabIndex={-1}>
                <h2 id="join-heading">Join Schedzo.</h2>
                <p>I keep hosted Schedzo free, subject to availability. If you&apos;d like to join or have a question, drop me an email. I&apos;ll reply about availability and help you get set up.</p>
                <p>To request access, include your Monzo user ID. You can find it by signing in to the <ExternalLink href="https://developers.monzo.com/">Monzo developer portal</ExternalLink>.</p>
                <p className={styles.actions}>
                  <a className={styles.button} href="mailto:join@schedzo.app?subject=Schedzo%20hosted%20access">Email me to join <EmailIcon /></a>
                  <span>Or copy: <CopyableContent value="join@schedzo.app">join@schedzo.app</CopyableContent></span>
                </p>
                <p className={styles.sourceNote}>Already have access? <a href="/console">Open the console</a>.</p>
                <p className={styles.sourceNote}>Want to look around first? <ExternalLink href="/demo" aria-label="Open the demo (opens in a new tab)">Open the demo</ExternalLink> with fictional accounts. No real money moves.</p>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
