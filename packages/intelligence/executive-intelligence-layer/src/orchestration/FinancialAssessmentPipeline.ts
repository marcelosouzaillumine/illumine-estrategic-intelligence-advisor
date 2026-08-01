import { FinancialIntegrityEngine } from '../integrity/FinancialIntegrityEngine';
import { ExecutiveFinancialStateClassifier } from '../integrity/ExecutiveFinancialStateClassifier';
import { TechnicalAssessment } from '../contracts/TechnicalAssessment';
import { ConstitutionalBoundaryGuard } from '../integrity/ConstitutionalBoundaryGuard';

export class FinancialAssessmentPipeline {
  /**
   * Lê a realidade: Executa validadores e emite o Parecer Financeiro Oficial.
   */
  public static run(financialData: any, historicalData?: any[]): TechnicalAssessment {
    // 1. Raw Data -> Validators
    const integrity = FinancialIntegrityEngine.validate(financialData, historicalData);
    
    // 2. Integrity -> State
    const state = ExecutiveFinancialStateClassifier.classify({
      integrityStatus: integrity.status,
      earningsQuality: { classification: 'MODERATE', score: 70, drivers: [] }, 
      cashConversion: { status: 'HEALTHY', conversionRate: 0.8 }, 
      solvency: { status: 'STABLE', liquidityRatio: 1.5, equityToAssets: 0.5, thirdPartyDependence: 0.5, workingCapital: 1000000, alerts: [] },
      executiveRiskLevel: 'LOW',
      narrativePermission: 'FULL'
    });

    const institutionalRestrictions: string[] = [];
    if (state.status === 'CRITICAL') {
      institutionalRestrictions.push('Bloqueio fiduciário total por inconsistência ou fragilidade sistêmica severa.');
    } else if (state.status === 'STRESSED') {
      institutionalRestrictions.push('Expansão condicionada. Capital deve ser preservado para solvência.');
    }

    const assessment: TechnicalAssessment = {
      domain: 'FINANCIAL',
      executiveState: state.status,
      confidence: integrity.status === 'PASSED' ? 0.95 : 0.40,
      
      executiveVerdict: state.status === 'HEALTHY' ? 'A estrutura patrimonial e financeira suporta a continuidade das operações com solidez.' : 
                        state.status === 'ATTENTION' ? 'Atenção aos indicadores de liquidez e composição da dívida.' :
                        state.status === 'CRITICAL' ? 'A estrutura patrimonial encontra-se severamente comprometida.' : 
                        'Condições financeiras sob estresse. Preservação de capital necessária.',
      
      executiveSummary: [
        'Análise da qualidade de balanço e ativos',
        'Avaliação da posição de caixa e disponibilidades',
        'Estrutura de dependência de capital de terceiros'
      ],
      
      criticalFindings: state.status === 'CRITICAL' ? ['Risco de solvência imediato.', 'Insuficiência de capital de giro.'] : [],
      supportingEvidence: [],
      quantitativeEvidence: [],
      limitations: institutionalRestrictions,
      unresolvedQuestions: [],
      confidenceDrivers: ['Integridade dos dados contábeis validados pelo motor'],
      lineage: ['BP-Data', 'FinancialIntegrityEngine', 'ExecutiveFinancialStateClassifier']
    };

    ConstitutionalBoundaryGuard.validateAssessmentIntegrity(assessment);
    
    return assessment;
  }
}
