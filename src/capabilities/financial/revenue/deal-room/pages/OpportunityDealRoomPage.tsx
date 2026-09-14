import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExecutiveWorkspaceTemplate } from '@/core/executive-workspace/template/ExecutiveWorkspaceTemplate';
import { RevenueLifecycleStages } from '../../../../../features/revenue/deal-room/config/RevenueLifecycleDefinition';
import { resolveDealRoomComposition } from '@application/revenue/deal-room/composition/resolveDealRoomComposition';
import { registerDealRoomWorkspaces } from '../../../../../features/revenue/deal-room/workspaces/registry';
import { DealRoomSnapshot } from '@application/revenue/deal-room/snapshots/DealRoomSnapshot';
import { BusinessContextPanel } from '@/core/executive-workspace/components/panels/BusinessContextPanel';
import { ExecutiveDecisionPanel } from '@/core/executive-workspace/components/panels/ExecutiveDecisionPanel';
import { DualTimeline } from '@/core/executive-workspace/components/timeline/DualTimeline';
import { DynamicLifecycleStepper } from '@/core/executive-workspace/components/stepper/DynamicLifecycleStepper';
import { ExecutiveText } from '@/components/ui/executive-typography';

// Ensure workspaces are registered
registerDealRoomWorkspaces();

export function OpportunityDealRoomPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<DealRoomSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!opportunityId) return;
    const { queryPort } = resolveDealRoomComposition();
    queryPort.getDealRoomSnapshot(opportunityId).then(data => {
      setSnapshot(data);
      setLoading(false);
    });
  }, [opportunityId]);

  if (loading || !snapshot) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <ExecutiveText variant="body" className="text-muted-foreground animate-pulse">
          INITIALIZING WORKSPACE...
        </ExecutiveText>
      </div>
    );
  }

  const handleBack = () => navigate('/executive/revenue/pipeline');

  const stepper = (
    <div className="mt-4">
      <DynamicLifecycleStepper stages={RevenueLifecycleStages} currentStageId={snapshot.currentStageId} />
    </div>
  );

  const isNew = opportunityId === 'new';

  return (
    <ExecutiveWorkspaceTemplate
      titleKey="dealRoom.pageTitle"
      subtitleKey="dealRoom.pageSubtitle"
      onBack={handleBack}
      currentStageId={snapshot.currentStageId}
      stages={RevenueLifecycleStages}
      businessContextData={snapshot.businessContextData}
      decisionData={snapshot.decisionData}
      intelligenceData={snapshot.intelligenceData}
      timelineData={snapshot.businessTimeline}
      runtimeFeedData={snapshot.technicalTimeline}
      panels={{
        businessContext: isNew ? null : <BusinessContextPanel data={snapshot.businessContextData} />,
        decisionPanel: isNew ? null : <ExecutiveDecisionPanel data={snapshot.decisionData} />,
        timelinePanel: isNew ? null : <DualTimeline events={[...snapshot.businessTimeline, ...snapshot.technicalTimeline]} />,
        runtimeFeedPanel: isNew ? null : undefined,
        copilotPanel: isNew ? null : (
          <div className="h-64 border rounded-xl bg-card border-dashed flex flex-col items-center justify-center p-4">
            <ExecutiveText variant="label" className="text-muted-foreground text-center">Executive Copilot™</ExecutiveText>
            <ExecutiveText variant="caption" className="text-muted-foreground text-center mt-2">AI-driven insights and recommendations will appear here.</ExecutiveText>
          </div>
        )
      }}
      commandBar={
        <div className="flex justify-between items-center w-full px-4">
          <div className="flex items-center gap-4">
            <ExecutiveText variant="caption" className="text-muted-foreground">Version: {snapshot._metadata.snapshotVersion}</ExecutiveText>
            <div className="px-2 py-1 rounded bg-muted/50 border border-border text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {snapshot.workspaceData.status}
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2 rounded-full border border-border bg-card hover:bg-muted text-sm font-bold">Cancel</button>
             <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold shadow-sm">Execute Stage Command</button>
          </div>
        </div>
      }
    />
  );
}
