import { SystemCapability } from '../../domain/authorization/Capabilities';
import { Page } from '../../app/navigation';
import { LucideIcon } from 'lucide-react';

export interface WorkspaceNavigationItem {
  id: Page;
  label: string; // Required for legacy permission checks
  labelKey: string;
  route?: string; // For future when we migrate fully to routes instead of Page enum
  capability?: SystemCapability;
  masterOnly?: boolean;
  icon: LucideIcon;
  children?: WorkspaceNavigationItem[];
}
export type NavigationCategory =
  | 'command'
  | 'board'
  | 'executive-office'
  | 'intelligence'
  | 'partner'
  | 'foundation'
  | 'platform'
  | 'administration';

export interface WorkspaceNavigationGroup {
  group: string; // Required for legacy permission checks
  groupKey: string;
  officeId?: string; // Canonical slug for URLs
  category?: NavigationCategory;
  icon: LucideIcon;
  items: WorkspaceNavigationItem[];
}
