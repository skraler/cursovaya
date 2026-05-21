# Тесты: step-03-dijkstra-route

## Автоматические

| ID | Модуль | Сценарий |
|----|--------|----------|
| D1 | dijkstra | Прямое ребро A–B weight 4 |
| D2 | dijkstra | Обход через третью вершину дешевле |
| D3 | dijkstra | Недостижимая вершина |
| D4 | dijkstra | from === to |
| R1 | routePlanner | A→B→D на демо-графе, totalDistance = 14 |
| R2 | routePlanner | Сегмент недостижим → success false |
| R3 | routePlanner | fullPathEdgeIds порядок корректен |
| R4 | routePlanner | pointIds < 2 → ошибка |

```bash
npm test -- tests/dijkstra.test.js tests/routePlanner.test.js
```

## Ручные

N/A
