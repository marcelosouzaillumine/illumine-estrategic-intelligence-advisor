const dbData = [
  { category: 'Receita Operacional Bruta', val: 166513.28, level: 1 },
  { category: '( - ) Deduções da Receita Bruta', val: 9543.74, level: 1 },
  { category: '( = ) Receita Operacional Líquida', val: 156969.54, level: 1 },
  { category: '( - ) Custo dos Produtos Vendidos', val: -70026.22, level: 1 },
  { category: '( = ) Lucro Bruto', val: 86943.32, level: 1 },
];

const getOrderIndex = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('receita operacional bruta') || n.includes('receita bruta') || n.includes('faturamento') || n.includes('venda')) return 0;
  if (n.includes('deduç') || n.includes('imposto sobre venda') || n.includes('abatimento') || n.includes('devoluç') || n.includes('cancelamento')) return 1;
  if (n.includes('receita líquida') || n.includes('receita operacional líquida')) return 2;
  if (n.includes('custo') || n.includes('cpv') || n.includes('csp') || n.includes('cmv')) return 3;
  if (n.includes('lucro bruto')) return 4;
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
  const cleanDb = clean(key);
  const cleanBucket = clean(bucket.name);
  if (cleanDb === cleanBucket) {
     bucket.val += val;
  } else {
     bucket.val += val;
  }
});

console.log('--- BEFORE FORMULAS ---');
matrix.forEach((b, i) => console.log(`${i}: ${b.name} = ${b.val}`));

matrix[2].val = matrix[0].val + matrix[1].val; // Receita Líquida
matrix[4].val = matrix[2].val + matrix[3].val; // Lucro Bruto

console.log('--- AFTER FORMULAS ---');
matrix.forEach((b, i) => console.log(`${i}: ${b.name} = ${b.val}`));

