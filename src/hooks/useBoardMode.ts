import { useMemo } from 'react';
import { BoardRuntimeAdapter, BoardIntelligenceInput } from '../services/BoardRuntimeAdapter';

export interface BoardModeViewModel {
  input: BoardIntelligenceInput;
  risks: any;
  attentionItems: any[];
  resolutions: any[];
  agenda: any;
}

export function useBoardMode(input: BoardIntelligenceInput | null): BoardModeViewModel | null {
  return useMemo(() => {
    if (!input) return null;

    const risks = BoardRuntimeAdapter.assessFiduciaryRisks(input);
    const attentionItems = BoardRuntimeAdapter.generateAttentionItems(input);
    const resolutions = BoardRuntimeAdapter.generateBoardResolutions(input, attentionItems);
    const agenda = BoardRuntimeAdapter.generateBoardAgenda(input, attentionItems, risks, resolutions);

    return {
      input,
      risks,
      attentionItems,
      resolutions,
      agenda
    };
  }, [input]);
}
