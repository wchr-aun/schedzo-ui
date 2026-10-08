"use client";

import {useLayoutEffect, useRef, useState, type KeyboardEvent} from "react";

const scrollDuration = 700;

export function usePaymentFlowScroll({enabled, stage, playback, reducedMotion}: {
  enabled: boolean;
  stage: number;
  playback: number;
  reducedMotion: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLOListElement>(null);
  const followLatest = useRef(true);
  const previousPlayback = useRef(playback);
  const animationFrame = useRef<number | undefined>(undefined);
  const lastPosition = useRef(0);
  const [retainedStage, setRetainedStage] = useState(stage);
  const renderedStage = enabled ? Math.max(stage, retainedStage) : stage;
  const [edges, setEdges] = useState({above: false, below: false});

  function measure() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const maximum = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const position = Math.max(0, Math.min(maximum, viewport.scrollTop));
    lastPosition.current = position;
    const above = position > 1;
    const below = maximum - position > 1;
    setEdges(current => current.above === above && current.below === below ? current : {above, below});
    return {maximum, below};
  }

  function cancelScroll() {
    if (animationFrame.current !== undefined) window.cancelAnimationFrame(animationFrame.current);
    animationFrame.current = undefined;
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!enabled || !viewport || !content) return;

    const replayed = previousPlayback.current !== playback;
    previousPlayback.current = playback;
    if (reducedMotion) followLatest.current = false;
    if (replayed) followLatest.current = true;

    const destinationForStage = () => {
      const maximum = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
      const selected = content.querySelector<HTMLElement>(`[data-flow-stage="${stage}"]`);
      if (!selected) return maximum;
      const padding = Number.parseFloat(window.getComputedStyle(content).paddingBottom) || 0;
      return Math.max(0, Math.min(maximum, selected.offsetTop + selected.offsetHeight + padding - viewport.clientHeight));
    };

    // Keep the previous viewport position before paint. Mobile browsers may
    // otherwise adjust it as new cards and their connectors enter the layout.
    viewport.scrollTop = lastPosition.current;
    const start = viewport.scrollTop;
    const destination = destinationForStage();
    setRetainedStage(current => Math.max(current, stage));
    if (followLatest.current && Math.abs(destination - start) > 1) {
      if (reducedMotion) {
        viewport.scrollTop = destination;
        setRetainedStage(stage);
      } else {
        let startedAt: number | undefined;
        const animate = (timestamp: number) => {
          startedAt ??= timestamp;
          const progress = Math.min(1, (timestamp - startedAt) / scrollDuration);
          const eased = (1 - 2 ** (-5 * progress)) / (1 - 2 ** -5);
          // Re-read the end position so text reflow during playback stays contained.
          const target = destinationForStage();
          viewport.scrollTop = start + (target - start) * eased;
          measure();
          animationFrame.current = progress < 1 ? window.requestAnimationFrame(animate) : undefined;
          if (progress === 1) setRetainedStage(stage);
        };
        animationFrame.current = window.requestAnimationFrame(animate);
      }
    } else if (followLatest.current || reducedMotion) {
      setRetainedStage(stage);
    }
    measure();

    const update = () => {
      // Size observation must not bypass the animation when a new step mounts.
      if (followLatest.current && animationFrame.current === undefined) {
        viewport.scrollTop = destinationForStage();
      }
      measure();
    };

    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    observer?.observe(viewport);
    observer?.observe(content);
    window.addEventListener("resize", update);
    return () => {
      cancelScroll();
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [enabled, stage, playback, reducedMotion]);

  function stopFollowing() {
    cancelScroll();
    followLatest.current = false;
  }

  function onScroll() {
    const measured = measure();
    if (measured && !measured.below && measured.maximum > 1) followLatest.current = true;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) stopFollowing();
  }

  return {viewportRef, contentRef, renderedStage, ...edges, onScroll, stopFollowing, onKeyDown};
}
