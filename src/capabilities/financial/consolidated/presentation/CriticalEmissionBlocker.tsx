import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export function CriticalEmissionBlocker({ reason }: { reason: string }) {
  return (
    <ExecutiveSurface variant="critical" className="p-10 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-critical-soft rounded-full flex items-center justify-center mb-6 border border-critical/30">
        <Lock size={32} className="text-critical" />
      </div>
      
      <ExecutiveHeading as="h2" variant="sectionTitle" className="uppercase tracking-widest mb-3 text-critical">
        Emissão Bloqueada
      </ExecutiveHeading>
      <ExecutiveText variant="bodyStandard" className="text-muted-foreground font-medium max-w-xl mx-auto mb-6">
        O Runtime de Governança Consolidada detectou uma violação de integridade crítica. A emissão de relatórios executivos foi suspensa para evitar contaminação fiduciária.
      </ExecutiveText>
      
      <div className="bg-card p-4 rounded-xl border border-critical/20 inline-flex items-center gap-3">
        <ShieldAlert size={16} className="text-critical shrink-0" />
        <ExecutiveText variant="bodyStandard" className="font-bold text-critical">
          {reason}
        </ExecutiveText>
      </div>
    </ExecutiveSurface>
  );
}

