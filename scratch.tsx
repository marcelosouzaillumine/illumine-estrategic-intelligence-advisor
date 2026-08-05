import { NAVIGATION_SURFACE_REGISTRY } from './src/core/navigation/navigation-surface.registry';

export function getSurfaceRoute(surfaceId: string) {
  const surface = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === surfaceId);
  return surface ? surface.route : `/dashboard/${surfaceId}`;
}
