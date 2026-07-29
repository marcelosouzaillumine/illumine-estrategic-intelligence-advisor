# EAC Technical Contract Diff Audit

## 1. InstitutionalPatternMap
- **Root Anterior:** `<div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">`
- **Root Atual:** `<ExecutiveTechnicalEvidenceSection aria-label="Evidências e metodologia dos padrões institucionais" className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">`
- **Classes Anteriores:** idênticas.
- **Classes Atuais:** idênticas.
- **Atributos:** `aria-label` adicionado nativamente pelo contrato.
- **Filhos:** Inalterados (mesma ordem).
- **Wrappers adicionados:** Nenhum. Substituição direta.
- **Diferenças Encontradas:** Apenas semântica HTML (`div` para `section`) e injeção do `data-eac-block="technical-evidence"`.

## 2. CopilotTracePanel
- **Root Anterior:** `<div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">`
- **Root Atual:** `<ExecutiveDecisionTraceSection aria-label="Rastro de decisão e auditoria do Copilot" className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">`
- **Classes Anteriores:** idênticas.
- **Classes Atuais:** idênticas.
- **Atributos:** `aria-label` adicionado.
- **Filhos:** Inalterados.
- **Wrappers adicionados:** Nenhum. Substituição direta.
- **Diferenças Encontradas:** `div` para `section`, e `data-eac-block="decision-trace"`.

## 3. AdvisorHistoricalSurface
- **Root Anterior:** `<div className="card-premium h-full flex flex-col">`
- **Root Atual:** `<ExecutiveDecisionTraceSection aria-label="Histórico e auditoria da assessoria" className="card-premium h-full flex flex-col">`
- **Classes Anteriores:** idênticas.
- **Classes Atuais:** idênticas (incluindo o sensível `h-full`).
- **Atributos:** `aria-label` adicionado.
- **Filhos:** Inalterados.
- **Wrappers adicionados:** Nenhum. Substituição direta.
- **Diferenças Encontradas:** O `h-full` foi passado intacto para a section, preservando o grid layout sem necessitar de `display: contents`.

## 4. DRETechnicalLayerSection
- **Root Anterior:** `<ExecutiveAccordion variant="analytics" icon={<Database />} ...>`
- **Root Atual:** `<ExecutiveTechnicalEvidenceSection aria-label="Evidências técnicas da DRE">` encapsulando o `ExecutiveAccordion`.
- **Classes Anteriores:** O Accordion não dependia de classes dimensionais repassadas pelo pai.
- **Classes Atuais:** O novo wrapper não injetou classes e manteve neutralidade.
- **Atributos:** `aria-label` na section.
- **Filhos:** `<ExecutiveAccordion>` é o primeiro filho direto da nova `<section>`.
- **Wrappers adicionados:** Um (o próprio `ExecutiveTechnicalEvidenceSection`).
- **Diferenças Encontradas:** Nova tag pai, sem impacto detectável no fluxo do documento.
