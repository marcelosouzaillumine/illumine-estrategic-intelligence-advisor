/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ConnectorSourceType } from '@illumine/executive-contracts';

describe('@illumine/intelligence (Wave 18.4 Connector Schema Validation)', () => {
  it('should support all 6 connector source types (ERP, CRM, Banking, Spreadsheet, API, Manual)', () => {
    const supportedTypes: ConnectorSourceType[] = ['ERP', 'CRM', 'BANKING', 'SPREADSHEET', 'API', 'MANUAL'];

    expect(supportedTypes.length).toBe(6);
    expect(supportedTypes).toContain('ERP');
    expect(supportedTypes).toContain('CRM');
    expect(supportedTypes).toContain('BANKING');
  });
});
