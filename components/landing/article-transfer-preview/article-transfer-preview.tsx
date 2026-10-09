"use client";

import { useState } from "react";
import { ConsoleClientContext } from "@/components/providers/console-client-provider";
import { DataProvider } from "@/components/providers/data-provider";
import { CreateScheduledTransfer } from "@/components/scheduled-transfers/create-scheduled-transfer/create-scheduled-transfer";
import { ScheduledTransfers } from "@/components/scheduled-transfers/scheduled-transfers/scheduled-transfers";
import { createDemoClient } from "@/lib/demo/client";
import { DEMO_ACCOUNT_ID, demoPots } from "@/lib/demo/fixtures";
import { rentExample } from "@/lib/content/instant-access-article";
import styles from "./article-transfer-preview.module.css";

const samplePot = demoPots.find((pot) => !pot.deleted && pot.type === "instant_access")!;

export function ArticleTransferPreview() {
  const [client] = useState(() => createDemoClient(undefined, { emptyHistory: true }));

  return (
    <ConsoleClientContext.Provider value={client}>
      <DataProvider>
        <div className={styles.preview}>
          <CreateScheduledTransfer
            accountId={DEMO_ACCOUNT_ID}
            potId={samplePot.id}
            currency={samplePot.currency}
            initiallyExpanded
            initialTransferType="withdraw"
            initialAmount={String(rentExample.amount)}
          />
          <ScheduledTransfers
            accountId={DEMO_ACCOUNT_ID}
            potId={samplePot.id}
            hideFiltersWhenEmpty
            emptyMessage="Create a sample withdrawal to see it here."
          />
        </div>
      </DataProvider>
    </ConsoleClientContext.Provider>
  );
}
