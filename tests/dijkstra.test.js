import { describe, it, expect } from 'vitest';
import { Graph } from '../src/graph/index.js';
import { dijkstra } from '../src/algorithms/dijkstra.js';

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

describe('dijkstra', () => {
  it('D1: direct edge A→B weight 4', () => {
    const { graph, a, b } = createDemoGraph();
    const result = dijkstra(graph, a.id, b.id);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(4);
    expect(result.pathVertexIds).toEqual([a.id, b.id]);
    expect(result.pathEdgeIds).toEqual(['e1']);
  });

  it('D2: cheaper path through third vertex', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(50, 0);
    const c = graph.addVertex(100, 0);

    graph.addEdge(a.id, c.id, 10, true);
    graph.addEdge(a.id, b.id, 2, true);
    graph.addEdge(b.id, c.id, 3, true);

    const result = dijkstra(graph, a.id, c.id);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(5);
    expect(result.pathVertexIds).toEqual([a.id, b.id, c.id]);
  });

  it('D3: unreachable vertex', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    const c = graph.addVertex(200, 200);

    graph.addEdge(a.id, b.id, 1, true);

    const result = dijkstra(graph, a.id, c.id);

    expect(result.reachable).toBe(false);
    expect(result.pathVertexIds).toEqual([]);
    expect(result.distance).toBe(Infinity);
  });

  it('D4: from equals to', () => {
    const { graph, a } = createDemoGraph();
    const result = dijkstra(graph, a.id, a.id);

    expect(result.reachable).toBe(true);
    expect(result.distance).toBe(0);
    expect(result.pathVertexIds).toEqual([a.id]);
    expect(result.pathEdgeIds).toEqual([]);
  });
});
