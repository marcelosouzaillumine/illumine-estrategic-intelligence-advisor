export function qualifyLiquidity(liquidezReal: number | undefined): string {
  if (liquidezReal === undefined) return "liquidez preservada";
  if (liquidezReal < 1.0) return "liquidez real crítica";
  if (liquidezReal < 1.5) return "liquidez real sob pressão";
  if (liquidezReal < 3.0) return "liquidez confortável";
  if (liquidezReal < 5.0) return "liquidez real robusta";
  return "liquidez real elevada";
}

export function qualifyLeverage(endividamentoGeral: number | undefined): string {
  if (endividamentoGeral === undefined) return "nível de alavancagem administrável";
  if (endividamentoGeral > 60) return "alavancagem excessiva";
  if (endividamentoGeral > 40) return "alavancagem moderada";
  if (endividamentoGeral > 20) return "baixa alavancagem";
  return "alavancagem mínima";
}

export function qualifyAutonomy(autonomiaFinanceira: number | undefined): string {
  if (autonomiaFinanceira === undefined) return "autonomia financeira funcional";
  if (autonomiaFinanceira < 20) return "autonomia financeira comprometida";
  if (autonomiaFinanceira < 40) return "autonomia financeira restrita";
  if (autonomiaFinanceira < 60) return "autonomia financeira preservada";
  if (autonomiaFinanceira < 80) return "autonomia financeira robusta";
  return "autonomia financeira superior";
}

export function qualifyCapitalDependency(dependenciaCapitalTerceiros: number | undefined): string {
  if (dependenciaCapitalTerceiros === undefined) return "dependência de capital controlada";
  if (dependenciaCapitalTerceiros > 70) return "forte dependência de terceiros";
  if (dependenciaCapitalTerceiros > 50) return "dependência de terceiros expressiva";
  if (dependenciaCapitalTerceiros > 30) return "dependência de capital equilibrada";
  return "baixa dependência de terceiros";
}
