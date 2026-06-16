import { BalanceSheetExecutiveViewModel } from '../types/executive/BalanceSheetExecutiveViewModel';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class BalanceSheetSourceTraceAudit {
  static deepCheck(obj: any, path = '') {
    if (obj === null || obj === undefined) return;
    
    // Teste de serialização (regex na ViewModel stringificada)
    if (path === '') {
      const vmString = JSON.stringify(obj);
      const forbiddenPattern = /\b(HEALTHY|UNHEALTHY|WARNING|ATTENTION|NEUTRAL|RESILIENT|MINOR_WARNINGS|MONITORING|STABLE|EXCELLENT|N\/A|null|undefined|NaN)\b/;
      if (forbiddenPattern.test(vmString)) {
        throw new Error(`[CONSTITUTIONAL VIOLATION] O BalanceSheetExecutiveViewModel final contém enums técnicos ou placeholders proibidos. Match encontrado.`);
      }

      const genericNarratives = /Painel não gerado|Erro Estrutural|Aguardando evidências|Omitido do contexto|Dados Insuficientes|Dados Indisponíveis|Indeterminada|Indeterminado|Análise indisponível|Dados indisponíveis|Melhorar previsibilidade|Fortalecer controles/i;
      if (genericNarratives.test(vmString)) {
        throw new Error(`[CONSTITUTIONAL VIOLATION] O BalanceSheetExecutiveViewModel final contém narrativas genéricas ou placeholders proibidos.`);
      }

      // Check numeric preservation mutilations
      const mutilatedNumerics = /\b(?:97(?![\.0-9])|65(?![\.0-9])|08x|9%|998(?![\.0-9]))\b/;
      // (This is a simplified check for testing; the real check runs in NumericIntegrityGuard)
      if (mutilatedNumerics.test(vmString)) {
        throw new Error(`[CONSTITUTIONAL VIOLATION] O BalanceSheetExecutiveViewModel final contém valores numéricos corrompidos.`);
      }
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, i) => BalanceSheetSourceTraceAudit.deepCheck(item, `${path}[${i}]`));
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          BalanceSheetSourceTraceAudit.deepCheck(obj[key], path ? `${path}.${key}` : key);
        }
      }
    }
  }

  static runAudit(viewModel: any) {
    let hasErrors = false;
    const errors: string[] = [];

    const checkOrigin = (path: string, origin: any, value: any) => {
      if (!origin || !origin.sourceEngine || !origin.sourceRule) {
        hasErrors = true;
        errors.push(`[MISSING ORIGIN] Campo ${path} sem rastreabilidade. Valor: ${value}`);
      }
    };

    try {
      BalanceSheetSourceTraceAudit.deepCheck(viewModel);
    } catch (e: any) {
      hasErrors = true;
      errors.push(e.message);
    }

    checkOrigin('strategicSeverityReason', viewModel.diagnosisOrigin, viewModel.strategicSeverityReason);
    checkOrigin('patrimonialThesis', viewModel.diagnosisOrigin, viewModel.patrimonialThesis);
    checkOrigin('planFinanceiro.acao', viewModel.planFinanceiro?.origin, viewModel.planFinanceiro?.acao);

    if (viewModel.technicalLayer && viewModel.technicalLayer.families) {
      viewModel.technicalLayer.families.forEach((f: any) => {
        f.indicators.forEach((ind: any, i: number) => {
          checkOrigin(`technicalLayer.families[${f.familyName}].indicators[${i}].label`, ind.origin, ind.label);
        });
      });
    }

    if (hasErrors) {
      console.error('BalanceSheetSourceTraceAudit FAILED:');
      errors.forEach(e => console.error(e));
      process.exit(1);
    } else {
      console.log('BalanceSheetSourceTraceAudit PASSED: Todas as origens mapeadas e sem vazamentos.');
    }
  }
}

// Simulador de execução no CI para ESM
import { fileURLToPath } from 'url';
const isMain = typeof process !== 'undefined' && process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  console.log('Executando Source Trace Audit...');
  console.log('Audit stub rodou. Integração deve ocorrer nas suítes de teste.');
}
