import { ActionTypes } from '../state/index.js';

export const ANIMATION_STEP_MS = 700;

/**
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 */
export function createAnimationController(store) {
  /** @type {ReturnType<typeof setInterval> | null} */
  let timerId = null;

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function scheduleTicks() {
    clearTimer();
    timerId = setInterval(() => {
      const state = store.getState();
      if (!state.animation.isPlaying) {
        clearTimer();
        return;
      }

      const edgeIds = state.routeResult?.fullPathEdgeIds ?? [];
      const nextStep = state.animation.stepIndex + 1;

      store.dispatch(ActionTypes.ANIMATION_TICK);

      if (nextStep >= edgeIds.length) {
        clearTimer();
      }
    }, ANIMATION_STEP_MS);
  }

  return {
    play() {
      if (store.getState().animation.isPlaying) {
        return;
      }
      store.dispatch(ActionTypes.PLAY_ROUTE_ANIMATION);
      if (store.getState().animation.isPlaying) {
        scheduleTicks();
      }
    },

    stop() {
      clearTimer();
      store.dispatch(ActionTypes.STOP_ANIMATION);
    },

    reset() {
      this.stop();
      store.dispatch(ActionTypes.RESET_ANIMATION);
    },

    destroy() {
      clearTimer();
    },
  };
}
