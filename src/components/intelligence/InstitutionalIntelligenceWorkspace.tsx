import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../Common';
import { InstitutionalIntelligenceRuntime } from '../../core/intelligence/InstitutionalIntelligenceRuntime';
import { InstitutionalContextEngine } from '../../core/intelligence/InstitutionalContextEngine';
import { InstitutionalIntelligenceContext } from '../../types/intelligence/InstitutionalIntelligenceContext';
import { InstitutionalIntelligenceSummary } from '../../types/intelligence/InstitutionalIntelligenceSummary';
import { InstitutionalObjectCard } from './InstitutionalObjectCard';
import { ExecutiveInstitutionalIntelligenceDashboard } from './ExecutiveInstitutionalIntelligenceDashboard';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';
import { Info } from 'lucide-react';

export const InstitutionalIntelligenceWorkspace: React.FC = () => {
  const { objectId, tenantId: urlTenantId } = useParams<{ objectId: string, tenantId?: string }>();
  const navigate = useNavigate();
  const tenantId = urlTenantId || 'SYSTEM_TENANT';
  
  const [context, setContext] = useState<InstitutionalIntelligenceContext | null>(null);
  const [summary, setSummary] = useState<InstitutionalIntelligenceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // In a real app, these would be injected via Context or DI
  const engine = new InstitutionalContextEngine();
  const runtime = new InstitutionalIntelligenceRuntime(engine);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!objectId || !tenantId) return;
      setLoading(true);

      try {
        InstitutionalObservabilityRegistry.recordObjectOpened(
          tenantId,
          `ctx-${Date.now()}`,
          objectId,
          'INSTITUTIONAL_INTELLIGENCE'
        );

        const ctx = await runtime.getInstitutionalContext(tenantId, objectId);
        const sum = await runtime.getInstitutionalSummary(tenantId, objectId);
        
        if (active) {
          setContext(ctx);
          setSummary(sum);
        }
      } catch (e) {
        console.error("Failed to load Intelligence Fabric Context", e);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [objectId, tenantId]);

  if (!tenantId || !objectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Info size={32} className="text-muted-foreground/60 mb-4" />
        <p className="text-eyebrow text-muted-foreground uppercase tracking-widest">Contexto indisponível.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Network className="animate-spin-slow text-primary mb-4" size={32} />
        <p className="text-eyebrow text-muted-foreground">Compilando Contexto Institucional...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Institutional Intelligence Fabric"
          subtitle="Visão omnidirecional de inteligência: Contexto, Memória, Causalidade, Evidência e Impacto."
          icon={Network}
          transparent
        />
        <button
          onClick={() => navigate(-1)} // Voltar para a origem (NavigationReference handled loosely via history here)
          className="btn-secondary"
        >
          <ArrowLeft size={16} className="text-muted-foreground" />
          <span>Voltar ao Sistema de Origem</span>
        </button>
      </div>

      <ExecutiveInstitutionalIntelligenceDashboard summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-6">
          <InstitutionalObjectCard context={context} />
        </div>
      </div>
    </div>
  );
};
