# Тесты: step-01-project-setup

## Автоматические

| ID | Описание | Файл |
|----|----------|------|
| T1 | Vitest запускается | `tests/smoke.test.js` |
| T2 | (опционально) `npm run build` завершается без ошибки | — |

```bash
npm test
npm run build
```

## Ручные

| ID | Действие | Ожидание |
|----|----------|----------|
| R1 | `npm install` | exit 0 |
| R2 | `npm run dev` | localhost открывается, виден layout |
| R3 | DevTools Console | нет красных ошибок |

## Не в scope

- Тесты графа и Дейкстры — step-02, step-03
- UI по прототипу — поздние шаги
