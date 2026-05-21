import { describe, it, expect } from 'vitest';
import { Graph, GraphError } from '../src/graph/index.js';

describe('Graph', () => {
  it('G1: empty graph has no vertices', () => {
    const graph = Graph.createEmpty();
    expect(graph.vertices.size).toBe(0);
    expect(graph.edges.size).toBe(0);
  });

  it('G2: addVertex creates vertex with label A', () => {
    const graph = Graph.createEmpty();
    const v = graph.addVertex(10, 20);
    expect(graph.vertices.size).toBe(1);
    expect(v.label).toBe('A');
    expect(v.x).toBe(10);
    expect(v.y).toBe(20);
  });

  it('G3: two vertices get labels A and B', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(50, 50);
    expect(a.label).toBe('A');
    expect(b.label).toBe('B');
  });

  it('G4: directed edge has single adjacency entry', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    graph.addEdge(a.id, b.id, 5, true);

    expect(graph.getNeighbors(a.id)).toEqual([
      { toId: b.id, weight: 5, edgeId: 'e1' },
    ]);
    expect(graph.getNeighbors(b.id)).toEqual([]);
  });

  it('G5: undirected edge has symmetric adjacency', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    graph.addEdge(a.id, b.id, 3, false);

    expect(graph.getNeighbors(a.id)).toEqual([
      { toId: b.id, weight: 3, edgeId: 'e1' },
    ]);
    expect(graph.getNeighbors(b.id)).toEqual([
      { toId: a.id, weight: 3, edgeId: 'e1' },
    ]);
  });

  it('G6: removeVertex removes incident edges', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    const c = graph.addVertex(200, 0);
    graph.addEdge(a.id, b.id, 1, true);
    graph.addEdge(b.id, c.id, 2, false);

    graph.removeVertex(b.id);

    expect(graph.vertices.has(b.id)).toBe(false);
    expect(graph.edges.size).toBe(0);
    expect(graph.getNeighbors(a.id)).toEqual([]);
    expect(graph.getNeighbors(c.id)).toEqual([]);
  });

  it('G7: removeEdge on undirected clears both adjacency sides', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);
    const edge = graph.addEdge(a.id, b.id, 4, false);

    graph.removeEdge(edge.id);

    expect(graph.edges.size).toBe(0);
    expect(graph.getNeighbors(a.id)).toEqual([]);
    expect(graph.getNeighbors(b.id)).toEqual([]);
  });

  it('G8: negative weight throws INVALID_WEIGHT', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(100, 0);

    expect(() => graph.addEdge(a.id, b.id, -1, true)).toThrow(GraphError);
    expect(() => graph.addEdge(a.id, b.id, -1, true)).toThrow(
      expect.objectContaining({ code: 'INVALID_WEIGHT' }),
    );
  });

  it('G9: getNeighbors returns correct toId and weight', () => {
    const graph = Graph.createEmpty();
    const a = graph.addVertex(0, 0);
    const b = graph.addVertex(50, 0);
    const c = graph.addVertex(100, 0);
    graph.addEdge(a.id, b.id, 2, true);
    graph.addEdge(a.id, c.id, 7, true);

    const neighbors = graph.getNeighbors(a.id);
    expect(neighbors).toHaveLength(2);
    expect(neighbors).toContainEqual({ toId: b.id, weight: 2, edgeId: 'e1' });
    expect(neighbors).toContainEqual({ toId: c.id, weight: 7, edgeId: 'e2' });
  });

  it('clear resets graph', () => {
    const graph = Graph.createEmpty();
    graph.addVertex(0, 0);
    graph.addVertex(10, 10);
    graph.clear();
    expect(graph.vertices.size).toBe(0);
    expect(graph.edges.size).toBe(0);
    expect(graph.adjacency.size).toBe(0);
  });

  it('updateVertexPosition updates coordinates', () => {
    const graph = Graph.createEmpty();
    const v = graph.addVertex(1, 2);
    const updated = graph.updateVertexPosition(v.id, 30, 40);
    expect(updated.x).toBe(30);
    expect(updated.y).toBe(40);
  });
});
