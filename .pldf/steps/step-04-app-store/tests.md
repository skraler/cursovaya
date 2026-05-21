# Тесты: step-04-app-store

| ID | Сценарий |
|----|----------|
| S1 | createInitialState — пустой graph |
| S2 | SET_TOOL_MODE меняет toolMode |
| S3 | ADD_VERTEX увеличивает vertices |
| S4 | SET_ROUTE_POINT start + finish + BUILD_ROUTE |
| S5 | BUILD_ROUTE недостижимость → error не null |
| S6 | subscribe вызывается после dispatch |
| S7 | CLEAR_GRAPH обнуляет состояние |

```bash
npm test -- tests/store.test.js
```
