# Контекст реализации: step-04-app-store

**Завершён**: 21.05.2026

## Реализовано

- `toolModes.js`, `AppState.js`, `store.js` (`createStore`), `actions.js` (`reduce` + `ActionTypes`)
- Actions: SET_TOOL_MODE, ADD_VERTEX, REMOVE_VERTEX, EDGE_*, CONFIRM_EDGE, SET_ROUTE_POINT, BUILD_ROUTE, CLEAR_GRAPH, UPDATE_VERTEX_POSITION
- `edgeDraft` для двухфазного ребра
- `tests/store.test.js` — S1–S7 (27 тестов в проекте)

## Модель обновления

- `Graph` мутируется in-place; оболочка `AppState` копируется при смене route/animation/error
- `subscribe` вызывается после каждого `dispatch`

## Следующий шаг

`step-05-ui-workspace` — layout по прототипу, toolbar, route panel, подписка на Store.
