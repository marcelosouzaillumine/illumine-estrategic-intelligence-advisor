import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExecutiveAttentionPriority,
  ExecutiveCognitiveLoadLevel,
  ExecutiveSignalDensity,
  ExecutiveDecisionUrgency,
  ExecutiveNarrativeCompression,
  CognitiveSignal,
  PrioritizedAttentionItem,
  NarrativeHierarchyBlock
} from '../../core/runtime/executive-orchestration/cognitive/types';
import { ExecutiveSignalPriorityEngine } from '../../core/runtime/executive-orchestration/cognitive/ExecutiveSignalPriorityEngine';
import { DecisionFatigueProtectionEngine } from '../../core/runtime/executive-orchestration/cognitive/DecisionFatigueProtectionEngine';
import { NarrativeCompressionEngine, CompressedOutput } from '../../core/runtime/executive-orchestration/cognitive/NarrativeCompressionEngine';
import { ExecutiveNarrativeHierarchyEngine } from '../../core/runtime/executive-orchestration/cognitive/ExecutiveNarrativeHierarchyEngine';
import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';

interface ExecutiveCognitiveContextType {
  compressionMode: 'board' | 'cfo' | 'advisor' | 'operational';
  setCompressionMode: (mode: 'board' | 'cfo' | 'advisor' | 'operational') => void;
  attentionPriority: ExecutiveAttentionPriority;
  narrativeCompression: ExecutiveNarrativeCompression;
  decisionUrgency: ExecutiveDecisionUrgency;
  cognitiveLoad: ExecutiveCognitiveLoadLevel;
  signalDensity: ExecutiveSignalDensity;
  focusHierarchy: NarrativeHierarchyBlock | null;
  executiveAttentionMap: Record<string, number>;
  prioritizedItems: PrioritizedAttentionItem[];
  compressedOutput: CompressedOutput | null;
  activeReport: ExecutiveIntelligenceReport | null;
  setActiveReport: (report: ExecutiveIntelligenceReport | null) => void;
  signals: CognitiveSignal[];
  setSignals: (signals: CognitiveSignal[]) => void;
}

const defaultHierarchy: NarrativeHierarchyBlock = {
  level1: 'Aguardando Resolução do Runtime',
  level2: 'Estruturação causal pendente.',
  level3: 'Aguardando consolidação de fluxos operacionais.',
  level4: 'Sem dados suficientes para projetar impacto.',
  level5: 'Execute as rotinas normais de auditoria.'
};

const ExecutiveCognitiveContext = createContext<ExecutiveCognitiveContextType>({
  compressionMode: 'board',
  setCompressionMode: () => {},
  attentionPriority: 'LOW',
  narrativeCompression: 'CRITICAL_ONLY',
  decisionUrgency: 'MONITOR',
  cognitiveLoad: 'MINIMAL',
  signalDensity: 'LIGHT',
  focusHierarchy: defaultHierarchy,
  executiveAttentionMap: {},
  prioritizedItems: [],
  compressedOutput: null,
  activeReport: null,
  setActiveReport: () => {},
  signals: [],
  setSignals: () => {}
});

export const useExecutiveCognitive = () => useContext(ExecutiveCognitiveContext);

