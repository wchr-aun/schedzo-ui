import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {usePaymentFlowScroll} from "./use-payment-flow-scroll";

describe("usePaymentFlowScroll", () => {
  let height: number;
  let position: number;
  let resize: () => void;
  let disconnect: ReturnType<typeof vi.fn>;
  let time: number;
  let frameId: number;
  let frames: Map<number, FrameRequestCallback>;

  beforeEach(() => {
    height = 200;
    position = 0;
    time = 0;
    frameId = 0;
    frames = new Map();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
    disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: () => void) { resize = callback; }
      observe() {}
      disconnect = disconnect;
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  function tick(milliseconds: number) {
    act(() => {
      time += milliseconds;
      const pending = [...frames];
      frames.clear();
      for (const [, callback] of pending) callback(time);
    });
  }

  function setup(reducedMotion = false, stage = 1) {
    const viewport = document.createElement("div");
    Object.defineProperties(viewport, {
      scrollHeight: {get: () => height},
      clientHeight: {get: () => 200},
      scrollTop: {get: () => position, set: value => { position = Math.max(0, Math.min(height - 200, value)); }},
    });
    const content = document.createElement("ol");
    const hook = renderHook(props => {
      const scroll = usePaymentFlowScroll(props);
      scroll.viewportRef.current = viewport;
      scroll.contentRef.current = content;
      return scroll;
    }, {initialProps: {enabled: true, stage, playback: 0, reducedMotion}});
    return {...hook, viewport, content};
  }

  it("shows only the cues for content hidden above or below, with tolerance at the ends", () => {
    const {result} = setup(true);
    expect(result.current).toMatchObject({above: false, below: false});
    act(() => { height = 600; resize(); });
    expect(result.current).toMatchObject({above: false, below: true});
    act(() => { position = 150; result.current.onScroll(); });
    expect(result.current).toMatchObject({above: true, below: true});
    act(() => { position = 399.5; result.current.onScroll(); });
    expect(result.current).toMatchObject({above: true, below: false});
    act(() => { height = 200; position = 0; resize(); });
    expect(result.current).toMatchObject({above: false, below: false});
  });

  it("follows new steps and resizing, lets readers stay behind, and resumes at the bottom", () => {
    const {result, rerender} = setup();
    height = 450;
    rerender({enabled: true, stage: 2, playback: 0, reducedMotion: false});
    tick(0);
    tick(1_000);
    expect(position).toBe(250);
    act(() => { height = 500; resize(); });
    expect(position).toBe(300);

    act(() => { result.current.stopFollowing(); position = 40; result.current.onScroll(); });
    height = 650;
    rerender({enabled: true, stage: 3, playback: 0, reducedMotion: false});
    expect(position).toBe(40);
    expect(result.current).toMatchObject({above: true, below: true});
    act(() => { height = 700; resize(); });
    expect(position).toBe(40);

    act(() => { position = 500; result.current.onScroll(); height = 750; resize(); });
    expect(position).toBe(550);
  });

  it("eases toward the new step over time and stops immediately for manual scrolling", () => {
    const {result, rerender} = setup();
    height = 600;
    rerender({enabled: true, stage: 2, playback: 0, reducedMotion: false});
    expect(position).toBe(0);
    act(() => resize());
    expect(position).toBe(0);
    tick(0);
    tick(150);
    const early = position;
    expect(early).toBeGreaterThan(0);
    expect(early).toBeLessThan(400);
    tick(150);
    expect(position - early).toBeLessThan(early);
    tick(400);
    expect(position).toBe(400);

    height = 800;
    rerender({enabled: true, stage: 3, playback: 0, reducedMotion: false});
    tick(0);
    tick(150);
    act(() => { result.current.stopFollowing(); position = 50; result.current.onScroll(); });
    tick(600);
    expect(position).toBe(50);
    expect(frames.size).toBe(0);
  });

  it.each([[3, 1], [3, 2], [2, 1]])("animates replay from step %i back to step %i before retiring later cards", (from, to) => {
    height = 800;
    const {result, rerender, content} = setup(false, from);
    tick(0);
    tick(1_000);
    expect(position).toBe(600);

    const selected = document.createElement("div");
    selected.dataset.flowStage = String(to);
    const destination = to === 1 ? 0 : 250;
    Object.defineProperties(selected, {offsetTop: {value: destination}, offsetHeight: {value: 200}});
    content.append(selected);
    rerender({enabled: true, stage: to, playback: 1, reducedMotion: false});
    expect(position).toBe(600);
    expect(result.current.renderedStage).toBe(from);
    act(() => resize());
    expect(position).toBe(600);
    tick(0);
    tick(175);
    expect(position).toBeGreaterThan(destination);
    expect(position).toBeLessThan(600);
    expect(result.current.renderedStage).toBe(from);
    tick(1_000);
    expect(position).toBe(destination);
    expect(result.current.renderedStage).toBe(to);
  });

  it("retargets a running backward replay from its current position", () => {
    height = 800;
    const {result, rerender, content} = setup(false, 3);
    tick(0);
    tick(1_000);
    for (const [stage, offset] of [[1, 0], [2, 250]]) {
      const selected = document.createElement("div");
      selected.dataset.flowStage = String(stage);
      Object.defineProperties(selected, {offsetTop: {value: offset}, offsetHeight: {value: 200}});
      content.append(selected);
    }
    rerender({enabled: true, stage: 1, playback: 1, reducedMotion: false});
    tick(0);
    tick(175);
    const interrupted = position;
    rerender({enabled: true, stage: 2, playback: 2, reducedMotion: false});
    expect(position).toBe(interrupted);
    expect(frames.size).toBe(1);
    tick(0);
    tick(1_000);
    expect(position).toBe(250);
    expect(result.current.renderedStage).toBe(2);
  });

  it("starts reduced-motion content at the top and positions explicit, repeated replays", () => {
    const {result, rerender} = setup(true);
    height = 600;
    rerender({enabled: true, stage: 3, playback: 0, reducedMotion: true});
    expect(position).toBe(0);
    expect(result.current.below).toBe(true);
    rerender({enabled: true, stage: 3, playback: 1, reducedMotion: true});
    expect(position).toBe(400);
    act(() => { result.current.stopFollowing(); position = 50; result.current.onScroll(); });
    rerender({enabled: true, stage: 3, playback: 2, reducedMotion: true});
    expect(position).toBe(400);
    height = 200;
    rerender({enabled: true, stage: 1, playback: 3, reducedMotion: true});
    expect(position).toBe(0);
  });

  it("disconnects size observations on unmount", () => {
    const {unmount, rerender} = setup();
    height = 600;
    rerender({enabled: true, stage: 2, playback: 0, reducedMotion: false});
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalled();
  });
});
