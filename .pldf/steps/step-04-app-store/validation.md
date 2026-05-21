# Критерии валидации шага 04: Store

## Критерии

- [ ] dispatch обновляет immutably или с предсказуемой мутацией (документировать)
- [ ] buildRoute использует routePlanner из step-03
- [ ] routePlan собирается через SET_ROUTE_POINT
- [ ] error заполняется при UNREACHABLE_SEGMENT
- [ ] Нет импорта из `ui/`
- [ ] Тесты S1–S7 проходят

### Покрытие P1

- [ ] «Выбор маршрута» (старт, финиш, промежуточные в routePlan)
- [ ] Связка расчёта с состоянием (кнопка buildRoute как action)

## Следующий шаг

step-05-ui-shell — `/pldf.plan`

---
**Статус**: Не начат
