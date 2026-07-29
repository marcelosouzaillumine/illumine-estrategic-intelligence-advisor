import { ASTBuilder, SemanticASTNode } from './ast/ast-builder';
import { Logger } from '../../core/src/logging/logger';

export class EUCCompilerEngine {
  public static compile(manifestRaw: Record<string, any>): SemanticASTNode {
    Logger.info('[EUC Compiler] Iniciando compilação AST de manifesto...');
    const ast = ASTBuilder.buildSemanticAST(manifestRaw);
    Logger.info(`[EUC Compiler] Árvore AST construída com sucesso para o nó raiz: ${ast.name}`);
    return ast;
  }
}
