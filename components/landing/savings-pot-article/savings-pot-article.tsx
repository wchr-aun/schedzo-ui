import Image from "next/image";
import { Footer } from "@/components/layout/footer/footer";
import { ExternalLink } from "@/components/ui/external-link/external-link";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { ArrowIcon } from "@/components/ui/icons/arrow-icon";
import { PaymentFlowExample } from "@/components/landing/payment-flow-example/payment-flow-example";
import { SavingsInterestCalculator } from "@/components/landing/savings-interest-calculator/savings-interest-calculator";
import { createPreviewTransfersPage } from "@/lib/scheduled-transfers/preview";
import styles from "./savings-pot-article.module.css";

const contents = [
  ["why-heading", "The Savings Pot limitation"],
  ["manual-heading", "Three ways to move your money"],
  ["rent-heading", "The rent example"],
  ["flow-heading", "See how it works"],
  ["safety-heading", "Access & your data"],
  ["limits-heading", "Availability & self-hosting"],
  ["faq-heading", "Common questions"],
] as const;

export function SavingsPotArticle() {
  const transfer = {
    ...createPreviewTransfersPage().scheduledTransfers[1],
    amount: 227_300,
  };

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
            <a href="/demo">Try the demo</a>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <article aria-labelledby="article-heading">
          <header className={styles.hero}>
            <a className={styles.backLink} href="/"><ArrowIcon direction="left" /> Back to Schedzo</a>
            <p className={styles.eyebrow}>Monzo Pots · A practical guide</p>
            <h1 id="article-heading">How to schedule withdrawals from <span>Monzo Savings Pots</span></h1>
            <p className={styles.lead}>
              Monzo lets you withdraw money from Savings Pots manually, but its in-app recurring Pot schedules are available for regular Pots rather than Savings Pots. You can move the money yourself, build an automation with a service such as IFTTT, or use Schedzo to schedule the withdrawal.
            </p>
          </header>

          <div className={styles.articleLayout}>
            <nav className={styles.contents} aria-label="On this page">
              <p className={styles.contentsLabel}>In this guide</p>
              <ol>
                {contents.map(([id, label], index) => (
                  <li key={id}><a href={`#${id}`}><span aria-hidden="true">0{index + 1}</span>{label}</a></li>
                ))}
              </ol>
              <a className={styles.backToTop} href="#article-heading">Back to top <ArrowIcon direction="up" /></a>
            </nav>
            <div className={styles.content}>
              <p>
                For example, if payday is on the 28th and rent is due around the 15th, you may want to leave the rent money in a Savings Pot until shortly before the payment. That way it remains in savings for longer instead of sitting in your main balance. The scheduled rent payment still comes from your main balance, so the money needs to be back there in time.
              </p>

              <section className={styles.section} aria-labelledby="why-heading">
                <h2 id="why-heading">Why can&apos;t I schedule a withdrawal from a Monzo Savings Pot?</h2>
                <p>
                  Monzo&apos;s app supports scheduled payments into and out of regular Pots. Savings Pots have different rules: recurring withdrawals are not currently offered through the same in-app schedule. You can still withdraw manually, and Monzo&apos;s developer API provides Pot deposit and withdrawal actions for approved apps.
                </p>
                <p>
                  A direct debit or scheduled bank payment also cannot be paid straight from a Savings Pot. Some regular Pots can be set up as Bills Pots, where eligible bills are covered from the Pot.
                </p>
              </section>

              <section className={styles.option} aria-labelledby="manual-heading">
                <p className={styles.optionLabel}>Option 01 · Keep it simple</p>
                <h2 id="manual-heading">Move the money manually</h2>
                <p><strong>Savings Pot → Monzo balance → payment.</strong> Withdraw the amount from the Pot shortly before your payment is due.</p>
                <ul>
                  <li><strong>Pros:</strong> no third-party service, simple to do, and you choose when the money moves.</li>
                  <li><strong>Cons:</strong> you have to remember, payday and bill dates may differ, and you might move the money earlier than necessary.</li>
                </ul>
              </section>

              <section className={styles.option} aria-labelledby="ifttt-heading">
                <p className={styles.optionLabel}>Option 02 · Build an automation</p>
                <h2 id="ifttt-heading">Use IFTTT</h2>
                <p>
                  IFTTT supports Monzo actions to move money into or out of a Pot, and its applets can connect those actions to supported triggers and schedules. It can work for some workflows, but the available triggers, timing, and configuration may not match every Savings Pot use case. Check the current <ExternalLink href="https://ifttt.com/monzo">IFTTT Monzo actions</ExternalLink> before relying on an applet.
                </p>
              </section>

              <section className={styles.option} aria-labelledby="schedzo-heading">
                <p className={styles.optionLabel}>Option 03 · Set your schedule</p>
                <h2 id="schedzo-heading">Use Schedzo</h2>
                <p>
                  Schedzo is an open-source scheduler built to make recurring Monzo Pot transfers easier, including withdrawals from Savings Pots. The app lets you choose a Pot, direction, amount, and schedule, then view or cancel pending transfers.
                </p>
                <ol>
                  <li>Connect your Monzo account through Monzo&apos;s authorisation flow.</li>
                  <li>Select an account and Pot.</li>
                  <li>Choose whether money moves into or out of the Pot.</li>
                  <li>Set the amount and choose a daily, weekly, or monthly schedule.</li>
                  <li>Review upcoming transfers and cancel a schedule when you no longer need it.</li>
                </ol>
                <p className={styles.actions}>
                  <a className={styles.button} href="/demo">Try the interactive demo</a>
                  <a href="mailto:join@schedzo.app">Request hosted access</a>
                </p>
              </section>

              <section className={styles.section} aria-labelledby="rent-heading">
                <h2 id="rent-heading">Example — keep rent money in a Savings Pot</h2>
                <p>
                  Imagine your payday is the 28th and rent is due on the 15th of the following month. Using the <ExternalLink href="https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/march2026#private-rents-by-english-region">ONS average monthly private rent in London for February 2026</ExternalLink> of £2,273, you could keep that money in a Savings Pot for the 17-day gap, then schedule a withdrawal shortly before the rent payment leaves your main balance.
                </p>
                <p>
                  Adjust the amount, rate, and days to estimate what the money could earn. The example uses the <ExternalLink href="https://monzo.com/current-account">2.75% AER variable rate on Monzo&apos;s free plan</ExternalLink>, checked on 2 October 2026; rates can change.
                </p>
                <div className={styles.rentCalculator}>
                  <SavingsInterestCalculator />
                </div>
              </section>

              <section className={styles.section} aria-labelledby="flow-heading">
                <h2 id="flow-heading">How Schedzo works</h2>
                <p>Schedzo moves money between your own Monzo Pot and account. Your rent or bill payment remains set up separately with Monzo or the bill provider.</p>
                <div className={styles.flowExample}>
                  <PaymentFlowExample transfer={transfer} heading="From saved. To paid." animated={false} />
                </div>
              </section>

              <section className={styles.section} aria-labelledby="safety-heading">
                <h2 id="safety-heading">Is Schedzo safe?</h2>
                <h3>What you authorise</h3>
                <p>
                  Schedzo connects through Monzo&apos;s developer API and Monzo&apos;s account authorisation flow. The app needs permission to read the authorised account and Pot details and to move money into or out of a Pot on your schedule. It does not need your Monzo password, and its Pot-transfer actions move money between your Pot and your own account; Schedzo does not set up your rent Direct Debit or send payments to a landlord.
                </p>
                <h3>What is stored</h3>
                <p>
                  The service stores account identifiers, Pot identifiers, scheduled transfer details and transfer history to run schedules and show their status. The backend stores Monzo access and refresh tokens encrypted at rest; the frontend keeps its app-session tokens in HttpOnly cookies and does not expose them to browser JavaScript. The backend currently retains schedule definitions and transfer history; disconnecting does not delete that history, and there is no self-service history deletion. To request deletion of your stored data, email <a href="mailto:join@schedzo.app">join@schedzo.app</a>. See the <ExternalLink href="https://github.com/wchr-aun/schedzo">backend source</ExternalLink> for implementation details.
                </p>
                <h3>Disconnecting and reviewing the code</h3>
                <p>
                  You can disconnect Schedzo from the console. The disconnect flow asks Monzo to revoke access, deactivates schedules, cancels pending transfers, and clears the app session; stored Monzo tokens are erased after revocation is confirmed. Schedzo is open source: review the <ExternalLink href="https://github.com/wchr-aun/schedzo-ui">frontend</ExternalLink> and <ExternalLink href="https://github.com/wchr-aun/schedzo">backend</ExternalLink>.
                </p>
                <p className={styles.note}>
                  Monzo&apos;s API does not permit withdrawals from Pots protected with added security; those withdrawals must be made in the Monzo app. See <ExternalLink href="https://docs.monzo.com/">Monzo API documentation</ExternalLink> for current API behavior.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="limits-heading">
                <h2 id="limits-heading">Current limitations</h2>
                <p>
                  Schedzo is a small project, and access to the hosted version may be limited by restrictions on Monzo&apos;s developer API. The hosted service is currently free to join, subject to availability. Technical users can self-host the <ExternalLink href="https://github.com/wchr-aun/schedzo">backend</ExternalLink> and <ExternalLink href="https://github.com/wchr-aun/schedzo-ui">frontend</ExternalLink>; self-hosting requires configuring the Monzo developer credentials and server environment.
                </p>
              </section>

              <section className={styles.section} aria-labelledby="faq-heading">
                <h2 id="faq-heading">Frequently asked questions</h2>
                <details className={styles.faqItem}>
                  <summary><h3>Can you schedule withdrawals from a Monzo Savings Pot?<span aria-hidden="true" /></h3></summary>
                  <p>Monzo does not currently offer recurring Savings Pot withdrawals in its in-app Pot schedule. Schedzo can schedule supported transfers through Monzo&apos;s API.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Can you schedule transfers between Monzo Pots?<span aria-hidden="true" /></h3></summary>
                  <p>Schedzo does not create a direct Pot-to-Pot transfer. It schedules deposits or withdrawals between a selected Pot and its associated Monzo account. Monzo&apos;s own regular Pot schedules are also available in the app.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Can Direct Debits come directly from a Monzo Savings Pot?<span aria-hidden="true" /></h3></summary>
                  <p>No. Eligible bills can be paid from some regular Bills Pots, but a Savings Pot is not a Direct Debit payment source.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Can I automatically move money out of a Monzo Savings Pot?<span aria-hidden="true" /></h3></summary>
                  <p>Yes, through an automation that supports your use case, such as Schedzo. Monzo&apos;s API may restrict withdrawals from Pots with added security.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Does Schedzo work with normal Monzo Pots?<span aria-hidden="true" /></h3></summary>
                  <p>Schedzo supports scheduled deposits and withdrawals for Pots available to the connected account, subject to Monzo API rules.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Does Schedzo cost anything?<span aria-hidden="true" /></h3></summary>
                  <p>The hosted version is currently free to join. Access is limited and may depend on Monzo&apos;s developer API restrictions.</p>
                </details>
                <details className={styles.faqItem}>
                  <summary><h3>Can I self-host Schedzo?<span aria-hidden="true" /></h3></summary>
                  <p>Yes. The frontend and backend are open source. See their GitHub repositories for setup instructions.</p>
                </details>
              </section>

              <section className={styles.closing} aria-label="Explore Schedzo">
                <h2>Less remembering. More saving.</h2>
                <p>See how Schedzo can help with your Monzo Pot schedules.</p>
                <p className={styles.actions}><a className={styles.button} href="/">Explore Schedzo</a><a href="/demo">Open the demo</a></p>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
