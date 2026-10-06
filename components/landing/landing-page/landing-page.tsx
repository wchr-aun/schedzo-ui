import {createPreviewTransfersPage} from "@/lib/scheduled-transfers/preview";
import Image from "next/image";
import {ArrowIcon} from "@/components/ui/icons/arrow-icon";
import {EmailIcon} from "@/components/ui/icons/email-icon";
import {ExternalLink} from "@/components/ui/external-link/external-link";
import {ThemeToggle} from "@/components/ui/theme-toggle/theme-toggle";
import {Footer} from "@/components/layout/footer/footer";
import {PotPreview} from "@/components/landing/pot-preview/pot-preview";
import {MonzoNotification} from "@/components/landing/monzo-notification/monzo-notification";
import {InterestCalculation} from "@/components/landing/interest-calculation/interest-calculation";
import {MonzoTransaction} from "@/components/landing/monzo-transaction/monzo-transaction";
import {PaymentFlow} from "@/components/landing/payment-flow/payment-flow";
import {RepositoryCard} from "@/components/landing/repository-card/repository-card";
import {FeatureCard} from "@/components/landing/feature-card/feature-card";
import {ScrollReveal} from "@/components/ui/scroll-reveal/scroll-reveal";
import styles from "./landing-page.module.css";

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
            <ExternalLink className={styles.consoleLink} href="/console">
              Go to console
            </ExternalLink>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-heading">
          <ScrollReveal className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.dot} /> Schedzo. On schedule.</p>
            <h1 id="hero-heading">Less remembering.<br /><span>More saving.</span></h1>
            <p className={styles.introduction}>
              Schedule money into and out of your Monzo pots, so there&apos;s one less
              thing to remember when life gets busy.
            </p>
            <p className={styles.invitation}>
              Free to join. Get in touch and I&apos;ll help you get set up.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#join">Join us <ArrowIcon /></a>
              <a className={styles.secondaryLink} href="#demo">Try the demo <ArrowIcon /></a>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}><PotPreview transfersPage={transfersPage} /></ScrollReveal>
        </section>

        <section id="why" className={styles.storySection} aria-labelledby="why-heading">
          <div className={styles.sectionIntro}>
            <ScrollReveal>
              <p className={styles.eyebrow}>01 / The motivation</p>
              <h2 id="why-heading">Why I&apos;m<br />building this.</h2>
            </ScrollReveal>
            <PaymentFlow transfer={storyTransfer} />
          </div>
          <div className={styles.storyContent}>
            <ScrollReveal>
              <h3>The problem.</h3>
              <p>
                Monzo doesn&apos;t let us <strong>schedule withdrawals from savings pots</strong>. So, if we
                want to keep money earning interest until a scheduled payment is due, we have
                to remember to manually move it into the main balance ourselves.
              </p>
              <p>
                If payday is on the 28th and rent is due on the 15th of the following month,
                that&apos;s <strong>over two weeks of interest</strong> we could earn on the rent money.
              </p>
              <p>
                Using <strong>£{exampleRentAmount.toLocaleString("en-GB")}</strong>, the <ExternalLink href="https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/march2026#private-rents-by-english-region">average monthly private rent in London in February 2026 according to the ONS</ExternalLink>,
                keeping that money in a savings pot for 17 days at 2.75% AER could earn roughly <InterestCalculation />. Do that each month and
                it&apos;s around <strong className={styles.interestHighlight}>£34 over a year</strong>. It&apos;s a small amount each time, but it adds
                up without having to put any extra money aside!
              </p>
              <p className={styles.rateNote}>
                Illustrative calculation using <ExternalLink href="https://monzo.com/current-account">Monzo&apos;s Instant Access Savings rate</ExternalLink> of
                2.75% AER variable on the free plan, checked on 2 October 2026. Rates can change.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <h3>The workaround.</h3>
              <p>
                The workaround is to schedule the payment from the main balance, then
                <strong> manually withdraw the money from the savings pot the day before</strong>.
                But life can sometimes be quite busy. Even with Monzo&apos;s reminder that
                there isn&apos;t enough money for the payment, <strong>it&apos;s easy to forget</strong>.
              </p>
              <figure className={styles.declinedPreview}>
                <ScrollReveal>
                  <MonzoTransaction revealTrigger="mount" kind="declined" amount={exampleRentAmount * 100} recipient="Landlord" initials="L" />
                  <figcaption>Example of a declined scheduled payment.</figcaption>
                </ScrollReveal>
              </figure>
              <p>
                I wanted to <strong>automate that last step</strong>, so the money can stay in
                the savings pot until it&apos;s needed, <strong>without me having to remember
                to move it myself</strong>.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <h3>Why build my own?</h3>
              <p>
                There&apos;s already a platform that can do this: <ExternalLink href="https://ifttt.com/applets/d3xg75n8-move-money-daily-from-a-monzo-pot-to-your-account">IFTTT</ExternalLink> lets
                us schedule withdrawals from pots to the main balance. But its free tier only
                allows <strong>two automations</strong>. So, I decided to build this to serve my needs.
              </p>
              <p>
                I also wanted <strong>a small project to play around with APIs in UK banking</strong>.
                Monzo already provides <ExternalLink href="https://docs.monzo.com">APIs to move money into and out of pots</ExternalLink>,
                so this felt like a good place to start.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section id="building" className={styles.buildSection} aria-labelledby="building-heading">
          <ScrollReveal className={styles.buildHeading}>
            <div>
              <p className={styles.eyebrow}>02 / From idea to app</p>
              <h2 id="building-heading">So I built Schedzo.</h2>
            </div>
            <p className={styles.buildDescription}>
              A small web app that helps schedule transfers into and out of pots,
              without a limit on the number of scheduled transfers you can create.
            </p>
          </ScrollReveal>
          <div className={styles.features}>
            <ScrollReveal>
              <FeatureCard
                number="01"
                title="Schedule money in or out."
                description="Create recurring deposits or withdrawals between your pots and main balance."
              />
            </ScrollReveal>
            <ScrollReveal>
              <FeatureCard
                number="02"
                title="Make as many plans as you need."
                description="No limit on the number of scheduled transfers you can create."
              />
            </ScrollReveal>
            <ScrollReveal>
              <FeatureCard
                number="03"
                title="Keep track of your plans."
                description="See what's coming next, filter transfers by status, and cancel pending transfers."
              />
            </ScrollReveal>
          </div>
          <div className={styles.notificationFeature}>
            <ScrollReveal className={styles.notificationCopy}>
              <h3>Know what happened.</h3>
              <p>
                When a scheduled transfer runs, whether it succeeds or fails, the app sends
                a notification to your Monzo app so you know what happened.
              </p>
            </ScrollReveal>
            <figure className={styles.notificationPreview}>
              <MonzoNotification title="🎉 £50.00 deposited" />
              <figcaption>Example notification</figcaption>
            </figure>
          </div>
        </section>

        <section id="join" className={styles.joinSection} aria-labelledby="join-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>03 / Join us</p>
            <h2 id="join-heading">You&apos;re welcome to join.</h2>
            <p className={styles.joinDescription}>
              It&apos;s free to join, and you can use Schedzo right here with your own Monzo account —
              no need to host anything yourself.
              It&apos;s a small personal project with room for a few people, so drop me a message
              if you&apos;d like to give it a go.
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.joinActions}>
            <a className={styles.primaryLink} href="mailto:wchr.aun@gmail.com">Say hello <EmailIcon /></a>
            <p className={styles.joinNote}>
              Already have access? <a href="/console">Go to console.</a>
            </p>
          </ScrollReveal>
        </section>

        <section id="demo" className={styles.demoSection} aria-labelledby="demo-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>04 / Interactive demo</p>
            <h2 id="demo-heading">Take a look around.</h2>
            <p className={styles.demoDescription}>
              Explore sample accounts and pots, create a schedule, or cancel a transfer.
              No Monzo account needed, and no real money moves.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <ExternalLink className={styles.primaryLink} href="/demo" aria-label="Open demo (opens in a new tab)" title="Opens in a new tab">Open demo</ExternalLink>
          </ScrollReveal>
        </section>

        <section id="code" className={styles.codeSection} aria-labelledby="code-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>05 / Open source</p>
            <h2 id="code-heading">Prefer to host it yourself?</h2>
          </ScrollReveal>
          <ScrollReveal className={styles.codeDescription}>
            <p>All the code is open source. Feel free to fork it, copy it, and run it on your own server.</p>
          </ScrollReveal>
          <div className={styles.repositories}>
            <ScrollReveal>
              <RepositoryCard
                href="https://github.com/wchr-aun/schedzo-ui"
                title="Frontend code"
                description="The website and console for your accounts, pots, and scheduled transfers."
                stack={['TypeScript', 'Next.js']}
                stackLabel="Frontend language and framework"
                license="MIT License"
              />
            </ScrollReveal>
            <ScrollReveal>
              <RepositoryCard
                href="https://github.com/wchr-aun/schedzo"
                title="Backend code"
                description="The scheduler that runs your transfers and sends updates to Monzo."
                stack={['Python', 'FastAPI']}
                stackLabel="Backend language and framework"
                license="MIT License"
              />
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
