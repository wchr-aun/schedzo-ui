import type {ScheduledTransfer} from "@/lib/scheduled-transfers/types";
import {PaymentFlow} from "@/components/landing/payment-flow/payment-flow";
import styles from "./payment-flow-example.module.css";

export function PaymentFlowExample({transfer, heading, animated = true, potName}: {
  transfer: ScheduledTransfer;
  heading: string;
  animated?: boolean;
  potName?: string;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.example}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The rent example</p>
          <h3 className={styles.heading}>{heading}</h3>
          <ol className={styles.summary}>
            <li><strong>Schedule the withdrawal.</strong><span>Choose when Schedzo should move the rent money from your Savings Pot back to your main balance.</span></li>
            <li><strong>The money moves back.</strong><span>Schedzo runs the withdrawal at the scheduled time, making the money available in your main balance.</span></li>
            <li><strong>Monzo handles the rent payment.</strong><span>Your rent payment stays arranged separately in Monzo and comes from that balance.</span></li>
          </ol>
          <p className={styles.note}>An illustration using sample data. No real money moves.</p>
        </div>
        <div className={styles.preview}>
          <PaymentFlow transfer={transfer} potName={potName} animated={animated} />
        </div>
      </div>
    </div>
  );
}
