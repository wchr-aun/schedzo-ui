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
import {PaymentFlow} from "@/components/landing/payment-flow/payment-flow";
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
            <a className={styles.consoleLink} href="/console">
              Go to console
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-heading">
          <ScrollReveal className={styles.heroCopy}>
            <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>
              <span className={styles.dot} /> Less remembering. <span>More saving.</span>
            </p>
            <h1 id="hero-heading">Schedule your Monzo Pot transfers.</h1>
            <p className={styles.introduction}>
              Automatically schedule money into and out of your Monzo Pots, including withdrawals from Savings Pots.
            </p>
            <p className={styles.invitation}>
              Free to join. Get in touch and I&apos;ll help you get set up.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#join">Join us <ArrowIcon /></a>
              <a className={styles.secondaryLink} href="/demo">Try the demo <ArrowIcon /></a>
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
              <h2 id="why-heading">Why I&apos;m<br />building this.</h2>
            </ScrollReveal>
          </div>
          <div className={styles.storyContent}>
            <ScrollReveal className={styles.storyProblem}>
              <h3>The problem.</h3>
              <p>
                Imagine payday is on the 28th and rent is due on the 15th. You could leave the rent money in a Savings Pot in the meantime, where it can keep earning interest. But Monzo doesn&apos;t let you schedule a recurring withdrawal from a Savings Pot for just before rent is due.
              </p>
            </ScrollReveal>
            <ScrollReveal className={styles.storyWorkaround}>
              <h3>The workaround.</h3>
              <p>
                You can schedule rent from your main balance, then move the money from your Savings Pot into that balance yourself beforehand. It works, but you have to remember to do it at the right time.
              </p>
              <figure className={styles.declinedPreview}>
                <ScrollReveal>
                  <MonzoTransaction revealTrigger="mount" kind="declined" amount={exampleRentAmount * 100} recipient="Landlord" initials="L" />
                  <figcaption>Example of a declined scheduled payment.</figcaption>
                </ScrollReveal>
              </figure>
            </ScrollReveal>
            <div className={styles.storyFlow}><PaymentFlow transfer={storyTransfer} /></div>
            <ScrollReveal className={styles.storyMotivation}>
              <h3>Why build my own?</h3>
              <p>
                <ExternalLink href="https://ifttt.com/monzo">IFTTT</ExternalLink> can automate some Monzo actions. I wanted to build a small, open-source tool focused on scheduled Pot transfers, including Savings Pot withdrawals.
              </p>
              <p>
                I also wanted <strong>a small project to play around with APIs in UK banking</strong>.
                Monzo already provides <ExternalLink href="https://docs.monzo.com">APIs to move money into and out of pots</ExternalLink>,
                so this felt like a good place to start.
              </p>
            </ScrollReveal>
            <ScrollReveal className={styles.storyArticle}>
              <p>
                Want to understand the options? <a href="/schedule-monzo-savings-pot-withdrawals">Read how to schedule withdrawals from Monzo Savings Pots.</a>
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
              <figcaption>Try the example notification</figcaption>
            </figure>
          </div>
        </section>

        <section id="demo" className={styles.demoSection} aria-labelledby="demo-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>03 / Interactive demo</p>
            <h2 id="demo-heading">Take a look around.</h2>
            <p className={styles.demoDescription}>
              Explore sample accounts and pots, create a schedule, or cancel a transfer.
              No Monzo account needed, and no real money moves.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <a className={styles.primaryLink} href="/demo">Open the demo <ArrowIcon /></a>
          </ScrollReveal>
        </section>

        <section id="code" className={styles.codeSection} aria-labelledby="code-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>04 / Open source</p>
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

        <section id="join" className={styles.joinSection} aria-labelledby="join-heading">
          <ScrollReveal>
            <p className={styles.eyebrow}>05 / Join us</p>
            <h2 id="join-heading">You&apos;re welcome to join.</h2>
            <p className={styles.joinDescription}>
              It&apos;s free to join, and you can use Schedzo right here with your own Monzo account —
              no need to host anything yourself.
              It&apos;s a small personal project with room for a few people, so drop me a message
              if you&apos;d like to give it a go.
            </p>
            <p className={styles.joinDescription}>
              To help you get set up, I&apos;ll need your Monzo user ID. You can find it by signing in
              to the <ExternalLink href="https://developers.monzo.com/" aria-label="Monzo developer portal (opens in a new tab)">Monzo developer portal</ExternalLink>.
              Please include it in your email.
            </p>
          </ScrollReveal>
          <ScrollReveal className={styles.joinActions}>
            <a className={styles.primaryLink} href="mailto:join@schedzo.app">Say hello <EmailIcon /></a>
            <p className={styles.joinEmail}>
              Or copy: <CopyableContent value="join@schedzo.app">join@schedzo.app</CopyableContent>
            </p>
            <p className={styles.joinNote}>
              Already have access? <a href="/console">Go to console.</a>
            </p>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
