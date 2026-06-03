import { DREExecutiveDataMapper } from '../core/runtime/dre/DREExecutiveDataMapper';

const payload = {
  netRevenue: 100000,
  cogs: -50000,
  adminExpenses: -20000,
  ebitda: 30000,
  netProfit: 10000,
  breakEvenRevenue: 80000,
  grossProfit: 50000
};

const result = DREExecutiveDataMapper.map(payload);
console.log('Result keys:', Object.keys(result));
console.log('Result.executiveMetrics:', result.executiveMetrics);
