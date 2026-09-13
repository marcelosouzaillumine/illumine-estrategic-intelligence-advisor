import { sha256 } from '../../../platform/crypto/sha256';
import { ConstitutionalGovernanceRegistry } from './ConstitutionalGovernanceRegistry';
import { ConstitutionalComplianceReport } from './ConstitutionalComplianceReport';

// Pre-register all protocols
import { SemanticConstitutionProtocol } from './protocols/SemanticConstitutionProtocol';
import { ScenarioConstitutionProtocol } from './protocols/ScenarioConstitutionProtocol';
import { ScenarioSimulationConstitutionProtocol } from './protocols/ScenarioSimulationConstitutionProtocol';
import { FiduciaryConstitutionProtocol } from './protocols/FiduciaryConstitutionProtocol';
import { TreasuryConstitutionProtocol } from './protocols/TreasuryConstitutionProtocol';
import { CausalConstitutionProtocol } from './protocols/CausalConstitutionProtocol';
import { LineageConstitutionProtocol } from './protocols/LineageConstitutionProtocol';
import { AIConstitutionProtocol } from './protocols/AIConstitutionProtocol';

ConstitutionalGovernanceRegistry.registerProtocol(new SemanticConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new ScenarioConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new ScenarioSimulationConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new FiduciaryConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new TreasuryConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new CausalConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new LineageConstitutionProtocol());
ConstitutionalGovernanceRegistry.registerProtocol(new AIConstitutionProtocol());

export class ConstitutionalGovernanceRuntime {
  
  public static evaluate(context: any): ConstitutionalComplianceReport {
    const protocolsList = ConstitutionalGovernanceRegistry.getAllProtocols();
    
    const results: Record<string, any> = {};
    const violations: Record<string, string[]> = {};

    let hasFail = false;
    let hasWarning = false;

    for (const protocol of protocolsList) {
      // For the AI Constitution, inject the prior results
      if (protocol.protocolId === 'ACF') {
        context.sccfValid = results['SCCF'] !== 'FAIL' && results['SCCF']?.status !== 'FAIL';
        context.fcfValid = results['FCF'] !== 'FAIL';
        context.tcfValid = results['TCF'] !== 'FAIL';
        context.ccfValid = results['CCF'] !== 'FAIL';
        context.lcfValid = results['LCF'] !== 'FAIL';
      }

      const res = protocol.validate(context);
      
      results[protocol.protocolId] = res.payload ? res.payload : res.status;
      if (res.violations.length > 0) {
        violations[protocol.protocolId] = res.violations;
      }

      if (res.status === 'FAIL') hasFail = true;
      if (res.status === 'WARNING') hasWarning = true;
    }

    const overallStatus = hasFail ? 'INVALID' : (hasWarning ? 'WARNING' : 'VALID');

    // Create deterministic hash of the constitutional state
    const hashPayload = {
      authority: 'CGL',
      status: overallStatus,
      protocols: results,
      // Note: We explicitly exclude validatedAt
    };

    const constitutionalHash = sha256(JSON.stringify(hashPayload)).substring(0, 16);

    return {
      constitutionalAuthority: 'CGL',
      protocols: results as any,
      protocolViolations: violations,
      constitutionalIntegrity: overallStatus,
      validatedAt: new Date().toISOString(),
      constitutionalHash
    };
  }
}
