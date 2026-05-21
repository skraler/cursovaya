# Задачи: step-03-dijkstra-route

**Зависимости**: step-02-graph-model

## Чек-лист

- [ ] `dijkstra(graph, fromId, toId)`:
  - [ ] distance + path при достижимости
  - [ ] `reachable: false` если нет пути
  - [ ] fromId === toId → distance 0, путь [fromId]
- [ ] `buildRoute(graph, routePlan)`:
  - [ ] Минимум 2 точки в pointIds
  - [ ] Цикл по парам (pointIds[i], pointIds[i+1])
  - [ ] `totalDistance` = сумма distance сегментов
  - [ ] `fullPathEdgeIds` без дублирования на стыках сегментов
  - [ ] При недостижимости: `success: false`, сегмент с reachable:false
- [ ] Тесты на графе из 4–5 вершин (как в прототипе A–B–C–D)
- [ ] Тест: разорванный граф → UNREACHABLE_SEGMENT
