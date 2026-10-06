"use client";

import {useEffect, useState, type ReactNode} from "react";
import styles from "./copyable-content.module.css";

export function CopyableContent({value, children, className = ""}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <span className={`${styles.container} ${className}`}>
      <button type="button" className={styles.button} onClick={copy}>
        {children}
        {status === "copied" ? (
          <svg aria-hidden="true" className={styles.icon} viewBox="0 0 20 20" fill="none">
            <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" className={styles.icon} viewBox="0 0 20 20" fill="none">
            <rect x="7" y="7" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v8A1.5 1.5 0 0 0 4.5 14H7" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </button>
      <span className={styles.status} role="status">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Couldn’t copy. Please try again." : ""}
      </span>
    </span>
  );
}
