import { ActionTypes } from '../state/index.js';

/**
 * @param {HTMLElement} overlay
 * @param {import('../state/store.js').ReturnType<import('../state/store.js').createStore>} store
 */
export function initEdgeModal(overlay, store) {
  const title = overlay.querySelector('#modal-title');
  const weightInput = overlay.querySelector('#weight');
  const edgeTypeSelect = overlay.querySelector('#edge-type');
  const btnCancel = overlay.querySelector('#modal-cancel');
  const btnOk = overlay.querySelector('#modal-ok');

  btnCancel?.addEventListener('click', () => {
    store.dispatch(ActionTypes.CANCEL_EDGE_DRAFT);
    overlay.classList.remove('open');
  });

  btnOk?.addEventListener('click', () => {
    const weight = Number(weightInput?.value ?? 0);
    const directed = edgeTypeSelect?.value === 'directed';
    store.dispatch(ActionTypes.CONFIRM_EDGE, { weight, directed });
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      store.dispatch(ActionTypes.CANCEL_EDGE_DRAFT);
      overlay.classList.remove('open');
    }
  });

  return {
    /**
     * @param {import('../state/AppState.js').AppState} state
     */
    render(state) {
      const draft = state.edgeDraft;
      if (!draft?.fromId || !draft?.toId) {
        overlay.classList.remove('open');
        return;
      }

      const from = state.graph.vertices.get(draft.fromId);
      const to = state.graph.vertices.get(draft.toId);
      if (title) {
        title.textContent = `Новое ребро: ${from?.label ?? '?'} → ${to?.label ?? '?'}`;
      }
      overlay.classList.add('open');
    },
  };
}
