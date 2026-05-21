import { createVertex } from './Vertex.js';
import { createEdge } from './Edge.js';
import {
  addAdjacencyEntry,
  getAdjacencyList,
  removeAdjacencyEntry,
  removeAllAdjacencyForVertex,
} from './adjacency.js';

export class GraphError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message);
    this.name = 'GraphError';
    this.code = code;
  }
}

export class Graph {
  constructor() {
    /** @type {Map<string, import('./Vertex.js').Vertex>} */
    this.vertices = new Map();
    /** @type {Map<string, import('./Edge.js').Edge>} */
    this.edges = new Map();
    /** @type {Map<string, import('./adjacency.js').AdjacencyEntry[]>} */
    this.adjacency = new Map();
    this._vertexCounter = 0;
    this._edgeCounter = 0;
  }

  static createEmpty() {
    return new Graph();
  }

  _nextVertexId() {
    this._vertexCounter += 1;
    return `v${this._vertexCounter}`;
  }

  _nextEdgeId() {
    this._edgeCounter += 1;
    return `e${this._edgeCounter}`;
  }

  _nextLabel() {
    const index = this.vertices.size;
    if (index >= 26) {
      return `V${index + 1}`;
    }
    return String.fromCharCode(65 + index);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {import('./Vertex.js').Vertex}
   */
  addVertex(x, y) {
    const id = this._nextVertexId();
    const label = this._nextLabel();
    const vertex = createVertex({ id, label, x, y });
    this.vertices.set(id, vertex);
    return vertex;
  }

  /**
   * @param {string} vertexId
   * @returns {boolean}
   */
  removeVertex(vertexId) {
    if (!this.vertices.has(vertexId)) {
      return false;
    }

    const edgeIds = [...this.edges.values()]
      .filter((e) => e.fromId === vertexId || e.toId === vertexId)
      .map((e) => e.id);

    for (const edgeId of edgeIds) {
      this.removeEdge(edgeId);
    }

    this.vertices.delete(vertexId);
    removeAllAdjacencyForVertex(this.adjacency, vertexId);
    return true;
  }

  /**
   * @param {string} fromId
   * @param {string} toId
   * @returns {import('./Edge.js').Edge | null}
   */
  _findEdgeBetween(fromId, toId) {
    for (const edge of this.edges.values()) {
      if (edge.directed) {
        if (edge.fromId === fromId && edge.toId === toId) {
          return edge;
        }
      } else if (
        (edge.fromId === fromId && edge.toId === toId) ||
        (edge.fromId === toId && edge.toId === fromId)
      ) {
        return edge;
      }
    }
    return null;
  }

  /**
   * @param {string} fromId
   * @param {string} toId
   * @param {number} weight
   * @param {boolean} directed
   * @returns {import('./Edge.js').Edge}
   */
  addEdge(fromId, toId, weight, directed) {
    if (fromId === toId) {
      throw new GraphError('SAME_VERTEX', 'Ребро не может соединять вершину с собой');
    }
    if (weight < 0) {
      throw new GraphError('INVALID_WEIGHT', 'Вес должен быть неотрицательным');
    }
    if (!this.vertices.has(fromId) || !this.vertices.has(toId)) {
      throw new GraphError('VERTEX_NOT_FOUND', 'Вершина не найдена');
    }
    if (this._findEdgeBetween(fromId, toId)) {
      throw new GraphError('DUPLICATE_EDGE', 'Ребро между этими вершинами уже существует');
    }

    const id = this._nextEdgeId();
    const edge = createEdge({ id, fromId, toId, weight, directed });
    this.edges.set(id, edge);

    const entry = { toId, weight, edgeId: id };
    addAdjacencyEntry(this.adjacency, fromId, entry);

    if (!directed) {
      addAdjacencyEntry(this.adjacency, toId, {
        toId: fromId,
        weight,
        edgeId: id,
      });
    }

    return edge;
  }

  /**
   * @param {string} edgeId
   * @returns {boolean}
   */
  removeEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) {
      return false;
    }

    removeAdjacencyEntry(this.adjacency, edge.fromId, edgeId);

    if (!edge.directed) {
      removeAdjacencyEntry(this.adjacency, edge.toId, edgeId);
    }

    this.edges.delete(edgeId);
    return true;
  }

  /**
   * @param {string} vertexId
   * @param {number} x
   * @param {number} y
   * @returns {import('./Vertex.js').Vertex}
   */
  updateVertexPosition(vertexId, x, y) {
    const vertex = this.vertices.get(vertexId);
    if (!vertex) {
      throw new GraphError('VERTEX_NOT_FOUND', 'Вершина не найдена');
    }
    vertex.x = x;
    vertex.y = y;
    return vertex;
  }

  /**
   * @param {string} vertexId
   * @returns {import('./adjacency.js').AdjacencyEntry[]}
   */
  getNeighbors(vertexId) {
    return [...getAdjacencyList(this.adjacency, vertexId)];
  }

  clear() {
    this.vertices.clear();
    this.edges.clear();
    this.adjacency.clear();
    this._vertexCounter = 0;
    this._edgeCounter = 0;
  }
}
