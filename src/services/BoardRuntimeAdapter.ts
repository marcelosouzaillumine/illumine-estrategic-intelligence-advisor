import { BoardIntelligenceInput, buildBoardIntelligenceInput } from '../capabilities/financial/runtime/board/BoardIntelligenceAdapter';
import { assessFiduciaryRisks } from '../capabilities/financial/runtime/board/FiduciaryRiskEngine';
import { generateAttentionItems, BoardAttentionItem } from '../capabilities/financial/runtime/board/BoardAttentionEngine';
import { generateBoardResolutions } from '../capabilities/financial/runtime/board/BoardResolutionLayer';
import { generateBoardAgenda } from '../capabilities/financial/runtime/board/BoardAgendaGenerator';

export const BoardRuntimeAdapter = {
  buildBoardIntelligenceInput,
  assessFiduciaryRisks,
  generateAttentionItems,
  generateBoardResolutions,
  generateBoardAgenda,
};

export type {
  BoardIntelligenceInput,
  BoardAttentionItem
};
