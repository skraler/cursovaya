import { ActionTypes, TOOL_MODES, ROUTE_ROLES } from '../state/index.js';
import { MODE_HINTS } from './toolbar.js';
import { clientToSvg, edgeGeometry } from './svgCoords.js';
import { undirectedEdgeShapePoints } from './shapes/undirectedEdge.js';
import { directedEdgeShapePoints } from './shapes/directedEdge.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEWBOX = { w: 800, h: 520 };
const VERTEX_R = 18;

/**
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 * @param {import('../state/AppState.js').AppState} state
 * @param {string} vertexId
 */
function handleVertexClick(store, state, vertexId) {
  switch (state.toolMode) {
    case TOOL_MODES.EDGE: {
      const draft = state.edgeDraft;
      if (!draft?.fromId) {
        store.dispatch(ActionTypes.EDGE_FIRST_CLICK, { vertexId });
      } else if (draft.fromId !== vertexId && !draft.toId) {
        store.dispatch(ActionTypes.EDGE_SECOND_CLICK, { vertexId });
      }
      break;
    }
    case TOOL_MODES.START:
      store.dispatch(ActionTypes.SET_ROUTE_POINT, {
        vertexId,
        role: ROUTE_ROLES.START,
      });
      break;
    case TOOL_MODES.WAYPOINT:
      store.dispatch(ActionTypes.SET_ROUTE_POINT, {
        vertexId,
        role: ROUTE_ROLES.WAYPOINT,
      });
      break;
    case TOOL_MODES.FINISH:
      store.dispatch(ActionTypes.SET_ROUTE_POINT, {
        vertexId,
        role: ROUTE_ROLES.FINISH,
      });
      break;
    case TOOL_MODES.DELETE_VERTEX:
      store.dispatch(ActionTypes.REMOVE_VERTEX, { vertexId });
      break;
    default:
      break;
  }
}

