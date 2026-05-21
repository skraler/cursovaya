/** @typedef {typeof TOOL_MODES[keyof typeof TOOL_MODES]} ToolMode */

export const TOOL_MODES = Object.freeze({
  VERTEX: 'vertex',
  EDGE: 'edge',
  START: 'start',
  WAYPOINT: 'waypoint',
  FINISH: 'finish',
  MOVE: 'move',
  DELETE_VERTEX: 'deleteVertex',
  DELETE_EDGE: 'deleteEdge',
});

export const ROUTE_ROLES = Object.freeze({
  START: 'start',
  WAYPOINT: 'waypoint',
  FINISH: 'finish',
});
