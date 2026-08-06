export interface ResolutionInput {
  fco: number;
  lucroLiquido: number;
  runwayMonths: number;
  capitalConsumido: number;
  patrimonioLiquido: number;
  liquidezReal: number;
}

export class DominantRiskResolver {
  public static resolve(input: ResolutionInput): string {
    if (input.lucroLiquido < 0 && input.fco < 0 && input.runwayMonths <= 6) {
      return 'Dependência de capitalização para continuidade operacional.';
    }
    if (input.lucroLiquido < 0 && input.capitalConsumido > 0) {
      return 'Erosão patrimonial por insuficiência de escala econômica.';
    }
    if (input.fco < 0) {
      return 'Queima operacional de caixa drenando a tesouraria.';
    }
    if (input.liquidezReal < 1.0) {
      return 'Fragilidade de liquidez limitando capacidade de pagamento no ciclo imediato.';
    }
    if (input.lucroLiquido < 0) {
      return 'Escala econômica insuficiente prejudicando a criação de valor.';
    }
    
    return 'Nenhum risco estrutural de alta gravidade identificado.';
  }
}

export class PriorityDecisionResolver {
  public static resolve(input: ResolutionInput): string {
    if (input.lucroLiquido < 0 && input.fco < 0 && input.runwayMonths <= 6) {
      return 'Atingir break-even operacional antes do esgotamento da capacidade de capitalização.';
    }
    if (input.fco < 0) {
      return 'Preservar liquidez e reduzir a queima de caixa da operação de forma imediata.';
    }
    if (input.lucroLiquido < 0 && input.capitalConsumido > 0) {
      return 'Recuperar rentabilidade econômica e definir política formal de recomposição patrimonial.';
    }
    if (input.liquidezReal < 1.0) {
      return 'Alongar perfil de passivos e otimizar capital de giro para recompor liquidez.';
    }
    if (input.lucroLiquido < 0) {
      return 'Revisar matriz de margens e despesas para retomar a criação de valor.';
    }
    
    return 'Acelerar iniciativas estratégicas de expansão preservando a resiliência atual.';
  }
}
