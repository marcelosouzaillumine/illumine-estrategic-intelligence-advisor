/**
 * Production visibility utilities for EFOS.
 * Determines whether debug tools should be shown based on environment
 * and profile, and provides a simple production check.
 */

/**
 * Returns true if the current Node environment is production.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Determines whether the debug layer should be rendered.
 *
 * @param profile - The execution profile (e.g., 'EXECUTIVE', 'BOARD', 'TECHNICAL').
 * @param showDebugTools - Flag indicating if debug tools are requested.
 * @returns true if debug layer is allowed, false otherwise.
 */
export function isDebugAllowed(profile: any, showDebugTools: boolean = false): boolean {
  // Never show debug in production regardless of flags
  if (isProduction()) {
    return false;
  }
  // Allow debug only for technical profiles when the flag is true
  // Assuming profile has a property indicating technical mode; fallback to string check.
  const isTechnical = typeof profile === 'string' ? profile.toUpperCase().includes('TECH') : !!profile?.isTechnical;
  return isTechnical && showDebugTools;
}
