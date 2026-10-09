import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import useSWR, { SWRConfig } from "swr";
import { ToastProvider } from "@/components/providers/toast-provider/toast-provider";
import { DEMO_ACCOUNT_ID } from "@/lib/demo/fixtures";
import { getScheduledTransfersPageKey } from "@/lib/scheduled-transfers/keys";
import { defaultScheduledTransferStatuses } from "@/lib/scheduled-transfers/types";
import { ArticleTransferPreview } from "./article-transfer-preview";

afterEach(() => vi.unstubAllGlobals());

function fillWithdrawal() {
  fireEvent.change(screen.getByLabelText("UK date and time"), {
    target: { value: "2099-01-14T09:00" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create scheduled transfer" }));
}

describe("article transfer preview", () => {
  it("creates and cancels a sample withdrawal without requests or changing the surrounding cache", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const key = getScheduledTransfersPageKey(
      DEMO_ACCOUNT_ID, "pot_demo_savings", defaultScheduledTransferStatuses, 0,
    );
    const existingPage = { scheduledTransfers: [], total: 42, limit: 50, offset: 0 };
    const cache = new Map([[key, { data: existingPage }]]);
    function ExistingCache() {
      const { data } = useSWR(key);
      return <p>Existing cache total: {data?.total}</p>;
    }

    render(
      <ToastProvider>
        <SWRConfig value={{ provider: () => cache }}>
          <ExistingCache />
          <ArticleTransferPreview />
        </SWRConfig>
      </ToastProvider>,
    );
    expect(await screen.findByText("Create a sample withdrawal to see it here.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Do it later" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByLabelText("Interval")).toHaveTextContent("Monthly");
    expect(screen.getByLabelText("Transfer type")).toHaveTextContent("Withdraw from pot");
    expect(screen.getByLabelText("Amount (pence)")).toHaveValue("227300");
    expect(screen.queryByRole("button", { name: /status.*selected/i })).not.toBeInTheDocument();
    fillWithdrawal();
    const result = await screen.findByRole("button", {
      name: "Show details for transfer demo_created_transfer_1",
    });
    expect(result.closest("li")).toHaveTextContent("Monthly withdrawal");
    expect(result.closest("li")).toHaveTextContent("£2,273.00");
    expect(await screen.findByText("Scheduled transfer created.")).toHaveAttribute("role", "status");
    expect(screen.getByRole("button", { name: /status.*3 selected/i })).toBeInTheDocument();

    fireEvent.click(result);
    fireEvent.click(screen.getByRole("button", { name: "Cancel transfer demo_created_transfer_1" }));
    await waitFor(() => expect(screen.queryByRole("button", {
      name: "Hide details for transfer demo_created_transfer_1",
    })).not.toBeInTheDocument());
    expect(await screen.findByText("Create a sample withdrawal to see it here.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /status.*selected/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Schedule a transfer" }));
    expect(screen.getByLabelText("Transfer type")).toHaveTextContent("Withdraw from pot");
    expect(screen.getByLabelText("Amount (pence)")).toHaveValue("227300");
    expect(screen.getByText("Existing cache total: 42")).toBeInTheDocument();
    expect(cache.get(key)?.data).toBe(existingPage);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("resets the sample history when the preview is mounted again", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const view = render(<ToastProvider><ArticleTransferPreview /></ToastProvider>);
    await screen.findByText("Create a sample withdrawal to see it here.");
    fillWithdrawal();
    await screen.findByRole("button", { name: "Show details for transfer demo_created_transfer_1" });
    view.unmount();
    render(<ToastProvider><ArticleTransferPreview /></ToastProvider>);
    expect(await screen.findByText("Create a sample withdrawal to see it here.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the filter available when the selected statuses hide a sample transfer", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ToastProvider><ArticleTransferPreview /></ToastProvider>);
    await screen.findByText("Create a sample withdrawal to see it here.");
    fillWithdrawal();
    await screen.findByRole("button", { name: "Show details for transfer demo_created_transfer_1" });
    fireEvent.click(screen.getByRole("button", { name: /status.*3 selected/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: "pending" }));
    expect(await screen.findByText("Create a sample withdrawal to see it here.", {}, { timeout: 2500 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /status.*2 selected/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "pending" }));
    expect(await screen.findByRole("button", { name: "Show details for transfer demo_created_transfer_1" }, { timeout: 2500 })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
