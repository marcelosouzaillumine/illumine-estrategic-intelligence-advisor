// src/components/operating-pressure/InstitutionalPressureDashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldAlert, Brain, Clock, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAnnualFinancialData, useAllFinancialData } from '../../hooks/useFinancialData';
import { executiveRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { PressureNarrativeComposer } from '../../services/FiduciaryRuntimeAdapter';
import { OperationalFatiguePanel } from './OperationalFatiguePanel';
import { LiquidityCompressionGraph } from './LiquidityCompressionGraph';
import { TreasuryErosionTimeline } from './TreasuryErosionTimeline';
import { FundingFragilityMap } from './FundingFragilityMap';
import { PressurePropagationGraph } from './PressurePropagationGraph';
import { PressureExplainabilityDrawer } from './PressureExplainabilityDrawer';
import { InstitutionalStrainHeatmap } from './InstitutionalStrainHeatmap';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';

interface DashboardProps {
  clientId: string;
  selectedYear: number;
  selectedMonth: number;
}

export function InstitutionalPressureDashboard({ clientId, selectedYear, selectedMonth }: DashboardProps) {
  const [filterYear, setFilterYear] = useState(selectedYear || new Date().getFullYear());

  useEffect(() => {
    if (selectedYear) {
      setFilterYear(selectedYear);
    }
  }, [selectedYear]);

  // Fetch financial data inputs
  const { dbData: dbDataDRE, docIds: docIdsDRE, loading: loadingDRE } = useAnnualFinancialData(clientId, filterYear, 'DRE');
  const { dbData: dbDataBP, loading: loadingBP } = useAnnualFinancialData(clientId, filterYear, 'BP');
  const { dbData: allHistoryData, loading: loadingHistory } = useAllFinancialData(clientId);

  const loading = loadingDRE || loadingBP || loadingHistory;

  // Compute report in runtime
  const report = useMemo(() => {
    if (loading || !clientId) return null;
    const input = {
      clientProfile: { id: clientId },
      dreData: dbDataDRE,
      bpData: dbDataBP,
      rawFinancialData: { filterYear, allHistoryData },
      historicalCyclesCount: docIdsDRE.length,
      isMockData: dbDataDRE.length === 0,
      historicalSeries: allHistoryData
    };
    return executiveRuntime.generateExecutiveReport(input);
  }, [clientId, filterYear, dbDataDRE, dbDataBP, allHistoryData, docIdsDRE.length, loading]);

  const pressureReport = report?.operatingPressureReport;

  if (!clientId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 bg-background border border-border rounded-md p-20 text-center w-full">
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-secondary shadow-xl relative">
          <Activity size={48} className="relative z-10 animate-pulse" />
        </div>
        <div className="text-center space-y-4 w-full max-w-2xl mx-auto">
          <h2 className="text-h2 font-medium text-foreground tracking-tight">Selecione uma Empresa</h2>
          <p className="text-muted-foreground w-full max-w-2xl mx-auto font-medium leading-relaxed">
            Por favor, selecione uma empresa ativa para visualizar a Pressão Operacional Institucional.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="animate-spin text-secondary" size={36} />
        <p className="text-sm text-muted-foreground font-medium">Avaliando linhagem fiduciária de pressões acumuladas...</p>
      </div>
    );
  }

  if (!pressureReport || !pressureReport.isAvailable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-card border border-border rounded-[40px] p-20 text-center shadow-sm">
        <Activity size={48} className="text-muted-foreground/30 mb-6" />
        <h3 className="text-xl font-bold text-foreground mb-2">Dados Insuficientes</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          Não conseguimos estruturar os dados históricos deste cliente para calcular a pressão operacional institucional.
        </p>
      </div>
    );
  }

  const mappedSeverityLabel = PressureNarrativeComposer.mapSeverityLabel(pressureReport.overallPressureLevel);
  const score = pressureReport.pressureScore;

  const getSeverityBg = (lvl: string) => {
    switch (lvl) {
      case 'ACUTE':
        return 'from-destructive/30 via-background to-background text-destructive border-destructive/40';
      case 'CRITICAL':
        return 'from-rose-500/20 via-background to-background text-rose-500 border-rose-500/30';
      case 'ELEVATED':
        return 'from-amber-500/20 via-background to-background text-amber-500 border-amber-500/30';
      case 'MODERATE':
        return 'from-blue-500/20 via-background to-background text-blue-500 border-blue-500/30';
      default:
        return 'from-emerald-500/20 via-background to-background text-emerald-500 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-12 pb-32 animate-executive-fade">
      <PageHeader 
        title="Institutional Operating Pressure"
        subtitle="Mecanismo contínuo de avaliação do desgaste operacional e fadiga fiduciária estrutural."
        icon={Activity}
        color="executive"
      />

      {/* Main KPI Summary Card */}
      <div className={cn(
        "bg-gradient-to-br border rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between",
        getSeverityBg(pressureReport.overallPressureLevel)
      )}>
        <div className="w-full md:w-auto md:flex-1 flex flex-col items-center md:items-start z-10 text-center md:text-left mb-10 md:mb-0 md:mr-10">
          <h3 className="text-3xl font-display font-medium mb-2 text-foreground">
            Pressão Operacional Institucional
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
            Painel soberano de medição de compressão de margens operacionais, velocidade de queima de caixa e dependência de capital de suporte.
          </p>
          
          <div className={cn(
            "px-6 py-2.5 mt-8 rounded-full border text-xs font-bold uppercase tracking-wider inline-flex",
            pressureReport.overallPressureLevel === 'ACUTE' ? 'bg-destructive/10 text-destructive border-destructive/20' :
            pressureReport.overallPressureLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
            pressureReport.overallPressureLevel === 'ELEVATED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            pressureReport.overallPressureLevel === 'MODERATE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          )}>
            {mappedSeverityLabel}
          </div>
        </div>

        <div className="relative w-48 h-48 flex items-center justify-center shrink-0 z-10">
          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.15)]" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted/10" />
            <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" 
              strokeDasharray="528" 
              strokeDashoffset={528 - (528 * score) / 100}
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out text-current"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-6xl font-display font-bold text-foreground leading-none absolute">{score.toFixed(0)}</span>
             <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest absolute bottom-9">/ 100</span>
          </div>
        </div>
      </div>

      {/* Narrative Disclosures */}
      {pressureReport.fiduciaryDisclosures.length > 0 && (
        <div className="space-y-3">
          {pressureReport.fiduciaryDisclosures.map((disc, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 bg-surface-container/60 border border-border rounded-2xl text-sm font-medium text-foreground">
              <AlertTriangle className="text-amber-500 shrink-0" size={16} />
              <span>{disc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Heatmap Section */}
      <InstitutionalStrainHeatmap 
        scores={{
          accumulation: pressureReport.pressureAccumulation.accumulationScore,
          fatigue: pressureReport.operationalFatigue.fatigueScore,
          compression: pressureReport.liquidityCompression.compressionScore,
          erosion: pressureReport.treasuryErosion.erosionScore,
          fragility: pressureReport.fundingFragility.fragilityScore
        }} 
      />

      {/* 2x2 Grid of Core Engines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OperationalFatiguePanel data={pressureReport.operationalFatigue} />
        <LiquidityCompressionGraph data={pressureReport.liquidityCompression} />
        <TreasuryErosionTimeline data={pressureReport.treasuryErosion} />
        <FundingFragilityMap data={pressureReport.fundingFragility} />
      </div>

      {/* Propagation Path */}
      <PressurePropagationGraph data={pressureReport.propagation} />

      {/* Rationale & Explainability Drawer */}
      <PressureExplainabilityDrawer 
        data={pressureReport.explainability} 
        lineageHash={pressureReport.pressureLineageHash} 
      />
    </div>
  );
}
