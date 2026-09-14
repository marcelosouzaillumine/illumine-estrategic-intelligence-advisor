export interface ExecutiveContext {
  office: string;
  capability?: string;
  surface?: string;
  timestamp: string;
}

/**
 * Transforms a URL like:
 * /executive/workspace/cfo-office/performance
 * into an ExecutiveContext object.
 */
export function resolveNavigationContext(path: string): ExecutiveContext | null {
  // Regex matches: /executive/workspace/{office}/{surface}
  // surface is optional
  const match = path.match(/^\/executive\/workspace\/([^\/]+)(?:\/([^\/]+))?/);
  
  if (!match) return null;

  const office = match[1];
  const surface = match[2];

  // In the future we can map 'surface' back to 'capability' using the NavigationRegistry
  // For now we store exactly what the URL provided
  return {
    office,
    surface,
    timestamp: new Date().toISOString()
  };
}
