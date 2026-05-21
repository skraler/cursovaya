import { createInitialState } from './AppState.js';
import { reduce } from './actions.js';

/**
 * @typedef {(state: import('./AppState.js').AppState, action: string) => void} StoreListener
 */

/**
 * @param {import('./AppState.js').AppState} [initialState]
 */
export function createStore(initialState = createInitialState()) {
  /** @type {import('./AppState.js').AppState} */
  let state = initialState;
  /** @type {Set<StoreListener>} */
  const listeners = new Set();

  return {
    getState() {
      return state;
    },

    /**
     * @param {StoreListener} listener
     * @returns {() => void}
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * @param {string} type
     * @param {unknown} [payload]
     */
    dispatch(type, payload) {
      state = reduce(state, type, payload);
      listeners.forEach((listener) => listener(state, type));
      return state;
    },
  };
}
