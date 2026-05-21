# Шаг 02: Модель графа и список смежности

**Номер**: step-02-graph-model  
**Дата создания**: 21.05.2026  
**Зависимости**: step-01-project-setup

## Описание

Реализовать доменный слой `src/graph/`: классы/модули `Vertex`, `Edge`, `Graph` со **списком смежности** по [data-model.md](../../data-model.md). Операции: добавление и удаление вершин и рёбер, обновление позиции вершины, получение соседей. Поддержка **ориентированных** и **неориентированных** рёбер (две записи в adjacency для undirected).

Без UI и без Store — только чистая логика + Vitest. Это основа для редактора на холсте и для Дейкстры (шаг 03).

## Задачи

- [ ] `src/graph/Vertex.js` — создание вершины, поля id, label, x, y, role — [data-model.md](../../data-model.md#vertex-вершина)
- [ ] `src/graph/Edge.js` — ребро с directed, weight — [data-model.md](../../data-model.md#edge-ребро)
- [ ] `src/graph/adjacency.js` — add/remove записей в списке смежности
- [ ] `src/graph/Graph.js` — агрегат: `addVertex`, `removeVertex`, `addEdge`, `removeEdge`, `updateVertexPosition`, `getNeighbors`, `clear`
- [ ] Автогенерация `label` (A, B, C…) при добавлении вершины
- [ ] Валидация: weight ≥ 0, запрет дублирующего ребра (опционально петля)
- [ ] `tests/graph.test.js` — сценарии из [tests.md](tests.md)
- [ ] Экспорт публичного API из `src/graph/index.js` (barrel)

## Тесты

### Автоматические тесты

См. [tests.md](tests.md) — `npm test`

### Ручные тесты

Не требуются (слой без UI).

## Валидация

См. [validation.md](validation.md)

## Связанные артефакты

- **Модели данных**: [data-model.md](../../data-model.md) — Vertex, Edge, Graph, AdjacencyEntry
- **Контракты**: [contracts/graph-operations.md](../../contracts/graph-operations.md) — addVertex, addEdge, removeVertex, removeEdge, clearGraph
- **UI**: N/A на этом шаге

---

**Статус**: Не начат  
**Завершен**: —
