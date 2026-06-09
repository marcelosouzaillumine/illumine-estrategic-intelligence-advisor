import { BoardIntelligenceInput, buildBoardIntelligenceInput } from '../core/runtime/board/BoardIntelligenceAdapter';
import { assessFiduciaryRisks } from '../core/runtime/board/FiduciaryRiskEngine';
import { generateAttentionItems, BoardAttentionItem } from '../core/runtime/board/BoardAttentionEngine';
import { generateBoardResolutions } from '../core/runtime/board/BoardResolutionLayer';
import { generateBoardAgenda } from '../core/runtime/board/BoardAgendaGenerator';

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
