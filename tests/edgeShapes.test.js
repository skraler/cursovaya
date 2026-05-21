import { describe, it, expect } from 'vitest';
import { edgeGeometry } from '../src/ui/svgCoords.js';
import { undirectedEdgeShapePoints } from '../src/ui/shapes/undirectedEdge.js';
import { directedEdgeShapePoints } from '../src/ui/shapes/directedEdge.js';

describe('edge shapes', () => {
  const geom = () => edgeGeometry({ x: 0, y: 0 }, { x: 100, y: 0 }, 18);

  it('undirected: shaft + distinct arrow heads', () => {
    const pts = undirectedEdgeShapePoints(geom()).split(' ');
    expect(pts.length).toBe(10);
    const ys = pts.map((p) => Number(p.split(',')[1]));
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(7, 0);
  });

  it('directed: straight shaft + one arrow head', () => {
    const g = geom();
    const pts = directedEdgeShapePoints(g).split(' ');
    expect(pts.length).toBe(7);
    const parsed = pts.map((p) => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });
    expect(parsed[0].x).toBeCloseTo(g.tipFrom.x, 0);
    const ys = parsed.map((p) => p.y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(7, 0);
  });
});
