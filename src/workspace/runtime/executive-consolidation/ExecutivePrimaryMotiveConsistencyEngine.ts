import * as ExecutiveSemanticBoundaryGuard from './ExecutiveSemanticBoundaryGuard';
import { ExecutiveAnalysisContext, StrategicSeverityLevel, StrategicOpinionConsistencyEngine } from './StrategicOpinionConsistencyEngine';
import { EXECUTIVE_DRIVER_CATALOG, ExecutiveDriverId } from './ExecutiveDriverCatalog';
import { ExecutiveNarrativeContext } from './ExecutiveNarrativeBuilder';
import { StrategicDiagnosisStageResolver } from './StrategicDiagnosisStageResolver';

export interface ExecutivePrimaryMotive {
  label: string; // The legacy label, now the composed string or dominant driver
  dominantStrength?: string;
  secondaryAttention?: string;
  severity: StrategicSeverityLevel;
  rationale: string;
  sourceDrivers: string[];
}

export class ExecutivePrimaryMotiveConsistencyEngine {
  
  public static deriveNarrativeContext(context: ExecutiveAnalysisContext, severity: StrategicSeverityLevel): ExecutiveNarrativeContext {
    const stage = StrategicDiagnosisStageResolver.deriveStrategicStage(context);
    
    const { dominantDriver, mitigatingDriver } = this.determineDrivers(context, severity);

    return {
      dominantDriver,
      mitigatingDriver,
      severity,
      module: context.moduleContext,
      institutionalState: severity,
      strategicStage: stage
    };
  }

  private static determineDrivers(context: ExecutiveAnalysisContext, severity: StrategicSeverityLevel) {
    const d = context.technicalDrivers || {};
    
    // Priority 1
    const lqReal = Number(d.liquidezReal);
    const lqSeca = Number(d.liquidezSeca);
    const lqInst = Number(d.liquidezInstantaneaReal);
    const fco = Number(d.fco);
    const tesouraria = Number(d.saldoTesouraria);

    // Priority 2
    const pl = Number(d.patrimonioLiquido);
    
    // Priority 3
    const endiv = Number(d.endividamentoGeral);
    const dep = Number(d.dependenciaCapitalTerceiros);

    // Priority 4
    const ebitda = Number(d.ebitda);
    const margem = Number(d.margemLiquida);

    // Priority 5
    const autonomiaRaw = Number(d.autonomiaFinanceira);
    const autonomia = (!isNaN(autonomiaRaw) && autonomiaRaw <= 1.0) ? autonomiaRaw * 100 : autonomiaRaw;

    let dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL];
    let mitigatingDriver: any = undefined;

