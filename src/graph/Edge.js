/**
 * @typedef {Object} Edge
 * @property {string} id
 * @property {string} fromId
 * @property {string} toId
 * @property {number} weight
 * @property {boolean} directed
 */

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.fromId
 * @param {string} params.toId
 * @param {number} params.weight
 * @param {boolean} params.directed
 * @returns {Edge}
 */
export function createEdge({ id, fromId, toId, weight, directed }) {
  return { id, fromId, toId, weight, directed };
}
