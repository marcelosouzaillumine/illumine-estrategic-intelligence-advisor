const getOrderIndex = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('receita operacional bruta') || n.includes('receita bruta') || n.includes('faturamento') || n.includes('venda')) return 0;
  if (n.includes('deduç') || n.includes('imposto sobre venda') || n.includes('abatimento') || n.includes('devoluç') || n.includes('cancelamento')) return 1;
  if (n.includes('receita líquida') || n.includes('receita operacional líquida')) return 2;
  if (n.includes('custo') || n.includes('cpv') || n.includes('csp') || n.includes('cmv')) return 3;
  return 5;
};

console.log('Custo da Mercadoria Vendida:', getOrderIndex('Custo da Mercadoria Vendida'));
console.log('Custo do Produto Vendido:', getOrderIndex('Custo do Produto Vendido'));
console.log('Custo do Serviço Prestado:', getOrderIndex('Custo do Serviço Prestado'));
console.log('Vendas Mercado Interno:', getOrderIndex('Vendas Mercado Interno'));
