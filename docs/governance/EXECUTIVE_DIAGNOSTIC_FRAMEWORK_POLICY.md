# Executive Diagnostic Framework™ Policy

## 1. Objetivo
Esta política estabelece as diretrizes de governança, proteção de propriedade intelectual e regras arquiteturais aplicáveis a todos os Executive Diagnostic Journeys™ desenvolvidos pela Illumine. O objetivo é garantir que a fundação de avaliação executiva da plataforma permaneça segura, escalável e unificada, alimentando adequadamente os módulos de Discovery (Concierge) e Advisory.

## 2. Padrão Arquitetural Universal
Todos os novos diagnósticos devem obrigatoriamente estender a arquitetura `ExecutiveDiagnosticJourney` e serem registrados no `DiagnosticRegistry`.
- Nenhuma lógica de diagnóstico deve ser embutida dentro de componentes UI (React).
- Nenhuma lógica de pontuação (*scoring*) deve misturar-se com a geração de perfil executivo (*interpretation*).

## 3. Classificação de Informação e Propriedade Intelectual (IP)

### 3.1. Informações Públicas (Permitido)
As seguintes informações podem ser expostas na camada pública (Marketing, Concierge B2B, Landing Pages):
- Nomes oficiais das jornadas (ex: *Financial Intelligence Diagnostic Journey™*).
- Áreas ou dimensões avaliadas em alto nível (ex: *Avaliamos a previsibilidade do seu fluxo financeiro*).
- Os benefícios e resultados esperados após a conclusão.

### 3.2. Informações Autenticadas (Permitido)
Resultados entregues diretamente a usuários logados ou clientes passando pela jornada:
- Perfis de Inteligência Executiva (*Executive Intelligence Profile™*).
- Resultados individuais mapeados (*Strengths*, *Attention Points*).
- Recomendações orientadas ao negócio.

### 3.3. Inteligência Proprietária (Estritamente Restrito)
Os ativos intelectuais a seguir constituem o núcleo (*core business*) da inteligência Illumine e **NUNCA** devem ser vazados em respostas públicas de API não autenticadas ou lógicas front-end decodificáveis:
- Pesos numéricos das opções e dos indicadores de cada dimensão.
- Fórmulas de cálculo do `ScoringEngine`.
- Regras de corte dos modelos de maturidade (os limites de *score* que geram cada `MaturityLevel`).
- O mapeamento lógico interno do `InterpretationEngine` (como métricas geram a linguagem executiva de saída).
- Algoritmos internos ou parâmetros do *Diagnostic Intelligence Ownership*.

## 4. Diagnostic Intelligence Ownership
Toda a taxonomia, as perguntas de avaliação, a modelagem de pesos e as recomendações sintetizadas são consideradas **ativos proprietários da Illumine**. Qualquer extensão ou integração futura por intermédio dos Executive Intelligence Agents™ deve operar lendo os resultados do `InterpretationEngine` através da abstração do Profile, preservando o sigilo corporativo das regras de negócio que originaram tais conclusões.

## 5. Extensibilidade
Esta arquitetura foi desenhada não apenas para coletas pontuais de questionários, mas para aceitar futuramente contextos de execução (`DiagnosticExecutionContext`) preenchidos assincronamente por Inteligência Artificial ou fluxos passivos de observabilidade de dados (via *Enterprise Data Foundation*).

## Executive Intelligence Portfolio Boundary™

**Público (Pode ser exposto à UI e ao usuário):**
* Nome das jornadas evolutivas (ex: Financial Intelligence Journey™)
* Áreas avaliadas (Capacidades Identificadas)
* Insights gerais qualitativos (Executive Insights)
* Estágio Organizacional Qualitativo (ex: Foundation Building)
* Vetores de Evolução (ex: Próximas Jornadas Recomendadas)

**Restrito (Protegido no Backend / Engine, NUNCA exposto ao usuário):**
* Matriz exata de maturidade e percentuais de corte
* Fórmulas numéricas de pesos das opções
* Regras estruturais de correlações entre diagnósticos (ex: Regra exata que define que Gov Inicial + Finança Avançada = Risco)
* Algoritmos internos de recomendação do Progression Engine
* Quaisquer scores agregados do portfólio completo
