const dbData = [
  { category: 'Receita Operacional Bruta', val: 166513.28, level: 1 },
  { category: '( - ) Deduções da Receita Bruta', val: 9543.74, level: 1 },
  { category: '( = ) Receita Operacional Líquida', val: 156969.54, level: 1 },
  { category: '( - ) Custo dos Produtos Vendidos', val: -70026.22, level: 1 },
  { category: '( = ) Lucro Bruto', val: 86943.32, level: 1 },
];

const getOrderIndex = (name: string) => {
  const n = name.toLowerCase();
  
  // MATCH TOTALS FIRST or MORE SPECIFIC ONES FIRST
  if (n.includes('receita líquida') || n.includes('receita operacional líquida')) return 2;
  if (n.includes('deduç') || n.includes('imposto sobre venda') || n.includes('abatimento') || n.includes('devoluç') || n.includes('cancelamento')) return 1;
  
  // NOW Receita Bruta (safely after deduções and liquida)
  if (n.includes('receita operacional bruta') || n.includes('receita bruta') || n.includes('faturamento')) return 0;
  
  // Custos vs Despesas
  if (n.includes('custo') || n.includes('cpv') || n.includes('csp') || n.includes('cmv')) return 3;
  if (n.includes('lucro bruto')) return 4;
  if (n.includes('despesa operacional') || n.includes('despesa com venda') || n.includes('despesa admin') || n.includes('despesa comercial')) return 5;
  if (n.includes('ebitda') || n.includes('lajida')) return 6;
  if (n.includes('deprecia') || n.includes('amortiza')) return 7;
  if (n.includes('ebit') || n.includes('lucro operacional') || n.includes('resultado operacional')) return 8;
  
  // Venda standalone should only go to Receita Bruta if it's strictly a Venda and not Despesa com Venda
  // Wait, Despesa com Venda is caught above. So Venda here is safe.
  if (n.includes('venda') && !n.includes('despesa')) return 0;

  if (n.includes('resultado financeiro') || n.includes('despesa financeir') || n.includes('receita financeir') || n.includes('juros')) return 9;
  if (n.includes('outras despesas') || n.includes('outras receitas')) return 10;
  if (n.includes('lair') || n.includes('resultado antes')) return 11;
  if (n.includes('provisão') || n.includes('imposto de renda') || n.includes('irpj') || n.includes('csll') || n.includes('contribuição social')) return 12;
  if (n.includes('lucro líquido') || n.includes('resultado líquido') || n.includes('lucro liquido') || n.includes('exercício')) return 13;
  
  return 5;
};

const clean = (s: string) => s.toLowerCase().replace(/^[(=)\-/+)\s]+/, '').trim();

const matrix = [
  { name: 'Receita Operacional Bruta', level: 1, type: 'parent', children: [] as any[], val: 0 },
  { name: '( - ) Deduções da Receita Bruta', level: 1, type: 'parent', children: [] as any[], val: 0 },
  { name: '( = ) Receita Operacional Líquida', level: 1, type: 'total', children: [] as any[], val: 0 },
  { name: '( - ) Custo dos Produtos Vendidos', level: 1, type: 'parent', children: [] as any[], val: 0 },
  { name: '( = ) Lucro Bruto', level: 1, type: 'total', children: [] as any[], val: 0 },
];

dbData.forEach((d: any) => {
  const key = d.conta || d.category;
  const idx = getOrderIndex(key);
  const val = d.val || d.valor || d.value || 0;
  const bucket = matrix[idx];
  bucket.val += val;
});

console.log('--- BEFORE FORMULAS ---');
matrix.forEach((b, i) => console.log(`${i}: ${b.name} = ${b.val}`));

matrix[2].val = matrix[0].val + matrix[1].val; // Receita Líquida
matrix[4].val = matrix[2].val + matrix[3].val; // Lucro Bruto

console.log('--- AFTER FORMULAS ---');
matrix.forEach((b, i) => console.log(`${i}: ${b.name} = ${b.val}`));
