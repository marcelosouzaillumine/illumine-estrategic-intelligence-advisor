export function sanitize(value: string): string {
  // List of forbidden tokens that must not appear in BOARD or EXECUTIVE views
  const forbiddenTokens = [
    '[[runtime.',
    'FULL_FINANCIAL_VIEW',
    'HIGH_CONFIDENCE',
    'DRE_DFC_DLPA',
    'DFC_CONTINUITY_PRESSURE',
    'CAPITAL_DESTRUCTION',
    'Debug Mode',
    '0.20805817244989006'
  ];

  let sanitized = value;
  forbiddenTokens.forEach(token => {
    const regex = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    sanitized = sanitized.replace(regex, '[REDACTED]');
  });
  return sanitized;
}
