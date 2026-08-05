import React, { useEffect, useState } from 'react';
import { WidgetInstance, WidgetLifecycleState } from '../../../workspace/types';
import { widgetRegistry } from './WidgetRegistry';
import { useExecutiveData } from '../providers/ExecutiveDataProvider';
import { useAuthorization } from '../../../hooks/useAuthorization';
import { Loader2, ShieldAlert, AlertCircle, FileQuestion } from 'lucide-react';

interface WidgetRendererProps {
  instance: WidgetInstance;
  context?: any;
}

export function WidgetRenderer({ instance, context }: WidgetRendererProps) {
  const { can } = useAuthorization();
  const { adapter, loading: providerLoading } = useExecutiveData();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lifecycle, setLifecycle] = useState<WidgetLifecycleState>('registered');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [invalidReason, setInvalidReason] = useState<string | undefined>();

  useEffect(() => {
    setLifecycle('configured');
    const validation = widgetRegistry.validate(instance.widgetId, can);
    setIsValid(validation.valid);
    setInvalidReason(validation.reason);
  }, [instance.widgetId, can]);

  useEffect(() => {
    if (!isValid || providerLoading || !adapter) return;

    let isMounted = true;
    setLifecycle('bound');

    const loadData = async () => {
      try {
        setLifecycle('loaded');
        // Fetch all required data sources defined in dataBinding
        const dataPromises = Object.values(instance.dataBinding).map(sourceId => 
          adapter.fetchData(sourceId, instance.config)
        );
        const results = await Promise.all(dataPromises);
        
        // Map back to keys
        const dataMap: Record<string, any> = {};
        Object.keys(instance.dataBinding).forEach((key, index) => {
          dataMap[key] = results[index];
        });

        if (isMounted) {
          setData(dataMap);
          setLifecycle('rendered');
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLifecycle('disposed');
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      setLifecycle('disposed');
    };
  }, [isValid, providerLoading, adapter, instance]);

  if (isValid === false) {
    if (invalidReason === 'NOT_FOUND') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-white/50 bg-white/5 rounded-xl border border-white/10">
          <FileQuestion className="h-6 w-6 mb-2" />
          <span className="text-xs">Widget {instance.widgetId} Not Found</span>
        </div>
      );
    }
    if (invalidReason === 'NO_PERMISSION') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-destructive/70 bg-destructive/10 rounded-xl border border-destructive/20">
          <ShieldAlert className="h-6 w-6 mb-2" />
          <span className="text-xs">Access Denied</span>
        </div>
      );
    }
  }

  if (providerLoading || lifecycle === 'loaded' || lifecycle === 'bound') {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-amber-500/70 bg-amber-500/10 rounded-xl border border-amber-500/20">
        <AlertCircle className="h-6 w-6 mb-2" />
        <span className="text-xs text-center">Failed to load widget data</span>
      </div>
    );
  }

  const def = widgetRegistry.get(instance.widgetId);
  if (!def || !data) return null;

  const Component = def.component;

  return (
    <div className="h-full w-full">
      <Component 
        instance={instance} 
        data={data} 
        context={context} 
      />
    </div>
  );
}
