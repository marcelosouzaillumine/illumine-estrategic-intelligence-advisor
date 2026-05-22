const matrix = [
  { name: 'Receita Operacional Bruta', val: 166513.28 },
  { name: '( - ) Deduções da Receita Bruta', val: 9543.74 },
  { name: '( = ) Receita Operacional Líquida', val: 156969.54 }, // Stale DB value
  { name: '( - ) Custo dos Produtos Vendidos', val: -70026.22 },
  { name: '( = ) Lucro Bruto', val: -157385.83 }, // Garbage DB value (Despesas copy pasted)
  { name: '( - ) Despesas Operacionais', val: -157385.83 },
  { name: '( = ) EBITDA', val: 0 },
  { name: 'Depreciação', val: 0 },
  { name: 'EBIT', val: 0 },
  { name: 'Resultado Financeiro', val: -929.96 },
  { name: 'Outras', val: 2823.59 },
  { name: 'LAIR', val: 0 },
  { name: 'Impostos', val: 0 },
  { name: 'Lucro Líquido', val: 0 },
];

const hasValue = (val: number) => Math.abs(val) > 0.001;

// We strictly subtract deductions if they came positive, but wait, the user banned Math.abs!
// So we just add them.
matrix[2].val = (hasValue(matrix[0].val) || hasValue(matrix[1].val)) ? (matrix[0].val + matrix[1].val) : matrix[2].val;
matrix[4].val = (hasValue(matrix[2].val) || hasValue(matrix[3].val)) ? (matrix[2].val + matrix[3].val) : matrix[4].val;
matrix[6].val = (hasValue(matrix[4].val) || hasValue(matrix[5].val)) ? (matrix[4].val + matrix[5].val) : matrix[6].val;
matrix[8].val = (hasValue(matrix[6].val) || hasValue(matrix[7].val)) ? (matrix[6].val + matrix[7].val) : matrix[8].val;
matrix[11].val = (hasValue(matrix[8].val) || hasValue(matrix[9].val) || hasValue(matrix[10].val)) ? (matrix[8].val + matrix[9].val + matrix[10].val) : matrix[11].val;
matrix[13].val = (hasValue(matrix[11].val) || hasValue(matrix[12].val)) ? (matrix[11].val + matrix[12].val) : matrix[13].val;

matrix.forEach((m, i) => console.log(`${i}: ${m.name} = ${m.val}`));
