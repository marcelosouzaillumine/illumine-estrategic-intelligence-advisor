import { SemanticInterpretation } from '../../executive-semantic-layer/src/ExecutiveSemanticLayer';
import { ExecutiveResponseTemplates } from './ExecutiveResponseTemplates';

export class ExecutiveResponseComposer {
  /**
   * O Composer recebe a saída da Camada Semântica e aplica os
   * templates institucionais aprovados para aquela intenção.
   */
  static compose(interpretation: SemanticInterpretation): string {
    const rawComposed = ExecutiveResponseTemplates.apply(interpretation.intent, interpretation.interpretedContent);
    return rawComposed;
  }
}
