"use client";

import {useId, useState} from "react";
import {Money} from "@/components/ui/money/money";
import styles from "./savings-interest-calculator.module.css";

const startingAmount = 2_273;
const startingRate = 2.75;
const startingDays = 17;

export function SavingsInterestCalculator() {
  const id = useId();
  const [amount, setAmount] = useState(String(startingAmount));
  const [rate, setRate] = useState(String(startingRate));
  const [days, setDays] = useState(String(startingDays));

  const principal = Number(amount);
  const annualRate = Number(rate);
  const periodDays = Number(days);
  const amountError = amount.trim() === ""
    ? "Enter a monthly rent amount."
    : !Number.isFinite(principal) || principal < 0 || principal > 1_000_000
      ? "Enter an amount from £0 to £1,000,000."
      : undefined;
  const rateError = rate.trim() === ""
    ? "Enter an interest rate."
    : !Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100
      ? "Enter a rate from 0% to 100%."
      : undefined;
  const daysError = days.trim() === ""
    ? "Enter the number of days."
    : !Number.isInteger(periodDays) || periodDays < 0 || periodDays > 365
      ? "Enter a whole number from 0 to 365."
      : undefined;
  const validInputs = !amountError && !rateError && !daysError;
  const interestPerPayment = validInputs
    ? principal * ((1 + annualRate / 100) ** (periodDays / 365) - 1)
    : 0;
  const annualInterest = interestPerPayment * 12;

  return (
    <div className={styles.calculatorGroup}>
      <section className={styles.calculator} aria-labelledby={`${id}-heading`}>
        <div className={styles.heading}>
          <h3 id={`${id}-heading`}>What could your rent money earn?</h3>
        </div>

        <div className={styles.fields}>
          <label htmlFor={`${id}-amount`}>
            <span>Monthly rent</span>
            <span className={styles.inputWrap}>
              <span aria-hidden="true">£</span>
              <input
                id={`${id}-amount`}
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                inputMode="decimal"
                value={amount}
                aria-invalid={Boolean(amountError)}
                aria-describedby={amountError ? `${id}-amount-error` : undefined}
                onChange={(event) => setAmount(event.target.value)}
              />
            </span>
            {amountError && <span id={`${id}-amount-error`} className={styles.fieldError}>{amountError}</span>}
          </label>
          <label htmlFor={`${id}-rate`}>
            <span>Interest rate (AER)</span>
            <span className={styles.inputWrap}>
              <input
                id={`${id}-rate`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                inputMode="decimal"
                value={rate}
                aria-invalid={Boolean(rateError)}
                aria-describedby={rateError ? `${id}-rate-error` : undefined}
                onChange={(event) => setRate(event.target.value)}
              />
              <span aria-hidden="true">%</span>
            </span>
            {rateError && <span id={`${id}-rate-error`} className={styles.fieldError}>{rateError}</span>}
          </label>
          <label htmlFor={`${id}-days`}>
            <span>Days in savings</span>
            <span className={styles.inputWrap}>
              <input
                id={`${id}-days`}
                type="number"
                min="0"
                max="365"
                step="1"
                inputMode="numeric"
                value={days}
                aria-invalid={Boolean(daysError)}
                aria-describedby={daysError ? `${id}-days-error` : undefined}
                onChange={(event) => setDays(event.target.value)}
              />
              <span>days</span>
            </span>
            {daysError && <span id={`${id}-days-error`} className={styles.fieldError}>{daysError}</span>}
          </label>
        </div>

        <div className={styles.result}>
          <span className={styles.resultLabel}>Estimated extra interest per year</span>
          <output aria-live="polite" aria-atomic="true">
            {validInputs ? <Money amount={Math.round(annualInterest * 100)} currency="GBP" label="estimated yearly interest" /> : "—"}
          </output>
          <span className={styles.monthlyResult}>
            {validInputs
              ? <>About £{(Math.round(interestPerPayment * 100) / 100).toFixed(2)} per monthly rent payment</>
              : "Enter valid figures to see an estimate."}
          </span>
        </div>
      </section>
      <p className={styles.disclaimer}>
        Assumes the same amount stays in savings for this many days each month, for 12 months. Illustrative estimate before tax.
      </p>
    </div>
  );
}
