#!/bin/bash
set -e

export VITE_USE_SUPABASE_STAGING=true

echo "Running Phase 6I.5 - Final Enterprise Regression"

echo "1. Resetting Database..."
npx supabase db reset

echo "2. Running Financial Invariants Test..."
npx tsx scripts/test-financial-invariants.ts

echo "3. Running Intelligence Engine Test..."
npx tsx scripts/test-intelligence-engine.ts

echo "4. Running Performance & Scale Test..."
npx tsx scripts/test-performance-scale.ts

echo "5. Running Migration Closure Audit..."
npx tsx scripts/test-migration-closure.ts

echo "6. Running Runtime Failure Test..."
npx tsx scripts/test-runtime-failure.ts

echo "7. Generating Phase 6 Certification..."
npx tsx scripts/certify-phase6.ts

echo "8. Running Typecheck..."
npm run typecheck

echo "9. Running Lint..."
npm run lint

echo "10. Running Build..."
npm run build

echo "ALL REGRESSION TESTS PASSED!"
