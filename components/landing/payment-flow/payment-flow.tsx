"use client";

import {useEffect, useId, useState, type CSSProperties} from "react";
import {useScrollReveal} from "@/lib/animation/use-scroll-reveal";
import {ArrowIcon} from "@/components/ui/icons/arrow-icon";
import {ScheduledTransferCard} from "@/components/scheduled-transfers/scheduled-transfer-card/scheduled-transfer-card";
import type {ScheduledTransfer} from "@/lib/scheduled-transfers/types";
import {MonzoTransaction} from "@/components/landing/monzo-transaction/monzo-transaction";
import revealStyles from "@/components/ui/scroll-reveal/scroll-reveal.module.css";
import {paymentFlowStageDuration, usePaymentFlowPlayback, type PaymentFlowStage} from "./use-payment-flow-playback";
import styles from "./payment-flow.module.css";

type PaymentFlowProps = {
  transfer: ScheduledTransfer;
  potName?: string;
  animated?: boolean;
};

type FlowContentProps = {transfer: ScheduledTransfer; potName: string};

const stages: {stage: PaymentFlowStage; label: string; replayLabel: string; status: string}[] = [
  {stage: 1, label: "Schedzo · Pot withdrawal", replayLabel: "Withdrawal due soon", status: "Withdrawal executing soon"},
  {stage: 2, label: "Schedzo · Transfer update", replayLabel: "Transfer completed", status: "Transfer completed · Main balance funded"},
  {stage: 3, label: "Monzo · Scheduled payment", replayLabel: "Rent sent to landlord", status: "Rent sent to landlord"},
];

export function PaymentFlow({transfer, potName = "Rainy day", animated = true}: PaymentFlowProps) {
  return animated
    ? <AnimatedPaymentFlow transfer={transfer} potName={potName} />
    : <PaymentFlowView transfer={transfer} potName={potName} />;
}

function AnimatedPaymentFlow({transfer, potName}: FlowContentProps) {
  const reveal = useScrollReveal<HTMLElement>();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = reveal.ref.current;
    if (!element || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.1);
    }, {threshold: 0.1, rootMargin: "-80px 0px 0px 0px"});
    observer.observe(element);
    return () => observer.disconnect();
  }, [reveal.ref]);

  const playback = usePaymentFlowPlayback({
    entered: reveal.entered,
    inView,
    reducedMotion: reveal.reducedMotion,
    scheduledFor: transfer.scheduled_for,
  });

  return <PaymentFlowView transfer={transfer} potName={potName} reveal={reveal} playback={playback} />;
}

function PaymentFlowView({transfer, potName, reveal, playback}: FlowContentProps & {
  reveal?: ReturnType<typeof useScrollReveal<HTMLElement>>;
  playback?: ReturnType<typeof usePaymentFlowPlayback>;
}) {
  const stepsId = useId();
  const visibleStage = playback?.stage ?? 3;
  const scheduledFor = playback?.scheduledFor ?? transfer.scheduled_for;
  const animate = Boolean(playback && !playback.reducedMotion);
  const previewTransfer: ScheduledTransfer = {
    ...transfer,
    scheduled_for: scheduledFor,
    status: visibleStage === 1 ? "pending" : "completed",
    executed_at: visibleStage === 1 ? null : scheduledFor,
  };

  return (
    <figure
      ref={reveal?.ref}
      className={reveal ? `${styles.flow} ${revealStyles.reveal}` : styles.flow}
      style={{"--flow-stage-duration": `${paymentFlowStageDuration}ms`} as CSSProperties}
      data-hidden={reveal?.hidden}
      data-entered={reveal?.entered}
      data-static={!playback || undefined}
      aria-label="Example of a pot withdrawal followed by a payment scheduled in Monzo"
    >
      <div className={styles.player} data-static={!playback || undefined}>
        <ol id={stepsId} className={styles.steps}>
          {stages.filter(({stage}) => stage <= visibleStage).map(({stage, label, status}) => (
            <li key={stage}>
              <p className={styles.stepLabel}>{label}</p>
              {stage === 1 ? (
                <fieldset className={styles.transferPreview} disabled inert aria-label="Example scheduled withdrawal">
                  <ul><ScheduledTransferCard transfer={previewTransfer} cancelling={false} onCancel={() => undefined} /></ul>
                </fieldset>
              ) : stage === 2 ? (
                <MonzoTransaction key={`transfer-${playback?.playback}`} revealTrigger="mount" animate={animate} kind="transfer" amount={transfer.amount} potName={potName} />
              ) : (
                <MonzoTransaction key={`payment-${playback?.playback}`} revealTrigger="mount" animate={animate} kind="payment" amount={transfer.amount} recipient="Landlord" initials="L" reference="Rent" />
              )}
              {playback ? (
                <div className={styles.explanation}>
                  <p role={visibleStage === stage ? "status" : undefined}>
                    Step {stage} of 3 · {stage === 1 && visibleStage > 1 ? "Withdrawal completed" : status}
                  </p>
                  {visibleStage === stage && stage < 3 && !playback.reducedMotion ? (
                    <div className={styles.countdown} aria-live="off">
                      <span>{playback.started ? `Next step in ${playback.secondsRemaining}s` : "Plays automatically when in view"}</span>
                      {playback.started && playback.inView ? <span className={styles.countdownTrack} aria-hidden="true"><span key={`${stage}-${playback.playback}`} /></span> : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {stage < visibleStage ? <div className={styles.arrow} aria-hidden="true"><ArrowIcon direction="down" /></div> : null}
            </li>
          ))}
        </ol>
        {playback ? (
          <div className={styles.controls} role="group" aria-label="Replay payment flow">
            {stages.map(({stage, replayLabel}) => (
              <button key={stage} type="button" aria-label={`Replay step ${stage}: ${replayLabel}`}
                aria-pressed={visibleStage === stage} aria-controls={stepsId} onClick={() => playback.replay(stage)}>
                {stage}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {visibleStage === 3 ? <figcaption>{playback ? "One less thing to remember." : "Savings Pot withdrawal followed by a scheduled Monzo payment."}</figcaption> : null}
    </figure>
  );
}
