# MASTER INTEGRATION ENGINE

Este documento define as regras de governança para a Infraestrutura de Integração Institucional (*Institutional Financial Data Integration Infrastructure*). 

O princípio norteador é o **Zero-Trust (Confiança Zero)** em dados que adentram a corporação, isolando o *Runtime Consolidado* de anomalias externas.

## Pipeline de Ingestão (A Alfândega Institucional)

Nenhum arquivo ou payload é enviado diretamente aos motores de cálculo. Ele percorre obrigatoriamente um *gateway* auditado:
1. **`DataIngestionGateway`**: Receptor passivo que impede parsings complexos client-side.
2. **`DataQualityGatekeeper`**: O fiscal da alfândega. Ele cruza o `TenantId` e checa anomalias graves (como tentar subir uma DRE da *Holding A* usando o token da *Holding B*). Ele **bloqueia** anomalias críticas e gera Avisos (Warnings) para inconsistências menores.
3. **`SourceTrustEngine`**: Classificador de Risco Fiduciário. Sistemas (M2M) autênticos recebem *HIGH Trust*; Uploads manuais desestruturados (CSV) sempre caem em *LOW/UNVERIFIED Trust*, forçando escrutínio.
4. **`IngestionLineageBinder`**: Carimbador. Atribui hashes que acompanharão aquele dado para sempre na arquitetura.
5. **`ImportReviewQueue`**: Quarentena. O dado dorme no estado *Staged / Pending Review*.

## Publicação Governamental

Os dados revisados passam por aprovação de um `Actor` (Advisor, Controller) antes de atingirem o `ImportPublicationEngine`.
Para respeitar o dogmatismo do *Runtime*, a publicação nunca sobrescreve o passado ou o *Runtime* que está vivo em cache. Ela agenda a publicação, gerando um `ImportPublicationRecord`, preservando a consistência temporal da análise que estava em tela.

## Governança do Client-Side
O React está proibido de armazenar *Uploads* de planilhas de milhões de linhas no *localStorage* ou no *IndexedDB*, para prevenir exfiltração de dados sensíveis entre sessões (*Cross-Tenant Leakage*). 
Isso é bloqueado duramente pelo script `runIntegrationGovernanceAudit.ts` que inspeciona toda mutação.
