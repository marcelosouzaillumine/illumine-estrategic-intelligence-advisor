import { DreExecutiveViewModelBuilder } from '../core/runtime/dre/DreExecutiveViewModelBuilder.ts';

const rawPayload = {
  cascadeResult: [
    { id: 'ROB', value: 1000000 },
    { id: 'DED', value: -100000 },
    { id: 'ROL', value: 900000 },
    { id: 'CUSTOS', value: -400000 },
    { id: 'LUCRO_BRUTO', value: 500000 },
    { id: 'DESP_OPER', value: -300000 },
    { id: 'EBITDA', value: 200000 },
    { id: 'DEP_AMORT', value: -50000 },
    { id: 'EBIT', value: 150000 },
    { id: 'LUCRO_LIQ', value: 100000 }
  ]
};

console.log("=== RUNNING RUNTIME TRACE AUDIT ===");
const vm = DreExecutiveViewModelBuilder.build(rawPayload, []);
console.log("=== DONE ===");
