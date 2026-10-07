import {createPreviewTransfersPage} from "@/lib/scheduled-transfers/preview";
import Image from "next/image";
import {ArrowIcon} from "@/components/ui/icons/arrow-icon";
import {EmailIcon} from "@/components/ui/icons/email-icon";
import {ExternalLink} from "@/components/ui/external-link/external-link";
import {ThemeToggle} from "@/components/ui/theme-toggle/theme-toggle";
import {Footer} from "@/components/layout/footer/footer";
import {PotPreview} from "@/components/landing/pot-preview/pot-preview";
import {MonzoNotification} from "@/components/landing/monzo-notification/monzo-notification";
import {MonzoTransaction} from "@/components/landing/monzo-transaction/monzo-transaction";
import {PaymentFlowExample} from "@/components/landing/payment-flow-example/payment-flow-example";
import {RepositoryCard} from "@/components/landing/repository-card/repository-card";
import {FeatureCard} from "@/components/landing/feature-card/feature-card";
import {ScrollReveal} from "@/components/ui/scroll-reveal/scroll-reveal";
import styles from "./landing-page.module.css";
import {CopyableContent} from "@/components/ui/copyable-content/copyable-content";

const exampleRentAmount = 2_273;

export function LandingPage() {
  const transfersPage = createPreviewTransfersPage();
  const storyTransfer = {
    ...transfersPage.scheduledTransfers[1],
    amount: exampleRentAmount * 100,
    scheduled_for: new Date().toISOString(),
  };

  return (
    <div id="top" className={styles.page}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={styles.header}>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a className={styles.brand} href="#top" aria-label="Schedzo, back to top">
            <Image className={styles.lightLogo} src="/logo.png" alt="" width={56} height={56} priority />
            <Image className={styles.darkLogo} src="/logo-dark-mode.png" alt="" width={56} height={56} priority />
            <span>Schedzo<span className={styles.brandCaption}>On schedule.</span></span>
          </a>
          <div className={styles.navigationControls}>
            <ExternalLink className={styles.consoleLink} href="/console" aria-label="Go to console (opens in a new tab)">
              Go to console
            </ExternalLink>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-heading">
          <ScrollReveal className={styles.heroCopy}>
            <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>
              <span className={styles.dot} /> <span>One less transfer to remember.</span>
            </p>
            <h1 id="hero-heading">Schedule your Monzo Pot transfers.</h1>
            <p className={styles.introduction}>
              Plan recurring deposits and withdrawals between your Monzo balance and Pots, including supported Savings Pot withdrawals.
            </p>
            <p className={styles.invitation}>
              Currently free to join. Say hello and I&apos;ll help you get set up.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#join">Join us <ArrowIcon /></a>
              <ExternalLink className={styles.secondaryLink} href="/demo" aria-label="Try the demo (opens in a new tab)">Try the demo</ExternalLink>
            </div>
            <p className={styles.heroNote}>
              Sample accounts only. No real money moves.
            </p>
            <a className={styles.storyLink} href="#why">A little about the project <ArrowIcon direction="down" /></a>
          </ScrollReveal>
          <ScrollReveal className={styles.heroPreview} delay={120}><PotPreview transfersPage={transfersPage} /></ScrollReveal>
        </section>

        <section id="why" className={styles.storySection} aria-labelledby="why-heading">
          <div className={styles.sectionIntro}>
            <ScrollReveal>
              <p className={styles.eyebrow}>01 / The motivation</p>
              <h2 id="why-heading">Why I built Schedzo.</h2>
            </ScrollReveal>
          </div>
          <div className={styles.storyContent}>
            <div className={styles.storyProblem}>
              <ScrollReveal>
                <h3>Payday and rent don&apos;t always line up.</h3>
                <p className={styles.storyText}>
                  Imagine payday is on the 28th and rent is due on the 15th of the following month. You&apos;d like to keep the rent money in a Savings Pot between those dates, rather than leave it in your main balance.
                </p>
                <p className={styles.storyText}>
                  I ran into this myself a few times. The rent money was in my Savings Pot, but I hadn&apos;t moved it back before the payment was due. The payment was declined.
                </p>
                <figure className={styles.declinedPreview}>
                  <MonzoTransaction revealTrigger="mount" kind="declined" amount={exampleRentAmount * 100} recipient="Landlord" initials="L" />
                  <figcaption>An illustration of my experience, using sample data.</figcaption>
                </figure>
              </ScrollReveal>
            </div>
            <div className={styles.storyResponse}>
              <div className={styles.storyWorkaround}>
                <ScrollReveal>
                  <h3>The transfer I had to remember.</h3>
                  <p className={styles.storyText}>
                    Your rent payment is arranged separately through Monzo and comes from your main balance. Before it goes out, the money needs to move back from your Savings Pot. You can make that withdrawal yourself, but it&apos;s another monthly task to remember.
                  </p>
                </ScrollReveal>
              </div>
              <div className={styles.storyMotivation}>
                <ScrollReveal>
                  <h3>What I wanted to build.</h3>
                  <p className={styles.storyText}>
                    After it happened a few times, I wanted a small tool that could schedule the Pot withdrawal ahead of my rent payment, so I wouldn&apos;t have to remember to move the money myself each month.
                  </p>
                  <p className={styles.storyText}>
                    I also wanted to explore APIs in UK banking and build a useful, open-source project around them.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
          <ScrollReveal className={styles.storyArticle}>
            <p className={styles.storyText}>
              Looking at other ways to do this? <a href="/schedule-monzo-savings-pot-withdrawals">Read the guide to scheduling Monzo Savings Pot withdrawals.</a>
            </p>
          </ScrollReveal>
        </section>

        <section id="building" className={styles.buildSection} aria-labelledby="building-heading">
          <ScrollReveal className={styles.buildHeading}>
            <div>
              <p className={styles.eyebrow}>02 / From idea to app</p>
              <h2 id="building-heading">So I built Schedzo.</h2>
            </div>
            <p className={styles.buildDescription}>
              Schedzo helps you schedule recurring transfers into and out of your Pots.
            </p>
          </ScrollReveal>
          <div className={styles.buildExample}>
            <PaymentFlowExample transfer={storyTransfer} heading="Here’s how the rent example works." />
          </div>
          <div className={styles.features}>
            <ScrollReveal>
              <FeatureCard
                number="01"
                title="Move money in either direction."
                description="Schedule deposits into a Pot or withdrawals back to its associated Monzo balance."
              />
            </ScrollReveal>
            <ScrollReveal>
              <FeatureCard
                number="02"
                title="Choose a recurring schedule."
                description="Set an amount, a starting date and time, and a daily, weekly, or monthly frequency."
              />
            </ScrollReveal>
            <ScrollReveal>
              <FeatureCard
                number="03"
                title="See what’s coming next."
                description="Review upcoming transfers, filter by status, and cancel pending transfers you no longer need."
              />
            </ScrollReveal>
          </div>
          <div className={styles.notificationFeature}>
            <ScrollReveal className={styles.notificationCopy}>
              <h3>Know how the transfer went.</h3>
              <p>
                Schedzo sends a notification to your Monzo app as soon as a scheduled transfer completes or fails. Delivery depends on Monzo&apos;s API.
              </p>
            </ScrollReveal>
            <ScrollReveal effect="popup" className={styles.notificationPreview}>
              <MonzoNotification
                title="🎉 £50.00 deposited"
                caption="Example transfer notification using sample data."
              />
            </ScrollReveal>
          </div>
        </section>

        <section id="demo" className={styles.demoSection} aria-labelledby="demo-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>03 / Interactive demo</p>
            <h2 id="demo-heading">Take a look around.</h2>
            <p className={styles.demoDescription}>
              Explore sample accounts and Pots, create a recurring transfer, and review or cancel a pending transfer.
              No Monzo account needed, and no real money moves. The demo resets when you refresh, so feel free to experiment.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <ExternalLink className={styles.primaryLink} href="/demo" aria-label="Open the demo (opens in a new tab)">Open the demo</ExternalLink>
          </ScrollReveal>
        </section>

        <section id="code" className={styles.codeSection} aria-labelledby="code-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>04 / Open source</p>
            <h2 id="code-heading">Built in the open.</h2>
          </ScrollReveal>
          <ScrollReveal className={styles.codeDescription}>
            <p>I wanted this to be a project people could inspect, learn from, and run themselves. All the code is open source.</p>
            <p>If you prefer to host it yourself, the repositories include setup instructions. You&apos;ll need to configure your own Monzo developer credentials and server environment.</p>
            <p>You connect your account through Monzo&apos;s authorisation flow. Schedzo uses that access to read your account and Pot details and run the Pot transfers you schedule. <a href="/schedule-monzo-savings-pot-withdrawals">Read how account access, stored data, and disconnecting work.</a></p>
          </ScrollReveal>
          <div className={styles.repositories}>
            <ScrollReveal>
              <RepositoryCard
                href="https://github.com/wchr-aun/schedzo-ui"
                title="Website and console"
                description="The landing page, demo, and console for browsing accounts, Pots, and scheduled transfers."
                stack={['TypeScript', 'Next.js']}
                stackLabel="Website language and framework"
                license="MIT License"
              />
            </ScrollReveal>
            <ScrollReveal>
              <RepositoryCard
                href="https://github.com/wchr-aun/schedzo"
                title="Scheduler"
                description="The service that manages schedules, runs Pot transfers, and reports their outcomes."
                stack={['Python', 'FastAPI']}
                stackLabel="Scheduler language and framework"
                license="MIT License"
              />
            </ScrollReveal>
          </div>
        </section>

        <section id="join" className={styles.joinSection} aria-labelledby="join-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>05 / Say hello</p>
            <h2 id="join-heading">You&apos;re welcome to join.</h2>
            <p className={styles.joinDescription}>
              Schedzo is a small personal project, currently free to join, with room for a few people. You can use it with your own Monzo account without hosting anything yourself.
              If you&apos;d like to give it a go, drop me an email and I&apos;ll help you get set up.
            </p>
            <p className={styles.joinDescription}>
              Include your Monzo user ID in your email. You can find it by signing in to the <ExternalLink href="https://developers.monzo.com/" aria-label="Monzo developer portal (opens in a new tab)">Monzo developer portal</ExternalLink>. I&apos;ll use it to help set up your access.
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.joinActions}>
            <a className={styles.primaryLink} href="mailto:join@schedzo.app">Say hello <EmailIcon /></a>
            <p className={styles.joinEmail}>
              Or copy: <CopyableContent value="join@schedzo.app">join@schedzo.app</CopyableContent>
            </p>
            <p className={styles.joinNote}>
              Already have access? <ExternalLink href="/console" aria-label="Go to console (opens in a new tab)">Go to console.</ExternalLink>
            </p>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
