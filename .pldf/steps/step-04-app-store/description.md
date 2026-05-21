# Шаг 04: Store и actions (состояние приложения)

**Номер**: step-04-app-store  
**Дата создания**: 21.05.2026  
**Зависимости**: step-03-dijkstra-route

## Описание

Реализовать слой `src/state/`: единый **AppState** и **Store** (getState, dispatch, subscribe) по [architecture.md](../../architecture.md). **actions** связывают UI-события с `graph/` и `algorithms/`:

- смена `toolMode`
- `addVertex`, `addEdge`, `removeVertex`, `removeEdge`, `clearGraph`
- `setRoutePoint` (start / waypoint / finish)
- `buildRoute` → вызывает `routePlanner`, пишет `routeResult` или `error`

Без отрисовки SVG — только состояние. Для проверки: unit-тесты dispatch и подписки.

## Задачи

- [ ] `src/state/toolModes.js` — константы режимов
- [ ] `src/state/AppState.js` — `createInitialState()`
- [ ] `src/state/store.js` — subscribe / getState / dispatch
- [ ] `src/state/actions.js` — обработчики по [contracts/](../../contracts/)
- [ ] `edgeDraft` для двухфазного создания ребра
- [ ] `tests/store.test.js` — buildRoute на тестовом графе в state

## Связанные артефакты

- [data-model.md](../../data-model.md) — AppState, ToolMode, RoutePlan
- [contracts/graph-operations.md](../../contracts/graph-operations.md)
- [contracts/route-operations.md](../../contracts/route-operations.md)

---

**Статус**: Завершен  
**Завершен**: 21.05.2026
