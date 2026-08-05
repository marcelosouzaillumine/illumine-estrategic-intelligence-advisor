# Wave 18B.4 — Executive Decision Center™

## 1. O Salto Arquitetural
O encerramento de uma proposta não é um ato puramente transacional de "Aceitar/Recusar". A partir desta Wave, a plataforma Illumine introduz o **Executive Decision Center™** como uma *Capability Institucional*. 
Embora nasça na Wave 18 (Revenue), seu design é transversal, preparando o terreno para gerenciar aprovações de *Board*, *CAPEX*, e *M&A*.

## 2. Information Architecture do Decision Center
O Decision Center deve instigar o conforto e a clareza antes do aceite:
- **Executive Summary:** A tese central da decisão.
- **Strategic Commitment:** Escopo, responsabilidades, premissas, cronograma e investimento finalizados.
- **Questions & Clarifications:** Um canal assimétrico e seguro para eliminar dúvidas sem interromper o fluxo comercial.
- **Decision Options:** O menu executivo de escolhas:
  1. Solicitar Conversa
  2. Solicitar Ajustes
  3. Aceitar Proposta
- **Acceptance Journey:** O fluxo criptográfico de validação e emissão do *Acceptance Certificate*.
- **Next Automation:** Transição imediata de "Obrigado" para "Próximos Passos", mitigando a ansiedade pós-compra.

## 3. Desacoplamento de Domínio (O Novo Core)
Será estabelecido o pacote independente `packages/domain/executive-decision`. 
O Revenue Domain (`packages/domain/revenue`) passará a emitir instâncias de decisão, delegando a responsabilidade de assinatura, registro de auditoria e geração do certificado para este novo motor institucional.

## 4. O Fluxo de Aceite (Acceptance Flow)
Quando a opção "Aceitar" é acionada:
`Accept Decision ➔ Identity Validation (OTP/Context) ➔ Digital Acceptance ➔ Acceptance Certificate ➔ Revenue Event Triggered`

## 5. Integração com a Wave 18B.3
O `ClientWorkspaceLayout` manterá a narrativa visual (Wave 18B.3) conectada a este Decision Center. O motor `SectionRenderer` mapeará dinamicamente o bloco `NEXT_STEP` para instanciar o `ExecutiveDecisionCenter`, injetando os payloads necessários para o aceite.
