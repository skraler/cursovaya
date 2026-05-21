import { Graph } from '../graph/index.js';
import { createRoutePlan } from '../algorithms/types.js';
import { TOOL_MODES } from './toolModes.js';

/**
 * @typedef {Object} EdgeDraft
 * @property {string} fromId
 * @property {string | null} toId
 */

/**
 * @typedef {Object} AnimationState
 * @property {boolean} isPlaying
 * @property {number} stepIndex
 * @property {string | null} highlightedEdgeId
 */

/**
 * @typedef {Object} AppState
 * @property {Graph} graph
 * @property {import('./toolModes.js').ToolMode} toolMode
 * @property {import('../algorithms/types.js').RoutePlan} routePlan
 * @property {import('../algorithms/types.js').RouteResult | null} routeResult
 * @property {AnimationState} animation
 * @property {string | null} error
 * @property {EdgeDraft | null} edgeDraft
 */

/**
 * @returns {AnimationState}
 */
function createInitialAnimation() {
  return {
    isPlaying: false,
    stepIndex: 0,
    highlightedEdgeId: null,
  };
}

/**
 * @returns {AppState}
 */
export function createInitialState() {
  return {
    graph: Graph.createEmpty(),
    toolMode: TOOL_MODES.VERTEX,
    routePlan: createRoutePlan([]),
    routeResult: null,
    animation: createInitialAnimation(),
    error: null,
    edgeDraft: null,
  };
}
