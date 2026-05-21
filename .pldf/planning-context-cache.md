# Кэш контекста планирования

**Дата создания**: 21.05.2026  
**Дата последнего обновления**: 21.05.2026

## Краткое резюме архитектуры

Клиентское SPA: слои `graph` → `algorithms` → `state` (Store) → `ui` (SVG). Один экран workspace: левая панель инструментов, центральный холст, правая панель маршрута и «Пуск». Без backend и БД.

## Ключевые технические решения

- JavaScript + Vite + Vitest
- Список смежности для графа
- Дейкстра по сегментам маршрута (старт → остановки → финиш)
- Единый AppState + dispatch/subscribe
- P3 (сохранение/экспорт) исключён

## Структура данных

Vertex, Edge, Graph (adjacency), RoutePlan, RouteResult, AnimationState, AppState, ToolMode. См. `data-model.md`.

## Паттерны и подходы

- Layered architecture
- Centralized Store
- Чистые функции в `algorithms/` для тестов

## Основные зависимости между компонентами

```
ui → state/actions → graph | algorithms
algorithms → graph (read-only)
state → ui (render on subscribe)
```

Планируемая последовательность: setup → graph+tests → dijkstra+routePlanner → store → ui shell → editor → route → animation → edit/clear.
