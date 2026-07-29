# Constituição de Governança Arquitetural — Illumine Governance™ (v5.0)

**Documento Institucional Permanente de Governança Arquitetural**

---

## 🏛️ 1. Princípios Arquiteturais (Permanentes & Invariáveis)

1. **Single Source of Truth (SSOT)**: Todo indicador, métrica financeira ou demonstrativo contábil deve possuir uma única origem de cálculo auditável na plataforma.
2. **Canonical First**: Toda nova visão, tela ou componente deve ser construído utilizando estritamente o Design System canônico (`src/components/ui/`).
3. **Atomic Migration**: A refatoração de qualquer página deve ser 100% concluída antes do início da próxima. Ambientes híbridos permanentes são proibidos.
4. **Compatibility Preservation**: Nenhum artefato de compatibilidade pode ser descontinuado enquanto houver consumidor ativo, teste ou documentação.
5. **Architecture by Evidence**: Qualquer alteração de motor, modelo ou fusão de página exige evidências numéricas comparativas gravadas.
6. **Documentation as Code**: Toda decisão arquitetural, baseline, ADR, RFC, registro e certificação faz parte integrante da arquitetura da plataforma e é versionada, revisada e auditada com o mesmo rigor aplicado ao código-fonte.

---

## 👥 2. Papéis & Responsabilidades da Governança

| Papel Institucional | Responsabilidade Principal | Mecanismo de Atuação |
| :--- | :--- | :--- |
| **Arquiteto-Chefe** | Aprovação final de decisões arquiteturais estruturais e assinatura dos ADRs | Revisão de ADRs e PRs Críticos |
| **Responsável Técnico** | Execução atômica das refatorações e convergência das visões | Implementação e testes locais |
| **Revisor Arquitetural** | Auditoria de conformidade dos padrões EAA/EELS e revisão de código | Code Review & Audit Scripts |
| **CI/CD Pipeline** | Execução automatizada e imparcial dos Guardrails de Arquitetura | `npm run validate:architecture` |
| **Comitê Arquitetural** | Análise e concessão de exceções temporárias e resolução de táticas | Reunião Semanal de Governança |

---

## 🧭 3. Estrutura de Governança: Técnica vs. Funcional (Domínio)

- **Governança Técnica**: Estrutura de camadas, limites de fronteira, Design System visual, performance, bundle size e Fitness Functions.
- **Governança Funcional (Domínio)**: Regras de negócio contábeis/financeiras, modelos de projeção, valoração, DRE/DFC/BP e matrizes de decisão do Conselho.

---

## ⚙️ 4. Architecture Fitness Functions (Verificações Contínuas)

| Fitness Function | Frequência | Ferramenta / Execução | Limite / Tolerância |
| :--- | :--- | :--- | :--- |
| **Boundary Validation** | Todo Commit / PR | `node scripts/validate_architecture_boundaries.cjs` | 0 novos vazamentos (teto legado ≤ 134) |
| **ViewModel Validation** | Todo Commit / PR | `node scripts/validate_viewmodels.cjs` | **0 violações** (214/214 em conformidade) |
| **Canonical Components** | Todo Commit | Auditoria AST de imports de `Common.tsx` | Redução progressiva até **0** |
| **Direct Firestore Import** | Todo Commit | Pattern Scanner em `src/components/pages/` | Redução progressiva até **0** |
| **Cyclic Dependency** | Diário | AST Dependency Graph Scanner | **0 dependências cíclicas** |
| **Dead Code & Orphan Audit** | Semanal | Tree-Shaking Analyzer | 0 arquivos órfãos não catalogados |
| **ADR Consistency Audit** | Mensal | Script Check em `docs/architecture/adr/` | 100% das alterações críticas com ADR |

---

## 🔄 5. Fluxo Formal de Mudanças Arquiteturais (Governance Lifecycle)

```
Proposta ──► RFC (Proposta Técnica) ──► ADR (Registro Decisório) ──► Implementação ──► Quality Gates ──► Auditoria ──► Certificação ──► Baseline Atualizada
```

---

## 🔄 6. Ciclo de Vida Formal de Aposentadoria de Artefatos

Todo artefato em processo de modernização percorre a esteira oficial:

$$\text{Canônico} \longrightarrow \text{Sucessor Homologado} \longrightarrow \text{Em Descontinuação} \longrightarrow \text{Compatibilidade} \longrightarrow \text{Removido}$$

1. **Canônico**: Em uso oficial ativo.
2. **Sucessor Homologado**: Nova implementação canônica aprovada para substituição.
3. **Em Descontinuação**: ADR publicado agendando a descontinuação; novos consumos bloqueados.
4. **Compatibilidade**: Mantido exclusivamente enquanto houver dependência ativa de testes/demos/documentação.
5. **Removido**: Exclusão física do repositório pós-eliminação de todas as dependências.

---

## 🏆 7. Níveis de Certificação Arquitetural

- 🥉 **Bronze**: Conclusão de 100% das migrações atômicas.
- 🥈 **Prata**: Atingimento de 100% dos KPIs de convergência + Zero violações críticas no CI/CD.
- 🥇 **Ouro**: KPIs 100% atingidos + Arquitetura certificada + Cobertura dos motores críticos ≥ 95% + Baseline gravada.

---

## 🔄 8. Política Operacional de Governança Contínua

1. Toda nova página criada na plataforma nasce obrigatoriamente canônica (`src/components/ui/`).
2. Qualquer proposta de inclusão de novo motor ou camada exige ADR aprovado pelo Arquiteto-Chefe.
3. Os guardrails de CI/CD operam em regime de bloqueio estrito.
