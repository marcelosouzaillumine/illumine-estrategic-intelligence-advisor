import * as ExecutiveSemanticBoundaryGuard from './ExecutiveSemanticBoundaryGuard';
import { ExecutiveAnalysisContext, StrategicSeverityLevel, StrategicOpinionConsistencyEngine } from './StrategicOpinionConsistencyEngine';

export interface ExecutivePrimaryMotive {
  label: string;
  severity: StrategicSeverityLevel;
  rationale: string;
  sourceDrivers: string[];
}

export class ExecutivePrimaryMotiveConsistencyEngine {
  
  public static deriveExecutivePrimaryMotive(context: ExecutiveAnalysisContext, rawTechnicalDriverLabel?: string): ExecutivePrimaryMotive {
    // 1. Base Severity from the central engine
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);
    const severity = opinion.severityState;
    
    const sourceDrivers = context.technicalDrivers ? Object.keys(context.technicalDrivers) : [];

    let label = rawTechnicalDriverLabel || 'Ausência de Restrições Estruturais';
    let rationale = 'Motivo derivado do contexto consolidado.';

    // 2. Coherence Matrix based on Severity
    if (severity === 'CRITICAL') {
      if (!rawTechnicalDriverLabel || rawTechnicalDriverLabel.includes('Sem vulnerabilidades')) {
        // Find worst technical driver if raw is missing/wrong
        if (context.technicalDrivers?.liquidityReal !== undefined && Number(context.technicalDrivers.liquidityReal) < 0.5) {
          label = 'Liquidez Real Crítica';
        } else if (context.technicalDrivers?.fco !== undefined && Number(context.technicalDrivers.fco) < 0) {
          label = 'Pressão Operacional sobre Caixa';
        } else {
          label = 'Fragilidade Estrutural de Capital';
        }
      } else {
        label = rawTechnicalDriverLabel;
      }
      rationale = 'Cenário Crítico: O motivo reflete os indicadores fiduciários mais expostos a risco.';
      
    } else if (severity === 'WARNING') {
      if (!rawTechnicalDriverLabel || rawTechnicalDriverLabel.includes('Sem vulnerabilidades')) {
        label = 'Monitoramento de Capital de Giro e Eficiência';
      } else {
        // Adapt critical sounding drivers to warning language
        if (rawTechnicalDriverLabel.toLowerCase().includes('crítica') || rawTechnicalDriverLabel.toLowerCase().includes('fragilidade')) {
          label = 'Monitoramento de Capital de Giro';
        } else {
          label = rawTechnicalDriverLabel;
        }
      }
      rationale = 'Cenário de Atenção: Foco em monitoramento e eficiência operacional.';
      
    } else { // HEALTHY
      // 3. Prohibit limiting strings if the consolidated context is HEALTHY/RESILIENT
      const prohibitedForHealthy = ['limitado', 'crítica', 'fragilidade', 'urgente', 'erosão', 'restrição', 'sobrevivência', 'vulnerável', 'reduzido'];
      const hasProhibited = prohibitedForHealthy.some(word => label.toLowerCase().includes(word));
      
      if (hasProhibited || label.includes('Sem vulnerabilidades críticas identificadas')) {
        if (context.moduleContext === 'BP') {
          if (context.technicalDrivers?.liquidityReal !== undefined && Number(context.technicalDrivers.liquidityReal) > 1.5) {
            label = 'Gestão de Excedente de Liquidez e Alocação de Capital';
          } else {
            label = 'Otimização da Estrutura de Capital';
          }
        } else if (context.moduleContext === 'DRE') {
          label = 'Expansão Sustentável e Geração de Valor';
        } else if (context.moduleContext === 'DFC') {
          label = 'Forte Capacidade de Geração de Caixa';
        } else if (context.moduleContext === 'DLPA') {
          label = 'Preservação de Robustez Patrimonial';
        } else {
          label = 'Consolidação Patrimonial e Disciplina de Capital';
        }
      }
      rationale = 'Cenário Resiliente/Saudável: O motivo reflete estabilidade e otimização da estrutura de capital, sem limitações iminentes.';
    }

    // 4. Semantic Guardrail
    const safeLabel = ExecutiveSemanticBoundaryGuard.sanitize(label, severity === 'CRITICAL' ? 'SEVERE' : 'MONITORING');

    return {
      label: safeLabel,
      severity,
      rationale,
      sourceDrivers
    };
  }
}
