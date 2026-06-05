import React from 'react';
import { SourceTrustLevel } from '../../services/FiduciaryRuntimeAdapter';
import { ShieldCheck, ShieldAlert, ShieldX, Shield, Building2 } from 'lucide-react';

export function SourceTrustBadge({ trust }: { trust: SourceTrustLevel }) {
  switch (trust) {
    case 'INSTITUTIONAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase" title="Origem Oficial (Ex: Open Finance)">
          <Building2 size={10} /> INSTITUTIONAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase" title="Origem Autenticada (Ex: ERP API)">
          <ShieldCheck size={10} /> HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase" title="Origem Parcialmente Validada">
          <Shield size={10} /> MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase" title="Origem Humana Estruturada (Ex: XLSX)">
          <ShieldAlert size={10} /> LOW
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase" title="Origem Genérica/Sem Assinatura (Ex: CSV)">
          <ShieldX size={10} /> UNVERIFIED
        </span>
      );
  }
}
