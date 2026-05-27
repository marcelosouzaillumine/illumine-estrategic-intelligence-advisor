const { ExecutiveActionMatrixEngine } = require('./dist/core/runtime/integrity/ExecutiveActionMatrixEngine.js');
console.log(ExecutiveActionMatrixEngine.buildMatrix(
  ['Preservação e reforço imediato de liquidez estrutural.'],
  {},
  {
    ativoTotal: 1000,
    ativoCirculante: 500,
    passivoCirculante: 400,
    passivoTotal: 600,
    patrimonioLiquido: 400,
    caixaEquivalentes: 50,
    estoques: 150
  },
  {},
  'HIGH'
));
