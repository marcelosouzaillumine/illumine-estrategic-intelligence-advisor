import { ConsolidatedCashFlowReport } from './cashflow/cashflow-types';
import { ConsolidatedCapitalGovernanceReport } from './capital-governance/capital-governance-types';

export interface CrossStatementTension {
  id: string;
  title: string;
  sourceStatement: 'DRE' | 'BP' | 'DFC' | 'DLPA';
  targetStatement: 'DRE' | 'BP' | 'DFC' | 'DLPA';
  severity: 'INFORMATIVA' | 'SENSÍVEL' | 'SEVERA' | 'CRÍTICA';
  description: string;
  evidence: string;
}

export interface PropagationVector {
  origin: string;
  destination: string;
  transmissionChannel: string;
  impactDescription: string;
}

export interface CrossStatementCausalityReport {
  tensions: CrossStatementTension[];
  vectors: PropagationVector[];
  stressPatterns: string[];
}

export class CrossStatementCausalityEngine {
  public static analyze(
    bpSummary: any,
    ebitda: number,
    lucroLiquido: number,
    cashFlowReport: ConsolidatedCashFlowReport,
    capitalGovernanceReport: ConsolidatedCapitalGovernanceReport
  ): CrossStatementCausalityReport {
    const tensions: CrossStatementTension[] = [];
    const vectors: PropagationVector[] = [];
    const stressPatterns: string[] = [];

    const hasCashFlow = cashFlowReport.isAvailable;
    const hasDLPA = capitalGovernanceReport.isAvailable;

    const at = bpSummary?.ativoTotal || 0;
    const ac = bpSummary?.ativoCirculante || 0;
    const pc = bpSummary?.passivoCirculante || 0;
    const pl = bpSummary?.patrimonioLiquido || 0;
    const est = bpSummary?.estoques || 0;
    const cx = bpSummary?.caixaEquivalentes || 0;

    // 1. Lucro Sem Caixa (DRE -> DFC)
    if (ebitda > 0 && hasCashFlow && cashFlowReport.operational.operatingCashFlow < 0) {
      tensions.push({
        id: 'LUCRO_SEM_CAIXA',
        title: 'Lucro sem Conversão de Caixa',
        sourceStatement: 'DRE',
        targetStatement: 'DFC',
        severity: 'SEVERA',
        description: 'A empresa apresenta resultado econômico positivo (EBITDA), mas consome caixa na operação, evidenciando descasamento no ciclo operacional.',
        evidence: `EBITDA de R$ ${ebitda.toLocaleString('pt-BR')} vs. Fluxo de Caixa Operacional de R$ ${cashFlowReport.operational.operatingCashFlow.toLocaleString('pt-BR')}.`
      });

      vectors.push({
        origin: 'EBITDA (DRE)',
        destination: 'Disponibilidades (BP/DFC)',
        transmissionChannel: 'Capital de Giro / Prazos Médios',
        impactDescription: 'O lucro operacional é retido em direitos creditórios (clientes) ou estoques antes de alcançar a conta corrente.'
      });

      stressPatterns.push('DESCALAS_GIRO');
    }

    // 2. Crescimento Sem Retenção (DRE -> DLPA)
    if (lucroLiquido > 0 && hasDLPA && capitalGovernanceReport.retention.retentionRate !== null && capitalGovernanceReport.retention.retentionRate < 0.15) {
      tensions.push({
        id: 'CRESCIMENTO_SEM_RETENCAO',
        title: 'Crescimento sem Retenção de Reservas',
        sourceStatement: 'DRE',
        targetStatement: 'DLPA',
        severity: 'SENSÍVEL',
        description: 'Os lucros líquidos gerados são distribuídos quase em sua totalidade, privando a empresa de fortalecer seu patrimônio.',
        evidence: `Lucro Líquido de R$ ${lucroLiquido.toLocaleString('pt-BR')} com taxa de retenção de apenas ${(capitalGovernanceReport.retention.retentionRate * 100).toFixed(1)}%.`
      });

      vectors.push({
        origin: 'Resultado Líquido (DRE)',
        destination: 'Patrimônio Líquido (BP)',
        transmissionChannel: 'Distribuição de Dividendos',
        impactDescription: 'A saída de recursos via dividendos impede a capitalização orgânica e enfraquece a autonomia financeira.'
      });
    }

    // 3. Distribuição Drenando Patrimônio (DLPA -> BP)
    if (hasDLPA && capitalGovernanceReport.distribution.distributionDiscipline === 'DRENAGEM') {
      const dividends = capitalGovernanceReport.distribution.distributedDividends;
      tensions.push({
        id: 'DISTRIBUICAO_DRENANTE',
        title: 'Distribuição Societária Drenante',
        sourceStatement: 'DLPA',
        targetStatement: 'BP',
        severity: 'CRÍTICA',
        description: 'O volume de dividendos e retiradas excede a geração de lucro líquido ou é realizado em cenário de prejuízo, corroendo o Patrimônio Líquido.',
        evidence: `Dividendos de R$ ${dividends.toLocaleString('pt-BR')} retirados em ciclo de lucro R$ ${lucroLiquido.toLocaleString('pt-BR')}.`
      });

      vectors.push({
        origin: 'Dividendos Declarados (DLPA)',
        destination: 'Reservas e Patrimônio (BP)',
        transmissionChannel: 'Corrosão de Lucros Acumulados',
        impactDescription: 'Descapitalização nominal direta da estrutura patrimonial, fragilizando a solvência.'
      });

      stressPatterns.push('DRENAGEM_PATRIMONIAL');
    }

    // 4. Estoque Retendo Liquidez (BP -> DFC)
    if (est > 0 && hasCashFlow && cashFlowReport.conversion.inventoryDrainImpact !== null && cashFlowReport.conversion.inventoryDrainImpact > 0.25) {
      tensions.push({
        id: 'ESTOQUE_DRAIN',
        title: 'Imobilização de Giro em Estoques',
        sourceStatement: 'BP',
        targetStatement: 'DFC',
        severity: 'SEVERA',
        description: 'Elevada fração do Ativo está retida sob forma de mercadorias e estoques de baixa rotação, asfixiando o fluxo de caixa disponível.',
        evidence: `Estoque de R$ ${est.toLocaleString('pt-BR')} representa ${(cashFlowReport.conversion.inventoryDrainImpact * 100).toFixed(1)}% do Ativo Total.`
      });

      vectors.push({
        origin: 'Estoques (BP)',
        destination: 'Caixa e Equivalentes (BP/DFC)',
        transmissionChannel: 'Estocagem Ineficiente',
        impactDescription: 'Capital de giro asfixiado em prateleira, gerando custos de oportunidade e pressão de pagamento de fornecedores no curto prazo.'
      });

      stressPatterns.push('ASFIXIA_POR_ESTOQUE');
    }

    // 5. EBITDA Positivo Sem Sustentabilidade Operacional (DRE -> DFC -> BP)
    if (ebitda > 0 && hasCashFlow && cashFlowReport.liquidity.sustainabilityClassification === 'VULNERÁVEL') {
      tensions.push({
        id: 'EBITDA_SEM_SUSTENTABILIDADE',
        title: 'Resultado Operacional sem Sustentabilidade de Caixa',
        sourceStatement: 'DRE',
        targetStatement: 'DFC',
        severity: 'SEVERA',
        description: 'A empresa gera resultado operacional contábil, porém sua vulnerabilidade financeira é crítica devido ao curtíssimo runway.',
        evidence: `Runway projetado de ${cashFlowReport.treasury.runwayMonths?.toFixed(1) ?? '0'} meses.`
      });

      vectors.push({
        origin: 'Resultado (DRE)',
        destination: 'Tesouraria (DFC)',
        transmissionChannel: 'Runway de Curto Prazo',
        impactDescription: 'O lucro contábil não protege contra a ruptura de curto prazo se o descasamento temporal for muito agudo.'
      });
    }

    return {
      tensions,
      vectors,
      stressPatterns
    };
  }
}
