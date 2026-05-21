import { ActionTypes, TOOL_MODES } from '../state/index.js';

/** @type {Record<string, string>} */
const DATA_TOOL_TO_MODE = {
  vertex: TOOL_MODES.VERTEX,
  edge: TOOL_MODES.EDGE,
  start: TOOL_MODES.START,
  waypoint: TOOL_MODES.WAYPOINT,
  finish: TOOL_MODES.FINISH,
  move: TOOL_MODES.MOVE,
  'delete-v': TOOL_MODES.DELETE_VERTEX,
  'delete-e': TOOL_MODES.DELETE_EDGE,
};

/** @type {Record<string, string>} */
export const MODE_HINTS = {
  [TOOL_MODES.VERTEX]: 'Режим: вершина — клик на холсте',
  [TOOL_MODES.EDGE]: 'Режим: ребро — клик по двум вершинам',
  [TOOL_MODES.START]: 'Режим: старт — клик по вершине',
  [TOOL_MODES.WAYPOINT]: 'Режим: остановка — клик по вершине',
  [TOOL_MODES.FINISH]: 'Режим: финиш — клик по вершине',
  [TOOL_MODES.MOVE]: 'Режим: перетащите вершину мышью',
  [TOOL_MODES.DELETE_VERTEX]: 'Режим: клик по вершине для удаления',
  [TOOL_MODES.DELETE_EDGE]: 'Режим: клик по ребру для удаления',
  clear: 'Очистка холста',
};

/**
 * @param {HTMLElement} panel
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 */
export function initToolbar(panel, store) {
  panel.querySelectorAll('.tool-btn[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dataTool = btn.dataset.tool;
      if (!dataTool) return;

      if (dataTool === 'clear') {
        if (window.confirm('Очистить холст? Граф и маршрут будут удалены.')) {
          store.dispatch(ActionTypes.CLEAR_GRAPH);
        }
        return;
      }

      const mode = DATA_TOOL_TO_MODE[dataTool];
      if (mode) {
        store.dispatch(ActionTypes.SET_TOOL_MODE, { mode });
      }
    });
  });
}

/**
 * @param {import('../state/AppState.js').AppState} state
 * @param {HTMLElement} panel
 */
export function renderToolbar(state, panel) {
  panel.querySelectorAll('.tool-btn[data-tool]').forEach((btn) => {
    const dataTool = btn.dataset.tool;
    if (dataTool === 'clear') {
      btn.classList.remove('active');
      return;
    }
    const mode = DATA_TOOL_TO_MODE[dataTool];
    btn.classList.toggle('active', mode === state.toolMode);
  });
}
