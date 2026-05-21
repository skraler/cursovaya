# Задачи: step-04-app-store

**Зависимости**: step-03-dijkstra-route

## Чек-лист

- [x] `createInitialState()` — пустой graph, toolMode: vertex, routePlan пуст
- [x] `SET_TOOL_MODE` action
- [x] `ADD_VERTEX` — клик (x, y) → graph.addVertex
- [x] `EDGE_FIRST_CLICK` / `EDGE_SECOND_CLICK` + `CONFIRM_EDGE` (weight, directed)
- [x] `SET_ROUTE_POINT` — обновление routePlan, роли вершин
- [x] `BUILD_ROUTE` — routePlanner.buildRoute → routeResult
- [x] `CLEAR_GRAPH` — сброс graph, route, result, error
- [x] subscribe(listener) — вызывается после каждого dispatch
- [x] Тест: dispatch BUILD_ROUTE на графе A–B–D → totalDistance 14
