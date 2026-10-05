"use client";

import { request } from "@/lib/errors/request";
import {Button} from "@/components/ui/button/button";
import {useToast} from "@/components/providers/toast-provider/toast-provider";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useSWRConfig} from "swr";

export function LogoutButton({ onLogout, className }: { onLogout?: () => void; className?: string }) {
  const router = useRouter();
  const { cache, mutate } = useSWRConfig();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  async function logout() {
    if (onLogout) {
      onLogout();
      return;
    }
    setIsLoggingOut(true);
    const toastId = toast.show({ tone: "progress", message: "Logging out…" });

    async function clearPrivateData() {
      await mutate(() => true, undefined, { revalidate: false });
      for (const key of Array.from(cache.keys())) cache.delete(key);
    }

    try {
      await request("/api/auth/logout", { method: "POST" }, "log out", false);
      await clearPrivateData();
      toast.update(toastId, { tone: "success", colour: "info", message: "Logged out." });
      router.refresh();
    } catch (error) {
      await clearPrivateData();
      router.refresh();
      toast.reportError(error, { operation: "log out", toastId });
      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      className={className}
      variant="danger"
      type="button"
      aria-label={isLoggingOut ? "Logging out…" : "Log out"}
      disabled={isLoggingOut}
      onClick={() => void logout()}
    >
      {isLoggingOut ? "Logging out…" : "Log out"}
    </Button>
  );
}
