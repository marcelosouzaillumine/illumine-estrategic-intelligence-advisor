import React from 'react';
import { useExecutiveCognitive } from '../../context/executive-cognitive/ExecutiveCognitiveProvider';
import { EyeOff } from 'lucide-react';

export function SignalSaturationWarning() {
  const { signalDensity } = useExecutiveCognitive();

  if (signalDensity !== 'DENSE' && signalDensity !== 'OVERLOADED') {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 border border-border/40 bg-surface-container/30 text-muted-foreground rounded-lg text-xs leading-relaxed animate-executive-fade">
      <EyeOff size={13} className="shrink-0 text-secondary" />
      <span className="font-medium">
        Foco cognitivo ativo: sinalizações secundárias ocultadas automaticamente para reduzir ruído visual. Use a lista expandida para fins de rastreabilidade completa.
      </span>
    </div>
  );
}
