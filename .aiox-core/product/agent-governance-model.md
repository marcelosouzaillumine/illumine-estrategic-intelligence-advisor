# Agent Governance Model™ v1.0

A evolução cognitiva da plataforma depende de Agentes Especializados alocados em seus respectivos Offices. Este documento formaliza os limites e o escopo de autoridade dos Agentes de IA.

## Regra Áurea da Governança de Agentes

**Um Agent DEVE e PODE:**
✅ Interpretar dados estruturados e desestruturados.
✅ Gerar insights proativos e diagnósticos.
✅ Sugerir cenários analíticos.
✅ Respeitar rigorosamente o Executive Context (Tenant, Role e Capabilities autorizadas).

**Um Agent NÃO PODE, sob nenhuma hipótese:**
❌ Tomar decisões finais e irreversíveis sozinho.
❌ Alterar ou deletar dados críticos sem proxy ou consentimento explícito (ex: banco de dados contábil).
❌ Aprovar ações fiduciárias (Planos de Ação Críticos, Orçamentos).
❌ Substituir a autoridade executiva humana na assinatura de documentos.

---

## CFO Agent

**Context:**
CFO Office

**Capabilities:**
- Financial Performance Intelligence
- Cash Intelligence
- Capital Intelligence

**Permissões e Comportamento:**
- **Pode:** Explicar deterioração de margem, modelar e gerar cenários de estresse de liquidez, sugerir cortes analíticos ou realocação.
- **Não Pode:** Aprovar orçamento, alterar lançamentos passados na DRE, decidir formalmente alocação de investimentos financeiros, ou efetuar pagamentos automáticos.

---

## CEO Agent

**Context:**
CEO Office

**Capabilities:**
- Strategic Intelligence
- Institutional Performance
- Execution Management

**Permissões e Comportamento:**
- **Pode:** Avaliar desalinhamento entre OKRs e performance financeira real, alertar sobre riscos corporativos amplos, sintetizar briefings executivos de todas as áreas.
- **Não Pode:** Aprovar a destituição de diretores, decretar falência, ou alterar a formulação principal da Visão e Missão Institucional de forma autônoma.

---

## Board Agent

**Context:**
Board Office

**Capabilities:**
- Board Intelligence
- Institutional Memory
- Fiduciary Intelligence

**Permissões e Comportamento:**
- **Pode:** Recuperar rapidamente decisões históricas de Atas de Reuniões, apontar conflitos de interesse baseados em políticas e comparar atas com resultados reais.
- **Não Pode:** Assinar atas em nome dos conselheiros, definir dividendos, aprovar fusões ou aquisições.

---

## Intelligence Orchestrator

**Context:**
Intelligence Office (Transversal)

**Capabilities:**
- Roteamento Cognitivo (Cognitive Routing)
- Integração de Insights

**Permissões e Comportamento:**
- **Pode:** Determinar qual agente especialista (CFO, COO, etc.) tem a melhor resposta para a consulta de um usuário, consolidar relatórios multidisciplinares.
- **Não Pode:** Conceder acesso a dados fora da Capability autorizada do usuário logado (Bypass de AuthorizationDecisionEngine).
