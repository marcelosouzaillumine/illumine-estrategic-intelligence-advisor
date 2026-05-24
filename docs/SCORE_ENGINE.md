# SCORE_ENGINE

## Dinâmica de Score
A lógica de score é contextual e obedece ao BUSINESS_MODEL_INTELLIGENCE_ENGINE. O motor deve:
- utilizar pesos dinâmicos por setor;
- modular severidade conforme modelo de negócio;
- recalibrar thresholds automaticamente.

**Exemplos de Modulação:**
- varejo → peso maior para estoque e liquidez seca;
- SaaS → peso maior para geração de caixa (asset light);
- indústria → tolerância maior à imobilização (asset heavy);
- hospital → interpretação baseada em previsibilidade de fluxo.

**REGRA OBRIGATÓRIA:**
Score sem contexto operacional é inválido.
