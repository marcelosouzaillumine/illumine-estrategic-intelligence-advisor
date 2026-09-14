import { ConstitutionalAxiomStatus } from './constitutional-dashboard-types';

export class ConstitutionalAxiomDisclosureEngine {
  public static extractAxioms(runtimeOutput: any): ConstitutionalAxiomStatus[] {
    // This engine simply extracts and formats existing axiom states from the canonical state
    const isQuarantined = runtimeOutput?.status === 'CONSTITUTIONAL_QUARANTINE';
    const isFailed = runtimeOutput?.status === 'FAILED';
    const failClosedActive = isQuarantined || isFailed || runtimeOutput?.canonicalState?.confidence === 'BLOCKED';

    return [
      {
        axiom: 'Survivability Supremacy',
        status: failClosedActive ? 'VIOLATED' : 'COMPLIANT',
        description: 'A integridade da sobrevivência institucional é o axioma primário.'
      },
      {
        axiom: 'Fail Closed Doctrine',
        status: failClosedActive ? 'ATTENTION' : 'COMPLIANT',
        description: 'Sistemas devem falhar de forma fechada, restringindo acessos em vez de expor dados inconsistentes.'
      },
      {
        axiom: 'Lineage Integrity',
        status: runtimeOutput?.canonicalState?.isLineageIncomplete ? 'RESTRICTED' : 'COMPLIANT',
        description: 'Toda conclusão deve ter um hash de linhagem rastreável até a evidência raiz.'
      },
      {
        axiom: 'Evidence Before Conclusion',
        status: runtimeOutput?.canonicalState?.restrictions?.length > 0 ? 'RESTRICTED' : 'COMPLIANT',
        description: 'Conclusões fiduciárias não podem ser inferidas sem evidência criptográfica.'
      },
      {
        axiom: 'Explainability Requirement',
        status: 'COMPLIANT',
        description: 'As restrições e enforcement actions devem ser plenamente explicáveis.'
      }
    ];
  }
}
