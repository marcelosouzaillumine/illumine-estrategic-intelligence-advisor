import React from 'react';
import { CommercialPipelineReadModel } from '@application/revenue/pipeline/read-models/CommercialPipelineReadModel';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ArrowLeft, Brain, Calendar, Clock, Sparkles, AlertTriangle, Star, ShieldCheck, Target, Activity } from 'lucide-react';
import { ExecutiveInsightCard } from '@/components/ui/executive-insight-card';

interface OpportunityWorkspaceProps {
  workspace: CommercialPipelineReadModel;
  onBack?: () => void;
}

export function OpportunityWorkspace({ workspace, onBack }: OpportunityWorkspaceProps) {
  const opp = workspace.selectedOpportunity;
  if (!opp) return null;
  
  return (
    <div className="flex flex-col h-full bg-background rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-card p-6 border-b border-border flex justify-between items-start shrink-0">
        <div>
          <button onClick={onBack} className="flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Pipeline
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ExecutiveText variant="sectionSubtitle" className="font-bold text-2xl">{opp.company}</ExecutiveText>
            <ExecutiveBadge variant="neutral" className="uppercase bg-primary/10 text-primary border-primary/20">
              {opp.stage}
            </ExecutiveBadge>
          </div>
          <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-2xl">
            {opp.origin} • Sponsor: {opp.executiveSponsor} • Probability: {opp.probability}%
          </ExecutiveText>
        </div>
        <div className="text-right">
          <ExecutiveText variant="body" className="text-muted-foreground uppercase tracking-wider mb-1">Expected ARR</ExecutiveText>
          <ExecutiveText variant="pageSubtitle" className="text-3xl text-primary font-light">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(workspace.forecast.expectedArr)}
          </ExecutiveText>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Context Panels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-5 rounded-xl border border-border">
                <ExecutiveText variant="label" className="font-semibold mb-3 flex items-center gap-2"><Target size={16}/> Business Objectives</ExecutiveText>
                <ul className="space-y-2">
                  {opp.businessObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <ExecutiveText variant="bodyStandard">{obj}</ExecutiveText>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-5 rounded-xl border border-border">
                <ExecutiveText variant="label" className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Pain Points</ExecutiveText>
                <ul className="space-y-2">
                  {opp.painPoints.map((pain, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                      <ExecutiveText variant="bodyStandard">{pain}</ExecutiveText>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Revenue Intelligence */}
            <div className="space-y-4">
              <ExecutiveText variant="sectionSubtitle" className="flex items-center gap-2">
                <Brain size={20} className="text-primary"/> Revenue Intelligence
              </ExecutiveText>
              <div className="grid grid-cols-1 gap-4">
                {workspace.intelligence.map(insight => (
                  <div key={insight.id} className="bg-card border border-border p-4 rounded-xl flex gap-4 items-start">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                      {insight.icon === 'Star' ? <Star size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div>
                      <ExecutiveText variant="label" className="font-semibold mb-1">{insight.title}</ExecutiveText>
                      <ExecutiveText variant="bodyStandard" className="text-muted-foreground mb-2">{insight.impact}</ExecutiveText>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <ExecutiveText variant="label" className="font-semibold text-xs uppercase text-muted-foreground mb-1">Recommendation</ExecutiveText>
                        <ExecutiveText variant="bodyStandard">{insight.recommendation}</ExecutiveText>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Timeline */}
            <div className="space-y-4">
              <ExecutiveText variant="sectionSubtitle" className="flex items-center gap-2">
                <Calendar size={20} className="text-primary"/> Executive Timeline
              </ExecutiveText>
              <div className="bg-card border border-border p-6 rounded-xl flex justify-between relative overflow-hidden">
                <div className="absolute top-10 left-10 right-10 h-0.5 bg-muted z-0"></div>
                {workspace.timeline.map((milestone, idx) => {
                  const isDone = milestone.status === 'completed';
                  const isCurrent = milestone.status === 'current';
                  return (
                    <div key={milestone.id} className="relative z-10 flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 bg-card
                        ${isDone ? 'border-primary text-primary' : isCurrent ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}
                      `}>
                        {idx + 1}
                      </div>
                      <ExecutiveText variant="label" className={`font-semibold text-center ${!isDone && !isCurrent ? 'text-muted-foreground' : ''}`}>
                        {milestone.stage}
                      </ExecutiveText>
                      <ExecutiveText variant="caption" className="text-muted-foreground mt-1">
                        {milestone.date}
                      </ExecutiveText>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Executive Copilot Panel */}
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl">
              <ExecutiveText variant="label" className="font-semibold flex items-center gap-2 text-primary mb-3">
                <Sparkles size={16}/> Executive Copilot™
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground italic mb-4">
                Copilot is analyzing standard clauses for this negotiation stage... (Wave 19 Placeholder)
              </ExecutiveText>
              <div className="h-24 bg-card/50 border border-border/50 border-dashed rounded-lg flex items-center justify-center">
                <ExecutiveText variant="caption" className="text-muted-foreground">AI Generation Zone</ExecutiveText>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-card border border-border rounded-xl flex flex-col h-[400px]">
              <div className="p-4 border-b border-border bg-muted/20">
                <ExecutiveText variant="label" className="font-semibold flex items-center gap-2">
                  <Activity size={16}/> Activity Feed
                </ExecutiveText>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {workspace.activities.map(act => (
                  <div key={act.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-muted-foreground"/>
                    </div>
                    <div>
                      <ExecutiveText variant="label" className="font-semibold">{act.title}</ExecutiveText>
                      <ExecutiveText variant="bodyStandard" className="text-muted-foreground mb-1">{act.description}</ExecutiveText>
                      <ExecutiveText variant="caption" className="text-muted-foreground/60">{act.actor} • {act.timestamp}</ExecutiveText>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
