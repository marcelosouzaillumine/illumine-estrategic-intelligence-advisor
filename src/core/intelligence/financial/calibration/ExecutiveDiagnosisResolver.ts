import { DiagnosticValidationResult, ContradictionDetection, ResolvedDiagnosis } from './contracts/CalibrationContracts';

export class ExecutiveDiagnosisResolver {
  
  public resolve(
    validationResult: DiagnosticValidationResult,
    contradictions: ContradictionDetection[]
  ): ResolvedDiagnosis {
    
    // Se não há contradições nem conflitos de validação, mantém o diagnóstico original
    if (validationResult.validationStatus === "VALID" && contradictions.length === 0) {
      return {
        originalFinding: validationResult.originalDiagnosis,
        detectedConflict: "NONE",
        resolvedDiagnosis: validationResult.originalDiagnosis,
        reasoning: "O motor identificou um cenário consistente com os indicadores patrimoniais e operacionais.",
        confidence: 95,
        evidenceTrail: validationResult.evidenceChecked
      };
    }

    // Se há dados insuficientes
    if (validationResult.validationStatus === "INSUFFICIENT_EVIDENCE") {
      return {
        originalFinding: validationResult.originalDiagnosis,
        detectedConflict: "INSUFFICIENT_DATA",
        resolvedDiagnosis: "Diagnóstico suspenso por falta de dados complementares.",
        reasoning: "Não é possível confirmar a narrativa devido à ausência de métricas críticas na estrutura de dados.",
        confidence: 30,
        evidenceTrail: validationResult.conflictingMetrics
      };
    }

    // Se existem contradições
    const primaryContradiction = contradictions[0];
    let resolvedText = "";
    
    if (primaryContradiction) {
      switch (primaryContradiction.type) {
        case 'FALSE_LIQUIDITY_ALARM':
          resolvedText = "Não foi identificada crise de liquidez. A empresa apresenta elevada capacidade financeira, porém existe oportunidade de melhorar a eficiência de utilização do capital disponível.";
          break;
        case 'UNHEALTHY_GROWTH':
          resolvedText = "A empresa apresenta crescimento de receita, porém com deterioração de margens e queima de caixa, indicando crescimento não sustentável.";
          break;
        case 'CAPITAL_UNDERUTILIZATION':
          resolvedText = "A estrutura possui forte base patrimonial, mas o retorno sobre o patrimônio (ROE) indica subutilização do capital próprio.";
          break;
        case 'ACCOUNTING_PROFIT_QUALITY_RISK':
          resolvedText = "O lucro líquido contábil não está se revertendo em geração de caixa operacional, evidenciando provável represamento no capital de giro (ex: contas a receber).";
          break;
        case 'IDLE_CAPITAL_RISK':
          resolvedText = "O volume de caixa está ocioso, gerando ineficiência estrutural frente ao baixo crescimento e retorno atual.";
          break;
        default:
          resolvedText = "Sinais financeiros divergentes identificados. Necessária revisão humana.";
      }
    } else if (validationResult.validationStatus === "CONFLICT") {
       resolvedText = "O cenário descrito pela narrativa contrasta numericamente com as evidências de liquidez ou alavancagem.";
    }

    return {
      originalFinding: validationResult.originalDiagnosis,
      detectedConflict: primaryContradiction ? primaryContradiction.type : "GENERIC_CONFLICT",
      resolvedDiagnosis: resolvedText,
      reasoning: `O motor identificou um sinal isolado (${validationResult.originalDiagnosis}). A análise integrada de calibração alterou a interpretação executiva porque ${primaryContradiction?.description || "há divergência nos indicadores"}.`,
      confidence: 85,
      evidenceTrail: primaryContradiction ? primaryContradiction.involvedMetrics : validationResult.evidenceChecked
    };
  }
}
