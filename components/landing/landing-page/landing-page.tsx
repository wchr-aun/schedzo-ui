import Image from "next/image";
import {ArrowIcon} from "@/components/ui/icons/arrow-icon";
import {EmailIcon} from "@/components/ui/icons/email-icon";
import {ExternalLink} from "@/components/ui/external-link/external-link";
import {ThemeToggle} from "@/components/ui/theme-toggle/theme-toggle";
import {Footer} from "@/components/layout/footer/footer";
import {PotPreview} from "@/components/landing/pot-preview/pot-preview";
import {RepositoryCard} from "@/components/landing/repository-card/repository-card";
import {FeatureCard} from "@/components/landing/feature-card/feature-card";
import {ScrollReveal} from "@/components/ui/scroll-reveal/scroll-reveal";
import {CopyableContent} from "@/components/ui/copyable-content/copyable-content";
import styles from "./landing-page.module.css";

export function LandingPage() {
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
            <a className={styles.navStoryLink} href="#how-it-works">How it works</a>
            <a className={styles.consoleLink} href="/console">Go to console</a>
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
              Plan recurring transfers between your Monzo Pots and main balance, including withdrawals from Savings Pots.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="/demo">Try the demo <ArrowIcon /></a>
              <a className={styles.secondaryLink} href="#access">Request access</a>
            </div>
            <p className={styles.heroNote}>Explore sample accounts. No Monzo account needed, and no real money moves.</p>
          </ScrollReveal>
          <ScrollReveal className={styles.heroVisual} delay={120}>
            <PotPreview />
            <p className={styles.sampleCaption}>Example account · Sample data</p>
            <a className={styles.previewLink} href="/demo">Try this in the demo <ArrowIcon /></a>
          </ScrollReveal>
        </section>

        <section id="how-it-works" className={styles.howSection} aria-labelledby="how-heading">
          <ScrollReveal className={styles.sectionHeading}>
            <p className={styles.eyebrow}>A simple example</p>
            <h2 id="how-heading">Keep money in your Pot until it&apos;s needed.</h2>
            <p>Schedule the transfer into your main balance before a payment you&apos;ve arranged in Monzo.</p>
          </ScrollReveal>
          <ol className={styles.steps}>
            <li><span className={styles.stepNumber}>01</span><span className={styles.stepIcon} aria-hidden="true">◉</span><h3>Savings Pot</h3><p>Keep money set aside until you need it.</p></li>
            <li><span className={styles.stepNumber}>02</span><span className={styles.stepIcon} aria-hidden="true">↗</span><h3>Main balance</h3><p>Schedzo moves the scheduled amount into your balance.</p></li>
            <li><span className={styles.stepNumber}>03</span><span className={styles.stepIcon} aria-hidden="true">▦</span><h3>Monzo payment</h3><p>Monzo makes the payment you arranged there.</p></li>
          </ol>
          <p className={styles.flowNote}>Schedzo schedules Pot transfers. You continue to arrange payments in Monzo.</p>
        </section>

        <section id="features" className={styles.buildSection} aria-labelledby="features-heading">
          <ScrollReveal className={styles.buildHeading}>
            <div>
              <p className={styles.eyebrow}>Made for your routine</p>
              <h2 id="features-heading">Plan and manage your transfers.</h2>
            </div>
            <p className={styles.buildDescription}>A small web app for recurring transfers into and out of your Monzo Pots.</p>
          </ScrollReveal>
          <div className={styles.features}>
            <ScrollReveal><FeatureCard number="↔" title="Schedule money in or out." description="Create recurring deposits or withdrawals between your pots and main balance." /></ScrollReveal>
            <ScrollReveal><FeatureCard number="◷" title="See what’s coming next." description="Keep track of your upcoming transfers and filter them by status." /></ScrollReveal>
            <ScrollReveal><FeatureCard number="✓" title="Manage your schedules." description="Create as many schedules as you need, and cancel pending transfers." /></ScrollReveal>
          </div>
          <div className={styles.notificationFeature}>
            <ScrollReveal className={styles.notificationCopy}>
              <p className={styles.eyebrow}>A timely update</p>
              <h3>Know when a transfer runs.</h3>
              <p>When a scheduled transfer runs, the app sends a notification to your Monzo app.</p>
            </ScrollReveal>
            <figure className={styles.notificationPreview}>
              <div className={styles.notificationCard}>
                <Image src="/monzo-logo.png" alt="" width={40} height={40} />
                <div><p className={styles.notificationMeta}>Monzo <span>Example</span></p><p className={styles.notificationTitle}>🎉 £50.00 deposited</p><p className={styles.notificationMessage}>Into your Rainy day Pot</p></div>
              </div>
              <figcaption>Example notification</figcaption>
            </figure>
          </div>
        </section>

        <section id="access" className={styles.accessSection} aria-labelledby="access-heading">
          <ScrollReveal className={styles.accessIntro}>
            <p className={styles.eyebrow}>Get started</p>
            <h2 id="access-heading">Get access to Schedzo.</h2>
            <p>It&apos;s free to join, with manual setup for a small number of people.</p>
            <ol className={styles.accessSteps}>
              <li><span>1</span><div><strong>Find your Monzo user ID</strong><p>Sign in to the Monzo developer portal to find it.</p></div></li>
              <li><span>2</span><div><strong>Send me an email</strong><p>Include your user ID so I can help get you set up.</p></div></li>
              <li><span>3</span><div><strong>Use Schedzo with your account</strong><p>No need to host anything yourself.</p></div></li>
            </ol>
          </ScrollReveal>
          <ScrollReveal className={styles.accessCard}>
            <h3>Request access</h3>
            <p>Email your Monzo user ID and I&apos;ll help you get set up.</p>
            <a className={styles.primaryLink} href="mailto:join@schedzo.app?subject=Schedzo%20access%20request">Email to request access <EmailIcon /></a>
            <p className={styles.joinEmail}>Or copy: <CopyableContent value="join@schedzo.app">join@schedzo.app</CopyableContent></p>
            <p className={styles.joinNote}>Already have access? <a href="/console">Go to console.</a></p>
          </ScrollReveal>
        </section>

        <section id="faq" className={styles.faqSection} aria-labelledby="faq-heading">
          <ScrollReveal className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Before you get started</p>
            <h2 id="faq-heading">A few quick answers.</h2>
          </ScrollReveal>
          <div className={styles.faqList}>
            <article><h3>Can I try it without a Monzo account?</h3><p>Yes. The demo uses sample accounts and pots, and no real money moves.</p></article>
            <article><h3>Do I need to host anything?</h3><p>No. You can use Schedzo here with your own Monzo account.</p></article>
            <article><h3>What should I include in my request?</h3><p>Include your Monzo user ID from the developer portal so I can help you get set up.</p></article>
            <article><h3>Is there a limit on schedules?</h3><p>There is no limit on the number of scheduled transfers you can create.</p></article>
          </div>
        </section>

        <section id="story" className={styles.storySection} aria-labelledby="story-heading">
          <div className={styles.storyCopy}>
            <ScrollReveal>
              <p className={styles.eyebrow}>A little about the project</p>
              <h2 id="story-heading">Why I built Schedzo.</h2>
              <p>I wanted to build a small, open-source tool focused on scheduled Pot transfers, including Savings Pot withdrawals.</p>
              <p>I also wanted a small project to explore APIs in UK banking. Monzo provides APIs to move money into and out of pots, so this felt like a good place to start.</p>
              <p>Want to understand the options? <a href="/schedule-monzo-savings-pot-withdrawals">Read how to schedule withdrawals from Monzo Savings Pots.</a></p>
            </ScrollReveal>
          </div>
          <div id="code" className={styles.codeSection} aria-labelledby="code-heading">
            <ScrollReveal>
              <p className={styles.eyebrow}>Open source</p>
              <h2 id="code-heading">Explore the code.</h2>
              <p className={styles.codeDescription}>Fork it, copy it, and run it on your own server.</p>
            </ScrollReveal>
            <div className={styles.repositories}>
              <ScrollReveal><RepositoryCard href="https://github.com/wchr-aun/schedzo-ui" title="Frontend code" description="The website and console for your accounts, pots, and scheduled transfers." stack={["TypeScript", "Next.js"]} stackLabel="Frontend language and framework" license="MIT License" /></ScrollReveal>
              <ScrollReveal><RepositoryCard href="https://github.com/wchr-aun/schedzo" title="Backend code" description="The scheduler that runs your transfers and sends updates to Monzo." stack={["Python", "FastAPI"]} stackLabel="Backend language and framework" license="MIT License" /></ScrollReveal>
            </div>
          </div>
        </section>

        <section className={styles.closingSection} aria-label="Try Schedzo">
          <div><h2>See how Schedzo fits your routine.</h2><p>Explore the demo or request access for your own account.</p></div>
          <div className={styles.closingActions}><a className={styles.primaryLink} href="/demo">Try the demo <ArrowIcon /></a><a className={styles.secondaryLink} href="#access">Request access</a></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
