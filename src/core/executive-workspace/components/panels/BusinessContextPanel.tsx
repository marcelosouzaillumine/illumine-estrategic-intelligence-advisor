import React from 'react';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { useTranslation } from 'react-i18next';
import { Building2, Globe, Shield, Users } from 'lucide-react';

export interface BusinessContextData {
  company: string;
  segmentKey: string;
  icpKey: string;
  sponsor: string;
  partner?: string;
  tenantId: string;
  regionKey: string;
  languageKey: string;
  currencyKey: string;
}

export function BusinessContextPanel({ data }: { data: BusinessContextData }) {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Building2 size={16} className="text-primary" />
        <ExecutiveText variant="moduleTitle" className="text-base">{t('dealRoom.businessContext', 'Business Context')}</ExecutiveText>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
        <ContextItem labelKey="dealRoom.company" value={data.company} />
        <ContextItem labelKey="dealRoom.segment" value={t(data.segmentKey)} />
        <ContextItem labelKey="dealRoom.sponsor" value={data.sponsor} />
        <ContextItem labelKey="dealRoom.tenant" value={data.tenantId} />
        <ContextItem labelKey="dealRoom.region" value={t(data.regionKey)} />
        <ContextItem labelKey="dealRoom.currency" value={t(data.currencyKey)} />
      </div>
    </div>
  );
}

function ContextItem({ labelKey, value }: { labelKey: string, value: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <ExecutiveText variant="caption" className="text-[10px] uppercase text-muted-foreground tracking-wider">{t(labelKey)}</ExecutiveText>
      <ExecutiveText variant="label" className="text-sm font-semibold truncate">{value}</ExecutiveText>
    </div>
  );
}
