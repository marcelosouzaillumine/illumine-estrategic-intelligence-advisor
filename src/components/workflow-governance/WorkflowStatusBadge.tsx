import React from 'react';
import { WorkflowStatus } from '../../services/FiduciaryRuntimeAdapter';
import { Clock, CheckCircle, XCircle, AlertCircle, PlayCircle, FileText, Ban } from 'lucide-react';

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  switch (status) {
    case 'APPROVED':
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
          <CheckCircle size={10} /> {status}
        </span>
      );
    case 'WAITING_APPROVAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
          <Clock size={10} /> WAITING APPROVAL
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">
          <PlayCircle size={10} /> IN PROGRESS
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase">
          <XCircle size={10} /> REJECTED
        </span>
      );
    case 'ESCALATED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase">
          <AlertCircle size={10} /> ESCALATED
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase">
          <Ban size={10} /> CANCELLED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 uppercase">
          <FileText size={10} /> DRAFT
        </span>
      );
  }
}
