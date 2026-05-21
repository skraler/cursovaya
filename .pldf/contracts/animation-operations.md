# Контракт: AnimationOperations

**Слой**: `src/ui/animationController.js`  
**Экран**: [workspace.html](../ui-prototype/workspace.html#animation)  
**Тип**: внутренний модуль (не HTTP)

## Операции

### playRouteAnimation

- **Триггер UI**: кнопка «▶ Пуск — анимация»
- **Предусловие**: `routeResult.success === true`
- **Вход**: `{ fullPathEdgeIds: string[] }`
- **Выход**: поток обновлений `animation` в Store
- **Поведение**:
  1. `isPlaying = true`
  2. Каждые ~700ms: `highlightedEdgeId = fullPathEdgeIds[stepIndex]`
  3. CSS: класс `animated` на SVG line — плавный зелёный `stroke` (как в прототипе)
  4. По завершении: все рёбра маршрута в состоянии `route`, `isPlaying = false`

### stopAnimation

- **Триггер UI**: повторный «Пуск» во время play или «Сбросить подсветку»
- **Вход**: `{}`
- **Выход**: `animation` в начальное состояние
