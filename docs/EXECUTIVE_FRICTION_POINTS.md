# Pontos de Fricção Executiva — Illumine Platform

Este documento cataloga pontos de atrito cognitivo ou dificuldades de interação identificados pelos usuários (CEOs, CFOs, Advisors) durante as sessões de conselho e onboarding.

---

## Catálogo de Fricções Identificadas

### 1. Mensagens de Alerta Nativo no Navegador
- **Fricção**: O uso de `alert()` interrompia o fluxo da apresentação ao forçar um diálogo modal síncrono nativo e cinza do navegador, diminuindo o tom premium e quebrando a integridade visual da plataforma.
- **Resolução**: Substituição de alertas síncronas nativos por estados de erro integrados em React (`calibrationError`).

### 2. Dúvida de Causalidade em Histórico Curto
- **Fricção**: CEOs de startups com apenas 1 ou 2 anos de histórico comercial questionavam por que o dashboard não exibia previsões causais de longo prazo.
- **Resolução**: A governança força "fail-closed" para dados de tendência evolutiva em caso de histórico menor que 3 anos, o que agora é claramente explicitado por mensagens informando "Histórico insuficiente para inferência evolutiva".

### 3. Entendimento de Lineage
- **Fricção**: Investidores e conselheiros de perfil mais tradicional tinham dificuldade de correlacionar os hashes de auditoria com os lançamentos contábeis originais.
- **Resolução**: Exposição simplificada do `BOARD_EVIDENCE_MODE` detalhando em português de onde as fontes foram extraídas de maneira transparente.