export function ExecutiveCognitiveProvider({ children }: { children: React.ReactNode }) {
  const [compressionMode, setCompressionMode] = useState<'board' | 'cfo' | 'advisor' | 'operational'>('board');
  const [activeReport, setActiveReport] = useState<ExecutiveIntelligenceReport | null>(null);
  const [signals, setSignalsState] = useState<CognitiveSignal[]>([]);
  const setSignals = React.useCallback((newSignals: CognitiveSignal[]) => {
    setSignalsState(prev => {
      if (prev === newSignals) return prev;
      if (prev.length === newSignals.length && JSON.stringify(prev) === JSON.stringify(newSignals)) {
        return prev;
      }
      return newSignals;
    });
  }, []);
  const [prioritizedItems, setPrioritizedItems] = useState<PrioritizedAttentionItem[]>([]);

  const [attentionPriority, setAttentionPriority] = useState<ExecutiveAttentionPriority>('LOW');
  const [decisionUrgency, setDecisionUrgency] = useState<ExecutiveDecisionUrgency>('MONITOR');
  const [cognitiveLoad, setCognitiveLoad] = useState<ExecutiveCognitiveLoadLevel>('MINIMAL');
  const [signalDensity, setSignalDensity] = useState<ExecutiveSignalDensity>('LIGHT');
  const [focusHierarchy, setFocusHierarchy] = useState<NarrativeHierarchyBlock | null>(defaultHierarchy);
  const [executiveAttentionMap, setExecutiveAttentionMap] = useState<Record<string, number>>({});
  const [compressedOutput, setCompressedOutput] = useState<CompressedOutput | null>(null);

  // Sync signals automatically from activeReport if signals is empty
  useEffect(() => {
    if (activeReport) {
      const newSignals: CognitiveSignal[] = [];

      // Convert alerts
      if (activeReport.metrics?.alerts) {
        activeReport.metrics.alerts.forEach((alert, idx) => {
          newSignals.push({
            id: `alert-${idx}`,
            sourceModule: 'FinancialMetrics',
            title: 'Alerta Operacional',
            description: alert.msg,
            timestamp: new Date().toISOString(),
            rawSeverity: alert.type === 'danger' ? 'CRITICAL' : 'WARNING'
          });
        });
      }

      // Convert violations
      if (activeReport.compliance?.auditFlags) {
        activeReport.compliance.auditFlags.forEach((flag, idx) => {
          newSignals.push({
            id: `violation-${idx}`,
            sourceModule: 'Compliance',
            title: 'Sinal de Governança',
            description: flag,
            timestamp: new Date().toISOString(),
            rawSeverity: 'CRITICAL',
            fiduciaryEscalation: true
          });
        });
      }

      setSignals(newSignals);
    }
  }, [activeReport]);

  // Main orchestration loop
  useEffect(() => {
    // 1. Prioritize focus using ExecutiveSignalPriorityEngine
    const rawPrioritized = ExecutiveSignalPriorityEngine.prioritize(signals);

    // 2. Protect from fatigue using DecisionFatigueProtectionEngine
    const { items: protectedItems, loadLevel, signalDensity: density } = 
      DecisionFatigueProtectionEngine.protect(rawPrioritized);

    setPrioritizedItems(protectedItems);
    setCognitiveLoad(loadLevel);
    setSignalDensity(density);

    // Derive global urgency and priority from the most critical active signals
    if (protectedItems.length > 0) {
      setAttentionPriority(protectedItems[0].priority);
      setDecisionUrgency(protectedItems[0].urgency);
    } else {
      setAttentionPriority('LOW');
      setDecisionUrgency('MONITOR');
    }

    // 3. Build focus maps (distribution of weights)
    const map: Record<string, number> = {};
    protectedItems.forEach(item => {
      const mod = item.signal.sourceModule;
      map[mod] = Math.max(map[mod] || 0, item.focusWeight);
    });
    setExecutiveAttentionMap(map);

    // 4. Narrative Compression
    if (activeReport) {
      const rawInsights = activeReport.causality?.insights?.map(ins => ins.text) || [];
      const rawViolations = activeReport.compliance?.narrativeRestrictions || [];
      const missingDeps = activeReport.institutionalContext?.scoreCalibrationRules ? [] : ['Fiduciary Rules Matrix'];

      const compressed = NarrativeCompressionEngine.compress(
        {
          summary: activeReport.advisory?.executiveSummary || '',
          insights: rawInsights,
          violations: rawViolations,
          missingDependencies: missingDeps,
          fiduciaryBlockers: activeReport.compliance?.auditFlags || [],
          confidenceLabel: activeReport.compliance?.confidenceLevel || 'HIGH_CONFIDENCE',
          lineageHash: activeReport.runtimeMetadata?.executionId
        },
        compressionMode
      );
      setCompressedOutput(compressed);

      // 5. Narratives Hierarchy Block (Level 1 -> 5)
      const block = ExecutiveNarrativeHierarchyEngine.buildBlock(activeReport);
      setFocusHierarchy(block);
    } else {
      setCompressedOutput(null);
      setFocusHierarchy(defaultHierarchy);
    }

  }, [signals, activeReport, compressionMode]);

  return (
    <ExecutiveCognitiveContext.Provider value={{
      compressionMode,
      setCompressionMode,
      attentionPriority,
      narrativeCompression: compressedOutput?.compressionMode || 'CRITICAL_ONLY',
      decisionUrgency,
      cognitiveLoad,
      signalDensity,
      focusHierarchy,
      executiveAttentionMap,
      prioritizedItems,
      compressedOutput,
      activeReport,
      setActiveReport,
      signals,
      setSignals
    }}>
      {children}
    </ExecutiveCognitiveContext.Provider>
  );
}
