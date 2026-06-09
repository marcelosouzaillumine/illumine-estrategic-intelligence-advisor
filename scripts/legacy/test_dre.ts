const getOrderIndex = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('receita operacional bruta') || n.includes('receita bruta') || n.includes('faturamento') || n.includes('venda')) return 0;
  if (n.includes('deduç') || n.includes('imposto sobre venda') || n.includes('abatimento') || n.includes('devoluç') || n.includes('cancelamento')) return 1;
  if (n.includes('receita líquida') || n.includes('receita operacional líquida')) return 2;
  if (n.includes('custo') || n.includes('cpv') || n.includes('csp') || n.includes('cmv')) return 3;
  if (n.includes('lucro bruto')) return 4;
  if (n.includes('despesa operacional') || n.includes('despesa com venda') || n.includes('despesa admin') || n.includes('despesa comercial')) return 5;
  if (n.includes('ebitda') || n.includes('lajida')) return 6;
  if (n.includes('deprecia') || n.includes('amortiza')) return 7;
  if (n.includes('ebit') || n.includes('lucro operacional') || n.includes('resultado operacional')) return 8;
  if (n.includes('resultado financeiro') || n.includes('despesa financeir') || n.includes('receita financeir') || n.includes('juros')) return 9;
  if (n.includes('outras despesas') || n.includes('outras receitas')) return 10;
  if (n.includes('lair') || n.includes('resultado antes')) return 11;
  if (n.includes('provisão') || n.includes('imposto de renda') || n.includes('irpj') || n.includes('csll') || n.includes('contribuição social')) return 12;
  if (n.includes('lucro líquido') || n.includes('resultado líquido') || n.includes('lucro liquido') || n.includes('exercício')) return 13;
  return 5;
};

console.log('Custo da Mercadoria Vendida:', getOrderIndex('Custo da Mercadoria Vendida'));
console.log('Custo do Produto Vendido:', getOrderIndex('Custo do Produto Vendido'));
console.log('Custo do Serviço Prestado:', getOrderIndex('Custo do Serviço Prestado'));
