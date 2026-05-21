# Тесты: step-02-graph-model

## Автоматические (Vitest)

| ID | Сценарий | Ожидание |
|----|----------|----------|
| G1 | Пустой граф | vertices.size === 0 |
| G2 | addVertex | вершина в Map, label "A" |
| G3 | Две вершины | labels "A", "B" |
| G4 | directed edge A→B weight 5 | одна запись в adjacency[A] |
| G5 | undirected edge A—B weight 3 | adjacency[A] и adjacency[B] симметричны |
| G6 | removeVertex | рёбра инцидентные удалены |
| G7 | removeEdge undirected | обе стороны adjacency очищены |
| G8 | weight < 0 | throw или reject |
| G9 | getNeighbors | корректные toId и weight |

```bash
npm test -- tests/graph.test.js
```

## Ручные

N/A
