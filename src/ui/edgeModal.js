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

  const close = () => {
    overlay.classList.remove('open');
  };

  btnCancel?.addEventListener('click', () => {
    const state = store.getState();
    if (state.editingEdgeId) {
      store.dispatch(ActionTypes.CANCEL_EDGE_EDITOR);
    } else {
      store.dispatch(ActionTypes.CANCEL_EDGE_DRAFT);
    }
    close();
  });

  btnOk?.addEventListener('click', () => {
    const state = store.getState();
    const weight = Number(weightInput?.value ?? 0);
    const directed = edgeTypeSelect?.value === 'directed';

    if (state.editingEdgeId) {
      store.dispatch(ActionTypes.UPDATE_EDGE, {
        edgeId: state.editingEdgeId,
        weight,
        directed,
      });
    } else {
      store.dispatch(ActionTypes.CONFIRM_EDGE, { weight, directed });
    }
    close();
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      const state = store.getState();
      if (state.editingEdgeId) {
        store.dispatch(ActionTypes.CANCEL_EDGE_EDITOR);
      } else {
        store.dispatch(ActionTypes.CANCEL_EDGE_DRAFT);
      }
      close();
    }
  });

  return {
    /**
     * @param {import('../state/AppState.js').AppState} state
     */
    render(state) {
      const draft = state.edgeDraft;
      const editingId = state.editingEdgeId;

      if (editingId) {
        const edge = state.graph.edges.get(editingId);
        if (!edge) {
          overlay.classList.remove('open');
          return;
        }
        const from = state.graph.vertices.get(edge.fromId);
        const to = state.graph.vertices.get(edge.toId);
        if (title) {
          title.textContent = `Редактировать ребро: ${from?.label ?? '?'} → ${to?.label ?? '?'}`;
        }
        if (weightInput) {
          weightInput.value = String(edge.weight);
        }
        if (edgeTypeSelect) {
          edgeTypeSelect.value = edge.directed ? 'directed' : 'undirected';
        }
        overlay.classList.add('open');
        return;
      }

      if (!draft?.fromId || !draft?.toId) {
        overlay.classList.remove('open');
        return;
      }

      const from = state.graph.vertices.get(draft.fromId);
      const to = state.graph.vertices.get(draft.toId);
      if (title) {
        title.textContent = `Новое ребро: ${from?.label ?? '?'} → ${to?.label ?? '?'}`;
      }
      if (weightInput) {
        weightInput.value = '1';
      }
      if (edgeTypeSelect) {
        edgeTypeSelect.value = 'undirected';
      }
      overlay.classList.add('open');
    },
  };
}
