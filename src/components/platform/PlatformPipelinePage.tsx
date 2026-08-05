import React from 'react';
import { Target } from 'lucide-react';
import { PageHeader } from '../Common';
import { ExecutivePlaceholder } from '../ui/executive-placeholder';

export function PlatformPipelinePage() {
  return (
    <div className="p-8">
      <PageHeader
        title="Pipeline Intelligence"
        subtitle="Platform Intelligence Workspace"
        icon={Target}
      />
      <div className="mt-8">
        <ExecutivePlaceholder 
          icon={Target}
          title="Pipeline Intelligence (PoC)"
          description="Esta página está estruturalmente acoplada pela Platform Constitution. A implementação visual e a integração com a IA multiagente ocorrerão nas próximas Waves (Command Center)."
        />
      </div>
    </div>
  );
}
