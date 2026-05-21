# Контекст планирования: Шаг 04 - Store

**Шаг**: step-04-app-store  
**Дата**: 2026-05-21  
**Итерация**: 4

## Почему

После graph + algorithms нужен единый Store (решение architecture). UI (шаг 05+) будет только dispatch и subscribe.

## Зависимости

- step-03-dijkstra-route

## P1 покрытие

- Выбор маршрута (routePlan, роли вершин)
- Интеграция buildRoute в состояние

## Решения

- **dispatch + reducer-style** actions — проще тестировать, чем event bus
- **edgeDraft** в state для 2-кликового ребра

**Сложность**: Средняя | **Время**: 4–5 ч

**Готов к реализации**: Да (после step-03)
