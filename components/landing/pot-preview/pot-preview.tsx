import styles from "./pot-preview.module.css";

export function PotPreview() {
  return (
    <figure className={styles.preview} aria-label="Sample Monzo Pot with upcoming scheduled transfers">
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.phone}>
        <div className={styles.statusBar} aria-hidden="true"><span>9:41</span><span className={styles.camera} /></div>
        <div className={styles.screen}>
          <p className={styles.label}>Savings Pot</p>
          <h2>Rainy day</h2>
          <div className={styles.balance}><span>Pot balance</span><strong>£5,549.54</strong></div>
          <div className={styles.transfersHeading}><h3>Upcoming transfers</h3><span>2</span></div>
          <ul className={styles.transferList}>
            <li><span className={styles.amountIn}>+ £50.00</span><span className={styles.status}>Pending</span><strong>Weekly deposit</strong><span className={styles.transferMeta}>Into Rainy day · Weekly</span></li>
            <li><span className={styles.amountOut}>− £25.00</span><span className={styles.status}>Pending</span><strong>Monthly withdrawal</strong><span className={styles.transferMeta}>To main balance · Monthly</span></li>
          </ul>
        </div>
        <div className={styles.homeIndicator} aria-hidden="true" />
      </div>
    </figure>
  );
}
