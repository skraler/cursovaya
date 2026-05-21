import { describe, it, expect } from 'vitest';
import { Graph } from '../src/graph/index.js';
import {
  buildRoute,
  RoutePlannerError,
  createRoutePlan,
} from '../src/algorithms/routePlanner.js';

function createDemoGraph() {
  const graph = Graph.createEmpty();
  const a = graph.addVertex(0, 0);
  const b = graph.addVertex(100, 0);
  const c = graph.addVertex(50, 80);
  const d = graph.addVertex(200, 0);

  graph.addEdge(a.id, b.id, 4, true);
  graph.addEdge(b.id, c.id, 3, true);
  graph.addEdge(a.id, c.id, 10, true);
  graph.addEdge(b.id, d.id, 10, true);

  return { graph, a, b, c, d };
}

describe('routePlanner', () => {
  it('R1: route A→B→D has totalDistance 14', () => {
    const { graph, a, b, d } = createDemoGraph();
    const { routeResult } = buildRoute(
      graph,
      createRoutePlan([a.id, b.id, d.id]),
    );

    expect(routeResult.success).toBe(true);
    expect(routeResult.totalDistance).toBe(14);
    expect(routeResult.segments).toHaveLength(2);
    expect(routeResult.fullPathVertexIds).toEqual([a.id, b.id, d.id]);
    expect(routeResult.fullPathEdgeIds).toEqual(['e1', 'e4']);
  });

  it('R2: unreachable segment sets success false', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    const c = graph.addVertex(200, 200);

    graph.addEdge(a.id, b.id, 1, true);

    const { routeResult, error } = buildRoute(
      graph,
      createRoutePlan([a.id, c.id]),
    );

    expect(routeResult.success).toBe(false);
    expect(routeResult.segments[0].reachable).toBe(false);
    expect(error).toMatch(/^UNREACHABLE_SEGMENT:/);
  });

  it('R3: fullPathEdgeIds order matches segments', () => {
    const { graph, a, b, d } = createDemoGraph();
    const { routeResult } = buildRoute(
      graph,
      createRoutePlan([a.id, b.id, d.id]),
    );

    const edgeOrder = routeResult.segments.flatMap((s) => s.pathEdgeIds);
    expect(routeResult.fullPathEdgeIds).toEqual(edgeOrder);
  });

  it('R4: pointIds less than 2 throws', () => {
    const { graph, a } = createDemoGraph();

    expect(() => buildRoute(graph, createRoutePlan([a.id]))).toThrow(
      RoutePlannerError,
    );
    expect(() => buildRoute(graph, createRoutePlan([]))).toThrow(
      expect.objectContaining({ code: 'INVALID_ROUTE_PLAN' }),
    );
  });
});
