# MASTER CONSOLIDATED INTELLIGENCE ENGINE

Este documento é a fonte normativa oficial da inteligência consolidada multi-entidade da Illumine, subordinado à Master Architecture e complementar à Master Financial Intelligence Engine.

## 1. Princípio Fundamental
A plataforma Illumine não é um somatório de balanços, nem um agregador de indicadores. Ela é uma **Predictive Institutional Intelligence Infrastructure**. A consolidação de dados financeiros deve obrigatoriamente evoluir para a interpretação do ecossistema corporativo.

## 2. Camada de Advisory Institucional
Toda inteligência consolidada nasce exclusivamente do Runtime Consolidado (`src/core/runtime/consolidated/advisory`). É estritamente proibido:
- Recalcular EBITDA consolidado fora da Master Engine.
- Inferir métricas na UI.
- Criar advisory dentro de componentes React ou PDFs.

## 3. Motores de Inteligência Consolidada

### Holding Structure Interpreter
Classifica o papel de cada entidade dentro do grupo (ex: `HOLDING_PATRIMONIAL`, `SUBSIDIARIA_OPERACIONAL`, `VEICULO_FINANCEIRO`). A classificação muda a expectativa de performance e risco sistêmico.

### Intercompany Dependency Analyzer
Mapeia o nível de dependência financeira e operacional entre entidades, rastreando parasitismo de caixa, sustentação artificial (funding contínuo) e dependência de receitas cruzadas.

### Cross-Entity Causality Engine
Identifica a causa raiz de movimentos no grupo (ex: crescimento artificial intragrupo, transferência de capital) e detecta onde o valor real é criado ou destruído.

### Group Risk Propagation Engine
Simula a contaminação financeira e o risco sistêmico (ex: "Se a Subsidiária A colapsar, a Holding B tem liquidez para suportar a quebra da cadeia?").

### Consolidated Confidence Resolver
A confiança narrativa do grupo herda a fundação financeira e sofre degradação adicional caso o advisory detecte parasitismos extremos, eliminações pendentes críticas ou dependência sistêmica não rastreável.

### Consolidated Narrative Engine
Produz a síntese executiva. Proíbe expressamente jargões genéricos ("A empresa precisa melhorar a gestão") em favor de constatações causais ("O risco consolidado do grupo decorre da concentração estrutural da geração de caixa em poucas filiais, sustentadas por alto passivo intercompany").

## 4. Active Governance
Qualquer falha de reconciliação cruzada estrutural (ex: dívida mútua fantasma, equidade negativa sem provisionamento) ou violação da equação patrimonial gera um alerta CRITICAL e bloqueia a emissão do `ConsolidatedExecutiveAdvisoryReport`.
