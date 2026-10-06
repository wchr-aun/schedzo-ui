import {THEME_STORAGE_KEY} from "@/lib/theme/constants";
import type {Metadata} from "next";
import type {ReactNode} from "react";
import "./globals.css";
import {ToastProvider} from "@/components/providers/toast-provider/toast-provider";
import {headers} from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL("https://schedzo.app"),
  title: "Schedzo – Schedule Transfers To & From Monzo Pots",
  description:
    "Schedule automatic transfers into and out of your Monzo pots, including Savings Pot withdrawals. Automate bills and keep money in savings until you need it.",
  openGraph: {
    title: "Schedzo – Schedule Transfers To & From Monzo Pots",
    description: "Schedule automatic transfers into and out of your Monzo pots, including Savings Pot withdrawals.",
    url: "https://schedzo.app/",
    siteName: "Schedzo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Schedzo – Schedule Transfers To & From Monzo Pots",
    description: "Schedule automatic transfers into and out of your Monzo pots, including Savings Pot withdrawals.",
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
  },
};

const themeInitializationScript = `
  try {
    const storedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (storedTheme === "light" || storedTheme === "dark") {
      document.documentElement.dataset.theme = storedTheme;
    }
  } catch {
    // Report once the toast provider mounts; CSS still follows the system theme.
    document.documentElement.dataset.themeStorageUnavailable = "true";
  }
`;

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
