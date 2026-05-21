# Критерии валидации шага 04: Store

## Критерии

- [x] dispatch обновляет immutably или с предсказуемой мутацией (документировать)
- [x] buildRoute использует routePlanner из step-03
- [x] routePlan собирается через SET_ROUTE_POINT
- [x] error заполняется при UNREACHABLE_SEGMENT
- [x] Нет импорта из `ui/`
- [x] Тесты S1–S7 проходят

### Покрытие P1

- [ ] «Выбор маршрута» (старт, финиш, промежуточные в routePlan)
- [ ] Связка расчёта с состоянием (кнопка buildRoute как action)

## Следующий шаг

step-05-ui-shell — `/pldf.plan`

---
**Статус**: Завершен (21.05.2026)
