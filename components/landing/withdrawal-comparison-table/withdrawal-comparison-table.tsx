import styles from "./withdrawal-comparison-table.module.css";

export function WithdrawalComparisonTable() {
  return (
    <>
      <p id="comparison-scroll-hint" className={styles.scrollHint}>Scroll sideways to compare <strong>Manual → IFTTT → Schedzo</strong>.</p>
      <div className={styles.tableScroll} role="region" aria-labelledby="comparison-caption" aria-describedby="comparison-scroll-hint" tabIndex={0}>
        <table className={styles.table}>
          <caption id="comparison-caption">Manual, IFTTT and Schedzo</caption>
          <thead><tr><th scope="col">Feature</th><th scope="col">Manual</th><th scope="col">IFTTT</th><th scope="col">Schedzo</th></tr></thead>
          <tbody>
            <tr><th scope="row">Setup</th><td>Withdraw in Monzo.</td><td>Connect Monzo; create an Applet.</td><td>Connect Monzo; choose a Pot and schedule.</td></tr>
            <tr><th scope="row">Repeats</th><td>Do it yourself each time.</td><td>Daily, weekly or monthly time triggers.</td><td>Daily, weekly or monthly.</td></tr>
            <tr><th scope="row">Pot access</th><td>Your Instant Access Pot.</td><td>Must appear in the withdrawal action.</td><td>Instant Access supported; added-security Pots excluded.</td></tr>
            <tr><th scope="row">Timing</th><td>When you withdraw.</td><td>Polling: hourly on Free; every 5 minutes on Pro/Pro+.</td><td>UK date and time; leave a buffer.</td></tr>
            <tr><th scope="row">Cost</th><td>No automation subscription.</td><td>Free, or paid monthly/yearly.</td><td><strong>Free.</strong></td></tr>
            <tr><th scope="row">Schedules</th><td>No automated schedules.</td><td>Free: 2 Applets. Pro: 20. Pro+: unlimited.</td><td>50 active schedules per user.</td></tr>
            <tr><th scope="row">Cancel</th><td>Nothing queued to cancel.</td><td>Disable the Applet; check any run in progress.</td><td>Cancel the schedule&apos;s future withdrawals.</td></tr>
            <tr><th scope="row">If it fails</th><td>Check your balance before retrying.</td><td>Check Applet activity and errors.</td><td>Check status and balance. Future occurrences continue.</td></tr>
            <tr><th scope="row">Notifications</th><td>Check Monzo.</td><td>Optional run/failure alerts in IFTTT.</td><td>Transfer success/failure updates in Monzo, when connected.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
