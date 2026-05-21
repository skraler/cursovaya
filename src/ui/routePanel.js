import { ActionTypes, ROUTE_ROLES } from '../state/index.js';

/**
 * @param {import('../state/AppState.js').AppState} state
 */
function formatSegmentSummary(state) {
  const { routeResult, graph } = state;
  if (!routeResult?.success) return '';

  return routeResult.segments
    .filter((s) => s.reachable)
    .map((s) => {
      const from = graph.vertices.get(s.fromId)?.label ?? '?';
      const to = graph.vertices.get(s.toId)?.label ?? '?';
      return `${from}→${to}: ${s.distance}`;
    })
    .join(' · ');
}

/**
 * @param {HTMLElement} panel
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 */
export function initRoutePanel(panel, store) {
  panel.querySelector('#btn-calc')?.addEventListener('click', () => {
    store.dispatch(ActionTypes.BUILD_ROUTE);
  });

  panel.querySelector('#btn-reset-anim')?.addEventListener('click', () => {
    store.dispatch(ActionTypes.RESET_ANIMATION);
  });

  panel.querySelector('#btn-play')?.addEventListener('click', () => {
    const status = panel.querySelector('#anim-status');
    if (status) {
      status.textContent = 'Анимация «Пуск» будет в шаге 07.';
    }
  });
}

/**
 * @param {import('../state/AppState.js').AppState} state
 * @param {HTMLElement} panel
 */
export function renderRoutePanel(state, panel) {
  const errorBanner = panel.querySelector('#error-banner');
  const routeList = panel.querySelector('#route-list');
  const resultBox = panel.querySelector('#result-box');
  const totalEl = panel.querySelector('#route-total');
  const segmentsEl = panel.querySelector('#route-segments');
  const animStatus = panel.querySelector('#anim-status');
  const btnPlay = panel.querySelector('#btn-play');

  if (errorBanner) {
    if (state.error) {
      errorBanner.textContent = state.error;
      errorBanner.classList.add('visible');
    } else {
      errorBanner.classList.remove('visible');
    }
  }

  if (routeList) {
    routeList.innerHTML = '';
    let waypointIndex = 0;

    for (const vertexId of state.routePlan.pointIds) {
      const vertex = state.graph.vertices.get(vertexId);
      if (!vertex) continue;

      const li = document.createElement('li');
      const badge = document.createElement('span');
      badge.className = 'badge';

      if (vertex.role === ROUTE_ROLES.START) {
        badge.classList.add('badge-start');
        badge.textContent = 'Старт';
      } else if (vertex.role === ROUTE_ROLES.FINISH) {
        badge.classList.add('badge-finish');
        badge.textContent = 'Финиш';
      } else {
        waypointIndex += 1;
        badge.classList.add('badge-stop');
        badge.textContent = String(waypointIndex);
      }

      li.append(badge, document.createTextNode(` ${vertex.label}`));
      routeList.append(li);
    }

    if (state.routePlan.pointIds.length === 0) {
      const li = document.createElement('li');
      li.className = 'route-list__empty';
      li.textContent = 'Выберите старт и финиш на графе';
      routeList.append(li);
    }
  }

  if (resultBox && totalEl && segmentsEl) {
    if (state.routeResult?.success) {
      resultBox.hidden = false;
      totalEl.textContent = String(state.routeResult.totalDistance);
      segmentsEl.textContent = formatSegmentSummary(state);
    } else {
      resultBox.hidden = true;
      totalEl.textContent = '—';
      segmentsEl.textContent = '';
    }
  }

  if (btnPlay) {
    btnPlay.disabled = !state.routeResult?.success;
  }

  if (animStatus) {
    if (state.animation.isPlaying) {
      animStatus.textContent = 'Анимация…';
    } else if (state.routeResult?.success) {
      animStatus.textContent =
        'Маршрут построен. «Пуск» — в следующем шаге реализации.';
    } else {
      animStatus.textContent =
        'Нажмите «Построить маршрут» после выбора старта и финиша.';
    }
  }
}
