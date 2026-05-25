import React, { useState } from 'react';
import { ProductGovernanceEngine } from '../../core/runtime/product-governance/ProductGovernanceEngine';
import { QuotaId } from '../../core/runtime/product-governance/ProductGovernanceTypes';
import { Database, Plus } from 'lucide-react';

export function UsageQuotaDashboard({ tenantId }: { tenantId: string }) {
  const [, setTick] = useState(0); // Para forçar render

  const quotasToTest: { id: QuotaId; label: string }[] = [
    { id: 'MAX_SCENARIOS', label: 'Cenários Ativos' },
    { id: 'MAX_UPLOADS', label: 'Uploads de Arquivos' },
    { id: 'MAX_MONITORING_CYCLES', label: 'Ciclos de Monitoramento' }
  ];

  const handleTestConsume = (quotaId: QuotaId) => {
    ProductGovernanceEngine.requestQuotaConsumption(tenantId, quotaId, 1);
    setTick(t => t + 1); // Re-render para mostrar novo consumo
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quotasToTest.map(q => {
        const status = ProductGovernanceEngine.getQuotaStatus(tenantId, q.id);
        const percent = status.limit > 0 ? (status.consumed / status.limit) * 100 : 0;
        const isExceeded = status.consumed >= status.limit;

        return (
          <div key={q.id} className="p-4 bg-surface-container border border-border rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Database size={12} /> {q.label}
              </div>
              <button 
                onClick={() => handleTestConsume(q.id)}
                className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                title="Tentar Consumir (Test)"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="text-2xl font-bold text-foreground mb-4">
              {status.consumed} <span className="text-sm font-normal text-muted-foreground">/ {status.limit}</span>
            </div>
            
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full ${isExceeded ? 'bg-rose-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min(percent, 100)}%` }} 
              />
            </div>
            {isExceeded && <div className="text-[10px] text-rose-500 font-medium mt-2">QUOTA EXCEDIDA</div>}
          </div>
        );
      })}
    </div>
  );
}
