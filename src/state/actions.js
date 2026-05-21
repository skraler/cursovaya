import { GraphError } from '../graph/index.js';
import { buildRoute, RoutePlannerError } from '../algorithms/routePlanner.js';
import { ROUTE_ROLES } from './toolModes.js';

export const ActionTypes = Object.freeze({
  SET_TOOL_MODE: 'SET_TOOL_MODE',
  ADD_VERTEX: 'ADD_VERTEX',
  REMOVE_VERTEX: 'REMOVE_VERTEX',
  EDGE_FIRST_CLICK: 'EDGE_FIRST_CLICK',
  EDGE_SECOND_CLICK: 'EDGE_SECOND_CLICK',
  CONFIRM_EDGE: 'CONFIRM_EDGE',
  CANCEL_EDGE_DRAFT: 'CANCEL_EDGE_DRAFT',
  REMOVE_EDGE: 'REMOVE_EDGE',
  SET_ROUTE_POINT: 'SET_ROUTE_POINT',
  BUILD_ROUTE: 'BUILD_ROUTE',
  CLEAR_GRAPH: 'CLEAR_GRAPH',
  UPDATE_VERTEX_POSITION: 'UPDATE_VERTEX_POSITION',
  RESET_ANIMATION: 'RESET_ANIMATION',
});

/**
 * @param {import('./AppState.js').AppState} state
 * @returns {import('./AppState.js').AppState}
 */
function cloneStateShell(state) {
  return {
    ...state,
    routePlan: { pointIds: [...state.routePlan.pointIds] },
    animation: { ...state.animation },
    edgeDraft: state.edgeDraft ? { ...state.edgeDraft } : null,
  };
}

/**
 * @param {import('../graph/Graph.js').Graph} graph
 * @param {string[]} pointIds
 * @param {string} vertexId
 */
function removeFromRoutePlan(graph, pointIds, vertexId) {
  const vertex = graph.vertices.get(vertexId);
  if (vertex) {
    vertex.role = 'none';
  }
  return pointIds.filter((id) => id !== vertexId);
}

/**
 * @param {import('./AppState.js').AppState} state
 * @param {string} vertexId
 * @param {'start' | 'waypoint' | 'finish'} role
 */
function applySetRoutePoint(state, vertexId, role) {
  const graph = state.graph;
  const vertex = graph.vertices.get(vertexId);
  if (!vertex) {
    return { ...state, error: 'Вершина не найдена' };
  }

  let pointIds = [...state.routePlan.pointIds];

  for (const v of graph.vertices.values()) {
    if (v.role === role) {
      v.role = 'none';
      pointIds = pointIds.filter((id) => id !== v.id);
    }
  }

  if (vertex.role !== 'none' && vertex.role !== role) {
    pointIds = removeFromRoutePlan(graph, pointIds, vertexId);
  } else {
    pointIds = pointIds.filter((id) => id !== vertexId);
  }

  vertex.role = role;

  if (role === ROUTE_ROLES.START) {
    pointIds.unshift(vertexId);
  } else if (role === ROUTE_ROLES.FINISH) {
    pointIds.push(vertexId);
  } else {
    const finishIndex = pointIds.findIndex(
      (id) => graph.vertices.get(id)?.role === ROUTE_ROLES.FINISH,
    );
    if (finishIndex >= 0) {
      pointIds.splice(finishIndex, 0, vertexId);
    } else {
      pointIds.push(vertexId);
    }
  }

  return {
    ...state,
    routePlan: { pointIds },
    routeResult: null,
    error: null,
    animation: { ...state.animation, isPlaying: false, stepIndex: 0, highlightedEdgeId: null },
  };
}

/**
 * @param {import('./AppState.js').AppState} state
 * @param {string} type
 * @param {unknown} payload
 * @returns {import('./AppState.js').AppState}
 */
