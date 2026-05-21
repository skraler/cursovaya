# Контракт: GraphOperations

**Слой**: `src/graph/`  
**Экран**: [workspace.html](../ui-prototype/workspace.html)  
**Тип**: внутренний модуль (не HTTP)

## Операции

### addVertex

- **Триггер UI**: режим `vertex`, клик по холсту
- **Вход**: `{ x: number, y: number }`
- **Выход**: `{ vertex: Vertex }`
- **Побочный эффект**: Store.graph обновлён, label = следующая буква A…Z

### removeVertex

- **Триггер UI**: режим `deleteVertex`, клик по вершине
- **Вход**: `{ vertexId: string }`
- **Выход**: `{ success: boolean }`
- **Побочный эффект**: удаление инцидентных рёбер; очистка routePlan от id

### addEdge

- **Триггер UI**: режим `edge`, два клика + модалка «Добавить»
- **Вход**: `{ fromId, toId, weight, directed }`
- **Выход**: `{ edge: Edge }` | `{ error: string }`
- **Ошибки**: `DUPLICATE_EDGE`, `INVALID_WEIGHT`, `SAME_VERTEX`

### removeEdge

- **Триггер UI**: режим `deleteEdge`, клик по ребру
- **Вход**: `{ edgeId: string }`
- **Выход**: `{ success: boolean }`

### updateVertexPosition

- **Триггер UI**: режим `move`, drag вершины
- **Вход**: `{ vertexId, x, y }`
- **Выход**: `{ vertex: Vertex }`

### clearGraph

- **Триггер UI**: кнопка «Очистить холст»
- **Вход**: `{}`
- **Выход**: `{ success: true }`
- **Побочный эффект**: пустой Graph, сброс routePlan и routeResult
