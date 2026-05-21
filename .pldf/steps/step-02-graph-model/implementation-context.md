# Контекст реализации: step-02-graph-model

**Завершён**: 21.05.2026

## Реализовано

- `Vertex.js`, `Edge.js` — фабрики сущностей
- `adjacency.js` — add/remove записей списка смежности
- `Graph.js` — add/remove вершин и рёбер, getNeighbors, clear, updateVertexPosition
- `index.js` — barrel export
- `GraphError` с кодами: `INVALID_WEIGHT`, `DUPLICATE_EDGE`, `SAME_VERTEX`, `VERTEX_NOT_FOUND`
- `tests/graph.test.js` — G1–G9 + clear + updatePosition (12 тестов всего в проекте)

## Решения

- ID: `v1`, `e1`…; метки: A, B, … (после Z — `V27`)
- Неориентированное ребро: одна `Edge` + две записи в adjacency
- Дубликат ребра: проверка пары вершин с учётом directed/undirected

## Следующий шаг

`step-03-dijkstra-route` — `dijkstra.js`, `routePlanner.js`.
