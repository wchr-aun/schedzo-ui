import type {ReactNode} from "react";
import type {ScheduledTransfer} from "@/lib/scheduled-transfers/types";
import {PaymentFlowPreview} from "./payment-flow-preview";
import {ScrollReveal} from "@/components/ui/scroll-reveal/scroll-reveal";
import styles from "./payment-flow-example.module.css";

const defaultExplanation = {
  steps: [
    {title: "Schedule the withdrawal.", description: "Choose when Schedzo should move the rent money from your Savings Pot back to your main balance."},
    {title: "The money moves back.", description: "Schedzo runs the withdrawal at the scheduled time, making the money available in your main balance."},
    {title: "Monzo handles the rent payment.", description: "Your rent payment stays arranged separately in Monzo and comes from that balance."},
  ],
  note: "An illustration using sample data. No real money moves.",
};

export function PaymentFlowExample({transfer, heading, animated = true, contained = false, potName, presentation = "standard", explanation = defaultExplanation}: {
  transfer: ScheduledTransfer;
  heading: ReactNode;
  animated?: boolean;
  contained?: boolean;
  potName?: string;
  presentation?: "standard" | "compact";
  explanation?: {steps: readonly {title: string; description: string}[]; note: string};
}) {
  const copy = (
    <>
      <p className={styles.eyebrow}>The rent example</p>
      <h3 className={styles.heading}>{heading}</h3>
      <ol className={styles.summary}>
        {explanation.steps.map(({title, description}) => (
          <li key={title}><strong>{title}</strong><span>{description}</span></li>
        ))}
      </ol>
      <p className={styles.note}>{explanation.note}</p>
    </>
  );

  return (
    <div className={styles.container}>
      <div className={`${styles.example}${presentation === "compact" ? ` ${styles.compact}` : ""}`}>
        {animated
          ? <ScrollReveal className={styles.copy}>{copy}</ScrollReveal>
          : <div className={styles.copy}>{copy}</div>}
        <div className={styles.preview} data-contained={contained || undefined}>
          <PaymentFlowPreview transfer={transfer} potName={potName} animated={animated} contained={contained} />
        </div>
      </div>
    </div>
  );
}
