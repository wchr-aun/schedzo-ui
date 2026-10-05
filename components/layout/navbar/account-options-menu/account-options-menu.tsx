"use client";

import { useEffect, useRef } from "react";
import { DisconnectButton } from "@/components/auth/disconnect-button/disconnect-button";
import { LogoutButton } from "@/components/auth/logout-button/logout-button";
import { MoreVerticalIcon } from "@/components/ui/icons/more-vertical-icon";
import styles from "./account-options-menu.module.css";

export function AccountOptionsMenu({
  onLogout,
  showDisconnect = true,
}: {
  onLogout?: () => void;
  showDisconnect?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function positionPanel() {
    const details = detailsRef.current;
    const panel = panelRef.current;
    const trigger = details?.querySelector("summary");
    if (!details?.open || !panel || !trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    const edgePadding = 12;
    const left = Math.max(
      edgePadding,
      Math.min(triggerRect.left, window.innerWidth - panelWidth - edgePadding),
    );
    const caretLeft = triggerRect.left + triggerRect.width / 2 - left;

    panel.style.left = `${left}px`;
    panel.style.top = `${triggerRect.bottom + 8}px`;
    panel.style.setProperty("--menu-caret-left", `${caretLeft}px`);
    panel.style.visibility = "visible";
  }

  function handleToggle() {
    const panel = panelRef.current;
    if (!detailsRef.current?.open) {
      if (panel) panel.style.visibility = "hidden";
      return;
    }
    window.requestAnimationFrame(positionPanel);
  }

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      const details = detailsRef.current;
      if (details && !details.contains(event.target as Node)) details.open = false;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current.open = false;
      }
    }

    function repositionOnViewportChange() {
      positionPanel();
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", repositionOnViewportChange);
    window.addEventListener("scroll", repositionOnViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", repositionOnViewportChange);
      window.removeEventListener("scroll", repositionOnViewportChange, true);
    };
  }, []);

  return (
    <details ref={detailsRef} className={styles.menu} onToggle={handleToggle}>
      <summary aria-label="More options" title="More options">
        <MoreVerticalIcon />
      </summary>
      <div ref={panelRef} className={styles.panel}>
        <LogoutButton onLogout={onLogout} className={styles.option} />
        {showDisconnect ? (
          <>
            <hr className={styles.divider} />
            <DisconnectButton className={styles.option} />
          </>
        ) : null}
      </div>
    </details>
  );
}
