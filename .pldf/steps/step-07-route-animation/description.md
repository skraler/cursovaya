# Шаг 07: Анимация маршрута (кнопка «Пуск»)

**Номер**: step-07-route-animation  
**Дата создания**: 21.05.2026  
**Зависимости**: step-06-svg-canvas

## Описание

Реализовать **P2: пошаговая анимация** по требованию студента:

- Кнопка **«▶ Пуск»** в правой панели
- `animationController.js` — таймер ~700ms, шаг по `routeResult.fullPathEdgeIds`
- Плавное закрашивание ребра зелёным (`stroke` transition, класс `animated`)
- Состояние `animation` в Store: `PLAY_ANIMATION`, `TICK`, `STOP`
- Кнопка **«Сбросить подсветку»** — сброс анимации

См. прототип: [workspace.html](../../ui-prototype/workspace.html) (скрипт playAnimation).

## Связанные артефакты

- [contracts/animation-operations.md](../../contracts/animation-operations.md)
- [ui-design.md](../../ui-design.md) — анимация P2

---

**Статус**: Не начат  
**Завершен**: —
