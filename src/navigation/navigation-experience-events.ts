/**
 * Telemetry events for the Executive Navigation Experience Migration
 */
export type NavigationEventName = 
  | 'EXECUTIVE_SHELL_OPENED'
  | 'OFFICE_SELECTED'
  | 'SURFACE_VIEWED'
  | 'LEGACY_BRIDGE_USED'
  | 'EXECUTIVE_ROLLBACK_TRIGGERED';

export function trackNavigationEvent(eventName: NavigationEventName, payload?: Record<string, any>) {
  // Mock tracking. In a real app this would go to Mixpanel, Segment, or an internal telemetry service.
  console.log(`[Telemetry] ${eventName}`, payload || {});
}
