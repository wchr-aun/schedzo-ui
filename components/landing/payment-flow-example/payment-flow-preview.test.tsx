import {act, fireEvent, render, screen, within} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {createPreviewTransfersPage} from "@/lib/scheduled-transfers/preview";
import {PaymentFlowPreview} from "./payment-flow-preview";

const observers = new Map<Element, Set<IntersectionObserverCallback>>();
let reducedMotion = false;
const preferenceListeners = new Set<() => void>();

function renderFlow(props: {animated?: boolean; potName?: string; contained?: boolean} = {}) {
  const transfer = createPreviewTransfersPage().scheduledTransfers[1];
  render(<PaymentFlowPreview transfer={{...transfer, amount: 227_300}} {...props} />);
  return screen.getByRole("figure", {name: "Example of a pot withdrawal followed by a payment scheduled in Monzo"});
}

function enter(element: Element) {
  act(() => {
    for (const callback of observers.get(element) ?? []) {
      callback([{isIntersecting: true, intersectionRatio: 1} as IntersectionObserverEntry], {} as IntersectionObserver);
    }
  });
}

function advance(milliseconds = 2_000) {
  act(() => vi.advanceTimersByTime(milliseconds));
}

describe("PaymentFlowPreview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    observers.clear();
    reducedMotion = false;
    preferenceListeners.clear();
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      get matches() { return reducedMotion; },
      addEventListener: vi.fn((_: string, callback: () => void) => preferenceListeners.add(callback)),
      removeEventListener: vi.fn((_: string, callback: () => void) => preferenceListeners.delete(callback)),
    })));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(element: Element) {
        const callbacks = observers.get(element) ?? new Set();
        callbacks.add(this.callback);
        observers.set(element, callbacks);
      }
      disconnect() {}
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("reveals the flow once and plays all stages without waiting for individual steps to enter view", () => {
    const flow = renderFlow();
    advance(10_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
    expect(within(flow).getByText("Executing soon")).toBeVisible();
    expect(within(flow).getByText("pending")).toBeVisible();
    expect(within(flow).queryByText(/withdrawn/)).not.toBeInTheDocument();
    expect(within(flow).queryByText("Landlord")).not.toBeInTheDocument();

    enter(flow);
    expect(screen.getByText("Next step in 2s")).toBeInTheDocument();
    advance(1_000);
    expect(screen.getByText("Next step in 1s")).toBeInTheDocument();
    advance(1_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");
    expect(screen.getByText("Next step in 2s")).toBeInTheDocument();
    expect(within(flow).getByText("completed")).toBeVisible();
    expect(within(flow).getByText(/withdrawn/)).toBeVisible();
    expect(within(flow).queryByText("Landlord")).not.toBeInTheDocument();

    advance();
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");
    expect(within(flow).getByText("Landlord")).toBeVisible();
    expect([...observers.keys()]).toEqual([flow]);
    expect(screen.queryByText(/Next step in/)).not.toBeInTheDocument();
    enter(flow);
    advance(10_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");
  });

  it("replays from each selected step and gives a repeated selection its full duration", () => {
    const flow = renderFlow();
    enter(flow);
    fireEvent.click(screen.getByRole("button", {name: "Replay step 3: Rent sent to landlord"}));
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");

    const first = screen.getByRole("button", {name: "Replay step 1: Withdrawal due soon"});
    fireEvent.click(first);
    advance(1_000);
    fireEvent.click(first);
    advance(500);
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(within(flow).getByText("pending")).toBeVisible();
    expect(within(flow).queryByText("Landlord")).not.toBeInTheDocument();
    advance(1_500);
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");

    fireEvent.click(screen.getByRole("button", {name: "Replay step 2: Transfer completed"}));
    advance();
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");
  });

  it("shows the complete flow on entry with reduced motion and allows manual steps", () => {
    reducedMotion = true;
    const flow = renderFlow();
    enter(flow);
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");
    fireEvent.click(screen.getByRole("button", {name: "Replay step 1: Withdrawal due soon"}));
    advance(10_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
    expect(screen.queryByText(/Next step in/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Replay step 2: Transfer completed"}));
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");
  });

  it("uses a two-second countdown on initial playback and replay", () => {
    const flow = renderFlow();
    enter(flow);
    expect(screen.getByText("Next step in 2s")).toBeInTheDocument();
    advance(1_000);
    expect(screen.getByText("Next step in 1s")).toBeInTheDocument();
    advance(999);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
    advance(1);
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");
    fireEvent.click(screen.getByRole("button", {name: "Replay step 1: Withdrawal due soon"}));
    expect(screen.getByText("Next step in 2s")).toBeInTheDocument();
    advance(1_999);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
    advance(1);
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");
  });

  it("renders the complete static example without playback or scroll setup", () => {
    const timeout = vi.spyOn(window, "setTimeout");
    const flow = renderFlow({animated: false, potName: "Rent savings"});
    expect(within(flow).getByText("completed")).toBeVisible();
    expect(within(flow).getByText("Landlord")).toBeVisible();
    expect(within(flow).getByText(/Rent savings/)).toBeVisible();
    expect(within(flow).getByText(/£2,273.00 withdrawn/)).toBeVisible();
    expect(within(flow).getByLabelText("£2,273.00 sent")).toBeVisible();
    expect(screen.queryByRole("group", {name: "Replay payment flow"})).not.toBeInTheDocument();
    expect(screen.queryByText(/Next step in/)).not.toBeInTheDocument();
    expect(observers.size).toBe(0);
    expect(screen.queryByRole("region", {name: "Payment flow steps"})).not.toBeInTheDocument();
    expect(timeout.mock.calls.some(([, delay]) => delay === 2_000)).toBe(false);
    timeout.mockRestore();
  });

  it("makes overflowing steps keyboard reachable with a directional scroll hint", () => {
    renderFlow({contained: true});
    const viewport = screen.getByRole("region", {name: "Payment flow steps"});
    expect(viewport).not.toHaveAttribute("tabindex");
    Object.defineProperties(viewport, {scrollHeight: {value: 600}, clientHeight: {value: 200}});
    fireEvent.resize(window);
    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(viewport).toHaveAccessibleDescription("Scroll to see more");
    fireEvent.wheel(viewport);
    viewport.scrollTop = 400;
    fireEvent.scroll(viewport);
    expect(viewport).toHaveAccessibleDescription("Scroll to see earlier steps");
    viewport.scrollTop = 0;
    fireEvent.scroll(viewport);
    expect(viewport).toHaveAccessibleDescription("Scroll to see more");
    expect(screen.getByRole("button", {name: "Replay step 3: Rent sent to landlord"})).toBeVisible();
    expect(viewport).not.toContainElement(screen.getByRole("group", {name: "Replay payment flow"}));
  });

  it("completes active playback when reduced motion is enabled and keeps replay manual", () => {
    const flow = renderFlow();
    enter(flow);
    advance(1_000);
    act(() => {
      reducedMotion = true;
      for (const listener of preferenceListeners) listener();
    });
    expect(screen.getByRole("status")).toHaveTextContent("Step 3 of 3");
    expect(within(flow).getByText("Landlord")).toBeVisible();
    expect(screen.queryByText(/Next step in/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Replay step 1: Withdrawal due soon"}));
    advance(10_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
  });

  it("clears active timers when unmounted", () => {
    const transfer = createPreviewTransfersPage().scheduledTransfers[1];
    const {unmount} = render(<PaymentFlowPreview transfer={transfer} />);
    const flow = screen.getByRole("figure", {name: "Example of a pot withdrawal followed by a payment scheduled in Monzo"});
    enter(flow);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("pauses offscreen playback and restarts the current stage when it returns", () => {
    const flow = renderFlow();
    enter(flow);
    advance(1_000);
    act(() => {
      for (const callback of observers.get(flow) ?? []) {
        callback([{isIntersecting: false} as IntersectionObserverEntry], {} as IntersectionObserver);
      }
    });
    advance(10_000);
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 3");
    expect(within(flow).queryByText("Landlord")).not.toBeInTheDocument();
    enter(flow);
    expect(screen.getByText("Next step in 2s")).toBeInTheDocument();
    advance();
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 3");
  });

});
