import { renderToolbar, initToolbar } from './toolbar.js';
import { renderRoutePanel, initRoutePanel } from './routePanel.js';
import { initCanvasRenderer, renderCanvas } from './canvasRenderer.js';
import { initEdgeModal } from './edgeModal.js';

/**
 * @param {HTMLElement} root
 */
function createWorkspaceMarkup(root) {
  root.innerHTML = `
    <header class="top-bar">
      <h1>Визуализатор кратчайших маршрутов</h1>
    </header>
    <div class="layout">
      <aside class="panel-left" id="tools-panel" aria-label="Инструменты"></aside>
      <main class="canvas-wrap" id="canvas-wrap" aria-label="Холст графа"></main>
      <aside class="panel-right" id="route-panel" aria-label="Маршрут"></aside>
    </div>
    <div class="modal-overlay" id="edge-modal" role="dialog" aria-labelledby="modal-title">
      <div class="modal">
        <h3 id="modal-title">Новое ребро</h3>
        <label for="weight">Вес (расстояние)</label>
        <input type="number" id="weight" value="1" min="0" step="0.1" />
        <label for="edge-type">Тип связи</label>
        <select id="edge-type">
          <option value="undirected">Неориентированное (↔)</option>
          <option value="directed">Ориентированное (→)</option>
        </select>
        <div class="modal-actions">
          <button type="button" class="modal-cancel" id="modal-cancel">Отмена</button>
          <button type="button" class="modal-ok" id="modal-ok">Добавить</button>
        </div>
      </div>
    </div>
  `;

  const toolsPanel = root.querySelector('#tools-panel');
  toolsPanel.innerHTML = `
    <p class="panel-title">Инструменты · P1</p>
    <div class="tool-group">
      <button type="button" class="tool-btn active" data-tool="vertex">⊕ Вершина</button>
      <button type="button" class="tool-btn" data-tool="edge">⟷ Ребро (2 клика)</button>
    </div>
    <p class="panel-title">Маршрут · P1</p>
    <div class="tool-group">
      <button type="button" class="tool-btn" data-tool="start">▶ Старт</button>
      <button type="button" class="tool-btn" data-tool="waypoint">◎ Остановка</button>
      <button type="button" class="tool-btn" data-tool="finish">■ Финиш</button>
    </div>
    <p class="panel-title">Редактирование · P2</p>
    <div class="tool-group">
      <button type="button" class="tool-btn" data-tool="move">↔ Переместить</button>
      <button type="button" class="tool-btn" data-tool="delete-v">✕ Удалить вершину</button>
      <button type="button" class="tool-btn" data-tool="delete-e">⌇ Удалить ребро</button>
      <button type="button" class="tool-btn danger" data-tool="clear">Очистить холст</button>
    </div>
  `;

  const routePanel = root.querySelector('#route-panel');
  routePanel.innerHTML = `
    <p class="panel-title">Маршрут</p>
    <div class="error-banner" id="error-banner" role="alert"></div>
    <ol class="route-list" id="route-list"></ol>
    <div class="result-box" id="result-box" hidden>
      <div class="label">Суммарная длина маршрута</div>
      <div class="total" id="route-total">—</div>
      <div class="label route-segments" id="route-segments"></div>
    </div>
    <button type="button" class="btn-primary" id="btn-calc">Построить маршрут</button>
    <button type="button" class="btn-primary" id="btn-play" disabled>▶ Пуск — анимация</button>
    <button type="button" class="btn-secondary" id="btn-reset-anim">Сбросить подсветку</button>
    <p class="anim-status" id="anim-status"></p>
  `;
}

/**
 * @param {HTMLElement} appRoot
 * @param {ReturnType<import('../state/store.js').createStore>} store
 */
export function mountWorkspace(appRoot, store) {
  createWorkspaceMarkup(appRoot);

  const toolsPanel = appRoot.querySelector('#tools-panel');
  const routePanel = appRoot.querySelector('#route-panel');
  const canvasWrap = appRoot.querySelector('#canvas-wrap');
  const edgeModalOverlay = appRoot.querySelector('#edge-modal');

  initToolbar(toolsPanel, store);
  initRoutePanel(routePanel, store);
  const canvasApi = initCanvasRenderer(canvasWrap, store);
  const edgeModal = initEdgeModal(edgeModalOverlay, store);

  const render = () => {
    const state = store.getState();
    renderToolbar(state, toolsPanel);
    renderRoutePanel(state, routePanel);
    renderCanvas(state, canvasWrap, canvasApi);
    edgeModal.render(state);
  };

  store.subscribe(render);
  render();
}
