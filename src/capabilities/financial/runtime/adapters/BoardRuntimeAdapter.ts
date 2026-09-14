import { BoardIntelligenceInput, buildBoardIntelligenceInput } from '../board/BoardIntelligenceAdapter';
import { assessFiduciaryRisks } from '../board/FiduciaryRiskEngine';
import { generateAttentionItems, BoardAttentionItem } from '../board/BoardAttentionEngine';
import { generateBoardResolutions } from '../board/BoardResolutionLayer';
import { generateBoardAgenda } from '../board/BoardAgendaGenerator';

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
