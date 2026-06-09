import { ExecutionCompressionEngine } from '../core/runtime/lifecycle/ExecutionCompressionEngine';

function runReplayLoadTest() {
  console.log('Iniciando Replay Load Test...');

  const mockPayload = {
    executionId: 'EXEC-123',
    data: new Array(10000).fill('MOCK_DATA_HEAVY_STRING_FOR_PAYLOAD_SIMULATION')
  };

  const startCompress = performance.now();
  const compressed = ExecutionCompressionEngine.compress(mockPayload, 'hash-123');
  const compressTime = performance.now() - startCompress;

  console.log(`Payload comprimido de ${compressed.originalSizeKb.toFixed(2)} KB para ${compressed.compressedSizeKb.toFixed(2)} KB em ${compressTime.toFixed(2)}ms`);

  const startDecompress = performance.now();
  const decompressed = ExecutionCompressionEngine.decompress(compressed);
  const decompressTime = performance.now() - startDecompress;

  console.log(`Payload descomprimido em ${decompressTime.toFixed(2)}ms`);

  if ((decompressed as any).executionId !== 'EXEC-123') {
    console.error('❌ CRITICAL: Falha na integridade da compressão/descompressão.');
    process.exit(1);
  }

  console.log('✅ Replay Compression Test Passou.');
}

runReplayLoadTest();
