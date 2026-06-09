const fs = require('fs');

const REPORT_FILE = 'docs/architecture/Tenancy_Runtime_Type_Hardening_Report.md';

let reportMd = `# Tenancy Runtime Type Hardening Report

## Resultado da Execução (Fases 1 e 2)

A auditoria local foi executada com sucesso sobre o domínio \`src/core/runtime/tenancy/\`.

### Métricas
- **Ocorrências Iniciais (any/ignores/catch):** 3
- **Ocorrências Corrigidas (SAFE_NOW):** 1
- **Ocorrências Adiadas (REVIEW_REQUIRED):** 2

### Detalhamento das Correções
O único item classificado como **SAFE_NOW** foi o bloco \`catch\` não tipado em \`TenantAuditLogger.ts\`.
Foi aplicado o padrão de Runtime Narrowing com sucesso:
- Conversão de \`catch (err)\` para \`catch (err: unknown)\`.
- Utilização de \`getErrorMessage(err)\` para extração segura e *fallback* sem vazar a estrutura completa do erro.

### Justificativas de Adiamento
**Itens REVIEW_REQUIRED (2):**
Ficaram restritos à tipagem flexível de metadata nos logs de auditoria:
- \`TenantAuditLogger.ts:14: metadata?: any\`
- \`TenancyTypes.ts:45: metadata?: any;\`

Esses itens representam payloads locais flexíveis, porém, como fazem parte da assinatura do contrato de \`TenantAuditRecord\` e da função pública \`logAction\`, sua conversão para \`Record<string, unknown>\` exigiria a garantia de que as partes chamadoras não enviariam tipos incompatíveis. O isolamento foi mantido sem alterar o comportamento do logger.

### Riscos Remanescentes
O ambiente \`tenancy\` provou estar solidamente encapsulado. Apenas 3 violações foram detectadas em todo o domínio, sendo 1 corrigida sem efeitos colaterais e 2 mapeadas de baixo impacto fiduciário. Nenhuma regra de ownership, isolamento ou resolução foi exposta. A tipagem estrita já imperava nos demais arquivos (como no \`TenantGovernanceEnforcer.ts\`, já resolvido na sprint \`v2.1\`).
`;

fs.writeFileSync(REPORT_FILE, reportMd);
console.log("Report updated.");
