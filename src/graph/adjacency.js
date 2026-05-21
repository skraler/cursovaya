/**
 * @typedef {Object} AdjacencyEntry
 * @property {string} toId
 * @property {number} weight
 * @property {string} edgeId
 */

/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} vertexId
 * @returns {AdjacencyEntry[]}
 */
export function getAdjacencyList(adjacency, vertexId) {
  return adjacency.get(vertexId) ?? [];
}

/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} fromId
 * @param {AdjacencyEntry} entry
 */
export function addAdjacencyEntry(adjacency, fromId, entry) {
  const list = [...getAdjacencyList(adjacency, fromId), entry];
  adjacency.set(fromId, list);
}

/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} fromId
 * @param {string} edgeId
 */
export function removeAdjacencyEntry(adjacency, fromId, edgeId) {
  const list = adjacency.get(fromId);
  if (!list) return;

  const filtered = list.filter((e) => e.edgeId !== edgeId);
  if (filtered.length === 0) {
    adjacency.delete(fromId);
  } else {
    adjacency.set(fromId, filtered);
  }
}

/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} vertexId
 */
/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} edgeId
 * @param {number} weight
 */
export function syncEdgeWeight(adjacency, edgeId, weight) {
  for (const [fromId, entries] of adjacency.entries()) {
    let changed = false;
    const next = entries.map((entry) => {
      if (entry.edgeId !== edgeId) {
        return entry;
      }
      changed = true;
      return { ...entry, weight };
    });
    if (changed) {
      adjacency.set(fromId, next);
    }
  }
}

/**
 * @param {Map<string, AdjacencyEntry[]>} adjacency
 * @param {string} vertexId
 */
export function removeAllAdjacencyForVertex(adjacency, vertexId) {
  adjacency.delete(vertexId);

  for (const [fromId, entries] of adjacency.entries()) {
    const filtered = entries.filter((e) => e.toId !== vertexId);
    if (filtered.length === 0) {
      adjacency.delete(fromId);
    } else if (filtered.length !== entries.length) {
      adjacency.set(fromId, filtered);
    }
  }
}
