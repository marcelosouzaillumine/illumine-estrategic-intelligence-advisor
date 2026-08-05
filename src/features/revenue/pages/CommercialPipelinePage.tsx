import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExecutivePageTemplate } from '../../../components/ui/executive-page-template';
import { Target, Plus } from 'lucide-react';
import { CommercialPipelineDashboard } from '../components/pipeline/CommercialPipelineDashboard';
import { Button } from '@/components/ui/button';
import { resolveCommercialPipelineQuery } from '@application/revenue/pipeline/composition/resolveCommercialPipelineQuery';
import { CommercialPipelineReadModel } from '@application/revenue/pipeline/read-models/CommercialPipelineReadModel';
import { OpportunityReadModel } from '@application/revenue/pipeline/read-models/OpportunityReadModel';
import { OpportunityWorkspace } from '../components/pipeline/OpportunityWorkspace';


// CAPABILITY_GUARD: This page explicitly requires COMMERCIAL_PIPELINE_VIEW capability to render data.
// It does not compute business logic, it only declares requirements and consumes Query Models.

export function CommercialPipelinePage() {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState<CommercialPipelineReadModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Resolve from the composition root
    const query = resolveCommercialPipelineQuery();
    
    query.getPipeline('revenue-office').then(data => {
      setPipeline(data);
      setLoading(false);
    });
  }, []);

  const handleSelectOpportunity = async (id: string) => {
    // Navigate to the official Command Surface (Deal Room)
    navigate(`/executive/revenue/deal-room/${id}`);
  };

  if (loading) {
    return <div className="p-8">Loading Pipeline Command Center...</div>;
  }

  return (
    <div className="p-8">
      <ExecutivePageTemplate
        header={{
          title: "Commercial Pipeline Command Center",
          subtitle: "Revenue Office™ | Executive Governance",
          icon: Target,
          actions: (
            <Button onClick={() => navigate('/executive/revenue/deal-room/new')} className="gap-2">
              <Plus size={16} />
              Nova Oportunidade
            </Button>
          )
        }}
      >
        {pipeline ? (
          <CommercialPipelineDashboard 
            pipeline={pipeline} 
            onSelectOpportunity={handleSelectOpportunity} 
          />
        ) : null}
      </ExecutivePageTemplate>
    </div>
  );
}
