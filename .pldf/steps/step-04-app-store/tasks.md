# Задачи: step-04-app-store

**Зависимости**: step-03-dijkstra-route

## Чек-лист

- [ ] `createInitialState()` — пустой graph, toolMode: vertex, routePlan пуст
- [ ] `SET_TOOL_MODE` action
- [ ] `ADD_VERTEX` — клик (x, y) → graph.addVertex
- [ ] `EDGE_FIRST_CLICK` / `EDGE_SECOND_CLICK` + `CONFIRM_EDGE` (weight, directed)
- [ ] `SET_ROUTE_POINT` — обновление routePlan, роли вершин
- [ ] `BUILD_ROUTE` — routePlanner.buildRoute → routeResult
- [ ] `CLEAR_GRAPH` — сброс graph, route, result, error
- [ ] subscribe(listener) — вызывается после каждого dispatch
- [ ] Тест: dispatch BUILD_ROUTE на графе A–B–C–D → totalDistance 14
