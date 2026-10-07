"use client";

import {useEffect, useReducer} from "react";

export type PaymentFlowStage = 1 | 2 | 3;
export const paymentFlowStageDuration = 2_000;
const stageSeconds = paymentFlowStageDuration / 1_000;

type PlaybackState = {
  stage: PaymentFlowStage;
  started: boolean;
  playback: number;
  scheduledFor: string;
  secondsRemaining: number;
};

type PlaybackAction =
  | {type: "start"; scheduledFor: string; reducedMotion: boolean}
  | {type: "replay"; stage: PaymentFlowStage; scheduledFor: string}
  | {type: "tick"}
  | {type: "advance"}
  | {type: "restartCountdown"}
  | {type: "reduceMotion"};

function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case "start":
      if (state.started) return state;
      return {
        ...state,
        started: true,
        stage: action.reducedMotion ? 3 : 1,
        scheduledFor: action.scheduledFor,
        secondsRemaining: action.reducedMotion ? 0 : stageSeconds,
      };
    case "replay":
      return {
        ...state,
        started: true,
        stage: action.stage,
        playback: state.playback + 1,
        scheduledFor: action.scheduledFor,
        secondsRemaining: action.stage === 3 ? 0 : stageSeconds,
      };
    case "tick":
      return {...state, secondsRemaining: Math.max(0, state.secondsRemaining - 1)};
    case "restartCountdown":
      return {...state, secondsRemaining: stageSeconds};
    case "advance":
      if (state.stage === 3) return state;
      return {...state, stage: state.stage === 1 ? 2 : 3, secondsRemaining: state.stage === 1 ? stageSeconds : 0};
    case "reduceMotion":
      return state.started ? {...state, stage: 3, secondsRemaining: 0} : state;
  }
}

export function usePaymentFlowPlayback({entered, inView, reducedMotion, scheduledFor}: {
  entered: boolean;
  inView: boolean;
  reducedMotion: boolean;
  scheduledFor: string;
}) {
  const [state, dispatch] = useReducer(playbackReducer, {
    stage: 1,
    started: false,
    playback: 0,
    scheduledFor,
    secondsRemaining: stageSeconds,
  });

  useEffect(() => {
    if (entered && !state.started) {
      dispatch({type: "start", scheduledFor: new Date().toISOString(), reducedMotion});
    }
  }, [entered, state.started, reducedMotion]);

  // A preference change completes playback; subsequent manual selections stay manual.
  useEffect(() => {
    if (reducedMotion) dispatch({type: "reduceMotion"});
  }, [reducedMotion]);

  useEffect(() => {
    if (!state.started || !inView || state.stage === 3 || reducedMotion) return;

    dispatch({type: "restartCountdown"});
    const countdown = window.setInterval(() => dispatch({type: "tick"}), 1_000);
    const timer = window.setTimeout(() => {
      window.clearInterval(countdown);
      dispatch({type: "advance"});
    }, paymentFlowStageDuration);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(timer);
    };
  }, [state.started, state.stage, state.playback, inView, reducedMotion]);

  function replay(stage: PaymentFlowStage) {
    dispatch({type: "replay", stage, scheduledFor: new Date().toISOString()});
  }

  return {...state, inView, reducedMotion, replay};
}
