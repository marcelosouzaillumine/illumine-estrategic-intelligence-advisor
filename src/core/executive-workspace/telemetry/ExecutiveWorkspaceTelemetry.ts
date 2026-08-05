export type TelemetryEventType = 
  | 'WorkspaceOpened'
  | 'StageChanged'
  | 'CommandExecuted'
  | 'CommandFailed'
  | 'WorkspaceCollapsed'
  | 'WorkspaceExpanded'
  | 'NavigationPerformed';

export interface TelemetryEvent {
  type: TelemetryEventType;
  timestamp: string;
  workspaceId: string;
  payload?: any;
}

export interface IExecutiveWorkspaceTelemetry {
  track(event: TelemetryEvent): void;
}

class ExecutiveWorkspaceTelemetryImpl implements IExecutiveWorkspaceTelemetry {
  track(event: TelemetryEvent): void {
    // In the future, this would send events to the central Enterprise Intelligence or telemetry backend.
    console.debug(`[Workspace Telemetry] ${event.type} in ${event.workspaceId}`, event.payload || '');
  }
}

export const ExecutiveWorkspaceTelemetry = new ExecutiveWorkspaceTelemetryImpl();
