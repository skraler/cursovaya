# Модель данных: Визуализатор кратчайших маршрутов

**Основано на**: [ui-design.md](ui-design.md), [concept.md](concept.md)  
**Хранение**: в памяти браузера (без БД)

## Диаграмма сущностей

```
AppState
 ├── Graph
 │    ├── Vertex[]
 │    └── Edge[]  → AdjacencyList
 ├── RoutePlan (ordered vertex ids)
 ├── RouteResult
 └── UiState (toolMode, animation, errors)
```

## Сущности

### Vertex (вершина)

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | да | Уникальный ID (`"v1"`, `"v2"`, …) |
| `label` | string | да | Подпись на холсте (`A`, `B`, … — авто по порядку создания) |
| `x` | number | да | Координата на холсте (px, SVG viewBox) |
| `y` | number | да | Координата на холсте |
| `role` | enum | да | `none` \| `start` \| `waypoint` \| `finish` |

**Правила:**
- Только одна вершина с `role: start` и одна с `role: finish`.
- `waypoint` — порядок в маршруте задаётся в `RoutePlan`, не в вершине.
- При удалении вершины удаляются все инцидентные рёбра.

---

### Edge (ребро)

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | да | Уникальный ID |
| `fromId` | string | да | ID начальной вершины |
| `toId` | string | да | ID конечной вершины |
| `weight` | number | да | Вес ≥ 0 |
| `directed` | boolean | да | `true` — только from→to; `false` — двунаправленное |

**Правила:**
- `weight` валидируется в модалке: `>= 0`, число.
- **Неориентированное** ребро в `Graph`: одна запись `Edge` + **две** записи в списке смежности (from→to и to→from с тем же весом).
- **Ориентированное**: одна запись в списке смежности.
- Запрет петли (from === to) на этапе P1 — опционально P2.

---

### Graph (граф)

| Поле | Тип | Описание |
|------|-----|----------|
| `vertices` | `Map<string, Vertex>` | Все вершины по id |
| `edges` | `Map<string, Edge>` | Все рёбра по id |
| `adjacency` | `Map<string, AdjacencyEntry[]>` | Список смежности |

**AdjacencyEntry:**

| Поле | Тип | Описание |
|------|-----|----------|
| `toId` | string | Соседняя вершина |
| `weight` | number | Вес ребра |
| `edgeId` | string | Ссылка на `Edge` для подсветки UI |

**Операции (домен):** `addVertex`, `removeVertex`, `addEdge`, `removeEdge`, `getNeighbors`, `updateVertexPosition`.

---

### RoutePlan (план маршрута)

| Поле | Тип | Описание |
|------|-----|----------|
| `pointIds` | string[] | Упорядоченный список: `[startId, ...waypointIds, finishId]` |

**Правила:**
- Минимум 2 точки (старт и финиш).
- Порядок промежуточных остановок **фиксирован** пользователем.
- Собирается кликами в режимах инструментов (см. прототип).

---

### RouteSegmentResult (результат одного сегмента)

| Поле | Тип | Описание |
|------|-----|----------|
| `fromId` | string | Начало сегмента |
| `toId` | string | Конец сегмента |
| `pathVertexIds` | string[] | Кратчайший путь (включая from и to) |
| `pathEdgeIds` | string[] | Рёбра пути по порядку |
| `distance` | number | Сумма весов сегмента |
| `reachable` | boolean | false если пути нет |

---

### RouteResult (полный маршрут)

| Поле | Тип | Описание |
|------|-----|----------|
| `segments` | RouteSegmentResult[] | По одному на пару соседних точек в `RoutePlan` |
| `totalDistance` | number | Сумма `distance` достижимых сегментов |
| `fullPathEdgeIds` | string[] | Склейка `pathEdgeIds` всех сегментов |
| `fullPathVertexIds` | string[] | Склейка вершин без дублирования стыков |
| `success` | boolean | true если все сегменты reachable |

---

### AnimationState (анимация P2)

| Поле | Тип | Описание |
|------|-----|----------|
| `isPlaying` | boolean | Идёт ли анимация |
| `stepIndex` | number | Текущий шаг (индекс ребра в `fullPathEdgeIds`) |
| `highlightedEdgeId` | string \| null | Ребро, подсвеченное на текущем шаге |

---

### AppState (корневое состояние Store)

| Поле | Тип | Описание |
|------|-----|----------|
| `graph` | Graph | Текущий граф |
| `toolMode` | ToolMode | Активный инструмент |
| `routePlan` | RoutePlan | Выбранные точки маршрута |
| `routeResult` | RouteResult \| null | Последний расчёт |
| `animation` | AnimationState | Состояние «Пуск» |
| `error` | string \| null | Сообщение (недостижимость и т.д.) |
| `edgeDraft` | EdgeDraft \| null | Временные данные при создании ребра (2-й клик) |

**ToolMode (enum):**
`vertex` | `edge` | `start` | `waypoint` | `finish` | `move` | `deleteVertex` | `deleteEdge`

**EdgeDraft:**

| Поле | Тип | Описание |
|------|-----|----------|
| `fromId` | string | Первая выбранная вершина |
| `toId` | string \| null | Вторая после второго клика |

---

## Переходы состояний (UI)

```
[toolMode] + клик по холсту/вершине
    → обновление graph | routePlan | edgeDraft

[Построить маршрут]
    → routeResult = RoutePlanner.compute(...)
    → error если !success

[▶ Пуск]
    → animation.isPlaying = true
    → по таймеру stepIndex++, highlightedEdgeId

[Сбросить подсветку]
    → animation сброс, routeResult подсветка только static route
```

## Валидация

| Правило | Сообщение пользователю |
|---------|------------------------|
| weight < 0 | «Вес должен быть неотрицательным» |
| сегмент недостижим | «Между точками X и Y нет пути» |
| нет старта или финиша | «Укажите старт и финиш» |
| routePlan < 2 точек | «Добавьте минимум старт и финиш» |

## Связь с UI (прототип workspace.html)

| UI элемент | Поля модели |
|------------|-------------|
| Список маршрута справа | `routePlan.pointIds` + roles вершин |
| Суммарная длина | `routeResult.totalDistance` |
| Сегменты A→B: 4 | `routeResult.segments[].distance` |
| Подсветка рёбер | `routeResult.fullPathEdgeIds` |
| Баннер ошибки | `error` |
| Модалка ребра | `weight`, `directed` → `Edge` |

## Нормализация

- Один источник правды: **AppState** (Store).
- UI не дублирует `Graph` — только читает snapshot из Store при `render()`.
- Алгоритмы **чистые функции** над `Graph` + ids (тестируются Vitest без DOM).
