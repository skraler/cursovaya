# Задачи: step-01-project-setup

**Зависимости**: нет  
**Связанные артефакты**: [architecture.md](../../architecture.md), [tech-stack.md](../../tech-stack.md)

## Чек-лист

- [ ] Инициализировать `package.json` (type: module, scripts: dev, build, test, preview)
- [ ] Установить `vite`, `vitest` как devDependencies
- [ ] Настроить `vite.config.js` (root, src, public)
- [ ] Настроить `vitest.config.js` (environment: node, include: tests/**)
- [ ] Создать `index.html` с `<div id="app">` и script `src/main.js`
- [ ] `src/main.js` — рендер минимального layout (header + 3 колонки-заглушки)
- [ ] `src/styles/workspace.css` — цвета из ui-prototype (схематичный стиль)
- [ ] Пустые `.gitkeep` или заглушки в `src/graph`, `algorithms`, `state`, `ui`
- [ ] `tests/smoke.test.js`
- [ ] Корневой `README.md` с командами запуска

## Критерий готовности

`npm run dev` и `npm test` выполняются успешно на чистой машине с Node 20+.
