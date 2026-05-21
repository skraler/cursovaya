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
