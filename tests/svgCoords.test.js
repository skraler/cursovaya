import { describe, it, expect } from 'vitest';
import { findVertexAt } from '../src/ui/svgCoords.js';
import { Graph } from '../src/graph/index.js';

describe('svgCoords', () => {
  it('findVertexAt returns vertex within radius', () => {
    const graph = Graph.createEmpty();
    const v = graph.addVertex(100, 200);

    expect(findVertexAt(graph, 100, 200)?.id).toBe(v.id);
    expect(findVertexAt(graph, 120, 200)).toBeNull();
  });
});
