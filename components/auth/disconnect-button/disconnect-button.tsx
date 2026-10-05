"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button/button";
import { useToast } from "@/components/providers/toast-provider/toast-provider";
import { request } from "@/lib/errors/request";

const WARNING = "Disconnect will revoke all access to Monzo and Schedzo, stop all scheduled transfers, and cancel all pending scheduled transfers. This will also end your session and sign you out. Continue?";

export function DisconnectButton({ className }: { className?: string }) {
  const router = useRouter();
  const { cache, mutate } = useSWRConfig();
  const toast = useToast();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  async function disconnect() {
    if (!window.confirm(WARNING)) return;

    setIsDisconnecting(true);
    const toastId = toast.show({ tone: "progress", message: "Disconnecting…" });

    async function clearPrivateData() {
      await mutate(() => true, undefined, { revalidate: false });
      for (const key of Array.from(cache.keys())) cache.delete(key);
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        // Storage can be unavailable in restricted browser contexts.
      }
    }

    await clearPrivateData();
    try {
      await request("/api/auth/disconnect", { method: "POST" }, "revoke access", false);
      toast.update(toastId, { tone: "success", colour: "info", message: "Disconnected. You are signed out." });
    } catch (error) {
      toast.reportError(error, { operation: "revoke access", toastId });
    } finally {
      router.refresh();
    }
  }

  return (
    <Button
      className={className}
      variant="danger"
      type="button"
      disabled={isDisconnecting}
      onClick={() => void disconnect()}
    >
      {isDisconnecting ? "Disconnecting…" : "Disconnect"}
    </Button>
  );
}
