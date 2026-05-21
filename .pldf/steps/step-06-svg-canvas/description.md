# Шаг 06: SVG-холст — редактор графа и подсветка маршрута

**Номер**: step-06-svg-canvas  
**Дата создания**: 21.05.2026  
**Зависимости**: step-05-ui-workspace

## Описание

Заменить заглушку холста полноценным **SVG-редактором** по прототипу:

- Отрисовка вершин, рёбер, весов, стрелок (directed)
- Клики по холсту/вершинам → `dispatch` (vertex, edge 2-click, start/waypoint/finish)
- Модалка ребра (вес, directed) → `CONFIRM_EDGE`
- После `BUILD_ROUTE` — класс `route` на рёбрах из `routeResult.fullPathEdgeIds`
- Роли вершин: стили start / waypoint / finish

Завершает **все функции P1** из концепции.

## Связанные артефакты

- [ui-prototype/workspace.html](../../ui-prototype/workspace.html)
- [contracts/graph-operations.md](../../contracts/graph-operations.md)
- [data-model.md](../../data-model.md)

---

**Статус**: Завершен  
**Завершен**: 21.05.2026