/**
 * @param {HTMLElement} canvasWrap
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 */
export function initCanvasRenderer(canvasWrap, store) {
  canvasWrap.innerHTML = `
    <span class="canvas-hint" id="mode-hint"></span>
    <svg id="graph-svg" viewBox="0 0 ${VIEWBOX.w} ${VIEWBOX.h}" aria-label="Холст графа">
      <g id="edges-layer"></g>
      <g id="vertices-layer"></g>
    </svg>
  `;

  const svg = /** @type {SVGSVGElement} */ (canvasWrap.querySelector('#graph-svg'));
  const hint = canvasWrap.querySelector('#mode-hint');

  /** @type {{ vertexId: string, moved: boolean } | null} */
  let dragState = null;

  svg.addEventListener('dblclick', (event) => {
    const edgeGroup = /** @type {SVGGElement | null} */ (
      event.target.closest('.edge-group')
    );
    if (edgeGroup?.dataset.edgeId) {
      event.preventDefault();
      store.dispatch(ActionTypes.OPEN_EDGE_EDITOR, {
        edgeId: edgeGroup.dataset.edgeId,
      });
    }
  });

  svg.addEventListener('click', (event) => {
    const state = store.getState();
    const vertexTarget = /** @type {SVGElement | null} */ (
      event.target.closest('[data-vertex-id]')
    );
    const edgeGroup = /** @type {SVGGElement | null} */ (
      event.target.closest('.edge-group')
    );

    if (vertexTarget) {
      handleVertexClick(store, state, vertexTarget.dataset.vertexId);
      return;
    }

    if (edgeGroup?.dataset.edgeId && state.toolMode === TOOL_MODES.DELETE_EDGE) {
      store.dispatch(ActionTypes.REMOVE_EDGE, {
        edgeId: edgeGroup.dataset.edgeId,
      });
      return;
    }

    if (!vertexTarget && !edgeGroup && state.toolMode === TOOL_MODES.VERTEX) {
      const { x, y } = clientToSvg(svg, event.clientX, event.clientY);
      store.dispatch(ActionTypes.ADD_VERTEX, { x, y });
    }
  });

  svg.addEventListener('mousedown', (event) => {
    if (store.getState().toolMode !== TOOL_MODES.MOVE) return;
    const vertexTarget = /** @type {SVGElement | null} */ (
      event.target.closest('[data-vertex-id]')
    );
    if (!vertexTarget) return;
    dragState = { vertexId: vertexTarget.dataset.vertexId, moved: false };
    event.preventDefault();
  });

  const api = {
    render(state) {
      canvasWrap.dataset.tool = state.toolMode;

      if (hint) {
        hint.textContent =
          MODE_HINTS[state.toolMode] ?? 'Выберите инструмент слева';
      }

      const routeEdgeIds = new Set(state.routeResult?.fullPathEdgeIds ?? []);
      const highlightedId = state.animation.highlightedEdgeId;

      const edgesLayer = svg.querySelector('#edges-layer');
      const verticesLayer = svg.querySelector('#vertices-layer');
      if (!edgesLayer || !verticesLayer) return;

      edgesLayer.replaceChildren();
      verticesLayer.replaceChildren();

      for (const edge of state.graph.edges.values()) {
        const from = state.graph.vertices.get(edge.fromId);
        const to = state.graph.vertices.get(edge.toId);
        if (!from || !to) continue;

        const geom = edgeGeometry(from, to, VERTEX_R);
        const group = document.createElementNS(SVG_NS, 'g');
        group.classList.add('edge-group');
        group.classList.add(edge.directed ? 'edge-directed' : 'edge-undirected');
        group.dataset.edgeId = edge.id;

        const shape = document.createElementNS(SVG_NS, 'polygon');
        if (edge.directed) {
          shape.setAttribute('points', directedEdgeShapePoints(geom));
          shape.classList.add('edge-shape', 'edge-shape--directed');
        } else {
          shape.setAttribute('points', undirectedEdgeShapePoints(geom));
          shape.classList.add('edge-shape', 'edge-shape--undirected');
        }
        group.append(shape);

        if (state.animation.isPlaying) {
          if (highlightedId === edge.id) {
            group.classList.add('animated');
          }
        } else if (
          state.routeHighlightActive &&
          routeEdgeIds.has(edge.id)
        ) {
          group.classList.add('route');
        }

        const label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('x', String((from.x + to.x) / 2));
        label.setAttribute('y', String((from.y + to.y) / 2 - 6));
        label.classList.add('edge-label');
        label.textContent = String(edge.weight);

        edgesLayer.append(group, label);
      }

      for (const vertex of state.graph.vertices.values()) {
        const group = document.createElementNS(SVG_NS, 'g');
        group.classList.add('vertex');
        group.dataset.vertexId = vertex.id;

        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('cx', String(vertex.x));
        circle.setAttribute('cy', String(vertex.y));
        circle.setAttribute('r', String(VERTEX_R));
        circle.classList.add('vertex-circle');
        if (vertex.role !== 'none') {
          circle.classList.add(vertex.role);
        }
        if (state.edgeDraft?.fromId === vertex.id) {
          circle.classList.add('draft-from');
        }

        const label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('x', String(vertex.x));
        label.setAttribute('y', String(vertex.y));
        label.classList.add('vertex-label');
        label.textContent = vertex.label;

        group.append(circle, label);
        verticesLayer.append(group);
      }
    },
  };

  window.addEventListener('mousemove', (event) => {
    if (!dragState) return;
    const { x, y } = clientToSvg(svg, event.clientX, event.clientY);
    const graph = store.getState().graph;
    try {
      graph.updateVertexPosition(
        dragState.vertexId,
        Math.max(0, Math.min(VIEWBOX.w, x)),
        Math.max(0, Math.min(VIEWBOX.h, y)),
      );
      dragState.moved = true;
      api.render(store.getState());
    } catch {
      /* ignore invalid drag */
    }
  });

  window.addEventListener('mouseup', () => {
    if (dragState?.moved) {
      store.dispatch(ActionTypes.VERTEX_DRAG_END);
    }
    dragState = null;
  });

  return api;
}

/**
 * @param {import('../state/AppState.js').AppState} state
 * @param {HTMLElement} canvasWrap
 * @param {ReturnType<typeof initCanvasRenderer>} canvasApi
 */
export function renderCanvas(state, canvasWrap, canvasApi) {
  canvasApi?.render(state);
}
