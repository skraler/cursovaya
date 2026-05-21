import { describe, it, expect, vi } from 'vitest';
import { createStore, ActionTypes, TOOL_MODES, ROUTE_ROLES } from '../src/state/index.js';
import { createInitialState } from '../src/state/AppState.js';

function getVertices(store) {
  return [...store.getState().graph.vertices.values()];
}

function buildDemoGraphInStore(store) {
  store.dispatch(ActionTypes.ADD_VERTEX, { x: 0, y: 0 });
  store.dispatch(ActionTypes.ADD_VERTEX, { x: 100, y: 0 });
  store.dispatch(ActionTypes.ADD_VERTEX, { x: 50, y: 80 });
  store.dispatch(ActionTypes.ADD_VERTEX, { x: 200, y: 0 });

  const [a, b, c, d] = getVertices(store);

  store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId: a.id });
  store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId: b.id });
  store.dispatch(ActionTypes.CONFIRM_EDGE, {
    weight: 4,
    directed: true,
  });

  store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId: b.id });
  store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId: c.id });
  store.dispatch(ActionTypes.CONFIRM_EDGE, { weight: 3, directed: true });

  store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId: a.id });
  store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId: c.id });
  store.dispatch(ActionTypes.CONFIRM_EDGE, { weight: 10, directed: true });

  store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId: b.id });
  store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId: d.id });
  store.dispatch(ActionTypes.CONFIRM_EDGE, { weight: 10, directed: true });

  return { a, b, c, d };
}

describe('store', () => {
  it('S1: createInitialState has empty graph', () => {
    const state = createInitialState();
    expect(state.graph.vertices.size).toBe(0);
    expect(state.toolMode).toBe(TOOL_MODES.VERTEX);
    expect(state.routePlan.pointIds).toEqual([]);
  });

  it('S2: SET_TOOL_MODE changes toolMode', () => {
    const store = createStore();
    store.dispatch(ActionTypes.SET_TOOL_MODE, { mode: TOOL_MODES.EDGE });
    expect(store.getState().toolMode).toBe(TOOL_MODES.EDGE);
  });

  it('S3: ADD_VERTEX increases vertices', () => {
    const store = createStore();
    store.dispatch(ActionTypes.ADD_VERTEX, { x: 10, y: 20 });
    expect(store.getState().graph.vertices.size).toBe(1);
    const vertex = getVertices(store)[0];
    expect(vertex.x).toBe(10);
    expect(vertex.label).toBe('A');
  });

  it('S4: SET_ROUTE_POINT start and finish then BUILD_ROUTE', () => {
    const store = createStore();
    const { a, b, d } = buildDemoGraphInStore(store);

    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: a.id,
      role: ROUTE_ROLES.START,
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: b.id,
      role: ROUTE_ROLES.WAYPOINT,
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: d.id,
      role: ROUTE_ROLES.FINISH,
    });

    store.dispatch(ActionTypes.BUILD_ROUTE);

    const { routeResult, error } = store.getState();
    expect(error).toBeNull();
    expect(routeResult?.success).toBe(true);
    expect(routeResult?.totalDistance).toBe(14);
  });

  it('S5: BUILD_ROUTE unreachable sets error', () => {
    const store = createStore();
    store.dispatch(ActionTypes.ADD_VERTEX, { x: 0, y: 0 });
    store.dispatch(ActionTypes.ADD_VERTEX, { x: 100, y: 0 });
    store.dispatch(ActionTypes.ADD_VERTEX, { x: 200, y: 200 });

    const [a, b, isolated] = getVertices(store);
    store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId: a.id });
    store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId: b.id });
    store.dispatch(ActionTypes.CONFIRM_EDGE, { weight: 1, directed: true });

    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: a.id,
      role: ROUTE_ROLES.START,
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: isolated.id,
      role: ROUTE_ROLES.FINISH,
    });

    store.dispatch(ActionTypes.BUILD_ROUTE);

    const { routeResult, error } = store.getState();
    expect(routeResult?.success).toBe(false);
    expect(error).toMatch(/^UNREACHABLE_SEGMENT:/);
  });

  it('S6: subscribe called after dispatch', () => {
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.dispatch(ActionTypes.ADD_VERTEX, { x: 0, y: 0 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][1]).toBe(ActionTypes.ADD_VERTEX);
  });

  it('S10: RESET_ANIMATION hides route highlight flag', () => {
    const store = createStore();
    const { a, d } = buildDemoGraphInStore(store);

    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: a.id,
      role: 'start',
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: d.id,
      role: 'finish',
    });
    store.dispatch(ActionTypes.BUILD_ROUTE);

    expect(store.getState().routeHighlightActive).toBe(true);

    store.dispatch(ActionTypes.RESET_ANIMATION);

    expect(store.getState().routeHighlightActive).toBe(false);
    expect(store.getState().routeResult?.success).toBe(true);
  });

  it('S8: PLAY_ROUTE_ANIMATION and TICK advance animation', () => {
    const store = createStore();
    const { a, b, d } = buildDemoGraphInStore(store);

    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: a.id,
      role: 'start',
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: b.id,
      role: 'waypoint',
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: d.id,
      role: 'finish',
    });
    store.dispatch(ActionTypes.BUILD_ROUTE);

    store.dispatch(ActionTypes.PLAY_ROUTE_ANIMATION);
    expect(store.getState().animation.isPlaying).toBe(true);
    expect(store.getState().animation.highlightedEdgeId).toBe('e1');

    store.dispatch(ActionTypes.ANIMATION_TICK);
    expect(store.getState().animation.stepIndex).toBe(1);

    store.dispatch(ActionTypes.ANIMATION_TICK);
    expect(store.getState().animation.isPlaying).toBe(false);
    expect(store.getState().animation.highlightedEdgeId).toBeNull();
  });

  it('S9: UPDATE_EDGE clears routeResult', () => {
    const store = createStore();
    const { a, b, d } = buildDemoGraphInStore(store);

    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: a.id,
      role: 'start',
    });
    store.dispatch(ActionTypes.SET_ROUTE_POINT, {
      vertexId: d.id,
      role: 'finish',
    });
    store.dispatch(ActionTypes.BUILD_ROUTE);
    expect(store.getState().routeResult?.success).toBe(true);

    store.dispatch(ActionTypes.OPEN_EDGE_EDITOR, { edgeId: 'e1' });
    store.dispatch(ActionTypes.UPDATE_EDGE, {
      edgeId: 'e1',
      weight: 99,
      directed: true,
    });

    expect(store.getState().routeResult).toBeNull();
    expect(store.getState().graph.edges.get('e1')?.weight).toBe(99);
  });

  it('S7: CLEAR_GRAPH resets state', () => {
    const store = createStore();
    buildDemoGraphInStore(store);
    store.dispatch(ActionTypes.CLEAR_GRAPH);

    const state = store.getState();
    expect(state.graph.vertices.size).toBe(0);
    expect(state.routePlan.pointIds).toEqual([]);
    expect(state.routeResult).toBeNull();
    expect(state.error).toBeNull();
    expect(state.edgeDraft).toBeNull();
  });
});
