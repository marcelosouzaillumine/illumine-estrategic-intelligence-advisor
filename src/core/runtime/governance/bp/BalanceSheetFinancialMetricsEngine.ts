import { BPSummary } from '../../../../lib/bpEngine';

export interface PatrimonialIndicator {
  metricName: string;
  value: number | string | 'INSUFFICIENT_DATA';
  classification: string;
  severity: string; // 'CRITICAL' | 'ATTENTION' | 'HEALTHY' | 'NEUTRAL' | 'CAPITAL_IDLE_WARNING' | 'POSITIVE_TREASURY' | 'TREASURY_STRESS' | 'SHORT_TERM_PRESSURE'
  confidence: number;
  evidence: any;
  rationale: string;
  lineageHash: string;
  family: string;
  format: 'percentage' | 'currency' | 'decimal' | 'string' | 'multiplier';
}

function generateHash(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; 
  }
  return `BPX-${Math.abs(hash).toString(16).toUpperCase()}`;
}

export class BalanceSheetFinancialMetricsEngine {
  static calculateIndicators(summary: BPSummary): PatrimonialIndicator[] {
    const indicators: PatrimonialIndicator[] = [];

    // --- LIQUIDEZ ---
    // 1. Liquidez Corrente
    {
      const family = 'Liquidez';
      const metricName = 'Liquidez Corrente';
      if (summary.passivoCirculante > 0) {
        const val = summary.ativoCirculante / summary.passivoCirculante;
        let classification = 'HEALTHY';
        let severity = 'HEALTHY';
        if (val < 1.00) { classification = 'CRITICAL'; severity = 'CRITICAL'; }
        else if (val <= 1.20) { classification = 'ATTENTION'; severity = 'ATTENTION'; }
        else if (val > 2.00) { classification = 'CAPITAL_IDLE_WARNING'; severity = 'CAPITAL_IDLE_WARNING'; }

        indicators.push({
          metricName,
          value: val,
          classification,
          severity,
          confidence: 95,
          evidence: { AC: summary.ativoCirculante, PC: summary.passivoCirculante },
          rationale: 'Mensura a capacidade de honrar compromissos de curto prazo.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'decimal'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Falta de Passivo Circulante'));
      }
    }

    // 2. Liquidez Seca
    {
      const family = 'Liquidez';
      const metricName = 'Liquidez Seca';
      if (summary.passivoCirculante > 0) {
        const val = (summary.ativoCirculante - summary.estoques) / summary.passivoCirculante;
        const classification = val >= 1.0 ? 'HEALTHY' : (val >= 0.8 ? 'ATTENTION' : 'CRITICAL');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 90,
          evidence: { AC: summary.ativoCirculante, Estoques: summary.estoques, PC: summary.passivoCirculante },
          rationale: 'Capacidade de liquidação sem depender da venda de estoques.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'decimal'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Falta de Passivo Circulante'));
      }
    }

    // 3. Liquidez Imediata
    {
      const family = 'Liquidez';
      const metricName = 'Liquidez Imediata';
      if (summary.passivoCirculante > 0) {
        const val = summary.caixaEquivalentes / summary.passivoCirculante;
        const classification = val >= 0.5 ? 'HEALTHY' : (val >= 0.2 ? 'ATTENTION' : 'CRITICAL');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 95,
          evidence: { Caixa: summary.caixaEquivalentes, PC: summary.passivoCirculante },
          rationale: 'Capacidade imediata de pagamento com recursos disponíveis.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'decimal'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Falta de Passivo Circulante'));
      }
    }

    // 4. Liquidez Geral
    {
      const family = 'Liquidez';
      const metricName = 'Liquidez Geral';
      const rlp = summary.realizavelLongoPrazo || 0;
      if ((summary.passivoCirculante + summary.passivoNaoCirculante) > 0) {
        const val = (summary.ativoCirculante + rlp) / (summary.passivoCirculante + summary.passivoNaoCirculante);
        const valLC = summary.passivoCirculante > 0 ? summary.ativoCirculante / summary.passivoCirculante : 0;
        
        let rationale = 'Solvência estrutural de longo prazo.';
        if (Math.abs(val - valLC) < 0.0001 && rlp === 0 && summary.passivoNaoCirculante === 0) {
          rationale = 'A Liquidez Geral coincide com a Liquidez Corrente devido à ausência de ativos e passivos de longo prazo documentados. A avaliação estrutural permanece restrita ao horizonte de curto prazo.';
        }

        const classification = val >= 1.0 ? 'HEALTHY' : 'ATTENTION';
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 90,
          evidence: { AC: summary.ativoCirculante, RLP: rlp, PC: summary.passivoCirculante, PNC: summary.passivoNaoCirculante, hasLongTermData: rlp > 0 || summary.passivoNaoCirculante > 0 },
          rationale,
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'decimal'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Falta de Passivos Exigíveis (PC e PNC)'));
      }
    }

    // --- CAPITAL DE GIRO ---
    // 5. Capital de Giro Líquido (CGL)
    {
      const family = 'Capital de Giro';
      const metricName = 'Capital de Giro Líquido';
      if (summary.ativoCirculante > 0 || summary.passivoCirculante > 0) {
        const val = summary.ativoCirculante - summary.passivoCirculante;
        const classification = val > 0 ? 'HEALTHY' : 'CRITICAL';
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 95,
          evidence: { AC: summary.ativoCirculante, PC: summary.passivoCirculante },
          rationale: 'Folga financeira operacional.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'currency'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Ativo/Passivo Circulante nulos'));
      }
    }

    // 6. Necessidade de Capital de Giro (NCG)
    {
      const family = 'Capital de Giro';
      const metricName = 'Necessidade de Capital de Giro';
      if (summary.obrigacoesOperacionais !== null) {
        const val = (summary.clientes + summary.estoques) - summary.obrigacoesOperacionais;
        const classification = 'NEUTRAL';
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 90,
          evidence: { Clientes: summary.clientes, Estoques: summary.estoques, ObrigacoesOperacionais: summary.obrigacoesOperacionais },
          rationale: 'Capital exigido pela operação.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'currency'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Obrigações operacionais não extraídas com segurança'));
      }
    }

    // 7. Saldo de Tesouraria
    {
      const family = 'Capital de Giro';
      const metricName = 'Saldo de Tesouraria';
      if (summary.ativoCirculante > 0 && summary.obrigacoesOperacionais !== null) {
        const cgl = summary.ativoCirculante - summary.passivoCirculante;
        const ncg = (summary.clientes + summary.estoques) - summary.obrigacoesOperacionais;
        const val = cgl - ncg;
        const classification = val > 0 ? 'POSITIVE_TREASURY' : 'TREASURY_STRESS';
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification === 'POSITIVE_TREASURY' ? 'HEALTHY' : 'CRITICAL',
          confidence: 90,
          evidence: { CGL: cgl, NCG: ncg },
          rationale: 'Disponibilidade real de tesouraria frente às exigências operacionais.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'currency'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Depende de NCG, dados insuficientes'));
      }
    }

    // --- ESTRUTURA DE CAPITAL ---
    // 8. Endividamento Geral
    {
      const family = 'Estrutura de Capital';
      const metricName = 'Endividamento Geral';
      if (summary.ativoTotal > 0) {
        const val = summary.passivoTotal / summary.ativoTotal;
        const classification = val > 0.8 ? 'CRITICAL' : (val > 0.6 ? 'ATTENTION' : 'HEALTHY');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 95,
          evidence: { PassivoTotal: summary.passivoTotal, AtivoTotal: summary.ativoTotal },
          rationale: 'Dependência global de capitais de terceiros em relação aos ativos.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'percentage'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Ativo Total ausente'));
      }
    }

    // 9. Dependência de Capital de Terceiros
    {
      const family = 'Estrutura de Capital';
      const metricName = 'Dependência de Capital de Terceiros';
      if (summary.patrimonioLiquido > 0) {
        const val = summary.passivoTotal / summary.patrimonioLiquido;
        const classification = val > 2.0 ? 'CRITICAL' : (val > 1.0 ? 'ATTENTION' : 'HEALTHY');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 95,
          evidence: { PassivoTotal: summary.passivoTotal, PL: summary.patrimonioLiquido },
          rationale: `Para cada R$ 1,00 de capital próprio, a empresa utiliza R$ ${val.toFixed(2).replace('.', ',')} de recursos de terceiros.`,
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'multiplier'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'PL ausente ou negativo'));
      }
    }

    // 10. Autonomia Financeira
    {
      const family = 'Estrutura de Capital';
      const metricName = 'Autonomia Financeira';
      if (summary.ativoTotal > 0 && summary.patrimonioLiquido >= 0) {
        const val = summary.patrimonioLiquido / summary.ativoTotal;
        const classification = val < 0.2 ? 'CRITICAL' : (val < 0.4 ? 'ATTENTION' : 'HEALTHY');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 95,
          evidence: { PL: summary.patrimonioLiquido, AtivoTotal: summary.ativoTotal },
          rationale: 'Independência financeira da organização baseada em capital próprio.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'percentage'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'PL negativo ou Ativo nulo'));
      }
    }

    // 11. Composição do Endividamento
    {
      const family = 'Estrutura de Capital';
      const metricName = 'Composição do Endividamento';
      if (summary.passivoTotal > 0) {
        const val = summary.passivoCirculante / summary.passivoTotal;
        let classification = 'HEALTHY';
        let severity = 'HEALTHY';
        if (val > 0.6) { classification = 'SHORT_TERM_PRESSURE'; severity = 'CRITICAL'; }
        else if (val >= 0.4) { classification = 'ATTENTION'; severity = 'ATTENTION'; }

        indicators.push({
          metricName,
          value: val,
          classification,
          severity,
          confidence: 95,
          evidence: { PC: summary.passivoCirculante, PassivoTotal: summary.passivoTotal },
          rationale: 'Concentração de obrigações de curto prazo.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'percentage'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Passivo Total nulo'));
      }
    }

    // --- IMOBILIZAÇÃO ---
    // 12. Imobilização do Patrimônio Líquido (IPL)
    {
      const family = 'Imobilização';
      const metricName = 'Imobilização do Patrimônio Líquido';
      if (summary.ativoPermanente !== null && summary.patrimonioLiquido > 0) {
        const val = summary.ativoPermanente / summary.patrimonioLiquido;
        const classification = val > 1.0 ? 'CRITICAL' : (val > 0.8 ? 'ATTENTION' : 'HEALTHY');
        indicators.push({
          metricName,
          value: val,
          classification,
          severity: classification,
          confidence: 90,
          evidence: { AtivoPermanente: summary.ativoPermanente, PL: summary.patrimonioLiquido },
          rationale: 'Mensura quanto do capital próprio encontra-se imobilizado.',
          lineageHash: generateHash(`${metricName}-${val}`),
          family,
          format: 'percentage'
        });
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Ativo Permanente não confiável ou PL nulo/negativo'));
      }
    }

    // 13. Debt-to-Equity (Oneroso)
    {
      const family = 'Estrutura de Capital';
      const metricName = 'Debt-to-Equity';
      if (summary.patrimonioLiquido > 0) {
        const passivoOneroso = summary.passivosFinanceiros || 0;
        
        if (passivoOneroso === 0) {
          indicators.push({
            metricName,
            value: 'N/A',
            classification: 'HEALTHY',
            severity: 'HEALTHY',
            confidence: 100,
            evidence: { PassivosFinanceiros: 0, PL: summary.patrimonioLiquido },
            rationale: 'A organização não possui dívida onerosa financeira ativa estruturada.',
            lineageHash: generateHash(`${metricName}-NA`),
            family,
            format: 'string'
          });
        } else {
          const val = passivoOneroso / summary.patrimonioLiquido;
          const classification = val > 1.5 ? 'CRITICAL' : (val > 0.8 ? 'ATTENTION' : 'HEALTHY');
          indicators.push({
            metricName: 'Financial Debt-to-Equity',
            value: val,
            classification,
            severity: classification,
            confidence: 95,
            evidence: { PassivosFinanceiros: passivoOneroso, PL: summary.patrimonioLiquido },
            rationale: 'Alavancagem financeira sobre capital próprio (apenas dívida onerosa).',
            lineageHash: generateHash(`FinDebtToEquity-${val}`),
            family,
            format: 'decimal'
          });
        }
      } else {
        indicators.push(this.insufficientData(metricName, family, 'Falta PL para Debt-to-Equity'));
      }
    }

    return indicators;
  }

  private static insufficientData(metricName: string, family: string, rationale: string): PatrimonialIndicator {
    return {
      metricName,
      value: 'INSUFFICIENT_DATA',
      classification: 'INSUFFICIENT_DATA',
      severity: 'NEUTRAL',
      confidence: 0,
      evidence: null,
      rationale: `Cálculo não executado: ${rationale}`,
      lineageHash: 'N/A',
      family,
      format: 'decimal'
    };
  }
}
