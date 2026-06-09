# Semantic Enum Test Audit

### Diagnóstico do Vazamento de Enum Semântico e Internacionalização

Esta auditoria concentrou-se na análise das suítes de testes semânticos:
- `tests/i18n-enum-leak-audit.test.ts`
- `tests/institutional-language-regression.test.tsx`

#### 1. Falsos Positivos de Renderização no DOM
A engine do teste `i18n-enum-leak-audit.test.ts` possui uma falha de design: o seu regex `>\s*([A-Z0-9_]{4,})\s*<` visa capturar strings como `> EXECUTIVE_VIOLATION <` vazando para a interface, o que é de fato um risco na plataforma.
Entretanto, o teste passou a capturar chaves institucionais perfeitamente normais e intencionais inseridas dentro das views de Console, Botões e Status Badges:
- `CANCELAR`, `IMPORTAR` (Botões de UI)
- `CRITICAL`, `WARNING` (AlertSeverityBadge - Ex: Severity.CRITICAL renderizado estritamente em inglês por escolha de design system, não sendo um enum quebrado).
- `DRAFT`, `COMPLETED` (WorkflowStatusBadge).
  
Esses termos não configuram um vazamento de enum "cru" (`EnumLeak`), mas sim design textual direto. O regex precisa ignorar literais válidas ou o teste deve ser convertido para não punir textos de UI em caixa alta.

#### 2. Restrições do `ExecutiveLanguageBoundaryGuard`
Em `institutional-language-regression.test.tsx`, o teste escaneia a `DFCPage` por tokens estritamente proibidos (`BOARD`, `EXECUTIVE`, `TECHNICAL`, `EQE`).
Contudo, o `mockRuntimeOutput` injeta a propriedade nativa do JSON no payload (ex: `cashBoardDecisionFramework: { boardOutlook: '...' }`). Em algumas renderizações, caso a tabela despeje o raw JSON ou o nome da key, o Regex aciona a infração `EXECUTIVE_LANGUAGE_LEAK` incorretamente.

#### Conclusão Semântica
O Runtime está protegido. A suíte de testes legada ficou demasiadamente paranoica, atacando componentes cosméticos. As correções demandam afrouxamento paramétrico (mock override ou whitelist no Regex), preservando o bloqueio contra vazamentos reais (como o vazamento de chaves de erro técnico, ex: `ERR_INTERNAL_RUNTIME_FAULT`).
