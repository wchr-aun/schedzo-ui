import type { ScheduledTransfer } from "@/lib/scheduled-transfers/types";

export const instantAccessArticle = {
  path: "/schedule-monzo-savings-pot-withdrawals",
  title: "Schedule Monzo Instant Access Savings withdrawals | Schedzo",
  headline: "How to schedule withdrawals from Monzo Instant Access Savings Pots",
  description: "Can you schedule withdrawals from Monzo Instant Access Savings Pots? Compare manual withdrawals, IFTTT and free Schedzo, with a monthly withdrawal walkthrough.",
  modifiedDate: "2026-10-10",
  author: { name: "Aun", url: "https://github.com/wchr-aun" },
  imagePath: "/schedule-monzo-savings-pot-withdrawals/opengraph-image.png",
  imageAlt: "Schedule Monzo Instant Access Savings withdrawals: compare manual withdrawals, IFTTT and Schedzo.",
} as const;

export const rentExample = {
  amount: 227_300,
  days: 16,
  potName: "Rent savings",
  setAsideDate: "2026-09-28",
  withdrawalDate: "2026-10-14",
  paymentDate: "2026-10-15",
} as const;

export const rentExampleTransfer: ScheduledTransfer = {
  setup_id: "article-monthly-withdrawal",
  transfer_id: "article-monthly-withdrawal-1",
  status: "pending",
  created_at: "2026-09-28T09:00:00+01:00",
  executed_at: null,
  scheduled_for: "2026-10-14T09:00:00+01:00",
  interval: "monthly",
  type: "withdrawal",
  amount: rentExample.amount,
};