export function reduce(state, type, payload = {}) {
  switch (type) {
    case ActionTypes.SET_TOOL_MODE: {
      const next = cloneStateShell(state);
      next.toolMode = /** @type {string} */ (payload).mode ?? state.toolMode;
      next.edgeDraft = null;
      return next;
    }

    case ActionTypes.ADD_VERTEX: {
      const { x, y } = /** @type {{ x: number, y: number }} */ (payload);
      state.graph.addVertex(x, y);
      return { ...state, error: null };
    }

    case ActionTypes.REMOVE_VERTEX: {
      const { vertexId } = /** @type {{ vertexId: string }} */ (payload);
      const pointIds = removeFromRoutePlan(
        state.graph,
        [...state.routePlan.pointIds],
        vertexId,
      );
      state.graph.removeVertex(vertexId);
      return {
        ...state,
        routePlan: { pointIds },
        routeResult: null,
        error: null,
        edgeDraft:
          state.edgeDraft?.fromId === vertexId || state.edgeDraft?.toId === vertexId
            ? null
            : state.edgeDraft,
      };
    }

    case ActionTypes.EDGE_FIRST_CLICK: {
      const { vertexId } = /** @type {{ vertexId: string }} */ (payload);
      return {
        ...state,
        edgeDraft: { fromId: vertexId, toId: null },
        error: null,
      };
    }

    case ActionTypes.EDGE_SECOND_CLICK: {
      const { vertexId } = /** @type {{ vertexId: string }} */ (payload);
      if (!state.edgeDraft?.fromId) {
        return state;
      }
      return {
        ...state,
        edgeDraft: { fromId: state.edgeDraft.fromId, toId: vertexId },
      };
    }

    case ActionTypes.CONFIRM_EDGE: {
      const { weight, directed } = /** @type {{ weight: number, directed: boolean }} */ (
        payload
      );
      if (!state.edgeDraft?.fromId || !state.edgeDraft?.toId) {
        return { ...state, error: 'Выберите две вершины для ребра' };
      }
      try {
        state.graph.addEdge(
          state.edgeDraft.fromId,
          state.edgeDraft.toId,
          weight,
          directed,
        );
        return { ...state, edgeDraft: null, error: null };
      } catch (err) {
        if (err instanceof GraphError) {
          return { ...state, error: err.message };
        }
        throw err;
      }
    }

    case ActionTypes.CANCEL_EDGE_DRAFT:
      return { ...state, edgeDraft: null };

    case ActionTypes.REMOVE_EDGE: {
      const { edgeId } = /** @type {{ edgeId: string }} */ (payload);
      state.graph.removeEdge(edgeId);
      return { ...state, routeResult: null, error: null };
    }

    case ActionTypes.SET_ROUTE_POINT: {
      const { vertexId, role } = /** @type {{ vertexId: string, role: 'start' | 'waypoint' | 'finish' }} */ (
        payload
      );
      return applySetRoutePoint(state, vertexId, role);
    }

    case ActionTypes.BUILD_ROUTE: {
      const { pointIds } = state.routePlan;
      const hasStart = pointIds.some(
        (id) => state.graph.vertices.get(id)?.role === ROUTE_ROLES.START,
      );
      const hasFinish = pointIds.some(
        (id) => state.graph.vertices.get(id)?.role === ROUTE_ROLES.FINISH,
      );

      if (pointIds.length < 2 || !hasStart || !hasFinish) {
        return {
          ...state,
          routeResult: null,
          error: 'Укажите старт и финиш',
        };
      }

      try {
        const { routeResult, error } = buildRoute(state.graph, state.routePlan);
        return {
          ...state,
          routeResult,
          error: error ?? null,
          animation: { ...state.animation, isPlaying: false, stepIndex: 0, highlightedEdgeId: null },
        };
      } catch (err) {
        if (err instanceof RoutePlannerError) {
          return { ...state, routeResult: null, error: err.message };
        }
        throw err;
      }
    }

    case ActionTypes.CLEAR_GRAPH: {
      state.graph.clear();
      return {
        ...state,
        routePlan: { pointIds: [] },
        routeResult: null,
        error: null,
        edgeDraft: null,
        animation: {
          isPlaying: false,
          stepIndex: 0,
          highlightedEdgeId: null,
        },
      };
    }

    case ActionTypes.RESET_ANIMATION:
      return {
        ...state,
        animation: {
          isPlaying: false,
          stepIndex: 0,
          highlightedEdgeId: null,
        },
      };

    case ActionTypes.UPDATE_VERTEX_POSITION: {
      const { vertexId, x, y } = /** @type {{ vertexId: string, x: number, y: number }} */ (
        payload
      );
      try {
        state.graph.updateVertexPosition(vertexId, x, y);
        return { ...state, error: null };
      } catch (err) {
        if (err instanceof GraphError) {
          return { ...state, error: err.message };
        }
        throw err;
      }
    }

    default:
      return state;
  }
}
