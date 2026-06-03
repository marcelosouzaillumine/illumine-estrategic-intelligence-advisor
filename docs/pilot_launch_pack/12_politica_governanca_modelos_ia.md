# Política de Governança de Modelos de Inteligência Artificial

A plataforma Governance/EFOS utiliza IA, mas o faz de forma arquitetonicamente segmentada para garantir a confiabilidade fiduciária exigida por Conselhos de Administração.

## 1. Princípio da Separação Causal vs. Generativa

**A Matemática Nunca é Generativa**:
- O cruzamento de BP, DRE e DFC, o cálculo de Runways, a verificação do Score e as restrições de liquidez (ISHE) são 100% algorítmicas, determinísticas e mapeáveis.
- **Proibição Absoluta**: É terminantemente proibido utilizar LLMs (Large Language Models) para "adivinhar", "estimar" ou "suavizar" dados financeiros ausentes. Se falta dado, o sistema aciona *Fail-Closed*.

## 2. O Papel da IA Generativa (Narrative Governance)

A IA atua primariamente como uma **Engine de Síntese e Tradução Semântica**:
- **Tradução Fiduciária**: Transforma os outputs matemáticos duros (ex: "Erosão de 15% na proporção FCO/EBITDA contínua") em narrativas estratégicas para consumo rápido pelo conselho.
- **Quarentena de Otimismo**: A IA geradora opera sob uma "camisa de força" (Prompt injection contido via Runtime Context). Se a matemática dita `SURVIVAL_MODE`, o contexto enviado ao LLM impõe *strings* negativas restritivas (ex: "Não recomendar M&A", "Bloquear jargões de growth").

## 3. Mitigação de Alucinações (Hallucinations)

- **Grounding Estruturado**: Os prompts subjacentes à IA não pedem "análise aberta" de planilhas. Eles recebem um JSON fortemente tipado, com o diagnóstico exato, a severidade, o perfil e as diretrizes já pré-calculadas.
- **Auditoria Narrativa**: A saída generativa passa por sanitização (`SurvivalConstraintPropagationEngine.sanitizeNarrative`) para extrair ou censurar falsas promessas de recuperação antes de ir para o Board Pack final.

## 4. Responsabilidade Executiva e Isenção Algorítmica

- Modelos de IA na plataforma exercem função *advisory* (consultiva), auxiliando a cognição humana.
- A aprovação de estratégias baseadas nas sínteses do EFOS requer inteira homologação humana pelo gestor C-Level (O "Human in the Loop" no ápice da cadeia decisória).
- A empresa cliente abdica do direito de responsabilizar a IA generativa por perdas de mercado, uma vez que a governança final da corporação e a auditabilidade de seus dados primários permanecem soberanos à mesma.
