/**
 * @typedef {'none' | 'start' | 'waypoint' | 'finish'} VertexRole
 */

/**
 * @typedef {Object} Vertex
 * @property {string} id
 * @property {string} label
 * @property {number} x
 * @property {number} y
 * @property {VertexRole} role
 */

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.label
 * @param {number} params.x
 * @param {number} params.y
 * @param {VertexRole} [params.role]
 * @returns {Vertex}
 */
export function createVertex({ id, label, x, y, role = 'none' }) {
  return { id, label, x, y, role };
}
