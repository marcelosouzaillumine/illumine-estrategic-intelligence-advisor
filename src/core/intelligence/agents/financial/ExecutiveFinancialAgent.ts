import { ExecutiveAgentRequest } from '../contracts/ExecutiveAgentRequest';
import { ExecutiveAgentResponse } from '../contracts/ExecutiveAgentResponse';
import { ExecutiveAgentMode } from '../contracts/ExecutiveAgentMode';
import { FinancialIntentClassifier } from './FinancialExecutiveIntent';
import { FinancialContextRetriever } from './FinancialContextRetriever';
import { AgentGovernance } from './AgentGovernance';
import { AgentReasoningTrace } from './AgentReasoningTrace';
import { ExecutiveResponseEngine } from './ExecutiveResponseEngine';

export class ExecutiveFinancialAgent {
  private intentClassifier = new FinancialIntentClassifier();
  private contextRetriever = new FinancialContextRetriever();
  private governance = new AgentGovernance();
  private responseEngine = new ExecutiveResponseEngine();

  public process(request: ExecutiveAgentRequest, mode: ExecutiveAgentMode): ExecutiveAgentResponse {
    const trace = new AgentReasoningTrace();
    
    // 1. Intent Recognition
    const intent = this.intentClassifier.classify(request.question);
    trace.setIntent(intent);

    // 2. Pre-flight Governance
    if (!this.governance.validatePreFlight(intent, mode, trace)) {
      return this.responseEngine.synthesize({}, "Esta operação não é permitida no modo de autonomia atual.", 0);
    }

    // 3. Context Retrieval
    const retrievedContext = this.contextRetriever.retrieve(intent, request.context);
    trace.setRetrievedContextSummary(JSON.stringify(retrievedContext));

    // 4. Financial Intelligence Query & Synthesis
    let baseAnswer = retrievedContext.profile ? 
      `A estrutura financeira apresenta o perfil: ${retrievedContext.profile}. ` : 
      "Não há dados patrimoniais suficientes para emitir um diagnóstico completo. ";

    if (retrievedContext.criticalFindings?.length > 0) {
      baseAnswer += `No entanto, o principal ponto de atenção identificado é: ${retrievedContext.criticalFindings[0].finding}. `;
    } else {
      baseAnswer += "A resiliência atual suporta a operação sem pressões urgentes de liquidez. ";
    }

    // Aprimoramento da Wave 2.1: Transparência Cognitiva
    if (retrievedContext.financialReasoningStatus?.calibrated) {
      if (retrievedContext.financialReasoningStatus.contradictionsResolved > 0) {
         baseAnswer += "A análise integrada identificou inicialmente uma divergência aparente nos indicadores brutos. Após validação cruzada, o cenário foi reinterpretado e calibrado para evitar falsos alarmes.";
      }
    }

    let response = this.responseEngine.synthesize(retrievedContext, baseAnswer, retrievedContext.financialReasoningStatus?.confidenceLevel || 90);


    // 5. Post-flight Governance (Shield)
    response = this.governance.validatePostFlight(response, trace);

    // Trace could be injected or persisted here, omitted for brevity in output contract
    // response.trace = trace.getTraceReport(); // Future

    return response;
  }
}
