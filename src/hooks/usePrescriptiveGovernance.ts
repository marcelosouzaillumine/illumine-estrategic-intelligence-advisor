import { useState, useEffect } from 'react';
import { usePredictiveGovernance } from './usePredictiveGovernance';
import { ExecutionCapacityConstraintEngine } from '../core/runtime/prescriptive-governance/ExecutionCapacityConstraintEngine';
import { PrescriptiveActionEngine } from '../core/runtime/prescriptive-governance/PrescriptiveActionEngine';
import { FiduciaryPriorityEngine } from '../core/runtime/prescriptive-governance/FiduciaryPriorityEngine';
import { DecisionMatrixEngine } from '../core/runtime/prescriptive-governance/DecisionMatrixEngine';
import { DecisionMatrixOutput } from '../core/runtime/prescriptive-governance/DecisionMatrixEngine';
import { InterventionTrackEngine } from '../core/runtime/prescriptive-governance/InterventionTrackEngine';
import { BoardAgendaEngine } from '../core/runtime/prescriptive-governance/BoardAgendaEngine';
import { BoardDraftingEngine } from '../core/runtime/prescriptive-governance/BoardDraftingEngine';
import { 
  InstitutionalCapacity, 
  ExecutivePriority, 
  InterventionTrack, 
  BoardAgenda, 
  BoardResolution 
} from '../core/runtime/prescriptive-governance/PrescriptiveTypes';
import { InMemoryTrendRepository } from '../core/runtime/predictive-governance/InstitutionalTrendRepository';

export interface PrescriptiveGovernanceOutput {
  capacity: InstitutionalCapacity;
  rawActions: ExecutivePriority[];
  prioritizedActions: ExecutivePriority[];
  decisionMatrix: DecisionMatrixOutput;
  interventionTracks: InterventionTrack[];
  boardAgenda: BoardAgenda;
  boardResolutions: BoardResolution[];
  isLoading: boolean;
}

const mockRepo = new InMemoryTrendRepository();

export function usePrescriptiveGovernance(clientId: string): PrescriptiveGovernanceOutput {
  const predictiveOutput = usePredictiveGovernance(clientId);
  const [output, setOutput] = useState<PrescriptiveGovernanceOutput>({
    capacity: {} as InstitutionalCapacity,
    rawActions: [],
    prioritizedActions: [],
    decisionMatrix: { dayZeroCritical: [], strategicPlanning: [], quickWins: [], monitoring: [] },
    interventionTracks: [],
    boardAgenda: { dateGenerated: '', items: [] },
    boardResolutions: [],
    isLoading: true
  });

  useEffect(() => {
    if (predictiveOutput.isLoading) return;

    if (mockRepo.getSnapshots(clientId).length === 0) {
      mockRepo.seedMockData(clientId);
    }
    const snapshots = mockRepo.getSnapshots(clientId);

    // 1. Capacity
    const capacity = ExecutionCapacityConstraintEngine.evaluateCapacity(snapshots);

    // 2. Action Engine (Raw unprioritized actions)
    const rawActions = PrescriptiveActionEngine.generateActions(predictiveOutput.risks);

    // 3. Fiduciary Priority (Applies capacity limit and ranks)
    const prioritizedActions = FiduciaryPriorityEngine.prioritize(rawActions, capacity);

    // 4. Decision Matrix
    const decisionMatrix = DecisionMatrixEngine.mapToMatrix(prioritizedActions);

    // 5. Intervention Tracks
    const interventionTracks = InterventionTrackEngine.groupIntoTracks(prioritizedActions);

    // 6. Board Agenda
    const boardAgenda = BoardAgendaEngine.generateAgenda(decisionMatrix, predictiveOutput.overallScore);

    // 7. Board Resolutions
    const boardResolutions = BoardDraftingEngine.generateResolutions(boardAgenda);

    setOutput({
      capacity,
      rawActions,
      prioritizedActions,
      decisionMatrix,
      interventionTracks,
      boardAgenda,
      boardResolutions,
      isLoading: false
    });
  }, [clientId, predictiveOutput]);

  return output;
}
