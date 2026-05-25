export type ComplianceStatus = 'compliant' | 'partially_compliant' | 'non_compliant';

export interface InstitutionalAuditTrail {
  pipelineVersion: string;
  architectureVersion: string;
  enginesExecuted: string[];
  businessModelStatus: string;
  riskValidationStatus: string;
  causalityValidationStatus: string;
  synthesisValidationStatus: string;
  fallbackStatus: string;
  complianceStatus: ComplianceStatus;
  warnings: string[];
}

export interface EnforcerContext {
  enginesExecuted?: string[];
  businessModel?: string;
  score?: number;
  isCglPositive?: boolean;
  isFirstCycle?: boolean;
}

const INSUFFICIENT_INFO_MSG = 'Informação insuficiente para inferência institucional validada.';

const WEAK_PLACEHOLDERS = [
  'N/A',
  '—',
  'Aguardando Consolidação',
  'Monitoramento passivo',
  'Base alinhada',
  'Estratégica'
];

/**
 * Institutional Runtime Enforcer
 * Barreira final para outputs institucionais.
 */
export function enforceInstitutionalRuntime(output: string | any, context: EnforcerContext): { sanitizedOutput: any, auditTrail: InstitutionalAuditTrail } {
  const auditTrail: InstitutionalAuditTrail = {
    pipelineVersion: 'v2.0',
    architectureVersion: 'Illumine Master Architecture v1.5.0',
    enginesExecuted: context.enginesExecuted || [],
    businessModelStatus: 'not_validated',
    riskValidationStatus: 'not_validated',
    causalityValidationStatus: 'not_validated',
    synthesisValidationStatus: 'not_validated',
    fallbackStatus: 'none',
    complianceStatus: 'compliant',
    warnings: []
  };

  let isNonCompliant = false;
  let isPartiallyCompliant = false;

  // 6. Bypass de modelo de negócio
  if (!context.businessModel || context.businessModel === 'Desconhecido') {
    auditTrail.businessModelStatus = 'missing';
    auditTrail.warnings.push('Modelo de negócio não inferido/informado.');
    isPartiallyCompliant = true;
  } else {
    auditTrail.businessModelStatus = 'validated';
  }

  let sanitizedOutput = output;
  const isStringOutput = typeof output === 'string';
  const strToAnalyze = isStringOutput ? output : JSON.stringify(output);

  // 1. Placeholders fracos e texto vazio
  if (!strToAnalyze || strToAnalyze.trim() === '' || strToAnalyze === '{}') {
    auditTrail.warnings.push('Output vazio detectado.');
    isNonCompliant = true;
  }

  let hasPlaceholders = false;
  
  if (isStringOutput) {
    WEAK_PLACEHOLDERS.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(sanitizedOutput as string)) {
        hasPlaceholders = true;
        sanitizedOutput = (sanitizedOutput as string).replace(regex, INSUFFICIENT_INFO_MSG);
      }
    });
  } else {
    // Deep clone to avoid mutating the original input immediately
    sanitizedOutput = JSON.parse(strToAnalyze);
    const checkAndReplace = (obj: any) => {
      if (!obj) return;
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          let value = obj[key].trim();
          let replaced = false;
          WEAK_PLACEHOLDERS.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            if (regex.test(value)) {
              hasPlaceholders = true;
              replaced = true;
              value = value.replace(regex, INSUFFICIENT_INFO_MSG);
            }
          });
          if (replaced || value === '') {
             obj[key] = value === '' ? INSUFFICIENT_INFO_MSG : value;
             if (value === '') hasPlaceholders = true;
          }
        } else if (typeof obj[key] === 'object') {
          checkAndReplace(obj[key]);
        }
      }
    };
    checkAndReplace(sanitizedOutput);
  }

  if (hasPlaceholders) {
    auditTrail.fallbackStatus = 'insufficient data';
    auditTrail.warnings.push('Placeholders fracos detectados no output.');
    isPartiallyCompliant = true;
  }

  // 2. Narrativas sem causalidade (heurística básica: se for string longa, checa palavras-chave)
  if (isStringOutput && strToAnalyze.length > 200) {
    const lower = strToAnalyze.toLowerCase();
    const hasCause = lower.includes('devido') || lower.includes('causa') || lower.includes('motivado') || lower.includes('reflexo');
    const hasConsequence = lower.includes('resulta') || lower.includes('impacta') || lower.includes('consequência') || lower.includes('gera');
    if (!hasCause || !hasConsequence) {
      auditTrail.causalityValidationStatus = 'failed';
      auditTrail.warnings.push('Narrativa carece de estrutura causal (Causa -> Consequência).');
      isPartiallyCompliant = true;
    } else {
      auditTrail.causalityValidationStatus = 'validated';
    }
  }

  // 5. Contradições entre score e narrativa
  if (context.score !== undefined) {
    const isCriticalScore = context.score < 40;
    const lower = strToAnalyze.toLowerCase();
    const indicatesHealth = lower.includes('excelente saúde') || lower.includes('sólido') || lower.includes('robusto') || lower.includes('alta performance');
    
    if (isCriticalScore && indicatesHealth) {
      auditTrail.synthesisValidationStatus = 'failed';
      auditTrail.warnings.push('Contradição detectada: Score crítico com narrativa saudável.');
      isNonCompliant = true;
    }
  }

  // Consolidar status
  if (isNonCompliant) {
    auditTrail.complianceStatus = 'non_compliant';
  } else if (isPartiallyCompliant) {
    auditTrail.complianceStatus = 'partially_compliant';
  } else {
    auditTrail.complianceStatus = 'compliant';
  }

  return { sanitizedOutput, auditTrail };
}
