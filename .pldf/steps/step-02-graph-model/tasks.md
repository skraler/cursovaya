# Задачи: step-02-graph-model

**Зависимости**: step-01-project-setup  
**Покрытие P1**: режимы графа (ориент./неориент. ребро); база для визуального редактора

## Чек-лист

- [ ] `Graph.createEmpty()` — пустой граф
- [ ] `addVertex(x, y)` → Vertex с уникальным id и label A,B,C…
- [ ] `removeVertex(id)` — удаляет вершину и все связанные рёбра из edges и adjacency
- [ ] `addEdge(fromId, toId, weight, directed)`:
  - [ ] directed=true → одна запись в adjacency
  - [ ] directed=false → одна Edge + две симметричные записи adjacency
- [ ] `removeEdge(edgeId)` — корректная очистка adjacency (оба направления для undirected)
- [ ] `updateVertexPosition(id, x, y)`
- [ ] `getNeighbors(vertexId)` → массив `{ toId, weight, edgeId }`
- [ ] `clear()` — пустой граф
- [ ] `tests/graph.test.js`: минимум 8 тест-кейсов (см. tests.md)
