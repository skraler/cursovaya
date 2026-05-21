import { dijkstra } from './dijkstra.js';
import {
  createRoutePlan,
  createRouteResult,
  createRouteSegmentResult,
} from './types.js';

export class RoutePlannerError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message);
    this.name = 'RoutePlannerError';
    this.code = code;
  }
}

/**
 * @param {import('../graph/Graph.js').Graph} graph
 * @param {import('./types.js').RoutePlan} routePlan
 * @returns {{ routeResult: import('./types.js').RouteResult, error: string | null }}
 */
export function buildRoute(graph, routePlan) {
  const pointIds = routePlan?.pointIds ?? [];

  if (pointIds.length < 2) {
    throw new RoutePlannerError(
      'INVALID_ROUTE_PLAN',
      'Добавьте минимум старт и финиш',
    );
  }

  const segments = [];
  const fullPathEdgeIds = [];
  const fullPathVertexIds = [];
  let totalDistance = 0;

  for (let i = 0; i < pointIds.length - 1; i += 1) {
    const fromId = pointIds[i];
    const toId = pointIds[i + 1];
    const path = dijkstra(graph, fromId, toId);

    segments.push(
      createRouteSegmentResult({
        fromId,
        toId,
        pathVertexIds: path.pathVertexIds,
        pathEdgeIds: path.pathEdgeIds,
        distance: path.distance,
        reachable: path.reachable,
      }),
    );

    if (path.reachable) {
      totalDistance += path.distance;

      if (fullPathVertexIds.length === 0) {
        fullPathVertexIds.push(...path.pathVertexIds);
      } else {
        fullPathVertexIds.push(...path.pathVertexIds.slice(1));
      }

      fullPathEdgeIds.push(...path.pathEdgeIds);
    }
  }

  const success = segments.every((s) => s.reachable);
  let error = null;

  if (!success) {
    const failed = segments.find((s) => !s.reachable);
    error = `UNREACHABLE_SEGMENT:${failed.fromId}:${failed.toId}`;
  }

  return {
    routeResult: createRouteResult({
      segments,
      totalDistance,
      fullPathEdgeIds,
      fullPathVertexIds,
      success,
    }),
    error,
  };
}

export { createRoutePlan };
