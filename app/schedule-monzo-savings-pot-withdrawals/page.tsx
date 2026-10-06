import type {Metadata} from "next";
import {SavingsPotArticle} from "@/components/landing/savings-pot-article/savings-pot-article";

export const metadata: Metadata = {
  title: "How to Schedule Withdrawals from Monzo Savings Pots – Schedzo",
  description:
    "Monzo does not currently offer recurring withdrawals from Savings Pots in its app. Compare manual and IFTTT options, and learn how Schedzo can automate them.",
  alternates: { canonical: "/schedule-monzo-savings-pot-withdrawals" },
  openGraph: {
    title: "How to Schedule Withdrawals from Monzo Savings Pots | Schedzo",
    description:
      "Compare ways to schedule withdrawals from Monzo Savings Pots, including manual transfers, IFTTT, and Schedzo.",
    url: "https://schedzo.app/schedule-monzo-savings-pot-withdrawals",
    siteName: "Schedzo",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "How to Schedule Withdrawals from Monzo Savings Pots | Schedzo",
    description:
      "Compare ways to schedule withdrawals from Monzo Savings Pots, including manual transfers, IFTTT, and Schedzo.",
  },
};

export default function SavingsPotWithdrawalsPage() {
  return <SavingsPotArticle />;
}
