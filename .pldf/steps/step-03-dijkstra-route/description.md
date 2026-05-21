# Шаг 03: Алгоритм Дейкстры и построение маршрута

**Номер**: step-03-dijkstra-route  
**Дата создания**: 21.05.2026  
**Зависимости**: step-02-graph-model

## Описание

Реализовать `src/algorithms/` без UI:

1. **`dijkstra.js`** — кратчайший путь между двумя вершинами на `Graph` (веса ≥ 0). Возврат: `pathVertexIds`, `pathEdgeIds`, `distance`, `reachable`.

2. **`routePlanner.js`** — для `RoutePlan.pointIds` [A, B, C, D] вызывает Дейкстру на каждом сегменте (A→B, B→C, C→D), склеивает результат в `RouteResult` по [data-model.md](../../data-model.md).

3. Вспомогательные типы/фабрики: `RoutePlan`, `RouteSegmentResult`, `RouteResult` (plain objects).

При недостижимом сегменте — `success: false`, понятный код ошибки для Store.

## Задачи

- [ ] `src/algorithms/dijkstra.js` — min-heap или линейный поиск (≤50 вершин допустимо)
- [ ] `src/algorithms/routePlanner.js` — `buildRoute(graph, routePlan)`
- [ ] `src/algorithms/types.js` — фабрики RoutePlan, RouteResult (опционально)
- [ ] `src/algorithms/index.js` — экспорт
- [ ] `tests/dijkstra.test.js` — простой граф, недостижимость, undirected
- [ ] `tests/routePlanner.test.js` — 2–3 сегмента, склейка path, totalDistance

## Связанные артефакты

- [data-model.md](../../data-model.md) — RoutePlan, RouteSegmentResult, RouteResult
- [contracts/route-operations.md](../../contracts/route-operations.md) — buildRoute
- [openapi.yaml](../../contracts/openapi.yaml) — `/internal/route/build`

---

**Статус**: Не начат  
**Завершен**: —