    if (severity === 'CRITICAL') {
      if (!isNaN(lqReal) && lqReal < 1.0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL];
      else if (!isNaN(lqInst) && lqInst < 0.5) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_INSTANT];
      else if (!isNaN(lqSeca) && lqSeca < 1.0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL];
      else if (!isNaN(fco) && fco < 0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.FREE_CASH_FLOW];
      else if (!isNaN(tesouraria) && tesouraria < 0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_INSTANT];
      else if (!isNaN(pl) && pl < 0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.SOLVENCY];
      else if (!isNaN(endiv) && endiv > 60) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.GENERAL_INDEBTEDNESS];
      else if (!isNaN(dep) && dep > 1.0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.THIRD_PARTY_DEPENDENCY];
      else if (!isNaN(margem) && margem < -0.1) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.NET_MARGIN];
      else if (!isNaN(ebitda) && ebitda < 0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.EBITDA];
      else dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL]; // fallback
      
      // Determine mitigating factor for critical situations
      if (dominantDriver.category === 'Cash & Liquidity' || dominantDriver.id === ExecutiveDriverId.LIQUIDITY_REAL) {
        if (!isNaN(autonomia) && autonomia >= 80) {
          mitigatingDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.FINANCIAL_AUTONOMY];
        } else if (!isNaN(pl) && pl > 0) {
           // Em BP, se Liquidez é crítica mas PL positivo e autonomia razoável, autonomia mitiga
           if (!isNaN(autonomia) && autonomia > 40) {
             mitigatingDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.FINANCIAL_AUTONOMY];
           }
        }
      }

    } else if (severity === 'WARNING') {
      if (!isNaN(endiv) && endiv > 40) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.GENERAL_INDEBTEDNESS];
      else if (!isNaN(lqReal) && lqReal < 1.5) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL];
      else dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.WORKING_CAPITAL]; // fallback
    } else { // HEALTHY
      if (!isNaN(autonomia) && autonomia >= 80) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.FINANCIAL_AUTONOMY];
      else if (!isNaN(dep) && dep <= 0.30) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.THIRD_PARTY_DEPENDENCY];
      else if (!isNaN(lqReal) && lqReal >= 3.0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.LIQUIDITY_REAL];
      else if (!isNaN(fco) && fco > 0) dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.FREE_CASH_FLOW];
      else dominantDriver = EXECUTIVE_DRIVER_CATALOG[ExecutiveDriverId.SOLVENCY]; // fallback
    }

    return { dominantDriver, mitigatingDriver };
  }

  public static deriveExecutivePrimaryMotive(context: ExecutiveAnalysisContext, rawTechnicalDriverLabel?: string): ExecutivePrimaryMotive {
    // Avoid circular dependency by relying on determineDrivers logic directly
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    const severity = opinion.severityState;
    const sourceDrivers = context.technicalDrivers ? Object.keys(context.technicalDrivers) : [];

    let dominantStrength: string | undefined = undefined;
    let secondaryAttention: string | undefined = undefined;
    let rationale = 'Motivo derivado do contexto consolidado.';

    if (severity === 'NEUTRAL' || !opinion.isComplete) {
      return {
        label: 'Dados Insuficientes',
        severity,
        rationale: 'Faltam drivers mínimos para determinar o motivo principal.',
        sourceDrivers
      };
    }

    const { dominantDriver, mitigatingDriver } = this.determineDrivers(context, severity);
    
    // Resolve secondary attention based on legacy logic
    const d = context.technicalDrivers || {};
    const dep = Number(d.dependenciaCapitalTerceiros);
    const endiv = Number(d.endividamentoGeral);
    const lqReal = Number(d.liquidezReal);
    const autonomiaRaw = Number(d.autonomiaFinanceira);
    const autonomia = (!isNaN(autonomiaRaw) && autonomiaRaw <= 1.0) ? autonomiaRaw * 100 : autonomiaRaw;

    if (severity === 'CRITICAL') {
      dominantStrength = dominantDriver.labels.critical;
      secondaryAttention = 'Risco de Continuidade Operacional';
      rationale = 'Matriz de Prioridade: Identificou driver crítico sobrepondo qualquer driver positivo.';
    } else if (severity === 'WARNING') {
      dominantStrength = dominantDriver.labels.warning;
      if (!isNaN(dep) && dep > 0.50) secondaryAttention = 'Forte Dependência de Terceiros';
      else secondaryAttention = 'Concentração de Riscos Operacionais';
      rationale = 'Matriz de Prioridade: Foco em monitoramento de drivers de risco mitigado.';
    } else {
      dominantStrength = dominantDriver.labels.healthy;
      if (!isNaN(lqReal) && lqReal >= 5.0) secondaryAttention = 'Oportunidade de Alocação de Excedentes';
      else if (!isNaN(endiv) && endiv > 30) secondaryAttention = 'Custo de Oportunidade da Dívida';
      else if (!isNaN(autonomia) && autonomia < 60) secondaryAttention = 'Disciplina na Manutenção de Capital Próprio';
      else secondaryAttention = 'Consolidação Sustentável da Operação';
      rationale = 'Matriz de Prioridade: Validação positiva após passagem limpa pela Severity Lock.';
    }

    const safeLabel = ExecutiveSemanticBoundaryGuard.sanitize(dominantStrength || rawTechnicalDriverLabel || '', severity === 'CRITICAL' ? 'SEVERE' : 'MONITORING');

    return {
      label: safeLabel,
      dominantStrength,
      secondaryAttention,
      severity,
      rationale,
      sourceDrivers
    };
  }
}
