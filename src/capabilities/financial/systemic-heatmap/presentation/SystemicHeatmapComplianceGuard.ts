export function SystemicHeatmapComplianceGuard(props: { output?: { systemicStressMap: any[], systemicConfidence: string } }) {
  if (!props.output) {
    return { props: { isEmpty: true, hasLowConfidence: false, hasUnverifiedDependency: false } };
  }

  return {
    props: {
      isEmpty: false,
      hasLowConfidence: props.output.systemicConfidence === 'LOW_CONFIDENCE_PROPAGATION',
      hasUnverifiedDependency: props.output.systemicConfidence === 'UNVERIFIED_DEPENDENCY'
    }
  };
}
