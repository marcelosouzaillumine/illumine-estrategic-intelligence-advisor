import { FinancialHypothesis } from './FinancialHypothesisEngine';
import { FinancialRelationship } from './FinancialRelationshipEngine';

export interface FinancialDiagnosticOutput {
  diagnosis: string;
  hypotheses: FinancialHypothesis[];
  strategicImplications: string[];
  opportunities: string[];
  cfoQuestions: string[];
}

export class FinancialDiagnosticEngine {
  /**
   * Synthesizes relationships and hypotheses into a final executive diagnosis.
   */
  public synthesize(relationships: FinancialRelationship[], hypotheses: FinancialHypothesis[]): FinancialDiagnosticOutput {
    let diagnosis = 'A estrutura financeira atual encontra-se estável, porém sem sinais contundentes de anomalia estrutural ou ineficiência de capital.';
    const strategicImplications: string[] = [];
    const opportunities: string[] = [];
    const cfoQuestions: string[] = [];

    // Synthesize Conservative Profile
    if (relationships.some(r => r.relationship === 'Conservative Capital Structure')) {
      diagnosis = 'A empresa apresenta uma estrutura patrimonial conservadora, caracterizada por elevada liquidez, baixa dependência de capital de terceiros e concentração relevante de recursos financeiros disponíveis. O cenário sugere capacidade financeira elevada, porém demanda avaliação sobre eficiência de alocação do capital excedente.';
      
      strategicImplications.push('O custo de oportunidade do capital parado pode estar diluindo o ROE potencial da organização.');
      opportunities.push('Avaliar política de dividendos ou M&A estratégico para utilização do caixa estrutural.');
      
      cfoQuestions.push('O nível atual de caixa está alinhado ao plano de crescimento e expansão da companhia?');
      cfoQuestions.push('Existe oportunidade de utilizar o capital próprio disponível para aceleração comercial sem tomar dívida?');
    }

    // Synthesize Operational Drag
    if (relationships.some(r => r.relationship === 'Heavy Operational Asset Drag')) {
      if (diagnosis.includes('conservadora')) {
         diagnosis += ' No entanto, existe uma concentração operacional em estoques que pode impactar a velocidade do ciclo de caixa no longo prazo.';
      } else {
         diagnosis = 'A operação indica retenção significativa de capital de giro em estoques operacionais, o que reduz a capacidade de liquidação rápida e amarra recursos que poderiam estar rendendo aplicações financeiras.';
      }

      strategicImplications.push('Maior sensibilidade a variações de demanda devido ao capital preso em operação.');
      opportunities.push('Otimização da cadeia de suprimentos e reavaliação da política de estocagem mínima.');

      cfoQuestions.push('O estoque atual acompanha estritamente o crescimento comercial ou reflete ineficiência de giro?');
    }

    return {
      diagnosis,
      hypotheses,
      strategicImplications,
      opportunities,
      cfoQuestions
    };
  }
}
