# Protocolo da Camada de Experiência Executiva (Executive Experience Layer)

Este protocolo define a especificação técnica e as restrições fiduciárias de design para a exibição, organização e humanização da inteligência contábil-financeira para executivos e tomadores de decisão na plataforma Illumine.

## 1. Princípio Central da Experiência Passiva
Toda e qualquer interface (workspaces de clientes, dashboards do advisor, relatórios impressos, apresentações para conselhos) consome **única e exclusivamente** a saída estruturada do `ExecutiveIntelligenceReport` gerada pelo Core Runtime.

É terminantemente proibido:
- Inferir qualquer severidade ou nível de risco na UI.
- Gerar ou complementar recomendações contábeis e estratégicas localmente.
- Criar conclusões narrativas que não possuam backing direto e auditável do report gerado.

## 2. Diretrizes de Storytelling Executivo
A camada de storytelling executivo (`ExecutiveStorytellingEngine.ts`) atua como um tradutor fiduciário com as seguintes atribuições exclusivas:
- **Organizar**: Agrupar as informações por relevância executiva de acordo com a prioridade das áreas de foco.
- **Priorizar**: Destacar os riscos críticos (degradação e colapso de confiança, insolvência preditiva) com maior proeminência visual.
- **Contextualizar**: Associar as métricas ao modelo de negócio (Asset Heavy vs. Asset Light) e estágio operacional do tenant.
- **Humanizar**: Traduzir nomenclaturas contábeis secas para explicações limpas, claras e acessíveis para conselheiros não-financeiros.
- **Format**: Ajustar espaçamentos, capitulares e layouts para leitura focada.

## 3. Matriz de Mapeamento de Stakeholders

O sistema compõe resumos executivos baseando-se no perfil de acesso do stakeholder:

| Perfil | Foco de Leitura | Densidade Narrativa | Detalhamento Técnico |
| :--- | :--- | :--- | :--- |
| **CEO Summary** | Direção estratégica, EBITDA, principais gargalos e prioridades. | Média-Baixa (Crisp) | Baixo |
| **Board Summary** | Governança fiduciária, riscos de liquidez, ratings de capital. | Baixa (Direto ao ponto) | Médio |
| **Investor Summary** | Variação YoY do PL, taxas de eficiência, indicadores macro. | Média | Médio |
| **Advisory Summary** | Playbook completo de mitigação, sensibilidades de estresse. | Alta | Alto |
| **Operational Summary** | Runway de caixa, gargalos circulantes e vencimentos. | Alta | Médio-Alto |
