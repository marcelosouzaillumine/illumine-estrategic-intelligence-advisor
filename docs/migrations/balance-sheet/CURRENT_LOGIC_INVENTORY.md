# Current Logic Inventory (Balance Sheet)

## 1. Firebase Listeners (Data Fetching)
- `onSnapshot` query on `financial_positions` collection for the `selectedClient`.
- Raw financial documents mapped directly to React state `positions`.
- Bank transaction queries built on top of positions (`deleteDoc`, `writeBatch`).

## 2. Hardcoded Calculations
- `exchangeRates` object created via useMemo directly on the page, extracting Dólar and Euro rates from `DATA.premissas.economicas` or defaulting to `4.90` and `5.77`.
- `financialMath.aggregatePositions(positions, exchangeRates)` computing total initial, total current, and variation percentage.
- `financialMath.aggregateHistory(positions, exchangeRates, monthOrder)` building historical trends.

## 3. UI Presentation Logic
- `varPerc = p.saldoInicial !== 0 ? (varAbs / p.saldoInicial) * 100 : 0` calculated inside the JSX map.
- Colors hardcoded (`text-emerald-600`, `text-rose-600`) depending on positive/negative variation logic in UI.
- Pie chart values manually multiplied by `exchangeRates` rate.

Toda essa lógica deve transitar para a `BalanceSheetCapability` e ser servida pronta para o frontend via uma interface comum `ExecutiveAnalyticsResult`.
