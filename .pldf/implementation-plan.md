# План реализации: Визуализатор кратчайших маршрутов

**Дата создания**: 21.05.2026  
**Основано на**: [concept.md](concept.md), [ui-design.md](ui-design.md), [tech-stack.md](tech-stack.md), [architecture.md](architecture.md)

## Обзор

Инкрементальная реализация: сначала домен (граф, Дейкстра), затем Store, затем UI по прототипу. P1 — рабочий редактор и маршрут; P2 — анимация «Пуск» и редактирование.

**Запланировано шагов**: 8 (планирование завершено)

## Шаги реализации

### Шаг 1: Настройка проекта Vite + Vitest

**Номер**: step-01-project-setup  
**Описание**: Инициализация репозитория приложения, структура `src/` по architecture.md, пустой экран запускается в браузере.  
**Зависимости**: нет  
**Приоритет**: инфраструктура (база для P1)

**Ссылка на детали**: [steps/step-01-project-setup/](steps/step-01-project-setup/)

---

### Шаг 2: Модель графа и список смежности

**Номер**: step-02-graph-model  
**Описание**: `src/graph/` — Vertex, Edge, Graph, adjacency list; directed/undirected; Vitest.  
**Зависимости**: step-01-project-setup  
**Приоритет**: P1 (режимы графа + база редактора)

**Ссылка на детали**: [steps/step-02-graph-model/](steps/step-02-graph-model/)

---

### Шаг 3: Алгоритм Дейкстры и построение маршрута

**Номер**: step-03-dijkstra-route  
**Описание**: `dijkstra.js`, `routePlanner.js`, Vitest; сегменты маршрута, недостижимость.  
**Зависимости**: step-02-graph-model  
**Приоритет**: P1

**Ссылка на детали**: [steps/step-03-dijkstra-route/](steps/step-03-dijkstra-route/)

---

### Шаг 4: Store и actions

**Номер**: step-04-app-store  
**Описание**: AppState, dispatch, subscribe; actions для графа, маршрута, buildRoute.  
**Зависимости**: step-03-dijkstra-route  
**Приоритет**: P1

**Ссылка на детали**: [steps/step-04-app-store/](steps/step-04-app-store/)

---

### Шаг 5: UI — рабочий экран (layout)

**Номер**: step-05-ui-workspace  
**Описание**: Вёрстка workspace, toolbar, route panel, subscribe на Store.  
**Зависимости**: step-04-app-store  
**Приоритет**: P1

**Ссылка**: [steps/step-05-ui-workspace/](steps/step-05-ui-workspace/)

---

### Шаг 6: SVG-холст (P1 завершение)

**Номер**: step-06-svg-canvas  
**Описание**: Редактор графа на SVG, модалка ребра, подсветка маршрута.  
**Зависимости**: step-05-ui-workspace  

**Ссылка**: [steps/step-06-svg-canvas/](steps/step-06-svg-canvas/)

---

### Шаг 7: Анимация маршрута (P2)

**Номер**: step-07-route-animation  
**Описание**: Кнопка «Пуск», пошаговая зелёная подсветка рёбер.  
**Зависимости**: step-06-svg-canvas  

**Ссылка**: [steps/step-07-route-animation/](steps/step-07-route-animation/)

---

### Шаг 8: Редактирование и очистка (P2 завершение)

**Номер**: step-08-graph-editing  
**Описание**: Удаление/перемещение, изменение весов, очистка холста.  
**Зависимости**: step-07-route-animation  

**Ссылка**: [steps/step-08-graph-editing/](steps/step-08-graph-editing/)

---

## Граф зависимостей

```
step-01-project-setup
    └── step-02-graph-model
            └── step-03-dijkstra-route
                    └── step-04-app-store
                            └── step-05-ui-workspace
                                    └── step-06-svg-canvas
                                            └── step-07-route-animation
                                                    └── step-08-graph-editing
```

**Параллельных шагов нет** — линейная цепочка для курсовой.

## Стратегия реализации

### Подход

MVP по P1, затем P2. Каждый шаг — отдельный коммит, тесты для логики до подключения UI.

### Порядок выполнения (планируемый)

1. **Фаза 0**: setup (step-01)
2. **Фаза 1 (P1)**: graph, dijkstra, store, UI editor, route build
3. **Фаза 2 (P2)**: animation, edit, clear

### Критерии завершения плана

Все функции P1 и P2 из concept.md покрыты шагами; каждый шаг имеет tests.md и validation.md.

## Тестирование

- **Unit**: Vitest для `graph/`, `algorithms/`
- **Ручное**: браузер для UI после step UI

---

**Статус**: Утверждено (все P1/P2 покрыты)  
**Утверждено**: 21.05.2026
