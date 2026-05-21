# Задачи: step-02-graph-model

**Зависимости**: step-01-project-setup  
**Покрытие P1**: режимы графа (ориент./неориент. ребро); база для визуального редактора

## Чек-лист

- [x] `Graph.createEmpty()` — пустой граф
- [x] `addVertex(x, y)` → Vertex с уникальным id и label A,B,C…
- [x] `removeVertex(id)` — удаляет вершину и все связанные рёбра из edges и adjacency
- [x] `addEdge(fromId, toId, weight, directed)`:
  - [x] directed=true → одна запись в adjacency
  - [x] directed=false → одна Edge + две симметричные записи adjacency
- [x] `removeEdge(edgeId)` — корректная очистка adjacency (оба направления для undirected)
- [x] `updateVertexPosition(id, x, y)`
- [x] `getNeighbors(vertexId)` → массив `{ toId, weight, edgeId }`
- [x] `clear()` — пустой граф
- [x] `tests/graph.test.js`: минимум 8 тест-кейсов (см. tests.md)
