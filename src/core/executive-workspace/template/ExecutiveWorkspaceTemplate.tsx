import React from 'react';
import { LifecycleStageDefinition } from '../types/ExecutiveWorkspaceMetadata';
import { WorkspaceRegistry } from '../registry/WorkspaceRegistry';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DynamicLifecycleStepper } from '../components/stepper/DynamicLifecycleStepper';

export interface ExecutiveWorkspaceTemplateProps {
  titleKey: string;
  subtitleKey?: string;
  onBack?: () => void;
  currentStageId: string;
  stages: LifecycleStageDefinition[];
  businessContextData: any;
  decisionData: any;
  intelligenceData: any;
  timelineData: any;
  runtimeFeedData: any;
  // Slots for the generic panels
  panels?: {
    businessContext?: React.ReactNode;
    decisionPanel?: React.ReactNode;
    copilotPanel?: React.ReactNode;
    timelinePanel?: React.ReactNode;
    runtimeFeedPanel?: React.ReactNode;
  };
  commandBar?: React.ReactNode;
}

export function ExecutiveWorkspaceTemplate({
  titleKey,
  subtitleKey,
  onBack,
  currentStageId,
  stages,
  panels,
  commandBar
}: ExecutiveWorkspaceTemplateProps) {
  const { t } = useTranslation();
  
  // Find the active stage and resolve its workspace component
  const currentStage = stages.find(s => s.id === currentStageId);
  const WorkspaceComponent = currentStage ? WorkspaceRegistry.get(currentStage.workspaceResolver) : null;

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* Header Area */}
      <header className="shrink-0 border-b border-border bg-card px-6 py-4 flex flex-col gap-4">
        {/* Top row: Back button & Title */}
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft size={16} />
              <ExecutiveText variant="label">{t('common.back', 'Back')}</ExecutiveText>
            </button>
          )}
          <div>
            <ExecutiveText variant="pageTitle">{t(titleKey)}</ExecutiveText>
            {subtitleKey && <ExecutiveText variant="pageSubtitle" className="text-muted-foreground mt-1">{t(subtitleKey)}</ExecutiveText>}
          </div>
        </div>

        {/* Stepper Slot */}
        <div className="w-full mt-2">
          <DynamicLifecycleStepper stages={stages} currentStageId={currentStageId} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        
        {/* Left Sidebar: Context & Decisions */}
        { (panels?.businessContext !== null || panels?.decisionPanel !== null) && (
          <aside className="w-80 shrink-0 border-r border-border bg-card/30 overflow-y-auto p-4 flex flex-col gap-6">
            {panels?.businessContext === undefined ? (
              <div className="h-32 border rounded-xl bg-card border-dashed flex items-center justify-center">
                <ExecutiveText variant="caption">Business Context Panel</ExecutiveText>
              </div>
            ) : panels.businessContext}
            
            {panels?.decisionPanel === undefined ? (
              <div className="h-64 border rounded-xl bg-card border-dashed flex items-center justify-center">
                <ExecutiveText variant="caption">Executive Decision Panel</ExecutiveText>
              </div>
            ) : panels.decisionPanel}
          </aside>
        )}

        {/* Center: Dynamic Workspace */}
        <main className="flex-1 min-w-0 min-h-0 bg-background overflow-y-auto p-6 relative">
          {WorkspaceComponent ? (
            <React.Suspense fallback={<div className="p-8 flex justify-center"><ExecutiveText variant="body">Loading Workspace...</ExecutiveText></div>}>
              <WorkspaceComponent stageId={currentStageId} />
            </React.Suspense>
          ) : (
            <div className="flex h-full items-center justify-center border-2 border-dashed border-border rounded-2xl">
              <ExecutiveText variant="body" className="text-muted-foreground">No Workspace Registered for {currentStageId}</ExecutiveText>
            </div>
          )}
        </main>

        {/* Right Sidebar: Intelligence & Timeline */}
        { (panels?.copilotPanel !== null || panels?.timelinePanel !== null || panels?.runtimeFeedPanel !== null) && (
          <aside className="w-96 shrink-0 border-l border-border bg-card/30 flex flex-col">
            {/* Tabs could be used here for Timeline vs Runtime Feed vs AI */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-6">
               {panels?.copilotPanel === undefined ? (
                <div className="h-40 border rounded-xl bg-card border-dashed flex items-center justify-center">
                  <ExecutiveText variant="caption">Executive Copilot</ExecutiveText>
                </div>
              ) : panels.copilotPanel}
              
              {panels?.timelinePanel === undefined ? (
                <div className="flex-1 border rounded-xl bg-card border-dashed flex items-center justify-center min-h-[300px]">
                  <ExecutiveText variant="caption">Business Timeline</ExecutiveText>
                </div>
              ) : panels.timelinePanel}
              
              {panels?.runtimeFeedPanel === undefined ? (
                 <div className="h-40 border rounded-xl bg-card border-dashed flex items-center justify-center">
                   <ExecutiveText variant="caption">Runtime Feed</ExecutiveText>
                 </div>
              ) : panels.runtimeFeedPanel}
            </div>
          </aside>
        )}

      </div>

      {/* Bottom Command Bar */}
      <footer className="shrink-0 border-t border-border bg-card p-4">
        {commandBar || (
          <div className="flex justify-end gap-3 h-10 items-center">
             <ExecutiveText variant="caption" className="text-muted-foreground">Command Bar</ExecutiveText>
          </div>
        )}
      </footer>
    </div>
  );
}
