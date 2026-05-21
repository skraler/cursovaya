import { describe, it, expect } from 'vitest';
import { findVertexAt, edgeGeometry } from '../src/ui/svgCoords.js';
import { Graph } from '../src/graph/index.js';

describe('svgCoords', () => {
  it('edgeGeometry leaves room for arrows at both ends', () => {
    const g = edgeGeometry({ x: 0, y: 0 }, { x: 100, y: 0 }, 18);
    expect(g.x1).toBeGreaterThan(18);
    expect(g.x2).toBeLessThan(82);
    expect(g.tipFrom.dirX).toBeLessThan(0);
    expect(g.tipTo.dirX).toBeGreaterThan(0);
  });

  it('findVertexAt returns vertex within radius', () => {
    const graph = Graph.createEmpty();
    const v = graph.addVertex(100, 200);

    expect(findVertexAt(graph, 100, 200)?.id).toBe(v.id);
    expect(findVertexAt(graph, 120, 200)).toBeNull();
  });
});
