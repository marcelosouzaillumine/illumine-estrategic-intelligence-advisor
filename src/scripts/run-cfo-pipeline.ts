import { CfoIntelligencePipeline } from '../workspace/intelligence/cfo/cfo.pipeline';

async function main() {
  console.log('--- Illumine Governance: CFO Pipeline Runner ---');

  const args = process.argv.slice(2);
  const tenantId = args.find(a => a.startsWith('--tenantId='))?.split('=')[1] || 'tenant-teste';
  const periodId = args.find(a => a.startsWith('--period='))?.split('=')[1] || '2026-08';

  console.log(`Target Tenant: ${tenantId}`);
  console.log(`Target Period: ${periodId}`);
  console.log('--------------------------------------------------');

  try {
    const pipeline = new CfoIntelligencePipeline();
    await pipeline.execute({
      tenantId,
      periodId,
      triggeredBy: 'system:manual-script-runner'
    });

    console.log('--- Pipeline Execution Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('--- Pipeline Execution Failed ---');
    console.error(error);
    process.exit(1);
  }
}

main();
