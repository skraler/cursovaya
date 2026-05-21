# Контекст реализации: step-08-graph-editing

**Завершён**: 21.05.2026

## Добавлено в шаге 08

- `Graph.updateEdge` + `syncEdgeWeight` в adjacency
- Редактирование ребра: двойной клик → модалка → `UPDATE_EDGE`
- Drag вершины без лишних dispatch (mouseup → `VERTEX_DRAG_END`, сброс маршрута)
- `invalidateRoute` при изменении графа
- Очистка холста останавливает анимацию (`animationController.stop`)

## Уже было из шагов 06–07

- move / delete vertex / delete edge / clear с confirm

## Курсовая готова (P1 + P2)

31 тест, `npm run build` OK.
