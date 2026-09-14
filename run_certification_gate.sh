#!/bin/bash
echo "=== Phase 6 Final Certification Gate ===" > certification_results.log
echo "" >> certification_results.log

echo "[1/10] Running Typecheck..." | tee -a certification_results.log
npx tsc --noEmit >> certification_results.log 2>&1
echo "Typecheck exit code: $?" | tee -a certification_results.log

echo "[2/10] Running Lint..." | tee -a certification_results.log
npm run lint >> certification_results.log 2>&1
echo "Lint exit code: $?" | tee -a certification_results.log

echo "[3/10] Running Build..." | tee -a certification_results.log
npm run build >> certification_results.log 2>&1
echo "Build exit code: $?" | tee -a certification_results.log

echo "[4/10] Running P01DataChain Test..." | tee -a certification_results.log
npx vitest run src/capabilities/financial/domain/__tests__/P01DataChain.spec.ts >> certification_results.log 2>&1
echo "P01DataChain exit code: $?" | tee -a certification_results.log

echo "[5/10] Running Financial Invariants..." | tee -a certification_results.log
npx tsx scripts/test-financial-invariants.ts >> certification_results.log 2>&1
echo "Invariants exit code: $?" | tee -a certification_results.log

echo "[6/10] Running Intelligence Engine..." | tee -a certification_results.log
npx tsx scripts/test-intelligence-engine.ts >> certification_results.log 2>&1
echo "Engine exit code: $?" | tee -a certification_results.log

echo "[7/10] Running Performance Scale..." | tee -a certification_results.log
npx tsx scripts/test-performance-scale.ts >> certification_results.log 2>&1
echo "Performance exit code: $?" | tee -a certification_results.log

echo "[8/10] Running Migration Closure..." | tee -a certification_results.log
npx tsx scripts/test-migration-closure.ts >> certification_results.log 2>&1
echo "Migration Closure exit code: $?" | tee -a certification_results.log

echo "[9/10] Running Runtime Failure..." | tee -a certification_results.log
npx tsx scripts/test-runtime-failure.ts >> certification_results.log 2>&1
echo "Runtime Failure exit code: $?" | tee -a certification_results.log

echo "[10/10] Running Git Diff Check..." | tee -a certification_results.log
git diff --check >> certification_results.log 2>&1
echo "Git Diff Check exit code: $?" | tee -a certification_results.log

echo "Done. Results saved to certification_results.log"
