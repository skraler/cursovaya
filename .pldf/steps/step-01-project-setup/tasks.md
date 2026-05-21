# Задачи: step-01-project-setup

**Зависимости**: нет  
**Связанные артефакты**: [architecture.md](../../architecture.md), [tech-stack.md](../../tech-stack.md)

## Чек-лист

- [x] Инициализировать `package.json` (type: module, scripts: dev, build, test, preview)
- [x] Установить `vite`, `vitest` как devDependencies
- [x] Настроить `vite.config.js` (root, src, public)
- [x] Настроить `vitest.config.js` (environment: node, include: tests/**)
- [x] Создать `index.html` с `<div id="app">` и script `src/main.js`
- [x] `src/main.js` — рендер минимального layout (header + 3 колонки-заглушки)
- [x] `src/styles/workspace.css` — цвета из ui-prototype (схематичный стиль)
- [x] Пустые `.gitkeep` или заглушки в `src/graph`, `algorithms`, `state`, `ui`
- [x] `tests/smoke.test.js`
- [x] Корневой `README.md` с командами запуска

## Критерий готовности

`npm run dev` и `npm test` выполняются успешно на чистой машине с Node 20+.
