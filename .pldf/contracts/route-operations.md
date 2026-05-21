# Контракт: RouteOperations

**Слой**: `src/algorithms/`, `src/state/`  
**Экран**: [workspace.html](../ui-prototype/workspace.html)  
**Тип**: внутренний модуль (не HTTP)

## Операции

### setRoutePoint

- **Триггер UI**: режим `start` | `waypoint` | `finish`, клик по вершине
- **Вход**: `{ vertexId: string, role: 'start' | 'waypoint' | 'finish' }`
- **Выход**: `{ routePlan: RoutePlan }`
- **Правила**:
  - `start` / `finish` — заменяют предыдущую точку с той же ролью
  - `waypoint` — добавляют в конец списка (перед финишем, если финиш уже есть — вставка по правилу Store)

### removeRoutePoint

- **Триггер UI**: (P2) кнопка удаления в списке справа — опционально
- **Вход**: `{ index: number }`
- **Выход**: `{ routePlan: RoutePlan }`

### buildRoute

- **Триггер UI**: кнопка «Построить маршрут»
- **Вход**: `{ graph: Graph, routePlan: RoutePlan }`
- **Выход**: `{ routeResult: RouteResult }` | `{ error: string }`
- **Логика**:
  1. Для каждой пары соседних id в `pointIds` вызвать `dijkstra(graph, from, to)`
  2. Склеить сегменты в `fullPathEdgeIds` / `fullPathVertexIds`
  3. Если любой сегмент `reachable: false` → `success: false`, `error` в Store

### resetRouteHighlight

- **Триггер UI**: «Сбросить подсветку»
- **Вход**: `{}`
- **Выход**: сброс `animation`, статическая подсветка из `routeResult`
