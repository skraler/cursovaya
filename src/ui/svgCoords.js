/**
 * @param {SVGSVGElement} svg
 * @param {number} clientX
 * @param {number} clientY
 * @returns {{ x: number, y: number }}
 */
export function clientToSvg(svg, clientX, clientY) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) {
    return { x: clientX, y: clientY };
  }
  const transformed = point.matrixTransform(matrix.inverse());
  return {
    x: Math.round(transformed.x),
    y: Math.round(transformed.y),
  };
}

/**
 * @param {import('../graph/Graph.js').Graph} graph
 * @param {number} x
 * @param {number} y
 * @param {number} [radius]
 */
const ARROW_LENGTH = 10;

/**
 * Геометрия ребра: линия между вершинами + точки для стрелок.
 * @param {{ x: number, y: number }} from
 * @param {{ x: number, y: number }} to
 * @param {number} [vertexRadius]
 */
export function edgeGeometry(from, to, vertexRadius = 18) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const lineInset = Math.min(vertexRadius + ARROW_LENGTH + 4, len / 2 - 1);

  return {
    x1: from.x + ux * lineInset,
    y1: from.y + uy * lineInset,
    x2: to.x - ux * lineInset,
    y2: to.y - uy * lineInset,
    /** направление A→B */
    ux,
    uy,
    tipTo: {
      x: to.x - ux * vertexRadius,
      y: to.y - uy * vertexRadius,
      dirX: ux,
      dirY: uy,
    },
    tipFrom: {
      x: from.x + ux * vertexRadius,
      y: from.y + uy * vertexRadius,
      dirX: -ux,
      dirY: -uy,
    },
  };
}

/** @deprecated use edgeGeometry */
export function edgeLineEndpoints(from, to, vertexRadius = 18) {
  const g = edgeGeometry(from, to, vertexRadius);
  return { x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2 };
}

/**
 * @param {import('../graph/Graph.js').Graph} graph
 * @param {number} x
 * @param {number} y
 * @param {number} [radius]
 */
export function findVertexAt(graph, x, y, radius = 18) {
  const r2 = radius * radius;
  for (const vertex of graph.vertices.values()) {
    const dx = vertex.x - x;
    const dy = vertex.y - y;
    if (dx * dx + dy * dy <= r2) {
      return vertex;
    }
  }
  return null;
}
