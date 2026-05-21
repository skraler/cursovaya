/**
 * @typedef {Object} DijkstraResult
 * @property {string[]} pathVertexIds
 * @property {string[]} pathEdgeIds
 * @property {number} distance
 * @property {boolean} reachable
 */

/**
 * Кратчайший путь Дейкстры (веса ≥ 0).
 * @param {import('../graph/Graph.js').Graph} graph
 * @param {string} fromId
 * @param {string} toId
 * @returns {DijkstraResult}
 */
export function dijkstra(graph, fromId, toId) {
  if (fromId === toId) {
    return {
      pathVertexIds: [fromId],
      pathEdgeIds: [],
      distance: 0,
      reachable: true,
    };
  }

  if (!graph.vertices.has(fromId) || !graph.vertices.has(toId)) {
    return {
      pathVertexIds: [],
      pathEdgeIds: [],
      distance: Infinity,
      reachable: false,
    };
  }

  const dist = new Map();
  const prev = new Map();
  const prevEdge = new Map();
  const visited = new Set();

  for (const id of graph.vertices.keys()) {
    dist.set(id, Infinity);
  }
  dist.set(fromId, 0);

  while (true) {
    let u = null;
    let minDist = Infinity;

    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < minDist) {
        minDist = d;
        u = id;
      }
    }

    if (u === null || minDist === Infinity) {
      break;
    }

    if (u === toId) {
      break;
    }

    visited.add(u);

    for (const { toId: neighborId, weight, edgeId } of graph.getNeighbors(u)) {
      const alt = dist.get(u) + weight;
      if (alt < dist.get(neighborId)) {
        dist.set(neighborId, alt);
        prev.set(neighborId, u);
        prevEdge.set(neighborId, edgeId);
      }
    }
  }

  if (dist.get(toId) === Infinity) {
    return {
      pathVertexIds: [],
      pathEdgeIds: [],
      distance: Infinity,
      reachable: false,
    };
  }

  const pathVertexIds = [];
  const pathEdgeIds = [];
  let current = toId;

  while (current !== undefined) {
    pathVertexIds.unshift(current);
    if (current === fromId) {
      break;
    }
    pathEdgeIds.unshift(prevEdge.get(current));
    current = prev.get(current);
  }

  return {
    pathVertexIds,
    pathEdgeIds,
    distance: dist.get(toId),
    reachable: true,
  };
}
