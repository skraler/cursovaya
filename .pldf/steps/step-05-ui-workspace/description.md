# Шаг 05: UI — рабочий экран (layout + связка со Store)

**Номер**: step-05-ui-workspace  
**Дата создания**: 21.05.2026  
**Зависимости**: step-04-app-store

## Описание

Сверстать **главный экран** по [workspace.html](../../ui-prototype/workspace.html) и [ui-design.md](../../ui-design.md):

- Три колонки: toolbar слева, область холста по центру, панель маршрута справа
- Стили `workspace.css` (светлая схематичная тема)
- `main.js` — createStore, subscribe → render
- Кнопки инструментов → `dispatch(SET_TOOL_MODE)`
- Кнопки «Построить маршрут», «Сбросить» → actions (без SVG-графа пока — заглушка «Граф: N вершин» на холсте)
- Правая панель: список `routePlan`, `totalDistance` из `routeResult`, баннер `error`

**Не в scope шага:** отрисовка SVG вершин/рёбер (шаг 06), анимация «Пуск» (шаг 08).

## Связанные артефакты

- [ui-prototype/workspace.html](../../ui-prototype/workspace.html)
- [ui-design.md](../../ui-design.md)

---

**Статус**: Не начат  
**Завершен**: —
