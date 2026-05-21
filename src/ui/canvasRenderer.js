import { ActionTypes, TOOL_MODES, ROUTE_ROLES } from '../state/index.js';
import { MODE_HINTS } from './toolbar.js';
import { clientToSvg } from './svgCoords.js';

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
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="#1e4a7a"/>
        </marker>
      </defs>
      <g id="edges-layer"></g>
      <g id="vertices-layer"></g>
    </svg>
  `;

  const svg = /** @type {SVGSVGElement} */ (canvasWrap.querySelector('#graph-svg'));
  const hint = canvasWrap.querySelector('#mode-hint');

  /** @type {{ vertexId: string } | null} */
  let dragState = null;

  svg.addEventListener('click', (event) => {
    const state = store.getState();
    const vertexTarget = /** @type {SVGElement | null} */ (
      event.target.closest('[data-vertex-id]')
    );
    const edgeTarget = /** @type {SVGLineElement | null} */ (
      event.target.closest('[data-edge-id]')
    );

    if (vertexTarget) {
      handleVertexClick(store, state, vertexTarget.dataset.vertexId);
      return;
    }

    if (edgeTarget && state.toolMode === TOOL_MODES.DELETE_EDGE) {
      store.dispatch(ActionTypes.REMOVE_EDGE, {
        edgeId: edgeTarget.dataset.edgeId,
      });
      return;
    }

    if (!vertexTarget && !edgeTarget && state.toolMode === TOOL_MODES.VERTEX) {
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
    dragState = { vertexId: vertexTarget.dataset.vertexId };
    event.preventDefault();
  });

  window.addEventListener('mousemove', (event) => {
    if (!dragState) return;
    const { x, y } = clientToSvg(svg, event.clientX, event.clientY);
    store.dispatch(ActionTypes.UPDATE_VERTEX_POSITION, {
      vertexId: dragState.vertexId,
      x: Math.max(0, Math.min(VIEWBOX.w, x)),
      y: Math.max(0, Math.min(VIEWBOX.h, y)),
    });
  });

  window.addEventListener('mouseup', () => {
    dragState = null;
  });

  return {
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

        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', String(from.x));
        line.setAttribute('y1', String(from.y));
        line.setAttribute('x2', String(to.x));
        line.setAttribute('y2', String(to.y));
        line.classList.add('edge-line');
        line.dataset.edgeId = edge.id;

        if (edge.directed) {
          line.setAttribute('marker-end', 'url(#arrow)');
        }
        if (routeEdgeIds.has(edge.id)) {
          line.classList.add('route');
        }
        if (highlightedId === edge.id) {
          line.classList.add('animated');
        }

        const label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('x', String((from.x + to.x) / 2));
        label.setAttribute('y', String((from.y + to.y) / 2 - 6));
        label.classList.add('edge-label');
        label.textContent = String(edge.weight);

        edgesLayer.append(line, label);
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
}

/**
 * @param {import('../state/AppState.js').AppState} state
 * @param {HTMLElement} canvasWrap
 * @param {ReturnType<typeof initCanvasRenderer>} canvasApi
 */
export function renderCanvas(state, canvasWrap, canvasApi) {
  canvasApi?.render(state);
}
