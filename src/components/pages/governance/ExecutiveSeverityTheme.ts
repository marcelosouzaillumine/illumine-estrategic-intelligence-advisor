// src/components/pages/governance/ExecutiveSeverityTheme.ts

export interface SeverityStyles {
  bg: string;
  text: string;
  border: string;
  badge: string;
  iconColor: string;
  glow: string;
}

export const EXECUTIVE_SEVERITY_THEME: Record<'HEALTHY' | 'ATTENTION' | 'WARNING' | 'CRITICAL' | 'FAIL_CLOSED', SeverityStyles> = {
  HEALTHY: {
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-md',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-900/40',
    badge: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.05)] dark:shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]'
  },
  ATTENTION: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-950/20 backdrop-blur-md',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-900/40',
    badge: 'bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border border-yellow-500/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(234,179,8,0.05)] dark:shadow-[0_0_15px_-3px_rgba(234,179,8,0.15)]'
  },
  WARNING: {
    bg: 'bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-md',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-900/40',
    badge: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.05)] dark:shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]'
  },
  CRITICAL: {
    bg: 'bg-rose-50/50 dark:bg-rose-950/20 backdrop-blur-md',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-900/40',
    badge: 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.05)] dark:shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]'
  },
  FAIL_CLOSED: {
    bg: 'bg-red-50/80 dark:bg-red-950/30 backdrop-blur-md',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-900/60',
    badge: 'bg-red-500/15 text-red-800 dark:text-red-400 border border-red-500/20',
    iconColor: 'text-red-600 dark:text-red-400',
    glow: 'shadow-[0_0_20px_-3px_rgba(239,68,68,0.08)] dark:shadow-[0_0_20px_-3px_rgba(239,68,68,0.25)]'
  }
};
