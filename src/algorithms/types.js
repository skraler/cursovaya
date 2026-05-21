/**
 * @typedef {Object} RoutePlan
 * @property {string[]} pointIds
 */

/**
 * @typedef {Object} RouteSegmentResult
 * @property {string} fromId
 * @property {string} toId
 * @property {string[]} pathVertexIds
 * @property {string[]} pathEdgeIds
 * @property {number} distance
 * @property {boolean} reachable
 */

/**
 * @typedef {Object} RouteResult
 * @property {RouteSegmentResult[]} segments
 * @property {number} totalDistance
 * @property {string[]} fullPathEdgeIds
 * @property {string[]} fullPathVertexIds
 * @property {boolean} success
 */

/**
 * @param {string[]} [pointIds]
 * @returns {RoutePlan}
 */
export function createRoutePlan(pointIds = []) {
  return { pointIds };
}

/**
 * @param {Object} params
 * @returns {RouteSegmentResult}
 */
export function createRouteSegmentResult(params) {
  return { ...params };
}

/**
 * @param {Object} params
 * @returns {RouteResult}
 */
export function createRouteResult(params) {
  return { ...params };
}
